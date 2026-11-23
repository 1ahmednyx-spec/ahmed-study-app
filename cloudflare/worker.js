/**
 * Ahmed Study Platform — Cloudflare Worker AI gateway
 * Required secret: GEMINI_API_KEY
 */
const ALLOWED_ORIGIN = "https://1ahmednyx-spec.github.io";
const MODEL = "gemini-3.8-flash";
const MAX_INPUT_CHARS = 12000;
const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 20;
const buckets = new Map();

function json(data, status, origin) {
  const headers = {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
    "Vary": "Origin"
  };
  if (origin === ALLOWED_ORIGIN) {
    headers["Access-Control-Allow-Origin"] = ALLOWED_ORIGIN;
    headers["Access-Control-Allow-Methods"] = "POST, OPTIONS";
    headers["Access-Control-Allow-Headers"] = "Content-Type";
    headers["Access-Control-Max-Age"] = "86400";
  }
  return new Response(JSON.stringify(data), { status, headers });
}

function rateLimited(request) {
  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  const now = Date.now();
  const current = buckets.get(ip);
  if (!current || now - current.startedAt >= WINDOW_MS) {
    buckets.set(ip, { startedAt: now, count: 1 });
    return false;
  }
  current.count += 1;
  if (buckets.size > 5000) {
    for (const [key, bucket] of buckets) {
      if (now - bucket.startedAt >= WINDOW_MS) buckets.delete(key);
      if (buckets.size <= 4000) break;
    }
  }
  return current.count > MAX_REQUESTS_PER_WINDOW;
}

function extractText(payload) {
  if (typeof payload.output_text === "string" && payload.output_text.trim()) {
    return payload.output_text.trim();
  }
  const steps = Array.isArray(payload.steps) ? payload.steps : [];
  return steps
    .filter(step => step && step.type === "model_output" && Array.isArray(step.content))
    .flatMap(step => step.content)
    .filter(part => part && part.type === "text" && typeof part.text === "string")
    .map(part => part.text)
    .join("\n")
    .trim();
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin");
    if (request.method === "OPTIONS") {
      if (origin !== ALLOWED_ORIGIN) return json({ error: "origin_not_allowed" }, 403, null);
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Max-Age": "86400",
          "Vary": "Origin"
        }
      });
    }

    if (request.method !== "POST") return json({ error: "method_not_allowed" }, 405, origin);
    if (origin && origin !== ALLOWED_ORIGIN) return json({ error: "origin_not_allowed" }, 403, null);
    if (!env.GEMINI_API_KEY) return json({ error: "server_not_configured" }, 503, origin);
    if (rateLimited(request)) return json({ error: "rate_limited" }, 429, origin);

    let body;
    try {
      body = await request.json();
    } catch {
      return json({ error: "invalid_json" }, 400, origin);
    }

    const prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";
    if (!prompt) return json({ error: "empty_prompt" }, 400, origin);
    if (prompt.length > MAX_INPUT_CHARS) return json({ error: "input_too_large" }, 413, origin);

    try {
      const upstream = await fetch("https://generativelanguage.googleapis.com/v1beta/interactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": env.GEMINI_API_KEY
        },
        body: JSON.stringify({
          model: MODEL,
          store: false,
          input: prompt
        })
      });

      const data = await upstream.json().catch(() => ({}));
      if (!upstream.ok) {
        const code = upstream.status === 429 ? "provider_rate_limited"
          : upstream.status === 401 || upstream.status === 403 ? "provider_auth_error"
          : upstream.status >= 500 ? "provider_unavailable"
          : "provider_request_failed";
        return json({ error: code }, upstream.status === 429 ? 429 : 502, origin);
      }

      const text = extractText(data);
      if (!text) return json({ error: "empty_model_response" }, 502, origin);
      return json({ text }, 200, origin);
    } catch {
      return json({ error: "provider_unavailable" }, 502, origin);
    }
  }
};
