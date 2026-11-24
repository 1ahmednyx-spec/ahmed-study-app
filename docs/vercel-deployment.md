# Vercel deployment — Ahmed Study Platform

This document describes the isolated Vercel migration. The existing Cloudflare deployment remains unchanged until the Vercel preview has been configured and verified.

## Project setup

1. Import `1ahmednyx-spec/ahmed-study-app` from GitHub in Vercel.
2. Use the repository root as the Root Directory. Do not set it to `cloudflare`.
3. Keep the project as a static frontend with Vercel Functions in the root `api/` directory. No frontend build command is required for the current HTML/CSS/JavaScript application.
4. Deploy a Preview first. Do not switch production domains or remove the Cloudflare deployment during this phase.

## Environment variables

Add these in Vercel Project Settings → Environment Variables. Add secrets to Preview first, then Production only after verification.

- `GEMINI_API_KEY` — secret used only by `api/chat.js`.
- `GEMINI_MODEL` — optional model override; if omitted, the API uses its code default.
- `DATABASE_URL` — pooled Neon PostgreSQL connection string, stored as a secret and used only by the database functions.

Never commit these values, put them in frontend files, or paste them into chat. Do not reuse a leaked credential; rotate it at its provider.

## API routes

- `GET /api/health` — deployment health check.
- `POST /api/chat` — server-side Gemini Interactions API proxy.
- `GET /api/db/health` — read-only Neon connectivity check.
- `GET /api/db/subjects` — published subjects only.
- `GET /api/db/subjects/:id/lessons` — published lessons for a subject UUID.

The database routes are intentionally read-only. They do not implement student accounts, student records, exam attempts, or database writes. Those features must wait for authentication and per-user authorization.

## Data and rollout safeguards

- The browser's existing `study-v1` local-storage key and schema are unchanged.
- Cloudflare Worker files and configuration remain in place for rollback.
- The service worker no longer caches `/api/*` responses and does not return cached HTML when an API request fails.
- Do not merge this migration into `main` or switch production traffic until Preview checks pass.
- The in-memory rate limiter is best-effort per serverless instance, not a global quota. Use a shared rate-limit service before treating it as abuse protection at scale.

## Preview verification checklist

1. `GET /api/health` returns `{ "ok": true }`.
2. `POST /api/chat` returns a valid response after `GEMINI_API_KEY` is configured.
3. `GET /api/db/health` returns `database: "connected"` after `DATABASE_URL` is configured.
4. `GET /api/db/subjects` returns a data array (an empty array is valid while no published subjects exist).
5. Test the main UI, PWA install/offline shell, and browser console.
6. Confirm existing local data remains under `study-v1`.

Do not put production secrets into Preview unless you intentionally want Preview to access production services. Prefer separate provider credentials or a Neon branch for Preview.
