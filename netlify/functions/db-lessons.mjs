import { neon } from "@neondatabase/serverless";
import { envValue, json, rateLimited, sameOrigin } from "../../lib/netlify-http.mjs";

export default async function handler(request, context) {
  if (request.method !== "GET") {
    return json({ error: { code: "method_not_allowed" } }, 405);
  }
  if (!sameOrigin(request)) return json({ error: { code: "forbidden_origin" } }, 403);

  const databaseUrl = envValue("DATABASE_URL");
  if (!databaseUrl) return json({ error: { code: "database_not_configured" } }, 503);
  if (rateLimited(request, context, "database", 60)) {
    return json({ error: { code: "rate_limited" } }, 429);
  }

  const subjectId = new URL(request.url).searchParams.get("id");
  if (!subjectId || !/^[0-9a-f-]{36}$/i.test(subjectId)) {
    return json({ error: { code: "invalid_subject_id" } }, 400);
  }

  try {
    const sql = neon(databaseUrl);
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
