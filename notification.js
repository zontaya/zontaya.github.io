"use strict";

let serviceWorkerRegistration = null;
const subscribeButton = document.querySelector("#subscribeButton");
const notificationButton = document.querySelector("#notificationButton");
const subscriptionJson = document.querySelector(".mdc-typography--headline6");
let isSubscribed = false;

navigator.serviceWorker.register('sw.js', {
    scope: './'
}).then(sw => {

    console.log("registered!", sw);

    sw.update()

    serviceWorkerRegistration = sw

    if ((navigator.userAgent.indexOf("Opera") || navigator.userAgent.indexOf('OPR')) != -1) {
        initialiseState()
    } else if (navigator.userAgent.indexOf("Chrome") !== -1) {
        initialiseState()
    } else if (navigator.userAgent.indexOf("Safari") !== -1) {
        safariIinitialiseState()
    } else if (navigator.userAgent.indexOf("Firefox") !== -1) {
        initialiseState()
    } else if ((navigator.userAgent.indexOf("MSIE") !== -1) || (!!document.documentMode === true)) //IF IE > 10

    {
        initialiseState()
    } else {
        initialiseState()
    }

}).catch(function (err) {
    console.log("Error", err);
});


function updateBtn() {
    if (isSubscribed) {
        subscribeButton.innerHTML = "unsubscribe";
    } else {
        subscribeButton.innerHTML = "subscribe";
    }
}

function initialiseState() {

    subscribeButton.addEventListener("click", () => {
        console.log("click");
        if (isSubscribed) {
            unsubscribe();
        } else {
            subscribe();
        }
    });

    serviceWorkerRegistration.pushManager.getSubscription().then(subscription => {
            sendSubscriptionToServer(subscription);
            updateBtn();
        })
        .catch(function (err) {
            console.warn('Error during getSubscription()', err);
        });

}

function subscribe() {
    serviceWorkerRegistration.pushManager.subscribe({
            userVisibleOnly: true
        }).then(subscription => {
            sendSubscriptionToServer(subscription);
            updateBtn();
        })
        .catch(function (e) {
            if (Notification.permission === 'denied') {
                console.warn('Permission for Notifications was denied');
            } else {
                console.error('Unable to subscribe to push.', e);
            }
        });
}

function unsubscribe() {
    serviceWorkerRegistration.pushManager.getSubscription()
        .then(subscription => {
            if (subscription) {
                subscription.unsubscribe();
            }
        })
        .catch(function (error) {
            console.log("Error unsubscribing", error);
        })
        .then(() => {
            sendSubscriptionToServer(null);
            updateBtn();
            console.log("unsubscribed.");
        });
}

function sendSubscriptionToServer(subscription) {

    if (subscription === null) {
        subscriptionJson.textContent = "";
        isSubscribed = false;
        return;
    }
    isSubscribed = true;
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