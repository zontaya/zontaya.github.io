/**
 * Step one: run a function on load (or whenever is appropriate for you)
 * Function run on load sets up the service worker if it is supported in the
 * browser. Requires a serviceworker in a `sw.js`. This file contains what will
 * happen when we receive a push notification.
 * If you are using webpack, see the section below.
 */

"use strict";

let serviceWorkerRegistration = null;
const pushButton = document.querySelector(".mdc-chip ");
const subscriptionJson = document.querySelector(".mdc-typography--headline6");
let isSubscribed = false;

navigator.serviceWorker.register('sw.js', {
    scope: './'
}).then(function (sw) {
    serviceWorkerRegistration = sw;
    //notify();
    console.log("Registered!", sw);
    safariIniti()
    sw.update()
    initialiseState();
   
}).catch(function (err) {
    console.log("Error", err);
});



/**
 * Step two: The serviceworker is registered (started) in the browser. Now we
 * need to check if push messages and notifications are supported in the browser
 */
function initialiseState() {




    console.log('initialiseState.');

    pushButton.addEventListener("click", function () {
        pushButton.disabled = true;
        if (isSubscribed) {

        } else {
            console.log('Push messaging isn\'t supported.');

            subscribe();
        }
    });



    // Check if user has disabled notifications
    // If a user has manually disabled notifications in his/her browser for 
    // your page previously, they will need to MANUALLY go in and turn the
    // permission back on. In this statement you could show some UI element 
    // telling the user how to do so.
    if (Notification.permission === 'denied') {
        console.log('The user has blocked notifications.');

    }

    // Check is push API is supported
    if (!('PushManager' in window)) {
        console.log('Push messaging isn\'t supported.');

    }



    // Get the push notification subscription object
    serviceWorkerRegistration.pushManager.getSubscription().then(function (subscription) {

            // If this is the user's first visit we need to set up
            // a subscription to push notifications
            if (!subscription) {
                subscribe();
            }
        })
        .catch(function (err) {
            // Handle the error - show a notification in the GUI
            console.warn('Error during getSubscription()', err);
        });

}

/**
 * Step three: Create a subscription. Contact the third party push server (for
 * example mozilla's push server) and generate a unique subscription for the
 * current browser.
 */
function subscribe() {

    console.log('subscribe  serviceWorkerRegistration', serviceWorkerRegistration);
    serviceWorkerRegistration.pushManager.subscribe({
            userVisibleOnly: true
        }).then(function (subscription) {
            // Update the server state with the new subscription
            sendSubscriptionToServer(subscription);
        })
        .catch(function (e) {
            if (Notification.permission === 'denied') {
                console.warn('Permission for Notifications was denied');
            } else {
                console.error('Unable to subscribe to push.', e);
            }
        });

}

/**
 * Step four: Send the generated subscription object to our server.
 */
function sendSubscriptionToServer(subscription) {

    // Get public key and user auth from the subscription object
    var key = subscription.getKey ? subscription.getKey('p256dh') : '';
    var auth = subscription.getKey ? subscription.getKey('auth') : '';


    // This example uses the new fetch API. This is not supported in all
    // browsers yet.

    var data = JSON.stringify({
        endpoint: subscription.endpoint,
        keys: {
            "p256dh": key ? btoa(String.fromCharCode.apply(null, new Uint8Array(key))) : '',
            "auth": auth ? btoa(String.fromCharCode.apply(null, new Uint8Array(auth))) : ''
        }
    })

    subscriptionJson.textContent = data;

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            console.log(this.responseText);
        }
    });

    xhr.open("POST", "http://192.168.1.33:8080/webpush_server/api/subscribe");
    //xhr.send(data);

    console.log('xhr:', xhr);
    console.log('data', data);


}


const notify = function () {
    // Check for notification compatibility.
    if (!'Notification' in window) {
        // If the browser version is unsupported, remain silent.
        return;
    }

    console.log('subscribe  serviceWorkerRegistration', serviceWorkerRegistration);
    console.log('subscribe   serviceWorkerRegistration.pushManager', serviceWorkerRegistration.pushManager);
    // Log current permission level
    console.log("XXXX", Notification.permission);
    // If the user has not been asked to grant or deny notifications
    // from this domain...
    if (Notification.permission === 'default') {
        Notification.requestPermission(function () {
            // ...callback this function once a permission level has been set.
            notify();
        });
    }
    // If the user has granted permission for this domain to send notifications...
    else if (Notification.permission === 'granted') {
        var n = new Notification(
            'New message from Liz', {
                'body': 'Liz: "Hi there!"',
                // ...prevent duplicate notifications
                'tag': 'unique string'
            }
        );
        // Remove the notification from Notification Center when clicked.
        n.onclick = function () {
            this.close();
        };
        // Callback function when the notification is closed.
        n.onclose = function () {
            console.log('Notification closed');
        };
    }
    // If the user does not want notifications to come from this domain...
    else if (Notification.permission === 'denied') {
        // ...remain silent.
        return;
    }
};