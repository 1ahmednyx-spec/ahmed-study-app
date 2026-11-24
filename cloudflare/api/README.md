# Ahmed Study Platform API

A small Cloudflare Worker API for the GitHub Pages frontend and Neon PostgreSQL database.

## Current scope

- `GET /api/health` — checks Worker-to-Neon connectivity.
- `GET /api/subjects` — returns published subjects only.
- `GET /api/subjects/:id/lessons` — returns published lessons for a subject only.
- All other methods and routes are rejected.
- No student records, exam answers, or private data are exposed.
- The database credential is read only from the Worker secret `DATABASE_URL`; never put it in frontend files.

## Configure and deploy

Run these commands from this directory:

```bash
npm install
npx wrangler login
npx wrangler secret put DATABASE_URL
npm run deploy
```

When prompted for `DATABASE_URL`, copy the connection string for the `ahmed_study_platform` database from the Neon Console. Paste it directly into the terminal prompt. Do not commit it, add it to `wrangler.toml`, or send it in chat.

The allowed browser origin is configured as `ALLOWED_ORIGIN` in `wrangler.toml`. Update it only if the published frontend origin changes.

After deployment, test:

- `https://YOUR-WORKER-DOMAIN/api/health`
- `https://YOUR-WORKER-DOMAIN/api/subjects`

## Security notes

This first phase is intentionally read-only. It exposes only published educational content. Authentication, student-specific data, writes, and rate limiting must be added before enabling account or student-data endpoints. Do not expose the Neon connection string to the browser.
