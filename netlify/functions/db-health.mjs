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

  try {
    const sql = neon(databaseUrl);
    const rows = await sql`SELECT 1 AS ok`;
    const connected = rows[0]?.ok === 1;
    return json({
      ok: connected,
      service: "ahmed-study-database",
      database: connected ? "connected" : "unavailable"
    }, connected ? 200 : 503);
  } catch {
    return json({ error: { code: "database_unavailable" } }, 503);
  }
}
