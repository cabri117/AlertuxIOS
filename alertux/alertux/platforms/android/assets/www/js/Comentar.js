$(window).load(function () {
    $(".page").fadeIn("slow");
});

function onLoad() {
    document.addEventListener("deviceready", onDeviceReady, false);
    document.addEventListener("backbutton", onBackKeyDown, false);
}

function onBackKeyDown() {
    window.location.href = "index.html";
    window.localStorage.removeItem("id-alerta");
}


function onDeviceReady() {
    var FotoPerfil = window.localStorage.getItem("FotoPerfil");

    if (FotoPerfil != null) {
        document.getElementById("FotoPerfil").src = FotoPerfil;
        window.localStorage.removeItem("FotoPerfil");
    }


    var Nombre = window.localStorage.getItem("usuarioAlerta");

    if (Nombre != null) {
        document.getElementById("Nombre").textContent = Nombre;
        window.localStorage.removeItem("usuarioAlerta");
    }


    var AlertaTexto = window.localStorage.getItem("alerta");

    if (AlertaTexto != null) {
        document.getElementById("Alerta").textContent = AlertaTexto;
        window.localStorage.removeItem("alerta");
    }

    var FotoMedia = window.localStorage.getItem("CardMedia");

    if (FotoMedia != "") {
        
        document.getElementById("FotoMedia").src = FotoMedia;
        window.localStorage.removeItem("CardMedia");
        $(".card-media").fadeIn("fast");
    }


    var Pais = window.localStorage.getItem("ubicacion");

    if (Pais != null) {
        document.getElementById("Ubicacion").textContent = Pais;
        window.localStorage.removeItem("ubicacion");
    }

    
    getcomentarios();


    
   
}



$("#btn").click(function () {

    var comentario_encode = document.getElementById("name2b nombre").value;
    var Idalerta = window.localStorage.getItem("id-alerta");
    var IdUsuario = window.localStorage.getItem("idUsuario");
    
    

    if (comentario_encode != "") {
        $.post("http://alertux.com/webservice/recibir_comentario.php", { comentario: comentario_encode, id_alerta: Idalerta, id_usuario: IdUsuario }, function () {
            window.plugins.toast.showWithOptions(
             {
                 message: "Comentario Enviado exitosamente",
                 duration: "long",
                 position: "center",
                 addPixelsY: -40  // added a negative value to move it up a bit (default 0)
             });

            getcomentarios();
            
        });
    } else {
        window.plugins.toast.showWithOptions(
            {
                message: "Porfavor escriba un comentario",
                duration: "long",
                position: "center",
                addPixelsY: -40  // added a negative value to move it up a bit (default 0)
            });
    }

});



$("#btnBack").click(function () {
    window.location.href = "index.html";
    window.localStorage.removeItem("id-alerta");
});



function getcomentarios() {

    var el = document.getElementById("IDListView")

    if (el) {
        while (el.hasChildNodes()) {
            el.removeChild(el.childNodes[0]);
        }
    }

    $.ajax({
        type: "POST",
        url: "http://alertux.com/webservice/get_comentarios.php?id_alerta=" + window.localStorage.getItem("id-alerta"),
        contentType: "application/json; charset=utf-8",
        crossDomain: true,
        dataType: 'json',
        success: function (response) {
            //console.error(JSON.stringify(response));
            //iterate through the data using $.each()
            var output = '';
            output += '<li data-role="list-divider" role="heading" class="ui-li-divider ui-bar-inherit ui-first-child">Comentarios</li>'
            $.each(response.comentarios, function (index, value) {


                if (value.nombre_usuario_comentario != null) {
                    output += '<li class="ui-li-has-thumb"><a href="#" class="ui-btn"><img src="' + value.picture_url_comentario + '" class="ui-thumbnail ui-thumbnail-circular"><h2>' + value.nombre_usuario_comentario + '</h2><p>' + value.comentario_alerta + '</p></a></li>';
                } else {
                    output += '<div class="center">No hay Comentarios</div>';
                }

            });

            $('#IDListView').append(output);

        },
        error: function () {
            //console.error("error");

        }
    });

}