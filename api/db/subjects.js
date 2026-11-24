import { neon } from "@neondatabase/serverless";
import { allowSameOrigin, isRateLimited, sendJson } from "../../lib/api-http.js";

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
    const subjects = await sql`
      SELECT id, name, description, sort_order
      FROM subjects
      WHERE is_published = TRUE
      ORDER BY sort_order ASC, name ASC
      LIMIT 100
    `;
    return sendJson(res, 200, { data: subjects });
  } catch {
    return sendJson(res, 503, { error: { code: "database_unavailable" } });
  }
}
