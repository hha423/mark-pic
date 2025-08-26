const CACHE_NAME = 'mark-pic-v1';
const urlsToCache = [
  '/mark-pic/',
  '/mark-pic/index.html',
  '/mark-pic/static/js/bundle.js',
  '/mark-pic/static/css/main.css',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});