import { envValue, json, rateLimited, sameOrigin } from "../../lib/netlify-http.mjs";

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
        item.content.length > 10000 ||
        !["user", "assistant", "model"].includes(item.role)) return null;
    const speaker = item.role === "assistant" || item.role === "model" ? "المساعد" : "الطالب";
    transcript.push(speaker + ": " + item.content.trim());
  }

  const combined = transcript.join("\n\n");
  return combined.length <= MAX_INPUT_CHARS ? combined : null;
}

export default async function handler(request, context) {
  if (request.method !== "POST") {
    return json({ error: { code: "method_not_allowed" } }, 405);
  }
  if (!sameOrigin(request)) {
    return json({ error: { code: "forbidden_origin" } }, 403);
  }

  const apiKey = envValue("GEMINI_API_KEY");
  if (!apiKey) return json({ error: { code: "missing_server_secret" } }, 503);
  if (rateLimited(request, context, "chat", 20)) {
    return json({ error: { code: "rate_limited" } }, 429);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: { code: "invalid_request" } }, 400);
  }

  const input = normalizeInput(body?.input);
  if (!input) return json({ error: { code: "invalid_request" } }, 400);

  const requestBody = {
    model: envValue("GEMINI_MODEL") || "gemini-3.8-flash",
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
        "x-goog-api-key": apiKey
      },
      body: JSON.stringify(requestBody)
    });
  } catch {
    return json({ error: { code: "provider_unavailable" } }, 502);
  }

  if (!upstream.ok) {
    if (upstream.status === 429) return json({ error: { code: "rate_limited" } }, 429);
    if (upstream.status === 400) return json({ error: { code: "provider_bad_request" } }, 400);
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
