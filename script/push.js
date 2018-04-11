const webpush = require("web-push");

// VAPID keys should only be generated only once.
const vapidKeys = webpush.generateVAPIDKeys();

webpush.setGCMAPIKey("AIzaSyBKfxnge9uaWHvHp9NnMksU-zAk5ge_Now");
webpush.setVapidDetails(
  "mailto:example@yourdomain.org",
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

// This is the same output of calling JSON.stringify on a PushSubscription
const pushSubscription = {
  endpoint: ".....",
  keys: {
    auth: ".....",
    p256dh: "....."
  }
};

webpush.sendNotification(pushSubscription, "Your Push Payload Text");
