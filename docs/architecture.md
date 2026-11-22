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
- `assets/js/features/tools.js`: exam generation and grading, lesson explanation, focus timer, revision-sheet export, local backup/restore, and appearance personalization.
- `assets/js/features/english-course.js`: English 2027 unit map, grammar reference, reader notes, vocabulary flashcards, writing practice, and curriculum quiz.
- `assets/js/features/english-coach.js`: English conversation helper, response correction, translation, speech playback, and optional voice input.
- `assets/js/app.js`: browser application bootstrap and remaining feature logic.
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
- `core/navigation.js`: section and tab switching (extracted).
- `features/schedule.js`: schedule and in-app reminder behavior (extracted).
- `features/notes.js`: local notes and fallback summaries (extracted).
- `features/words.js`: vocabulary management and flashcard review (extracted).
- `features/practice.js`: practice tracking, progress statistics, and study-plan suggestions (extracted).
- `features/mistakes.js`: mistake notebook and spaced review (extracted).
- `features/tools.js`: study tools and personalization (extracted).
- `features/english-course.js`: English 2027 course tracking and practice (extracted).
- `features/english-coach.js`: English chat and voice interaction (extracted).
- `features/tools.js`: remaining tool behavior.
- `app.js`: bootstrap and orchestration.

These are migration targets, not modules already implemented.
