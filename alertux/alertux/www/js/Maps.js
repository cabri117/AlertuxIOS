$(window).load(function () {
    $(".page").fadeIn("slow");
});

var maxAge = 3000, timeout = 5000;
var map;

function onLoad() {
    
    document.addEventListener("deviceready", onDeviceReady, false);
}

// device APIs are available
//
function onDeviceReady() {
   


    $("#PerfilBtn").click(function () {
        window.location.href = "Profile.html";
    });
    // Now safe to use device APIs
    if (checkConnection()) {


        



        var string = device.platform;
        if (string == "iOS") {
            var value = window.localStorage.getItem("key");
            if (value != null) {
                $.ajax({
                    type: "POST",
                    url: "http://alertux.com/webservice/consulta_correo.php?correo=" + value,
                    contentType: "application/json; charset=utf-8",
                    crossDomain: true,
                    dataType: 'json',
                    success: function (response) {
                        //console.error(JSON.stringify(response));
                        //iterate through the data using $.each()
                        var output = '';
                        $.each(response.usuario, function (index, value) {
                            output += '<div id="ProfileDiv" class="col-xs-4 center-xs"> <div class="box"> <img class="profile-thumbnail" src="' + value.picture_url + '" /> </div> </div> <div class="col-xs-8"> <div class="box profile-text"> <strong>' + value.fullname + '</strong> </div></div>';
                            window.localStorage.setItem("idUsuario", value.id_usuario);
                        });

                        $('#ProfileRow').append(output);
                    },
                    error: function () {
                        //console.error("error");

                    }
                });

            } else {
                window.location.href = "Login.html";
            }


        } else if (string == "Android") {
            window.plugins.DeviceAccounts.getEmail(function (accounts) {
                // accounts is an array with objects containing name and type attributes
                console.log('account registered on this device:', accounts);
                window.localStorage.setItem("key", accounts);
                $.ajax({
                    type: "POST",
                    url: "http://alertux.com/webservice/consulta_correo.php?correo=" + accounts,
                    contentType: "application/json; charset=utf-8",
                    crossDomain: true,
                    dataType: 'json',
                    success: function (response) {
                        //console.error(JSON.stringify(response));
                        //iterate through the data using $.each()
                        var output = '';
                        $.each(response.usuario, function (index, value) {
                            output += '<div class="col-xs-4 center-xs"> <div class="box"> <img class="profile-thumbnail" src="' + value.picture_url + '" /> </div> </div> <div class="col-xs-8"> <div class="box profile-text"> <strong>' + value.fullname + '</strong> </div></div>';
                            window.localStorage.setItem("idUsuario", value.id_usuario);
                        });

                        $('#ProfileRow').append(output);
                    },
                    error: function () {
                        //console.error("error");

                    }
                });



            }, function (error) {
                console.log('Fail to retrieve accounts, details on exception:', error);

            });
        } else {
            window.plugins.toast.showWithOptions(
            {
                message: "Alertux no es Compatible con sus dispositivo",
                duration: "long",
                position: "center",
                addPixelsY: -40  // added a negative value to move it up a bit (default 0)
            });
        }


        var banderaAlerta = window.localStorage.getItem("bandera");

        if (banderaAlerta != null) {//si viene d ever mapa
            if (banderaAlerta == "True") {//si es true
                window.localStorage.removeItem("bandera");
                VerEnMapa();

            }
        } else {//si no haz lo demas 
        navigator.geolocation.getCurrentPosition(onSuccess, function (error) {
            console.log("Failed to retrieve high accuracy position - trying to retrieve low accuracy");
            navigator.geolocation.getCurrentPosition(onSuccess, onError, { maximumAge: maxAge, timeout: timeout, enableHighAccuracy: false });
        }, { maximumAge: maxAge, timeout: timeout, enableHighAccuracy: true });
    }// fin else bandera
    }// fin check connection


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
   
    
    map = new GMaps({
        el: '#map',
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        zoomControl: true,
        zoomControlOpt: {
            style: 'SMALL',
            position: 'TOP_LEFT'
        },
        panControl: false,
        streetViewControl: false,
        mapTypeControl: false,
        overviewMapControl: false
    });

    map.addMarker({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
    });


    var Ciudad;
    var Region;
    var Pais;
    //  window.alert("Latitude: " + position.coords.latitude + "," + position.coords.longitude);
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
                        if (v.types == "locality,political") {
                            // window.alert(v.long_name);
                            window.localStorage.setItem("Ciudad", v.long_name);
                            Ciudad = v.long_name;
                        }

                        if (v.types == "administrative_area_level_1,political") {
                            // window.alert(v.long_name);
                            window.localStorage.setItem("Region", v.long_name);
                            Region = v.long_name;
                        }


                        if (v.types == "country,political") {
                            // window.alert(v.long_name);
                            window.localStorage.setItem("Pais", v.long_name);
                            Pais = v.long_name;
                            bandera = "true";
                            alertas(Ciudad, Region, Pais);
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


function alertas(Ciudad, Region, Pais) {
    var IdUser = window.localStorage.getItem("idUsuario");
    
    $.ajax({
        type: "POST",
        url: "http://alertux.com/webservice/json_mapa.php?pais=" + Pais + "&region=" + Region + "&ciudad=" + Ciudad + "&id_usuario=" + IdUser,
        contentType: "application/json; charset=utf-8",
        crossDomain: true,
        dataType: 'json',
        success: function (response) {
            //console.error(JSON.stringify(response));
            //iterate through the data using $.each()
            var data =
                [{ "ID": 1, "Name": "Inicio", "IMAGE": "img/tran_map.png" },
            { "ID": 2, "Name": "Inicio", "IMAGE": "img/sin_cat.png" },
            { "ID": 3, "Name": "Inicio", "IMAGE": "img/catas_map.png" },
            { "ID": 4, "Name": "Inicio", "IMAGE": "img/clim_map.png" },
            { "ID": 5, "Name": "Inicio", "IMAGE": "img/comu_map.png" },
            { "ID": 6, "Name": "Inicio", "IMAGE": "img/icon.png" },
            { "ID": 8, "Name": "Inicio", "IMAGE": "img/sin_cat.png" }
                ];
            var output = '';
            $.each(response.pines, function (index, value) {
                $.each(data, function (index, v) {//comienza categorias
                    
                    if (v.ID == value.id_categoria) {
                        
                        var icon = v.IMAGE;
                        
                        if (map == null) {

                            window.plugins.toast.showWithOptions(
                                {
                                    message: "Active el GPS para mayor precisión",
                                    duration: "long",
                                    position: "center",
                                    addPixelsY: -40  // added a negative value to move it up a bit (default 0)
                                });
                        
                            map = new GMaps({
                                el: '#map',
                                lat: value.latitud,
                                lng: value.longitud,
                                zoomControl: true,
                                zoomControlOpt: {
                                    style: 'SMALL',
                                    position: 'TOP_LEFT'
                                },
                                panControl: false,
                                streetViewControl: false,
                                mapTypeControl: false,
                                overviewMapControl: false
                            });
                        }//finish if map


                        map.addMarker({
                            lat: value.latitud,
                            lng: value.longitud,
                            icon: icon,
                            infoWindow: {
                                content: '<a id=' + value.id_alerta + 'Detalle><p>' + value.alerta + '</p></a>'
                            }
                        });

                        $(document.body).on('click', '#' + value.id_alerta + 'Detalle', function () {//Boton detalle comentar


                            var idCard = "." + value.id_alerta + "Card";
                            var Pais = "." + value.id_alerta + "Pais";
                            var alerta = "." + value.id_alerta + "alerta";
                            var UsuarioAlerta = "." + value.id_alerta + "UsuarioAlerta";
                            var FotoPerfil = "." + value.id_alerta + "FotoPerfil";
                            var MedioFoto = "." + value.id_alerta + "MedioFoto";


                            window.localStorage.setItem("id-alerta", value.id_alerta);
                            window.localStorage.setItem("alerta", value.alerta);
                            window.localStorage.setItem("ubicacion", value.ubicacion);
                            window.localStorage.setItem("usuarioAlerta", value.usuario);

                            if (value.picture_url != "") {
                                window.localStorage.setItem("FotoPerfil", value.picture_url);
                            } else {
                                window.localStorage.setItem("FotoPerfil", "");
                            }
                            

                            if (value.url_multimedia != "") {
                                window.localStorage.setItem("CardMedia", value.url_multimedia);
                            } else {
                                window.localStorage.setItem("CardMedia", "");
                            }

                            window.location.href = "Comentar.html";

                        });//fin detalle comentar



                   }//fin categoria


                });//FOR CATEGORIAS

            });//FOR ALERTAS

            
        },
        error: function () {
            //console.error("error");
            alert('Now working!');
        }
    });
}


function onError(error) {

    window.plugins.toast.showWithOptions(
            {
                message: "Active el GPS para mayor precisión",
                duration: "long",
                position: "center",
                addPixelsY: -40  // added a negative value to move it up a bit (default 0)
            });


    if (window.localStorage.getItem("LastLatitude") != null) {

  
    map = new GMaps({
        el: '#map',
        lat: window.localStorage.getItem("LastLatitude"),
        lng: window.localStorage.getItem("LastLongitude"),
        zoomControl: true,
        zoomControlOpt: {
            style: 'SMALL',
            position: 'TOP_LEFT'
        },
        panControl: false,
        streetViewControl: false,
        mapTypeControl: false,
        overviewMapControl: false
    });
    }

    var Ciudad = window.localStorage.getItem("Ciudad");
    var Region = window.localStorage.getItem("Region");
    var Pais = window.localStorage.getItem("Pais");

    if (Pais != null) {
        alertas(Ciudad, Region, Pais);
    } else {
        alertas("ciudad", "San Salvador", "El Salvador");
        
    }

};


$("#btnActualizar").click(function () {
    

   

    window.plugins.toast.showWithOptions(
            {
                message: "Actualizando....",
                duration: "long",
                position: "center",
                addPixelsY: -40  // added a negative value to move it up a bit (default 0)
            });


     navigator.geolocation.getCurrentPosition(onSuccess, function (error) {
        console.log("Failed to retrieve high accuracy position - trying to retrieve low accuracy");
        navigator.geolocation.getCurrentPosition(onSuccess, onError, { maximumAge: maxAge, timeout: timeout, enableHighAccuracy: false });
    }, { maximumAge: maxAge, timeout: timeout, enableHighAccuracy: true });

});


function VerEnMapa() {

    ///LLAMADA INTENT DE ITEM
    var longitud = window.localStorage.getItem("longitud");
    var latitud = window.localStorage.getItem("latitud");
    var CategoriaID = window.localStorage.getItem("Categoria");
    var IDAlertaMapa = window.localStorage.getItem("id-alerta");
    var AlertaMapa = window.localStorage.getItem("alerta");
    var ubicacion = window.localStorage.getItem("ubicacion"); 
    var usuarioAlerta = window.localStorage.getItem("usuarioAlerta");
    var CardMedia = window.localStorage.getItem("CardMedia");
    var FotoPerfil = window.localStorage.getItem("FotoPerfil");
    //---------------------------

    //REMOVE ITEMS
    window.localStorage.removeItem("longitud");
    window.localStorage.removeItem("latitud");
    window.localStorage.removeItem("Categoria");
    window.localStorage.removeItem("id-alerta");
    window.localStorage.removeItem("alerta");
    window.localStorage.removeItem("ubicacion");
    window.localStorage.removeItem("usuarioAlerta");
    window.localStorage.removeItem("CardMedia");
    window.localStorage.removeItem("FotoPerfil");

    //---------------------

    //Crear MAPA
    map = new GMaps({
        el: '#map',
        lat: latitud,
        lng: longitud,
        zoomControl: true,
        zoomControlOpt: {
            style: 'SMALL',
            position: 'TOP_LEFT'
        },
        panControl: false,
        streetViewControl: false,
        mapTypeControl: false,
        overviewMapControl: false
    });



    var data =[{ "ID": 1, "Name": "Inicio", "IMAGE": "img/tran_map.png" },
            { "ID": 2, "Name": "Inicio", "IMAGE": "img/sin_cat.png" },
            { "ID": 3, "Name": "Inicio", "IMAGE": "img/catas_map.png" },
            { "ID": 4, "Name": "Inicio", "IMAGE": "img/clim_map.png" },
            { "ID": 5, "Name": "Inicio", "IMAGE": "img/comu_map.png" },
            { "ID": 6, "Name": "Inicio", "IMAGE": "img/icon.png" },
            { "ID": 8, "Name": "Inicio", "IMAGE": "img/sin_cat.png" }];

    $.each(data, function (index, v) {//comienza categorias

        
        if (CategoriaID == v.ID) {

            var icon = v.IMAGE;//ICONO DE CATEGORIA
            
            //AGREGAR ICONOC
            map.addMarker({
                lat: latitud,
                lng: longitud,
                icon: icon,
                infoWindow: {
                    content: '<a id=' + IDAlertaMapa + 'Detalle><p>' + AlertaMapa + '</p></a>'
                }
            });

            $(document.body).on('click', '#' + IDAlertaMapa + 'Detalle', function () {//Boton detalle comentar



                window.localStorage.setItem("id-alerta", IDAlertaMapa);
                window.localStorage.setItem("alerta", AlertaMapa);
                window.localStorage.setItem("ubicacion", ubicacion);
                window.localStorage.setItem("usuarioAlerta", usuarioAlerta);

                if (FotoPerfil != "") {
                    window.localStorage.setItem("FotoPerfil", FotoPerfil);
                } else {
                    window.localStorage.setItem("FotoPerfil", "");
                }


                if (CardMedia != "") {
                    window.localStorage.setItem("CardMedia", CardMedia);
                } else {
                    window.localStorage.setItem("CardMedia", "");
                }

                window.location.href = "Comentar.html";

            });//fin detalle comentar


        }

    });//fin categorias

}