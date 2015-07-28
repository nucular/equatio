E.sharing = {};

// Set a value
E.sharing.set = function(name, value) {
    switch (name) {
        case "gfx":
            E.graphics.toggle(value); break;
        case "sfx":
            E.sound.set(value); break;
        case "gfxcode":
            E.graphics.setCode(value);
            $("#gfxcode")[0].value = value;
            break;
        case "sfxcode":
            E.sound.setCode(value);
            $("#sfxcode")[0].value = value;
            break;
        case "paused":
            E.pause(value); break;
        case "volume":
            E.sound.setVolume(value); break;
        case "td":
            E.setSpeed(value); break;
        case "t":
            E.vars.t = value;
            $("#time").text(Math.floor(value / 60) + " sec");
            break;
        case "s":
            E.vars.s = value; break;
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
            nvalue = parseFloat(value);
            if (isNaN(nvalue))
                value = decodeURIComponent(value);
            else
                value = nvalue;
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

    url += "gfx=" + E.graphics.active;
    url += "&sfx=" + E.sound.active;

    var gfxcode = $("#gfxcode").val();
    if (gfxcode != "" && E.graphics.active)
        url += "&gfxcode=" + encodeURIComponent(gfxcode);

    var sfxcode = $("#sfxcode").val();
    if (sfxcode != "" && E.sound.active)
        url += "&sfxcode=" + encodeURIComponent(sfxcode);

    url += "&paused=" + E.paused;
    url += "&volume=" + Math.round(E.sound.gain.value.getValue()*100)/100;
    url += "&td=" + Math.round(E.vars.td*100)/100;
    url += "&t=" + E.vars.t;
    url += "&s=" + E.vars.s;

    return url;
}

// Show a popup with the shortened link
// TODO: Add support for preview with v.gd?
E.sharing.share = function() {
    var but = $("#sharebutton");
    but.css("color", "#295").text("Please wait");

    function error() {
        but.css("color", "#e22").text("Error");
        setTimeout(function() {
            but.css("color", "#ccc").text("Share!");
        }, 2000);
    }

    var url = E.sharing.shorten(E.sharing.build(),
    function(data, textStatus, jqXHR) {
        but.css("color", "#ccc").text("Share!");
        if (data.shorturl)
            prompt("Your link was shortened. You can copypaste it and share your \
creation with others.\n\nTip: Append a '-' at the end of this URL to show a \
preview before redirecting to equatio.", data.shorturl);
        else
            error();
    }, error, false);
}

// Show a popup with the unshortened link
E.sharing.showURL = function() {
    var url = E.sharing.build();
    prompt("You can copypaste this link to store your creation or share it with \
others.\n\nTip: Click on the 'Share!' button instead to generate a shortened version of this link.", url);
}
