$(window).load(function () {
    $(".page").fadeIn("slow");
});

function CheckCorreo() {
    var testnumber = document.getElementsByName("name2")[0].value;

    if (testnumber.length > 0) {
        $("#btn").fadeIn("slow");

    } else {
        $("#btn").fadeOut("slow");
    }
    

    return false;
}


$("#btn").click(function () {
    var Correo = document.getElementsByName("name2")[0].value;
    var isAEmail = Correo.match(/@/g)
    if (Correo.length > 0) {
        if (isAEmail != null) {
            window.localStorage.setItem("key", Correo);
            window.location.href = "index.html";
        } else {
            window.plugins.toast.showWithOptions(
           {
               message: "Porfavor escriba el Correo Electronico con sus respectivo Dominio '@' ",
               duration: "long",
               position: "center",
               addPixelsY: -40  // added a negative value to move it up a bit (default 0)
           });
        }
    } else {
        window.plugins.toast.showWithOptions(
            {
                message: "Porfavor escriba el Correo Electronico",
                duration: "long",
                position: "center",
                addPixelsY: -40  // added a negative value to move it up a bit (default 0)
            });
        $("#btn").fadeOut("slow");
    }
    
});

