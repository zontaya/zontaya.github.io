importScripts("https://www.gstatic.com/firebasejs/4.12.1/firebase.js");
var cacheName = "weather-PWA";
var filesToCache = [
  "/",
  "/index.html",
  "/manifest.json",
  "/sw.js",
  "/script/main.js",
  "/styles/material.indigo-pink.min.css",
  "/styles/styles.css",
  "/styles/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2",
  "/material.min.js",
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

self.addEventListener("notificationclick", function(event) {
  console.log("[ServiceWorker] Notification click Received.");

  event.notification.close();

  event.waitUntil(clients.openWindow("https://developers.google.com/web/"));
});

self.addEventListener("push", function(event) {
  console.log("[ServiceWorker] Push Received.");
  console.log('[ServiceWorker] Push had this data: "${event.data.text()}"');

  const title = "Push Codelab";
  const options = {
    body: "Yay it works.",
    icon: "images/android-desktop.png",
    badge: "images/badge.png"
  };

  event.waitUntil(self.registration.showNotification(title, options));
});


// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.
firebase.initializeApp({
  messagingSenderId: "480761532735"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();
// [END initialize_firebase_in_sw]

// If you would like to customize notifications that are received in the
// background (Web app is closed or not in browser focus) then you should
// implement this optional method.
// [START background_handler]
messaging.setBackgroundMessageHandler(function(payload) {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  // Customize notification here
  const notificationTitle = "Background Message Title";
  const notificationOptions = {
    body: "Yay it works.",
    icon: "images/android-desktop.png",
    badge: "images/badge.png"
  };

  return self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});
