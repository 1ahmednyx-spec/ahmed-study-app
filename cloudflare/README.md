# Ahmed Study Platform — Cloudflare Worker

The Worker serves the static application, the secure Gemini endpoint, public lesson-video playback metadata, and authenticated lesson-video administration.

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

## Lesson video API and admin secrets

Apply the schema migration in `migrations/001_lesson_videos.sql` to the Neon `neondb` database.

Configure these Cloudflare Worker secrets from the `cloudflare` directory. Keep the existing `GEMINI_API_KEY` secret:

```bash
npx wrangler secret put DATABASE_URL
npx wrangler secret put ADMIN_EMAIL
npx wrangler secret put ADMIN_PASSWORD
npx wrangler secret put ADMIN_SESSION_SECRET
```

- `DATABASE_URL`: Neon pooled connection string.
- `ADMIN_EMAIL`: the one email address allowed to administer lesson videos.
- `ADMIN_PASSWORD`: a dedicated strong password (at least 16 characters); do not reuse an email or Neon password.
- `ADMIN_SESSION_SECRET`: a random secret of at least 32 characters, used to sign eight-hour admin sessions. Generate locally with `node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"`.

The app frontend calls the Worker at `https://sparkling-disk-d582ahmed-study-ai.1ahmednyx.workers.dev`. CORS is restricted to the GitHub Pages origin for this app and localhost development.

Routes:
- `GET /api/lesson-videos?course_id=...` — public video metadata for a course.
- `POST /api/admin/login` — verifies the configured admin email/password and returns a short-lived signed bearer token.
- `POST /api/lesson-videos` — create or replace one lesson's YouTube URL (admin token required).
- `DELETE /api/lesson-videos` — remove one lesson's video (admin token required).
- Existing `GET /api/db/health`, subjects, and lesson routes remain unchanged.

Only YouTube watch, youtu.be, shorts, and embed links are accepted. Video files are never uploaded or stored by the platform.

## Security and compatibility

- The database credential is read only from the Worker secret `DATABASE_URL`.
- The Neon driver uses HTTP queries suitable for serverless Workers.
- The API rejects cross-origin browser requests and non-GET methods.
- Public educational content is filtered by `is_published = TRUE`.
- Existing Gemini routes, static assets, GitHub Pages files, and the browser's `study-v1` local-storage data are left intact.
- The in-memory request limit is best-effort per Worker isolate, not a global quota system.
