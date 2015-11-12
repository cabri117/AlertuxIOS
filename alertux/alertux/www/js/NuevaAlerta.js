$(window).load(function () {
    $(".page").fadeIn("slow");
});

var maxAge = 3000, timeout = 5000;
var mUbicacion;
var LAT, LONG;
var mCiudad, mPais, mRegion;

function onLoad() {
    
    document.addEventListener("deviceready", onDeviceReady, false);
    document.addEventListener("backbutton", onBackKeyDown, false);
}

function onBackKeyDown() {
    window.location.href = "index.html";
    
}

function onDeviceReady() {


    navigator.geolocation.getCurrentPosition(onSuccess, function (error) {
        console.log("Failed to retrieve high accuracy position - trying to retrieve low accuracy");
        navigator.geolocation.getCurrentPosition(onSuccess, onError, { maximumAge: maxAge, timeout: timeout, enableHighAccuracy: false });
    }, { maximumAge: maxAge, timeout: timeout, enableHighAccuracy: true });



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

        return true

    }

}


var onSuccess = function (position) {

    //window.alert("Latitude: " + position.coords.latitude + "," + position.coords.longitude);
    //  window.alert("Latitude: " + position.coords.latitude + "," + position.coords.longitude);
    //window.localStorage.setItem("LastLatitude", position.coords.latitude);
    //window.localStorage.setItem("LastLongitude", position.coords.longitude);
    LAT=position.coords.latitude;
    LONG=position.coords.longitude;
    $.ajax({
        type: "POST",
        url: "http://maps.googleapis.com/maps/api/geocode/json?latlng=" + position.coords.latitude + "," + position.coords.longitude + "&sensor=true&language=es",
        contentType: "application/json; charset=utf-8",
        crossDomain: true,
        dataType: 'json',
        success: function (response) {

            var bandera = "false";
            // window.alert("sucess");
            //var json = JSON.stringify(response);
            //window.alert(json);
            $.each(response.results, function (index, value) {


                $.each(value.address_components, function (index, v) {

                    if (bandera == "false") {
                        

                        if (v.types == "route") {
                            //window.alert(v.long_name);
                            mUbicacion = v.long_name;
                            document.getElementById("Ubicacion").innerHTML = v.long_name;
                            
                            
                        }
                        if (bandera == "false") {
                            if (v.types == "locality,political") {
                                // window.alert(v.long_name);
                                
                                mCiudad = v.long_name;
                            }

                            if (v.types == "administrative_area_level_1,political") {
                                // window.alert(v.long_name);
                                
                                mRegion = v.long_name;
                            }


                            if (v.types == "country,political") {
                                // window.alert(v.long_name);
                               
                                mPais = v.long_name;
                                bandera = "true";
                                
                            }

                        }


                    }


                });





            });

        },
        error: function () {
            //console.error("error");
            alert('Now working!');
        }
    });
   

};

function onError(error) {

    window.plugins.toast.showWithOptions(
                                           {
                                               message: "Active el GPS",
                                               duration: "long",
                                               position: "center",
                                               addPixelsY: -40  // added a negative value to move it up a bit (default 0)
                                           });

};

$("#btn").click(function () {
    enviarAlertaTexto();
});

function enviarAlertaTexto() {
    var mAlerta = document.getElementById("name2b Alerta").value;//Alerta
    var IdUsuario = window.localStorage.getItem("idUsuario");//ID USUARIO
    var mCategoria = $("#select-choice-1b").val();//CATEGORIA
    

    if (mAlerta != "") {
        $.post("http://alertux.com/webservice/nueva_alerta.php", { a: mAlerta, u: mUbicacion, lo: LONG, la: LAT, id_u: IdUsuario, pais: mPais, region: mRegion, ciudad: mCiudad, cat: mCategoria }, function () {
            window.plugins.toast.showWithOptions(
             {
                 message: "Alerta Enviado exitosamente",
                 duration: "long",
                 position: "center",
                 addPixelsY: -40  // added a negative value to move it up a bit (default 0)
             });

            window.location.href = "index.html";

        });
    } else {
        window.plugins.toast.showWithOptions(
            {
                message: "Porfavor escriba una Alerta",
                duration: "long",
                position: "center",
                addPixelsY: -40  // added a negative value to move it up a bit (default 0)
            });
    }
    
}


$("#btnBack").click(function () {
    window.location.href = "index.html";
    
});