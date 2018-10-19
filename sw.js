
var cacheName = "weather-PWA";
var filesToCache = [
  "/",
  "/index.html",
  "/manifest.json",
  "/script/main.js",
  "/script/material.min.js",
  "/styles/material.indigo-pink.min.css",
  "https://fonts.googleapis.com/icon?family=Material+Icons",
  "/images/icons/icon-144x144.png",
  "/images/icons/icon-152x152.png",
  "/images/icons/icon-192x192.png",
  "/images/icons/icon-256x256.png",
  "/images/icons/icon-512x512.png"
];

self.addEventListener("install", e => {
  console.log("[ServiceWorker] Install");
  e.waitUntil(
    caches
    .open(cacheName)
    .then(cache => {
      console.log("[ServiceWorker] Caching app shell");
      return cache.addAll(filesToCache);
    })
    .then(() => {
      return self.skipWaiting();
    })
  );
});

self.addEventListener("fetch", event => {
  console.log("[ServiceWorker] fetch");
  event.respondWith(
    caches.open(cacheName).then(cache => {
      return cache.match(event.request).then(response => {
        var fetchPromise = fetch(event.request).then(networkResponse => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
        return response || fetchPromise;
      });
    })
  );
});

self.addEventListener("activate", function (event) {
  console.log("[ServiceWorker] activate");
  event.waitUntil(
    caches.keys().then(function (c) {
      return Promise.all(
        c.filter(function (cache) {
          // Return true if you want to remove this cache,
          // but remember that caches are shared across
          // the whole origin
        })
        .map(function (cache) {
          console.log("[ServiceWorker] Caching app remove");
          return caches.delete(cache);
        })
      );
    })
  );
});

self.addEventListener("notificationclick", function (event) {
  console.log("[ServiceWorker] Notification click Received.");
  event.notification.close();
  event.waitUntil(clients.openWindow("/index.html"));
});



self.addEventListener("push", function (event) {
  console.log("[ServiceWorker] Push Received.");
  console.log("[ServiceWorker] Push had this data: " + event.data.text());

  const title = "Push Codelab";
  const options = {
    body: "Yay it works.",
    icon: "images/android-desktop.png",
    badge: "images/badge.png"
  };

  event.waitUntil(self.registration.showNotification(title, options));
});