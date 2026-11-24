import { neon } from "@neondatabase/serverless";
import { allowSameOrigin, isRateLimited, sendJson } from "../../../../_lib/http.js";

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
  const subjectId = req.query?.id;
  if (typeof subjectId !== "string" || !/^[0-9a-f-]{36}$/i.test(subjectId)) {
    return sendJson(res, 400, { error: { code: "invalid_subject_id" } });
  }
  try {
    const sql = neon(process.env.DATABASE_URL);
    const lessons = await sql`
      SELECT id, subject_id, title, content, sort_order
      FROM lessons
      WHERE subject_id = ${subjectId}
        AND is_published = TRUE
      ORDER BY sort_order ASC, title ASC
      LIMIT 100
    `;
    return sendJson(res, 200, { data: lessons });
  } catch {
    return sendJson(res, 503, { error: { code: "database_unavailable" } });
  }
}
