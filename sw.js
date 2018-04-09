var cacheName = "weather-PWA";
var filesToCache = [
  "/",
  "/index.html",
  "/manifest.json",
  "/script/main.js.json",
  "/styles/material.indigo-pink.min.css",
  "/material.min.js",
  "/styles/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2",
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
  console.log("[ServiceWorker] fetch");
  event.respondWith(
    caches.open(cacheName).then(function(cache) {
      return cache.match(event.request).then(function(response) {
        var fetchPromise = fetch(event.request).then(function(networkResponse) {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
        return response || fetchPromise;
      });
    })
  );
});

self.addEventListener("activate", function(event) {
  console.log("[ServiceWorker] activate");
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

self.addEventListener("sync", function(event) {
  console.log("[ServiceWorker] sync");
  registration.showNotification("Sync event fired!");
  if (event.id == "myFirstSync") {
  }
});

self.addEventListener("push", function(event) {
  console.log("Received a push message", event);

  var title = "Yay a message.";
  var body = "We have received a push message.";
  var icon = "/images/icon-192x192.png";
  var tag = "simple-push-demo-notification-tag";

  event.waitUntil(
    self.registration.showNotification(title, {
      body: body,
      icon: icon,
      tag: tag
    })
  );
});

self.addEventListener("notificationclick", function(event) {
  console.log("On notification click: ", event.notification.tag);
  // Android doesn’t close the notification when you click on it
  // See: http://crbug.com/463146
  event.notification.close();

  // This looks to see if the current is already open and
  // focuses if it is
  event.waitUntil(
    clients
      .matchAll({
        type: "window"
      })
      .then(function(clientList) {
        for (var i = 0; i < clientList.length; i++) {
          var client = clientList[i];
          if (client.url === "/" && "focus" in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow("/");
        }
      })
  );
});
