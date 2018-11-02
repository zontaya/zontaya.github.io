"use strict";

var domain = "web.com.cct.webpush";
var webpush_server = "https://cctwebpush.herokuapp.com";

function safariIniti() {
  console.log("safariIniti");
  var pResult = window.safari.pushNotification.permission(domain);

  if (pResult.permission === "default") {
    console.log("Permission for " + domain + " is " + pResult.permission);
    //request permission
    checkRemotePermission(pResult);
  } else if (pResult.permission === "granted") {
    console.log("Permission for " + domain + " is " + pResult.permission);
    var token = pResult.deviceToken;
    // Show subscription for debug
    console.log("Subscription details:" + token);
  } else if (pResult.permission === "denied") {
    console.log("Permission for " + domain + " is " + pResult.permission);
  }
}

var checkRemotePermission = function(permissionData) {
  if (permissionData.permission === "default") {
    // This is a new web service URL and its validity is unknown.

    window.safari.pushNotification.requestPermission(
      // The web service URL.
      webpush_server, // The web service URL.
      domain, // The Website Push ID.
      {}, // Data that you choose to send to your server to help you identify the user.
      checkRemotePermission // The callback function.
    );
  } else if (permissionData.permission === "denied") {
    // The user said no.

    console.log(permissionData.permission);
  } else if (permissionData.permission === "granted") {
    console.log(permissionData.permission);
    console.log("token:", permissionData.deviceToken);
    // The web service URL is a valid push provider, and the user said yes.
  }
};
