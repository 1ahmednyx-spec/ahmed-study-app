import { json } from "../../lib/netlify-http.mjs";

export default async function handler(request) {
  if (request.method !== "GET") {
    return json({ error: { code: "method_not_allowed" } }, 405);
  }
  return json({ ok: true, service: "ahmed-study-platform" });
}
