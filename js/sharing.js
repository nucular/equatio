E.sharing = {};

// Set a value
E.sharing.set = function(name, value) {
    switch (name) {
        case "gfx":
            E.graphics.toggle(value); break;
        case "sfx":
            E.sound.toggle(value); break;
        case "gfxcode":
            E.graphics.setCode(value); break;
        case "sfxcode":
            E.sound.setCode(value); break;
    }
}

// Load all the values from the URL
E.sharing.load = function() {
    var search = document.location.search;
    if (search == "")
        return

    search = search.substring(1);
    var parts = search.split("&");

    for (var i = 0; i < parts.length; ++i) {
        var name = parts[i].split("=")[0];
        var value = parts[i].split("=")[1];

        if (value == "false")
            value = false;
        else if (value == "true")
            value = true
        else {
            try {
                value = parseInt(value);
            }
            catch (e) {
                value = E.base64.decode(value);
            }
        }

        console.log(name, value);
        E.sharing.set(name, value);
    }
}

// Shorten the sharing-URL using v.gd or is.gd
E.sharing.shorten = function(url, callback, error, preview) {
    var shortener = preview ? "http://v.gd/create.php" : "http://is.gd/create.php";
    $.getJSON(shortener, "format=json&url=" + encodeURIComponent(url), callback).error(error);
}

// Build the sharing link
E.sharing.build = function() {
    var url = document.location.origin + document.location.pathname + "?";

    url += "gfx=" + $("#gfxactive")[0].checked;
    url += "&sfx=" + $("#sfxactive")[0].checked;

    var gfxcode = $("#gfxcode").val();
    if (gfxcode != "")
        url += "&gfxcode=" + encodeURIComponent(E.base64.encode(gfxcode));

    var sfxcode = $("#sfxcode").val();
    if (sfxcode != "")
        url += "&sfxcode=" + encodeURIComponent(E.base64.encode(sfxcode));

    return url;
}

// Show a popup with the shortened link
// TODO: Add support for preview with v.gd?
E.sharing.share = function() {
    var but = $("#sharebutton");
    but.css("color", "#050").text("Please wait");

    function error() {
        but.css("color", "#900").text("Error");
        setTimeout(function() {
            but.css("color", "inherit").text("Share!");
        }, 2000);
    }

    var url = E.sharing.shorten(E.sharing.build(),
    function(data, textStatus, jqXHR) {
        but.css("color", "inherit").text("Share!");
        if (data.shorturl)
            prompt("Your link was created. Now you can copypaste it and share your creation with others:", data.shorturl);
        else
            error();
    }, error, false);
}