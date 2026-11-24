const JSON_HEADERS = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store"
};

const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 20;
const MAX_INPUT_CHARS = 20000;
const requestBuckets = new Map();

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: JSON_HEADERS });
}

function getClientKey(request) {
  return request.headers.get("CF-Connecting-IP") || "unknown";
}

function isRateLimited(request) {
  const now = Date.now();
  const key = getClientKey(request);
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
  return current.count > MAX_REQUESTS;
}

function normalizeContents(input) {
  if (typeof input === "string") {
    if (!input.trim() || input.length > MAX_INPUT_CHARS) return null;
    return [{ role: "user", parts: [{ text: input }] }];
  }

  if (!Array.isArray(input) || input.length === 0 || input.length > 20) return null;
  const contents = [];
  for (const item of input) {
    if (!item || typeof item.content !== "string" || !item.content.trim() ||
        item.content.length > 10000 || !["user", "assistant", "model"].includes(item.role)) {
      return null;
    }
    contents.push({
      role: item.role === "assistant" || item.role === "model" ? "model" : "user",
      parts: [{ text: item.content }]
    });
  }
  return contents;
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

  const contents = normalizeContents(body?.input);
  if (!contents) {
    return json({ error: { code: "invalid_request" } }, 400);
  }

  const generationConfig = {
    temperature: body?.responseFormat === "json" ? 0.2 : 0.7,
    maxOutputTokens: 4096
  };
  if (body?.responseFormat === "json") {
    generationConfig.responseMimeType = "application/json";
  }

  let upstream;
  try {
    upstream = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/" +
        encodeURIComponent(env.GEMINI_MODEL || "gemini-3.8-flash") + ":generateContent",
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-goog-api-key": env.GEMINI_API_KEY
        },
        body: JSON.stringify({ contents, generationConfig })
      }
    );
  } catch {
    return json({ error: { code: "provider_unavailable" } }, 502);
  }

  if (!upstream.ok) {
    if (upstream.status === 429) {
      return json({ error: { code: "rate_limited" } }, 429);
    }
    if (upstream.status === 400) {
      return json({ error: { code: "provider_bad_request" } }, 400);
    }
    if (upstream.status === 401 || upstream.status === 403) {
      return json({ error: { code: "invalid_api_key" } }, 502);
    }
    return json({ error: { code: "provider_error" } }, 502);
  }

  let result;
  try {
    result = await upstream.json();
  } catch {
    return json({ error: { code: "invalid_provider_response" } }, 502);
  }

  const text = (result?.candidates?.[0]?.content?.parts || [])
    .map(part => typeof part.text === "string" ? part.text : "")
    .join("")
    .trim();

  if (!text) {
    return json({ error: { code: "empty_response" } }, 502);
  }

  return json({ text });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/health") {
      return request.method === "GET"
        ? json({ ok: true, service: "ahmed-study-ai" })
        : json({ error: { code: "method_not_allowed" } }, 405);
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
