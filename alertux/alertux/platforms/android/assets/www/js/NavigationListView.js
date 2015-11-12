function PopulateListView() {
    var data = [{ "ID": 1, "Name": "Inicio", "IMAGE": "ionic.png" },
               // { "ID": 2, "Name": "Favoritos", "IMAGE": "FAVORITOS.png" },
                { "ID": 3, "Name": "Mapas", "IMAGE": "MAPAS.png" },
               // { "ID": 4, "Name": "Notas", "IMAGE": "NOTE.png" }
    ];
    var output = '';
    //iterate through the data using $.each()
    $.each(data, function (index, value) {
        //add each value to the output buffer
        output += '<li id="' + value.ID + '"><a id="' + value.ID + '" data-id="' + value.ID + '"><div class="thumbContainer"><img  src="img/' + value.IMAGE + '" /></div><h2 class="colorTexto">' + value.Name + '</h2></a></li>';
    });

    $('#ListViewNavigation').append(output).trigger('create').listview('refresh');

    

}

$('#ListViewNavigation').on('click', 'li', function () {
    var search_r = $('a', this).attr('id');
    switch(search_r) {
        case "1":
            window.location.href = "index.html";
            break;
        case "3":
            window.location.href = "Maps.html";
            break;
        default:
        
    }
});


$.ajax({
    type: "POST",
    url: "your_url",
    contentType: "application/json; charset=utf-8",
    dataType: "HTML",
    success: PopulateListView(),
    error: function (xhr, status, error) {
        var err = eval("(" + xhr.responseText + ")");
        window.alert(err.Message);
        

    }

});









