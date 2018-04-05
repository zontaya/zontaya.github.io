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

self.addEventListener("fetch", function(event) {
  var freshResource = fetch(event.request.clone).then(function(response) {
    var clonedResponse = response.clone();
    // Don't update the cache with error pages!
    if (response.ok) {
      // All good? Update the cache with the network response
      caches.open(cacheName).then(function(cache) {
        cache.put(event.request, clonedResponse);
      });
    }
    return response;
  });
  var cachedResource = caches
    .open(cacheName)
    .then(function(cache) {
      return cache.match(event.request).then(function(response) {
        return response || freshResource;
      });
    })
    .catch(function(e) {
      return freshResource;
    });
  event.respondWith(cachedResource);
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
