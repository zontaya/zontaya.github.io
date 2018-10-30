"use strict";

var domain = "web.com.cct.webpush";

function safariIniti() {
    console.log('safariIniti');


    var pResult = window.safari.pushNotification.permission(domain);

    if (pResult.permission === 'default') {
        console.log("Permission for " + domain + " is " + pResult.permission);
        //request permission
        checkRemotePermission(pResult);
    } else if (pResult.permission === 'granted') {
        console.log("Permission for " + domain + " is " + pResult.permission);
        var token = pResult.deviceToken;
        // Show subscription for debug
        console.log('Subscription details:' + token);
    } else if (pResult.permission === 'denied') {
        console.log("Permission for " + domain + " is " + pResult.permission);
    }
}


var checkRemotePermission = function (permissionData) {
    console.log("Permission for 2 " + domain + " is " + permissionData.permission);

    if (permissionData.permission === 'default') {
        // This is a new web service URL and its validity is unknown.

        requestPermissions();
        window.safari.pushNotification.requestPermission(
            // The web service URL.
            'https://10.100.90.203:8443/webpush_server', // The web service URL.
            domain, // The Website Push ID.
            {"name":"bas"}, // Data that you choose to send to your server to help you identify the user.
            checkRemotePermission // The callback function.
        );
    } else if (permissionData.permission === 'denied') {
        // The user said no.
    } else if (permissionData.permission === 'granted') {
        // The web service URL is a valid push provider, and the user said yes.
        // permissionData.deviceToken is now available to use.
    }
};


function getToken() {

    // always start with a letter (for DOM friendlyness)
    var idstr = String.fromCharCode(Math.floor((Math.random() * 25) + 65));
    do {
        // between numbers and characters (48 is 0 and 90 is Z (42-48 = 90)
        var ascicode = Math.floor((Math.random() * 42) + 48);
        if (ascicode < 58 || ascicode > 64) {
            // exclude all chars between : (58) and @ (64)
            idstr += String.fromCharCode(ascicode);
        }
    } while (idstr.length < 32);

    return (idstr);
}


function requestPermissions() {

    var tokenVal = getToken();
    console.log("token:", tokenVal);
    window.safari.pushNotification.requestPermission('https://10.100.90.203:8443/webpush_server', domain, {
            token: tokenVal
        },
        function (subscription) {

            console.log(subscription.permission);
            console.log("PERMISSION ====>> " + subscription.permission);
            if (subscription.permission === 'granted') {
                //TODO
            } else if (subscription.permission === 'denied') {
                // TODO:
            }
        });

}