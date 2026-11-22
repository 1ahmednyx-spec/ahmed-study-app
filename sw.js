const CACHE_NAME = 'ahmed-study-platform-v17';
const APP_FILES = [
  './',
  './index.html',
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
  './assets/js/features/ministry-library.js',
  './assets/js/features/english-coach.js',
  './assets/js/features/preferences.js',
  './assets/js/app.js',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png'
];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_FILES)));
  self.skipWaiting();
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))));
  self.clients.claim();
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET' || new URL(event.request.url).origin !== self.location.origin) return;
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
    if (response && response.ok) {
      const copy = response.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
    }
    return response;
  }).catch(() => caches.match('./index.html'))));
});
