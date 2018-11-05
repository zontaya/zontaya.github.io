"use strict";

var domain = "web.com.cct.webpush";
var webpush_server = "https://cctwebpush.herokuapp.com";


function safariIinitialiseState() {

    subscribeButton.addEventListener("click", () => {
        console.log("click");
        if (isSubscribed) {

        } else {
            //subscribe;
            checkRemotePermission(result);
        }
    });


    var result = window.safari.pushNotification.permission(domain);
    if (result.permission === "default") {
        console.log(result.permission);

    } else if (result.permission === "granted") {
        console.log(result.permission);
        isSubscribed = true;
        var token = result.deviceToken;
        subscriptionJson.textContent = "token:" + token;
        subscribeButton.disabled = isSubscribed;
        updateBtn();
    } else if (result.permission === "denied") {
        console.log(result.permission);
        isSubscribed = false;
        updateBtn();
    }

}

const checkRemotePermission = permissionData => {
    if (permissionData.permission === "default") {
        window.safari.pushNotification.requestPermission(
            webpush_server, // The web service URL.
            domain, // The Website Push ID.
            {}, // Data that you choose to send to your server to help you identify the user.
            checkRemotePermission // The callback function.
        );
    } else if (permissionData.permission === "denied") {
        console.log(permissionData.permission);
        isSubscribed = false;
        updateBtn();
    } else if (permissionData.permission === "granted") {
        console.log(permissionData.permission);
        isSubscribed = true;
        var token = permissionData.deviceToken;
        subscriptionJson.textContent = "token:" + token;
        subscribeButton.disabled = isSubscribed;
        updateBtn();
    }
};