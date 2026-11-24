# Netlify deployment — Ahmed Study Platform

This is an isolated hosting migration. The existing Cloudflare deployment remains unchanged and available for rollback. The Vercel migration branch and PR #20 are also left untouched.

## Site configuration

- Connect the GitHub repository `1ahmednyx-spec/ahmed-study-app`.
- Deploy the branch `migration/netlify-platform` as a Deploy Preview first; do not select `main` as the new production deployment during testing.
- The repository root is the base directory.
- Build command: `npm run build`.
- Publish directory: `dist`.
- Functions directory: `netlify/functions`.
- The build script copies only the public app files into `dist`; server-side source files and function code are not published as static assets.

## Environment variables

Configure these in Netlify UI under Site configuration → Environment variables, with Functions scope:

- `GEMINI_API_KEY` — server-side Gemini API key.
- `GEMINI_MODEL` — optional Gemini model override.
- `DATABASE_URL` — pooled Neon PostgreSQL connection string.

Never commit secrets or paste them into chat. Prefer a dedicated Neon branch/credential for deploy previews instead of exposing production database credentials.

## API routes

The existing browser-facing API paths are preserved through internal rewrites:

- `GET /api/health`
- `POST /api/chat`
- `GET /api/db/health`
- `GET /api/db/subjects`
- `GET /api/db/subjects/:id/lessons`

The database API is read-only and exposes published subjects and lessons only. It does not create student accounts, save exam attempts, or write student records.

## Data and rollout safeguards

- Existing `study-v1` local storage key and schema remain unchanged.
- Cloudflare Worker files/configuration and production deployment are not changed.
- The existing Vercel migration branch and PR #20 are not modified.
- No Neon schema or data changes are part of this migration.
- Do not change the production domain or merge to `main` until Preview testing succeeds.
- The in-memory rate limiter is best-effort per function instance, not a global quota.

## Preview verification

1. `GET /api/health` returns `{ "ok": true }`.
2. `POST /api/chat` works after `GEMINI_API_KEY` is configured.
3. `GET /api/db/health` returns `database: "connected"` after `DATABASE_URL` is configured.
4. Subjects and lesson endpoints return data arrays (empty arrays are valid when no published rows exist).
5. Verify the app UI, service worker install/offline shell, browser console, and existing local data.
