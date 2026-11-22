# Ahmed Study Platform — Architecture

## Current static-app structure

- `index.html`: semantic page structure and navigation.
- `assets/css/app.css`: application styles and responsive layouts.
- `assets/js/app.js`: current browser application entry point and feature logic.
- `manifest.webmanifest`: PWA metadata.
- `sw.js`: service-worker cache strategy.
- `tests/ui-smoke.mjs`: Playwright browser smoke tests.

## Runtime and data

The application remains a static, client-side app. Existing study data is stored in browser local storage under the compatibility key `study-v1`. This key must not be renamed or discarded during refactoring.

There is no account system, cloud database, or server-side AI integration yet. Never place provider API keys in browser code. AI-dependent controls must keep a clear unavailable-state message until a secure backend is configured.

## Phase 2 migration rules

1. Keep the static GitHub Pages deployment working at every commit.
2. Preserve all existing feature IDs, form IDs, and the `study-v1` data format unless a versioned migration is added.
3. Split styles and scripts without changing execution order or behavior.
4. Extract JavaScript into small modules incrementally; do not convert to a bundler or framework until the migration can be tested on GitHub Pages.
5. Validate imports, backup restore, responsive layouts, and browser console output in CI.
6. Keep official curriculum and exam facts sourced and clearly labeled.

## Next modularization targets

- `core/storage.js`: validated local persistence and backup compatibility.
- `core/navigation.js`: section and tab switching.
- `features/schedule.js`, `features/notes.js`, `features/practice.js`, and `features/tools.js`: feature behavior.
- `app.js`: bootstrap and orchestration.

These are migration targets, not modules already implemented.
