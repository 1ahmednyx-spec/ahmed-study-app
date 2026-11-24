import { allowSameOrigin, isRateLimited, sendJson } from "./_lib/http.js";

const MAX_INPUT_CHARS = 20000;

function normalizeInput(input) {
  if (typeof input === "string") {
    const value = input.trim();
    return value && value.length <= MAX_INPUT_CHARS ? value : null;
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

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return sendJson(res, 405, { error: { code: "method_not_allowed" } });
  }
  if (!allowSameOrigin(req)) {
    return sendJson(res, 403, { error: { code: "forbidden_origin" } });
  }
  if (!process.env.GEMINI_API_KEY) {
    return sendJson(res, 503, { error: { code: "missing_server_secret" } });
  }
  if (isRateLimited(req, "chat", 20)) {
    return sendJson(res, 429, { error: { code: "rate_limited" } });
  }

  const body = req.body && typeof req.body === "object" ? req.body : {};
  const input = normalizeInput(body.input);
  if (!input) return sendJson(res, 400, { error: { code: "invalid_request" } });

  const requestBody = {
    model: process.env.GEMINI_MODEL || "gemini-3.8-flash",
    input,
    store: false
  };
  if (body.responseFormat === "json") {
    requestBody.response_format = { type: "text", mime_type: "application/json" };
  }

  let upstream;
  try {
    upstream = await fetch("https://generativelanguage.googleapis.com/v1beta/interactions", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-goog-api-key": process.env.GEMINI_API_KEY
      },
      body: JSON.stringify(requestBody)
    });
  } catch {
    return sendJson(res, 502, { error: { code: "provider_unavailable" } });
  }

  if (!upstream.ok) {
    if (upstream.status === 429) return sendJson(res, 429, { error: { code: "rate_limited" } });
    if (upstream.status === 400) return sendJson(res, 400, { error: { code: "provider_bad_request" } });
    if (upstream.status === 401 || upstream.status === 403) {
      return sendJson(res, 502, { error: { code: "invalid_api_key" } });
    }
    return sendJson(res, 502, { error: { code: "provider_error" } });
  }

  let result;
  try {
    result = await upstream.json();
  } catch {
    return sendJson(res, 502, { error: { code: "invalid_provider_response" } });
  }
  const text = (result?.steps || [])
    .filter(step => step.type === "model_output")
    .flatMap(step => step.content || [])
    .map(part => typeof part.text === "string" ? part.text : "")
    .join("")
    .trim();

  if (!text || result?.status !== "completed") {
    return sendJson(res, 502, { error: { code: "empty_response" } });
  }
  return sendJson(res, 200, { text });
}
