var cacheName = "weatherPWA";
var filesToCache = [
  "/",
  "/index.html",
  "/manifest.json",
  "/material.indigo-pink.min.css",
  "/material.min.js",
  "/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2",
  "/images/icons/icon-128x128.png",
  "/images/icons/icon-144x144.png",
  "/images/icons/icon-152x152.png",
  "/images/icons/icon-192x192.png",
  "/images/icons/icon-256x256.png",
  "/images/icons/icon-512x512.png"
];

self.addEventListener("install", function(e) {
  console.log("[ServiceWorker] Install");
  e.waitUntil(
    caches
      .open(cacheName)
      .then(function(cache) {
        console.log("[ServiceWorker] Caching app shell");
        return cache.addAll(filesToCache);
      })
      .then(function() {
        return self.skipWaiting();
      })
  );
});
self.addEventListener("fetch", function(evt) {
  console.log("The service worker is serving the asset.");
  evt.respondWith(fromCache(evt.request));
  evt.waitUntil(update(evt.request).then(refresh));
});

self.addEventListener("activate", function(event) {
  event.waitUntil(
    caches.keys().then(function(c) {
      return Promise.all(
        c
          .filter(function(cache) {
            // Return true if you want to remove this cache,
            // but remember that caches are shared across
            // the whole origin
          })
          .map(function(cache) {
            console.log("[ServiceWorker] Caching app remove");
            return caches.delete(cache);
          })
      );
    })
  );
});

function fromCache(request) {
  return caches.open(cacheName).then(function(cache) {
    return cache.match(request);
  });
}

function update(request) {
  return caches.open(cacheName).then(function(cache) {
    return fetch(request).then(function(response) {
      return cache.put(request, response.clone()).then(function() {
        return response;
      })
    })
  })
}
function refresh(response) {
  return self.clients.matchAll().then(function(clients) {
    clients.forEach(function(client) {
      var message = {
        type: "refresh",
        url: response.url,
        eTag: response.headers.get("ETag")
      };
      client.postMessage(JSON.stringify(message));
    });
  });
}
