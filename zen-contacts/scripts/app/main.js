'use strict';

// global error handling
var showAlert = function(message, title, callback) {
    navigator.notification.alert(message, callback || function () {
    }, title, 'OK');
};
var showError = function(message) {
    showAlert(message, 'Error occured');
};
window.addEventListener('error', function (e) {
    e.preventDefault();
    var message = e.message + "' from " + e.filename + ":" + e.lineno;
    showAlert(message, 'Error occured');
    return true;
});

var onBackKeyDown = function(e) {
    e.preventDefault();
    navigator.notification.confirm('Do you really want to exit?', function (confirmed) {
        var exit = function () {
            navigator.app.exitApp();
        };
        if (confirmed === true || confirmed === 1) {
            AppHelper.logout().then(exit, exit);
        }
    }, 'Exit', 'Ok,Cancel');
};
var onDeviceReady = function() {
    //Handle document events
    if (parseFloat(window.device.version) >= 7.0) {
        $(document.body).addClass("ios-offset");
    }
    
    // check network connection
    if (navigator.network.connection.type == Connection.NONE) {
        showError('This app requires an internet connection.');
    }
    
    document.addEventListener("backbutton", onBackKeyDown, false);
};

document.addEventListener("deviceready", onDeviceReady, false);

var mobileApp = new kendo.mobile.Application(document.body, { transition: 'slide', statusBarStyle: "black", layout: 'mobile-tabstrip', skin: 'flat' });

var app = { viewModels: {} };