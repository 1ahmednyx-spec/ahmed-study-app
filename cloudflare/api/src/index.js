import { neon } from "@neondatabase/serverless";

const json = (data, status = 200, headers = {}) =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      "x-content-type-options": "nosniff",
      "referrer-policy": "no-referrer",
      ...headers
    }
  });

function corsHeaders(origin, allowedOrigin) {
  return {
    "access-control-allow-origin": origin === allowedOrigin ? allowedOrigin : "null",
    "access-control-allow-methods": "GET, OPTIONS",
    "access-control-allow-headers": "content-type, authorization",
    "access-control-max-age": "86400",
    "vary": "Origin"
  };
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get("Origin");
    const allowedOrigin = env.ALLOWED_ORIGIN;
    const cors = corsHeaders(origin, allowedOrigin);

    if (origin && origin !== allowedOrigin) {
      return json({ error: "Origin not allowed" }, 403, cors);
    }

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }

    if (request.method !== "GET") {
      return json({ error: "Method not allowed" }, 405, {
        ...cors,
        allow: "GET, OPTIONS"
      });
    }

    if (!env.DATABASE_URL) {
      return json({ error: "API is not configured" }, 503, cors);
    }

    try {
      const sql = neon(env.DATABASE_URL);

      if (url.pathname === "/api/health") {
        const rows = await sql`SELECT 1 AS ok`;
        return json({ status: "ok", database: rows[0]?.ok === 1 ? "connected" : "unknown" }, 200, cors);
      }

      if (url.pathname === "/api/subjects") {
        const subjects = await sql`
          SELECT id, name, description, sort_order
          FROM subjects
          WHERE is_published = TRUE
          ORDER BY sort_order ASC, name ASC
        `;
        return json({ data: subjects }, 200, cors);
      }

      const lessonMatch = url.pathname.match(/^\/api\/subjects\/([0-9a-f-]{36})\/lessons$/i);
      if (lessonMatch) {
        const subjectId = lessonMatch[1];
        const lessons = await sql`
          SELECT id, subject_id, title, content, sort_order
          FROM lessons
          WHERE subject_id = ${subjectId}
            AND is_published = TRUE
          ORDER BY sort_order ASC, title ASC
        `;
        return json({ data: lessons }, 200, cors);
      }

      return json({ error: "Not found" }, 404, cors);
    } catch {
      return json({ error: "Internal server error" }, 500, cors);
    }
  }
};
