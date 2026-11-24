import { neon } from "@neondatabase/serverless";
import { getProviderDiagnostics } from "./provider-diagnostics.js";

const JSON_HEADERS = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store",
  "x-content-type-options": "nosniff",
  "referrer-policy": "no-referrer"
};

const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 20;
const MAX_DB_REQUESTS = 60;
const MAX_INPUT_CHARS = 20000;
const requestBuckets = new Map();

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: JSON_HEADERS });
}

function isRateLimited(request, maxRequests = MAX_REQUESTS) {
  const now = Date.now();
  const key = request.headers.get("CF-Connecting-IP") || "unknown";
  const current = requestBuckets.get(key);
  if (!current || now - current.startedAt >= WINDOW_MS) {
    requestBuckets.set(key, { startedAt: now, count: 1 });
    if (requestBuckets.size > 1000) {
      for (const [bucketKey, bucket] of requestBuckets) {
        if (now - bucket.startedAt >= WINDOW_MS) requestBuckets.delete(bucketKey);
      }
    }
    return false;
  }
  current.count += 1;
  return current.count > maxRequests;
}

function normalizeInput(input) {
  if (typeof input === "string") {
    return input.trim() && input.length <= MAX_INPUT_CHARS ? input.trim() : null;
  }
  if (!Array.isArray(input) || input.length === 0 || input.length > 20) return null;
  const transcript = [];
  for (const item of input) {
    if (!item || typeof item.content !== "string" || !item.content.trim() ||
        item.content.length > 10000 || !["user", "assistant", "model"].includes(item.role)) {
      return null;
    }
    const speaker = item.role === "assistant" || item.role === "model" ? "المساعد" : "الطالب";
    transcript.push(speaker + ": " + item.content.trim());
  }
  const combined = transcript.join("\n\n");
  return combined.length <= MAX_INPUT_CHARS ? combined : null;
}

async function handleAI(request, env) {
  if (request.method !== "POST") {
    return json({ error: { code: "method_not_allowed" } }, 405);
  }

  const origin = request.headers.get("Origin");
  if (origin && origin !== new URL(request.url).origin) {
    return json({ error: { code: "forbidden_origin" } }, 403);
  }

  if (!env.GEMINI_API_KEY) {
    return json({ error: { code: "missing_server_secret" } }, 503);
  }

  if (isRateLimited(request)) {
    return json({ error: { code: "rate_limited" } }, 429);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: { code: "invalid_request" } }, 400);
  }

  const input = normalizeInput(body?.input);
  if (!input) {
    return json({ error: { code: "invalid_request" } }, 400);
  }

  const requestBody = {
    model: env.GEMINI_MODEL || "gemini-3.5-flash-lite",
    input,
    store: false
  };
  if (body?.responseFormat === "json") {
    requestBody.response_format = { type: "text", mime_type: "application/json" };
  }

  let upstream;
  try {
    upstream = await fetch("https://generativelanguage.googleapis.com/v1beta/interactions", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-goog-api-key": env.GEMINI_API_KEY
      },
      body: JSON.stringify(requestBody)
    });
  } catch {
    return json({ error: { code: "provider_unavailable" } }, 502);
  }

  if (!upstream.ok) {
    // Return only the provider HTTP status and a strictly validated status code.
    // Never expose provider messages, request content, headers, or credentials.
    const diagnostics = await getProviderDiagnostics(upstream);
    if (upstream.status === 429) {
      return json({ error: { code: "rate_limited", ...diagnostics } }, 429);
    }
    if (upstream.status === 400) {
      return json({ error: { code: "provider_bad_request", ...diagnostics } }, 400);
    }
    if (upstream.status === 401 || upstream.status === 403) {
      return json({ error: { code: "invalid_api_key", ...diagnostics } }, 502);
    }
    return json({ error: { code: "provider_error", ...diagnostics } }, 502);
  }

  let result;
  try {
    result = await upstream.json();
  } catch {
    return json({ error: { code: "invalid_provider_response" } }, 502);
  }

  const text = (result?.steps || [])
    .filter(step => step.type === "model_output")
    .flatMap(step => step.content || [])
    .map(part => typeof part.text === "string" ? part.text : "")
    .join("")
    .trim();

  if (!text || result?.status !== "completed") {
    return json({ error: { code: "empty_response" } }, 502);
  }

  return json({ text });
}

/*
 * Phase 1 database API is intentionally read-only.
 * It exposes only published educational content; no student records or writes.
 */
async function handleDatabase(request, env, url) {
  if (request.method !== "GET") {
    return json({ error: { code: "method_not_allowed" } }, 405);
  }

  const origin = request.headers.get("Origin");
  if (origin && origin !== url.origin) {
    return json({ error: { code: "forbidden_origin" } }, 403);
  }

  const isHealth = url.pathname === "/api/db/health";
  const isSubjects = url.pathname === "/api/db/subjects";
  const lessonMatch = url.pathname.match(/^\/api\/db\/subjects\/([0-9a-f-]{36})\/lessons$/i);
  if (!isHealth && !isSubjects && !lessonMatch) {
    return json({ error: { code: "not_found" } }, 404);
  }

  if (!env.DATABASE_URL) {
    return json({ error: { code: "database_not_configured" } }, 503);
  }

  if (isRateLimited(request, MAX_DB_REQUESTS)) {
    return json({ error: { code: "rate_limited" } }, 429);
  }

  try {
    const sql = neon(env.DATABASE_URL);

    if (isHealth) {
      const rows = await sql`SELECT 1 AS ok`;
      return json({
        ok: rows[0]?.ok === 1,
        service: "ahmed-study-database",
        database: rows[0]?.ok === 1 ? "connected" : "unavailable"
      });
    }

    if (isSubjects) {
      const subjects = await sql`
        SELECT id, name, description, sort_order
        FROM subjects
        WHERE is_published = TRUE
        ORDER BY sort_order ASC, name ASC
        LIMIT 100
      `;
      return json({ data: subjects });
    }

    const subjectId = lessonMatch[1];
    const lessons = await sql`
      SELECT id, subject_id, title, content, sort_order
      FROM lessons
      WHERE subject_id = ${subjectId}
        AND is_published = TRUE
      ORDER BY sort_order ASC, title ASC
      LIMIT 100
    `;
    return json({ data: lessons });
  } catch {
    return json({ error: { code: "database_unavailable" } }, 503);
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/health") {
      return request.method === "GET"
        ? json({ ok: true, service: "ahmed-study-ai" })
        : json({ error: { code: "method_not_allowed" } }, 405);
    }

    if (url.pathname.startsWith("/api/db/")) {
      return handleDatabase(request, env, url);
    }

    if (url.pathname === "/api/chat") {
      return handleAI(request, env);
    }

    if (url.pathname.startsWith("/api/")) {
      return json({ error: { code: "not_found" } }, 404);
    }

    return env.ASSETS.fetch(request);
  }
};
