
var cacheName = 'weatherPWA-step-8-1';
var filesToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/styles.css',
  '/images/favicon.png',
  '/images/android-desktop.png'
];

self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(filesToCache);
    })
  );
});


self.addEventListener('fetch', function(e) {
  console.log('[Service Worker] Fetch', e.request.url);
  e.respondWith(
      caches.match(e.request).then(function(response) {
        return response || fetch(e.request);
      })
    );
  
});
