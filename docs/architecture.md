# Ahmed Study Platform — Architecture

## Current static-app structure

- `index.html`: semantic page structure and navigation.
- `assets/css/app.css`: application styles and responsive layouts.
- `assets/js/core/navigation.js`: tab activation and dashboard quick-link navigation.
- `assets/js/features/schedule.js`: schedule rendering, event creation/completion/deletion, next-event display, and in-app reminders.
- `assets/js/features/notes.js`: local lesson-note creation, rendering, deletion, and offline fallback summarization.
- `assets/js/features/words.js`: vocabulary entry, AI-assisted translation, flashcard review, spaced-repetition levels, and importing vocabulary from the English helper.
- `assets/js/features/practice.js`: practice records, subject accuracy statistics, weekly question goals, AI question generation, and AI weekly-plan suggestions.
- `assets/js/features/mistakes.js`: mistake notebook, retry/correct actions, review scheduling, and completion tracking.
- `assets/js/features/tools.js`: exam generation and grading, lesson explanation, focus timer, revision-sheet export, and local backup/restore.
- `assets/js/features/english-course.js`: English 2027 unit map, grammar reference, reader notes, vocabulary flashcards, writing practice, and curriculum quiz.
- `assets/js/features/english-coach.js`: English conversation helper, response correction, translation, speech playback, and optional voice input.
- `assets/js/features/preferences.js`: theme switching, brand name and greeting customization, and accent-color selection.
- `assets/js/app.js`: shared helpers, dependency wiring, initial rendering, and service-worker registration.
- `manifest.webmanifest`: PWA metadata.
- `sw.js`: service-worker cache strategy.
- `tests/ui-smoke.mjs`: Playwright browser smoke tests.

## Runtime and data

The application UI and existing study data remain client-side. Existing study data is stored in browser local storage under the compatibility key `study-v1`. This key must not be renamed or discarded during refactoring. A secure Cloudflare Worker provides the server-side AI API and a read-only Neon API for published educational content. Student accounts, authentication, student-specific cloud synchronization, and database writes are not yet implemented. Never place provider API keys or database connection strings in browser code.

## Secure AI backend (Cloudflare Worker)

- `cloudflare/src/index.js` handles `POST /api/chat` and serves static assets through the `ASSETS` binding.
- The browser calls only the same-origin `/api/chat` endpoint; it never receives the Gemini API key.
- The Worker calls the Gemini Interactions API using `GEMINI_API_KEY` as a Cloudflare Secret. The default model is `gemini-3.8-flash`; `GEMINI_MODEL` may override it as a regular Worker variable.
- Requests use `store: false`, validate input size and message count, and apply a best-effort per-isolate rate limit.
- Configure `main = "src/index.js"`, `assets.binding = "ASSETS"`, and `run_worker_first = ["/api/*"]` in `cloudflare/wrangler.toml`.
- `GET /api/health` is a non-sensitive Worker deployment health check.

## Neon database integration — phase 1

- The same Worker exposes `GET /api/db/health`, `GET /api/db/subjects`, and `GET /api/db/subjects/:uuid/lessons`.
- `@neondatabase/serverless` uses Neon's HTTP query interface in the Cloudflare Worker.
- The pooled Neon connection string is configured only as the Cloudflare Worker Secret `DATABASE_URL`. It must never be committed or sent to the browser.
- The public API returns only rows marked `is_published = TRUE`; it is read-only and does not expose user, exam-attempt, answer, notes, or schedule records.
- Cross-origin browser requests and non-GET methods are rejected. The request limit is best-effort per Worker isolate.
- Student-specific data endpoints and database writes are intentionally deferred until authentication and per-user authorization are implemented.

## Phase 2 migration rules

1. Keep the static GitHub Pages deployment working at every commit.
2. Preserve all existing feature IDs, form IDs, and the `study-v1` data format unless a versioned migration is added.
3. Split styles and scripts without changing execution order or behavior.
4. Extract JavaScript into small modules incrementally; do not convert to a bundler or framework until the migration can be tested on GitHub Pages.
5. Validate imports, backup restore, responsive layouts, and browser console output in CI.
6. Keep official curriculum and exam facts sourced and clearly labeled.

## Modularization status

All feature modules listed in the current structure above have been extracted and are loaded before the bootstrap. `app.js` now contains only shared helpers, dependency wiring, initial rendering, and service-worker registration. Further changes should be driven by concrete maintenance needs rather than splitting the small bootstrap into artificial modules.

All modules above are implemented and loaded by `index.html` before the application bootstrap.


## Vercel migration — isolated preview phase

- The `migration/vercel-platform` branch adds Vercel Node.js Functions under `api/` for the existing Gemini and read-only Neon routes.
- The Vercel implementation uses server-side `GEMINI_API_KEY` and `DATABASE_URL` environment variables. No secret values belong in the repository or browser.
- `sw.js` bypasses caching for `/api/*` and returns a JSON network error rather than cached HTML when an API request cannot reach the network.
- The Cloudflare Worker remains the current production implementation until the Vercel Preview is configured and verified. Do not remove or modify Cloudflare production settings as part of this preview migration.
- The existing `study-v1` local-storage key and data shape remain unchanged. Authentication, student-specific cloud sync, and database writes remain out of scope for this migration phase.
