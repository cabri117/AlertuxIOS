var maxAge = 3000, timeout = 5000;

var Ciudad;
var Region;
var Pais;
var id_alerta_ultimo;


$(window).load(function () {
    $(".page").fadeIn("slow");
});
//
function onLoad() {
    $(".GifImage").fadeIn("slow");
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

        navigator.geolocation.getCurrentPosition(onSuccess, function (error) {
            console.log("Failed to retrieve high accuracy position - trying to retrieve low accuracy");
            navigator.geolocation.getCurrentPosition(onSuccess, onError, { maximumAge: maxAge, timeout: timeout, enableHighAccuracy: false });
        }, { maximumAge: maxAge, timeout: timeout, enableHighAccuracy: true });
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
        
        return true

    }
    
}



var onSuccess = function (position) {
    
    //  window.alert("Latitude: " + position.coords.latitude + "," + position.coords.longitude);
    window.localStorage.setItem("LastLatitude", position.coords.latitude);
    window.localStorage.setItem("LastLongitude", position.coords.longitude);
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

function onError(error) {

    window.plugins.toast.showWithOptions(
            {
                message: "Active el GPS para mayor precisión",
                duration: "long",
                position: "center",
                addPixelsY: -40  // added a negative value to move it up a bit (default 0)
            });


     Ciudad = window.localStorage.getItem("Ciudad");
     Region = window.localStorage.getItem("Region");
     Pais = window.localStorage.getItem("Pais");

    if (Pais != null) {
        alertas(Ciudad,Region,Pais);
    } else {
        alertas("ciudad", "San Salvador", "El Salvador");
        
    }
    
};



function alertas(Ciudad, Region, Pais) {

    $.ajax({
        type: "POST",
        url: "http://alertux.com/webservice/index.php?pais="+ Pais +"&ciudad="+Ciudad+"&region="+Region+"&versionapp=3.3",
        contentType: "application/json; charset=utf-8",
        crossDomain: true,
        dataType: 'json',
        success: function (response) {
            //console.error(JSON.stringify(response));
            //iterate through the data using $.each()
            var data =
                [{ "ID": 1, "Name": "Inicio", "IMAGE": "transito1.png" },
            { "ID": 2, "Name": "Inicio", "IMAGE": "seguridad1.png" },
            { "ID": 3, "Name": "Inicio", "IMAGE": "catastrofe1.png" },
            { "ID": 4, "Name": "Inicio", "IMAGE": "clima1.png" },
            { "ID": 5, "Name": "Inicio", "IMAGE": "comunitarios1.png" },
            { "ID": 6, "Name": "Inicio", "IMAGE": "disturbios1.png" },
            { "ID": 8, "Name": "Inicio", "IMAGE": "otros1.png" }
                ]
            var output = '';
            $.each(response.alertas, function (index, value) {
                $.each(data, function (index, v) {
                    id_alerta_ultimo = value.id_alerta;//Ultimo ID ALERTA
                    if (v.ID == value.id_categoria) {
                        if (value.url_multimedia != "") {
                            output += '<div id=' + value.id_alerta + ' class="' + value.id_alerta + 'Card nd2-card CardBackground"><img class="' + value.id_alerta + 'Categoria divCategoria" src="img/' + v.IMAGE + '" style="width:39px; height:39px;" /> <div class="card-title has-avatar"><img class="' + value.id_alerta + 'FotoPerfil card-avatar" src="' + value.picture_url + '"><h3 class="' + value.id_alerta + 'UsuarioAlerta card-primary-title">' + value.fullname + '</h3><h5 class="' + value.id_alerta + 'Pais card-subtitle">' + value.ubicacion + '</h5></div><div class="card-media"><img class=' + value.id_alerta + 'MedioFoto url_multimedia" src="' + value.url_multimedia + '" style="width:400px; height:300px;" /></div><div class="' + value.id_alerta + 'alerta card-supporting-text has-action">' + value.alerta + '</div> <div class="BoxBackground"> <a id="' + value.id_alerta + 'CompartirBtn" href="#" class="CompartirBtn ui-btn ui-btn-inline ui-btn-fab waves-effect waves-button waves-effect waves-button aCardAction "><img class="ImgCard" src="img/compartir_naranja.png" /><h3 class="NameCard">Compartir</h3></a> <a id="' + value.id_alerta + 'VerEnMapa" href="#" class="ui-btn ui-btn-inline ui-btn-fab waves-effect waves-button waves-effect waves-button aCardAction "><img class="ImgCard" src="img/world_01.png" /><h3 class="NameCard">Ver en Mapa</h3></a> <a id="' + value.id_alerta + 'ComentarBtn" href="#" class="ui-btn ui-btn-inline ui-btn-fab waves-effect waves-button waves-effect waves-button aCardAction"><img class="ImgCard" src="img/comentar_naranja.png" /><h3 class="NameCard">Comentar</h3></a>  </div></div>';
                        } else {
                            output += '<div id=' + value.id_alerta + ' class="' + value.id_alerta + 'Card nd2-card CardBackground"><img class="' + value.id_alerta + 'Categoria divCategoria" src="img/' + v.IMAGE + '" style="width:39px; height:39px;" /> <div class="card-title has-avatar"><img class="' + value.id_alerta + 'FotoPerfil card-avatar" src="' + value.picture_url + '"><h3 class="' + value.id_alerta + 'UsuarioAlerta card-primary-title">' + value.fullname + '</h3><h5 class="' + value.id_alerta + 'Pais card-subtitle">' + value.ubicacion + '</h5></div><div class="' + value.id_alerta + 'alerta card-supporting-text has-action">' + value.alerta + '</div> <div class="BoxBackground"> <a id="' + value.id_alerta + 'CompartirBtn"  href="#" class="ui-btn ui-btn-inline ui-btn-fab waves-effect waves-button waves-effect waves-button aCardAction "><img class="ImgCard" src="img/compartir_naranja.png" /><h3 class="NameCard">Compartir</h3></a> <a id="' + value.id_alerta + 'VerEnMapa"  href="#" class="ui-btn ui-btn-inline ui-btn-fab waves-effect waves-button waves-effect waves-button aCardAction "><img class="ImgCard" src="img/world_01.png" /><h3 class="NameCard">Ver en Mapa</h3></a> <a id="' + value.id_alerta + 'ComentarBtn" href="#" class="ui-btn ui-btn-inline ui-btn-fab waves-effect waves-button waves-effect waves-button aCardAction"><img class="ImgCard" src="img/comentar_naranja.png" /><h3 class="NameCard">Comentar</h3></a></div></div>';
                        }

                        $(document.body).on('click', '#' + value.id_alerta + 'CompartirBtn', function () {//Boton de Compartir

                            var idCard = "." + value.id_alerta + "Card";
                            var Pais = "." + value.id_alerta + "Pais";

                            
                            
                            var message = {
                               
                                text: "Comparto una alerta en " + $(Pais).html() + " http://alertux.com/redirect/?alerta=" + $(idCard).attr('id')
                            };
                            window.socialmessage.send(message);
                        });//Fin compartir


                        $(document.body).on('click', '#' + value.id_alerta + 'ComentarBtn', function () {//Boton comentar

                            var idCard = "." + value.id_alerta + "Card";
                            var Pais = "." + value.id_alerta + "Pais";
                            var alerta = "." + value.id_alerta + "alerta";
                            var UsuarioAlerta = "." + value.id_alerta + "UsuarioAlerta";
                            var FotoPerfil = "." + value.id_alerta + "FotoPerfil";
                            var MedioFoto = "." + value.id_alerta + "MedioFoto";

                            
                             
                             window.localStorage.setItem("id-alerta", $(idCard).attr('id'));
                              window.localStorage.setItem("alerta", $(alerta).html());
                              window.localStorage.setItem("ubicacion", $(Pais).html());
                              window.localStorage.setItem("usuarioAlerta", $(UsuarioAlerta).html());
                              window.localStorage.setItem("FotoPerfil", $(FotoPerfil).attr('src'));

                              if (value.url_multimedia != "") {
                                  window.localStorage.setItem("CardMedia", $(MedioFoto).attr('src'));
                              } else {
                                  window.localStorage.setItem("CardMedia", "");
                              }
                              
                              window.location.href = "Comentar.html";
                        });//Fin comentar

                        $(document.body).on('click', '#' + value.id_alerta + 'VerEnMapa', function () {//Boton ver en mapa

                            var idCard = "." + value.id_alerta + "Card";
                            var Pais = "." + value.id_alerta + "Pais";
                            var alerta = "." + value.id_alerta + "alerta";
                            var UsuarioAlerta = "." + value.id_alerta + "UsuarioAlerta";
                            var FotoPerfil = "." + value.id_alerta + "FotoPerfil";
                            var MedioFoto = "." + value.id_alerta + "MedioFoto";
                            var CategoriaID = "." + value.id_alerta + "Categoria";

                            
                            if (value.longitud != "") {

                                if (value.latitud != "") {

                                    window.localStorage.setItem("id-alerta", $(idCard).attr('id'));
                                    window.localStorage.setItem("alerta", $(alerta).html());
                                    window.localStorage.setItem("ubicacion", $(Pais).html());
                                    window.localStorage.setItem("usuarioAlerta", $(UsuarioAlerta).html());
                                    window.localStorage.setItem("FotoPerfil", $(FotoPerfil).attr('src'));
                                    window.localStorage.setItem("longitud", value.longitud);
                                    window.localStorage.setItem("latitud", value.latitud);
                                    window.localStorage.setItem("Categoria", value.id_categoria);
                                    window.localStorage.setItem("bandera", "True");

                                    if (value.url_multimedia != "") {
                                        window.localStorage.setItem("CardMedia", $(MedioFoto).attr('src'));
                                    } else {
                                        window.localStorage.setItem("CardMedia", "");
                                    }

                                    window.location.href = "Maps.html";
                                } else {
                                    window.plugins.toast.showWithOptions(
                                            {
                                                message: "Ubicación Desconocida",
                                                duration: "long",
                                                position: "center",
                                                addPixelsY: -40  // added a negative value to move it up a bit (default 0)
                                            });
                                }//fin else laitud
                            } else {
                                window.plugins.toast.showWithOptions(
                                            {
                                                message: "Ubicación Desconocida",
                                                duration: "long",
                                                position: "center",
                                                addPixelsY: -40  // added a negative value to move it up a bit (default 0)
                                            });
                            }//fin else longiotud
                            
                           
                        });//Fin ver en mapa


                    }//fin categoria

                   
                });//FOR CATEGORIAS

            });//FOR ALERTAS
            
            $(".GifImage").fadeOut("fast");
            $('#Alertas').append(output);
            $('#Alertas').fadeIn("slow");
        },
        error: function () {
            //console.error("error");
            alert('Now working!');
        }
    });
}



function Nuevalertas(Ciudad, Region, Pais) {
    
    var bandera = "false";
    $.ajax({
        type: "POST",
        url: "http://alertux.com/webservice/masalertas.php?pais=" + Pais + "&ciudad=" + Ciudad + "&region=" + Region + "&id_alerta_ultimo="+id_alerta_ultimo,
        contentType: "application/json; charset=utf-8",
        crossDomain: true,
        dataType: 'json',
        success: function (response) {
            
            //console.error(JSON.stringify(response));
            //iterate through the data using $.each()
            var data =
                [{ "ID": 1, "Name": "Inicio", "IMAGE": "transito1.png" },
            { "ID": 2, "Name": "Inicio", "IMAGE": "seguridad1.png" },
            { "ID": 3, "Name": "Inicio", "IMAGE": "catastrofe1.png" },
            { "ID": 4, "Name": "Inicio", "IMAGE": "clima1.png" },
            { "ID": 5, "Name": "Inicio", "IMAGE": "comunitarios1.png" },
            { "ID": 6, "Name": "Inicio", "IMAGE": "disturbios1.png" },
            { "ID": 8, "Name": "Inicio", "IMAGE": "otros1.png" }
                ]
            var output = '';
            $.each(response.alertas, function (index, value) {
                id_alerta_ultimo = value.id_alerta;//Ultimo ID ALERTA
                $.each(data, function (index, v) {
                    if (v.ID == value.id_categoria) {
                        if (value.url_multimedia != "") {
                            output += '<div id=' + value.id_alerta + ' class="' + value.id_alerta + 'Card nd2-card CardBackground"><img class="' + value.id_alerta + 'Categoria divCategoria" src="img/' + v.IMAGE + '" style="width:39px; height:39px;" /> <div class="card-title has-avatar"><img class="' + value.id_alerta + 'FotoPerfil card-avatar" src="' + value.picture_url + '"><h3 class="' + value.id_alerta + 'UsuarioAlerta card-primary-title">' + value.fullname + '</h3><h5 class="' + value.id_alerta + 'Pais card-subtitle">' + value.ubicacion + '</h5></div><div class="card-media"><img class=' + value.id_alerta + 'MedioFoto url_multimedia" src="' + value.url_multimedia + '" style="width:400px; height:300px;" /></div><div class="' + value.id_alerta + 'alerta card-supporting-text has-action">' + value.alerta + '</div> <div class="BoxBackground"> <a id="' + value.id_alerta + 'CompartirBtn" href="#" class="CompartirBtn ui-btn ui-btn-inline ui-btn-fab waves-effect waves-button waves-effect waves-button aCardAction "><img class="ImgCard" src="img/compartir_naranja.png" /><h3 class="NameCard">Compartir</h3></a> <a id="' + value.id_alerta + 'VerEnMapa" href="#" class="ui-btn ui-btn-inline ui-btn-fab waves-effect waves-button waves-effect waves-button aCardAction "><img class="ImgCard" src="img/world_01.png" /><h3 class="NameCard">Ver en Mapa</h3></a> <a id="' + value.id_alerta + 'ComentarBtn" href="#" class="ui-btn ui-btn-inline ui-btn-fab waves-effect waves-button waves-effect waves-button aCardAction"><img class="ImgCard" src="img/comentar_naranja.png" /><h3 class="NameCard">Comentar</h3></a>  </div></div>';
                        } else {
                            output += '<div id=' + value.id_alerta + ' class="' + value.id_alerta + 'Card nd2-card CardBackground"><img class="' + value.id_alerta + 'Categoria divCategoria" src="img/' + v.IMAGE + '" style="width:39px; height:39px;" /> <div class="card-title has-avatar"><img class="' + value.id_alerta + 'FotoPerfil card-avatar" src="' + value.picture_url + '"><h3 class="' + value.id_alerta + 'UsuarioAlerta card-primary-title">' + value.fullname + '</h3><h5 class="' + value.id_alerta + 'Pais card-subtitle">' + value.ubicacion + '</h5></div><div class="' + value.id_alerta + 'alerta card-supporting-text has-action">' + value.alerta + '</div> <div class="BoxBackground"> <a id="' + value.id_alerta + 'CompartirBtn"  href="#" class="ui-btn ui-btn-inline ui-btn-fab waves-effect waves-button waves-effect waves-button aCardAction "><img class="ImgCard" src="img/compartir_naranja.png" /><h3 class="NameCard">Compartir</h3></a> <a id="' + value.id_alerta + 'VerEnMapa"  href="#" class="ui-btn ui-btn-inline ui-btn-fab waves-effect waves-button waves-effect waves-button aCardAction "><img class="ImgCard" src="img/world_01.png" /><h3 class="NameCard">Ver en Mapa</h3></a> <a id="' + value.id_alerta + 'ComentarBtn" href="#" class="ui-btn ui-btn-inline ui-btn-fab waves-effect waves-button waves-effect waves-button aCardAction"><img class="ImgCard" src="img/comentar_naranja.png" /><h3 class="NameCard">Comentar</h3></a></div></div>';
                        }

                        $(document.body).on('click', '#' + value.id_alerta + 'CompartirBtn', function () {//Boton de Compartir

                            var idCard = "." + value.id_alerta + "Card";
                            var Pais = "." + value.id_alerta + "Pais";

                            var message = {

                                text: "Comparto una alerta en " + $(Pais).html() + " http://alertux.com/redirect/?alerta=" + $(idCard).attr('id')
                            };
                            window.socialmessage.send(message);
                        });//Fin compartir


                        $(document.body).on('click', '#' + value.id_alerta + 'ComentarBtn', function () {//Boton comentar

                            var idCard = "." + value.id_alerta + "Card";
                            var Pais = "." + value.id_alerta + "Pais";
                            var alerta = "." + value.id_alerta + "alerta";
                            var UsuarioAlerta = "." + value.id_alerta + "UsuarioAlerta";
                            var FotoPerfil = "." + value.id_alerta + "FotoPerfil";
                            var MedioFoto = "." + value.id_alerta + "MedioFoto";


                            window.localStorage.setItem("id-alerta", $(idCard).attr('id'));
                            window.localStorage.setItem("alerta", $(alerta).html());
                            window.localStorage.setItem("ubicacion", $(Pais).html());
                            window.localStorage.setItem("usuarioAlerta", $(UsuarioAlerta).html());
                            window.localStorage.setItem("FotoPerfil", $(FotoPerfil).attr('src'));

                            if (value.url_multimedia != "") {
                                window.localStorage.setItem("CardMedia", $(MedioFoto).attr('src'));
                            } else {
                                window.localStorage.setItem("CardMedia", "");
                            }

                            window.location.href = "Comentar.html";
                        });//Fin comentar

                        

                        $(document.body).on('click', '#' + value.id_alerta + 'VerEnMapa', function () {//Boton ver en mapa

                            var idCard = "." + value.id_alerta + "Card";
                            var Pais = "." + value.id_alerta + "Pais";
                            var alerta = "." + value.id_alerta + "alerta";
                            var UsuarioAlerta = "." + value.id_alerta + "UsuarioAlerta";
                            var FotoPerfil = "." + value.id_alerta + "FotoPerfil";
                            var MedioFoto = "." + value.id_alerta + "MedioFoto";
                            var CategoriaID = "." + value.id_alerta + "Categoria";


                            if (value.longitud != "") {

                                if (value.latitud != "") {

                                    window.localStorage.setItem("id-alerta", $(idCard).attr('id'));
                                    window.localStorage.setItem("alerta", $(alerta).html());
                                    window.localStorage.setItem("ubicacion", $(Pais).html());
                                    window.localStorage.setItem("usuarioAlerta", $(UsuarioAlerta).html());
                                    window.localStorage.setItem("FotoPerfil", $(FotoPerfil).attr('src'));
                                    window.localStorage.setItem("longitud", value.longitud);
                                    window.localStorage.setItem("latitud", value.latitud);
                                    window.localStorage.setItem("Categoria", value.id_categoria);
                                    window.localStorage.setItem("bandera", "True");

                                    if (value.url_multimedia != "") {
                                        window.localStorage.setItem("CardMedia", $(MedioFoto).attr('src'));
                                    } else {
                                        window.localStorage.setItem("CardMedia", "");
                                    }

                                    window.location.href = "Maps.html";
                                } else {
                                    window.plugins.toast.showWithOptions(
                                            {
                                                message: "Ubicación Desconocida",
                                                duration: "long",
                                                position: "center",
                                                addPixelsY: -40  // added a negative value to move it up a bit (default 0)
                                            });
                                }//fin else laitud
                            } else {
                                window.plugins.toast.showWithOptions(
                                            {
                                                message: "Ubicación Desconocida",
                                                duration: "long",
                                                position: "center",
                                                addPixelsY: -40  // added a negative value to move it up a bit (default 0)
                                            });
                            }//fin else longiotud


                        });//Fin ver en mapa


                    }//fin categoria


                });//FOR CATEGORIAS

            });//FOR ALERTAS

            $(".MiniLoader").fadeOut("fast");
            $('#Alertas').append(output);
        },
        error: function () {
            //console.error("error");
            $(".MiniLoader").fadeOut("fast");
        }
    });
}



$("#btnActualizarData").click(function () {


    $("#MiniLoader").fadeIn("slow");

    Nuevalertas(Ciudad, Region, Pais);

    

});




//$(document).on("click", "#CompartirBtn", function () {
    

  //  var message = {

     //   text: "Comparto una alerta en " + $(".card-subtitle").html() + " http://alertux.com/redirect/?alerta=" + $(".nd2-card").attr('id')
      //  };
        //   window.socialmessage.send(message);
//});


//$(document).on("click", "#CompartirBtn", function () {
  //  alert($(".nd2-card").attr('id'));
  //  window.localStorage.setItem("id-alerta", $(".nd2-card").attr('id'));
  //  window.localStorage.setItem("alerta", $(".card-supporting-text").html());
  //  window.localStorage.setItem("ubicacion", $(".card-subtitle").html());
  //  window.localStorage.setItem("usuarioAlerta", $(".card-primary-title").html());
  //  window.localStorage.setItem("FotoPerfil", $('.card-avatar').attr('src'));
 //  window.localStorage.setItem("CardMedia", $('.url_multimedia').attr('src'));
 //  window.location.href = "Comentar.html";


//});



