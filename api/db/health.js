import { neon } from "@neondatabase/serverless";
import { allowSameOrigin, isRateLimited, sendJson } from "../_lib/http.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return sendJson(res, 405, { error: { code: "method_not_allowed" } });
  }
  if (!allowSameOrigin(req)) return sendJson(res, 403, { error: { code: "forbidden_origin" } });
  if (!process.env.DATABASE_URL) {
    return sendJson(res, 503, { error: { code: "database_not_configured" } });
  }
  if (isRateLimited(req, "database", 60)) {
    return sendJson(res, 429, { error: { code: "rate_limited" } });
  }
  try {
    const sql = neon(process.env.DATABASE_URL);
    const rows = await sql`SELECT 1 AS ok`;
    const connected = rows[0]?.ok === 1;
    return sendJson(res, connected ? 200 : 503, {
      ok: connected,
      service: "ahmed-study-database",
      database: connected ? "connected" : "unavailable"
    });
  } catch {
    return sendJson(res, 503, { error: { code: "database_unavailable" } });
  }
}
