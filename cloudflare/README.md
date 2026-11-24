# Ahmed Study Platform — Cloudflare Worker

The Worker serves the static application, the secure Gemini endpoint, and a read-only Neon PostgreSQL API.

## Neon database setup

1. In Neon, open the `ahmed_study_platform` database and select the **pooled** connection string (the hostname includes `-pooler`).
2. In the Cloudflare Worker settings, add a secret named `DATABASE_URL` and paste the pooled Neon connection string. Do not put it in GitHub, `wrangler.toml`, frontend JavaScript, or chat.
3. Install and deploy from this directory:

```bash
npm install
npx wrangler secret put DATABASE_URL
npm run deploy
```

When Wrangler prompts for the secret, paste the pooled connection string directly into the terminal. If you add it through the Cloudflare dashboard instead, skip the `wrangler secret put` command.

The existing `GEMINI_API_KEY` secret is separate and must remain configured.

## Read-only API routes

- `GET /api/db/health` — checks that the Worker can query Neon.
- `GET /api/db/subjects` — returns published subjects.
- `GET /api/db/subjects/:uuid/lessons` — returns published lessons for one subject.

The first database phase is intentionally read-only. It does not expose student records, exam answers, account details, or write operations. Those routes require a real authentication and authorization layer before implementation.

## Security and compatibility

- The database credential is read only from the Worker secret `DATABASE_URL`.
- The Neon driver uses HTTP queries suitable for serverless Workers.
- The API rejects cross-origin browser requests and non-GET methods.
- Public educational content is filtered by `is_published = TRUE`.
- Existing Gemini routes, static assets, GitHub Pages files, and the browser's `study-v1` local-storage data are left intact.
- The in-memory request limit is best-effort per Worker isolate, not a global quota system.
