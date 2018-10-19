/*
 *
 *  Push Notifications codelab
 *  Copyright 2015 Google Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License
 *
 */

/* eslint-env browser, es6 */
/* eslint-disable no-unused-vars */

"use strict";

const applicationServerPublicKey =
  "BMhK14EULf5-oLtj-lmZq1yjEAwzI6HJjtJIhTHfuViS90p-capwR4NE5-Mk8mU7qBkKOf_DiGxI3Fq_qvnQml0";
const pushButton = document.querySelector(".js-push-btn");

let isSubscribed = false;
let swRegistration = null;

if ("serviceWorker" in navigator && "PushManager" in window) {
  console.log("[ServiceWorker] and Push is supported");
  navigator.serviceWorker
    .register("./sw.js")
    .then(function (swReg) {
      swRegistration = swReg;
      swReg.update();
      console.log("[ServiceWorker] is registered", swReg);
      initializeUI();
    })
    .catch(function (error) {
      console.error("[ServiceWorker] Error", error);
    });
} else {
  console.warn("Push messaging is not supported");
  pushButton.textContent = "Push Not Supported";
}

function urlB64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

function updateBtn() {
  if (Notification.permission === "denied") {
    pushButton.textContent = "Push Messaging Blocked.";
    pushButton.disabled = true;
    updateSubscriptionOnServer(null);
    return;
  }

  if (isSubscribed) {
    pushButton.textContent = "Disable Push Messaging";
  } else {
    pushButton.textContent = "Enable Push Messaging";
  }

  pushButton.disabled = false;
}

function initializeUI() {
  pushButton.addEventListener("click", function () {
    pushButton.disabled = true;
    if (isSubscribed) {
      unsubscribeUser();
    } else {
      subscribeUser();
    }
  });

  // Set the initial subscription value
  swRegistration.pushManager.getSubscription().then(function (subscription) {
    isSubscribed = !(subscription === null);
    updateSubscriptionOnServer(subscription);
    if (isSubscribed) {
      console.log("User is subscribed.");
    } else {
      console.log("User is NOT subscribed.");
    }
    updateBtn();
  });
}

function subscribeUser() {
  const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
  swRegistration.pushManager
    .subscribe({
      userVisibleOnly: true,
      applicationServerKey: applicationServerKey
    })
    .then(function (subscription) {
      console.log("User is subscribed");

      updateSubscriptionOnServer(subscription);

      isSubscribed = true;

      updateBtn();
    })
    .catch(function (err) {
      console.log("Failed to subscribe the user: ", err);
      updateBtn();
    });
}

function updateSubscriptionOnServer(subscription) {
  // TODO: Send subscription to application server

  const subscriptionJson = document.querySelector(".js-subscription-json");
  const subscriptionDetails = document.querySelector(
    ".js-subscription-details"
  );

  if (subscription) {
    subscriptionJson.textContent = JSON.stringify(subscription);
    subscriptionDetails.classList.remove("is-invisible");
    console.log("User is subscribed:" + JSON.stringify(subscription));
  } else {
    subscriptionJson.textContent = null;
    subscriptionDetails.classList.add("is-invisible");
  }
}

function unsubscribeUser() {
  swRegistration.pushManager
    .getSubscription()
    .then(function (subscription) {
      if (subscription) {
        return subscription.unsubscribe();
      }
    })
    .catch(function (error) {
      console.log("Error unsubscribing", error);
    })
    .then(function () {
      updateSubscriptionOnServer(null);
      console.log("User is unsubscribed.");
      isSubscribed = false;
      updateBtn();
    });
}