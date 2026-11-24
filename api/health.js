import { sendJson } from "../lib/api-http.js";

export default function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return sendJson(res, 405, { error: { code: "method_not_allowed" } });
  }
  return sendJson(res, 200, { ok: true, service: "ahmed-study-platform" });
}
