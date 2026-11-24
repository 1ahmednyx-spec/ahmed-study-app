const CACHE_NAME = 'ahmed-study-platform-v28';
const APP_FILES = [
  './',
  './index.html',
  './assets/images/welcome-screen.svg',
  './assets/images/welcome-screen-mobile.svg',
  './assets/css/app.css',
  './assets/js/core/storage.js',
  './assets/js/core/navigation.js',
  './assets/js/features/schedule.js',
  './assets/js/features/notes.js',
  './assets/js/features/words.js',
  './assets/js/features/practice.js',
  './assets/js/features/mistakes.js',
  './assets/js/features/tools.js',
  './assets/js/features/english-course.js',
  './assets/js/features/english-learning-path.js',
  './assets/js/features/subject-courses.js',
  './assets/js/features/exam-center.js',
  './assets/js/features/past-exam-archive.js',
  './assets/js/features/dashboard.js',
  './assets/js/features/smart-revision.js',
  './assets/js/features/ministry-library.js',
  './assets/js/features/english-coach.js',
  './assets/js/features/preferences.js',
  './assets/js/app.js',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png'
];

const STATIC_PATHS = new Set(
  APP_FILES.map(file => new URL(file, self.registration.scope).pathname)
);

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(APP_FILES))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key.startsWith('ahmed-study-platform-') && key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // API responses must always reach the network and must never enter the app-shell cache.
  if (url.pathname.startsWith('/api/')) return;

  // Cache only the explicitly listed app-shell files; other requests pass through untouched.
  if (!STATIC_PATHS.has(url.pathname)) return;

  event.respondWith(
    caches.open(CACHE_NAME).then(cache => cache.match(request)).then(cached => {
      if (cached) return cached;

      return fetch(request).then(response => {
        if (!response || !response.ok) return response;
        const copy = response.clone();
        return caches.open(CACHE_NAME)
          .then(cache => cache.put(request, copy))
          .then(() => response)
          .catch(() => response);
      }).catch(() => {
        if (request.mode === 'navigate') {
          return caches.open(CACHE_NAME).then(cache => cache.match('./index.html'));
        }
        throw new Error('Static asset unavailable offline');
      });
    })
  );
});
