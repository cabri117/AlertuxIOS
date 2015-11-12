
// Wait for device API libraries to load
//
function onLoad() {
    document.addEventListener("deviceready", onDeviceReady, false);
}

// device APIs are available
//
function onDeviceReady() {
    // Now safe to use device APIs
    if (checkConnection()) {
        $("div").fadeOut();
        window.plugins.DeviceAccounts.getEmail(function (accounts) {
            // accounts is an array with objects containing name and type attributes
            console.log('account registered on this device:', accounts);
        }, function (error) {
            console.log('Fail to retrieve accounts, details on exception:', error);
        });
    }
}

function checkConnection() {
    var networkState = navigator.connection.type;

    var states = {};
    states[Connection.UNKNOWN] = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI] = 'WiFi connection';
    states[Connection.CELL_2G] = 'Cell 2G connection';
    states[Connection.CELL_3G] = 'Cell 3G connection';
    states[Connection.CELL_4G] = 'Cell 4G connection';
    states[Connection.NONE] = 'No network connection';
    if (states[networkState] == states[Connection.NONE]) {
        return false
    } else {
        console.log('INICIO', "CONNECTIONS TRUE");
        return true
    }
    
}


