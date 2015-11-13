$(window).load(function () {
    $(".page").fadeIn("slow");
});
//
var IdUsuario;

function onLoad() {
    document.addEventListener("deviceready", onDeviceReady, false);
    document.addEventListener("backbutton", onBackKeyDown, false);
}

function onBackKeyDown() {
    window.location.href = "index.html";
}
// device APIs are available
//
function onDeviceReady() {
    
    // Now safe to use device APIs
    if (checkConnection()) {
        var value = window.localStorage.getItem("key");
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
                   // output += ' <a id="BtnImage" href="#">  <img class="ProfilePhoto" id="myimage" src="' + value.picture_url + '"  style="width:50px; height:50px;"> </a> ';
                    document.getElementById("name2b nombre").value = value.fullname;
                    document.getElementById("myimage").src = value.picture_url;
                    IdUsuario = value.id_usuario;
                    Descripcion(value.id_usuario);
                    
                });

               // $('#IMG').append(output);
               
            },
            error: function () {
                //console.error("error");

            }
        });

        
    }
   
    
       
}

$('#IMG').on('click', 'a', function () {
   
    //getPhoto(pictureSource.PHOTOLIBRARY);
    
   // navigator.camera.getPicture(onSuccess, onFail, {
      // quality: 50,
     //  destinationType: Camera.DestinationType.FILE_URI
  //  });

 //   function onSuccess(imageData) {
        //document.getElementById("myimage").src = "data:image/jpeg;base64," + imageData;
        //image.src = "data:image/jpeg;base64," + imageData;
    //    window.alert("Success");
    //    var image = document.getElementById('myImage');
     //   image.src = imageData;

  //  }

   // function onFail(message) {
   //   alert('Failed because: ' + message);
    //}

});

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

function Descripcion(id_usuario_actual) {


    
    $.ajax({
        type: "POST",
        url: "http://alertux.com/webservice/info_usuario.php?id_usuario=" + id_usuario_actual,
        contentType: "application/json; charset=utf-8",
        crossDomain: true,
        dataType: 'json',
        success: function (response) {
            //console.error(JSON.stringify(response));
            //iterate through the data using $.each()
            $.each(response.info, function (index, value) {
                document.getElementById("name2b descrip").value = value.descripcion;
                
            });

           

        },
        error: function () {
            //console.error("error");

        }
    });
}

$("#btnBack").click(function () {
    window.location.href = "index.html";
});


$("#BtnImage").click(function () {
    window.location.href = "index.html";
});

$("#btnSave").click(function () {
   // var img = document.getElementById('myimage')
    //var myBase64EncodedData = getBase64Image(img);
    var Descripcion_encode = document.getElementById("name2b descrip").value;
    var nombre_encode = document.getElementById("name2b nombre").value;
    $.post("http://alertux.com/webservice/cambiar_perfil.php?target=post", { nombre: nombre_encode, ubicacion: "", descripcion: Descripcion_encode, id_usuario: IdUsuario}, function() {
        window.plugins.toast.showWithOptions(
         {
             message: "Cambios guardado exitosamente",
             duration: "long",
             position: "center",
             addPixelsY: -40  // added a negative value to move it up a bit (default 0)
         });
        window.location.href = "index.html";
});
});


//navigator.camera.getPicture(onSuccess, onFail, {
//    quality: 50,
 //   destinationType: Camera.DestinationType.DATA_URL
//});

//function onSuccess(imageData) {
    //var image = document.getElementById('myimage');
    //image.src = "data:image/jpeg;base64," + imageData;

//}

//function onFail(message) {
 //   alert('Failed because: ' + message);
//}
function getPhoto(source) {
    // Retrieve image file location from specified source
    navigator.camera.getPicture(onPhotoURISuccess, onFail, {
        quality: 50,
        destinationType: destinationType.FILE_URI,
        sourceType: source
    });
}

