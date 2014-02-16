// The main graphic framework for equatio

E.graphics = {}

E.graphics.active = true;

E.graphics.load = function() {
    E.graphics.context = $("#screen")[0].getContext("2d");
    E.graphics.imageData = E.graphics.context.getImageData(0, 0, 256, 256);
    E.graphics.buffer = new ArrayBuffer(E.graphics.imageData.data.length);
    E.graphics.buffer8 = new Uint8ClampedArray(E.graphics.buffer);
    E.graphics.data = new Uint32Array(E.graphics.buffer);
}

E.graphics.toggle = function(bool) {
    E.graphics.active = bool;
    if (!bool)
        E.graphics.context.clearRect(0, 0, 256, 256);
    else
        E.graphics.draw();
    $("#gfxactive")[0].checked = bool;
}

E.graphics.draw = function() {
    //
}

E.graphics.setCode = function(c) {
    $("#gfxerror").css("color", "#050");
    if (c == "") {
        $("#gfxerror").text("No code");
        E.graphics.reset();
        return;
    }

    // Check for syntax errors beforehand
    try {
        eval(c);
    }
    catch (e) {
        // Skip reference errors to variables
        var a = e.message.split(" ")[0];
        if (!E.vars.hasOwnProperty(a) && a != "rd")
        {
            E.graphics.reset();
            $("#gfxerror").css("color", "#900").text(e.message);
            return;
        }
    }

    var code = "var s = E.vars.s, t = E.vars.t, td = E.vars.td, mx = E.vars.mx, my = E.vars.my;\
        var rd = Math.random()*256, mld = E.vars.mld, mrd = E.vars.mrd, mmd = E.vars.mmd;\
        for (var y = 0; y < 256; y++) {\
            for (var x = 0; x < 256; x++) {\
                E.graphics.data[y * 256 + x] = (255 << 24) | (" + c + ");\
            }\
        }\
        E.graphics.imageData.data.set(E.graphics.buffer8);\
        E.graphics.context.putImageData(E.graphics.imageData, 0, 0);";

    E.graphics.draw = new Function(code);

    try {
        E.graphics.draw();
        $("#gfxerror").text("No error");

        if (!E.graphics.active)
            E.graphics.context.clearRect(0, 0, 256, 256);
    }
    catch (e) {
        E.graphics.reset();
        $("#gfxerror").css("color", "#900").text(e.message);
    }
}

E.graphics.reset = function() {
    E.graphics.draw = function() {};
    E.graphics.context.clearRect(0, 0, 256, 256);
}