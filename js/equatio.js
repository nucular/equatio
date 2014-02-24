// This is the main object!
var E = {};

// The predefined variables
E.vars = {
    t: 0, s: 0,
    td: 1,
    x: 0, y: 0,
    mx: 0, my: 0,
    mld: 0, mmd: 0, mrd: 0,
    v: 1
}

E.paused = false;
E.lastSec = 0;

// Main initialization function
$(function() {
    E.polyfill();
    E.examples.load();

    E.graphics.load();
    E.sound.load();

    // Bug
    setTimeout(function() {
        $("#speed").simpleSlider("setValue", 1);
        $("#volume").simpleSlider("setValue", 0.5);
        E.sharing.load();
    }, 500)
    
    // Connect all the event handlers
    $("#sharebutton").bind("click", E.sharing.share);
    $("#urlbutton").bind("click", E.sharing.showURL);
    $("#resetbutton").bind("click", E.reset)

    $("#playbutton").bind("click", function(e) {E.pause();});
    $("#backbutton").bind("click", E.back);

    // Bind events to the variables
    $("#screen").bind("mousemove", function(e) {
        E.vars.mx = e.offsetX;
        E.vars.my = e.offsetY;
    });
    $("#screen").bind("mousedown", function(e) {
        if (e.button == 0)
            E.vars.mld = 1;
        else if (e.button == 1)
            E.vars.mmd = 1;
        else if (e.button == 2)
            E.vars.mrd = 1;
    });
    $("#screen").bind("mouseup", function(e) {
        if (e.button == 0)
            E.vars.mld = 0;
        else if (e.button == 1)
            E.vars.mmd = 0;
        else if (e.button == 2)
            E.vars.mrd = 0;
    })
    $("#screen").bind("mouseleave", function(e) {
        E.mld = E.mmd = E.mrd = 0;
    })

    // Disable context menu on the screen
    $("#screen").bind("contextmenu", function(e) {return false;});

    $("#examples").bind("change", function(e) {E.examples.select($("#examples").val())});
    $("#gfxactive").bind("change", function(e) {
        E.graphics.toggle($("#gfxactive")[0].checked)
    });
    $("#sfxactive").bind("change", function(e) {
        if (!E.paused)
            E.sound.set($("#sfxactive")[0].checked)
        else
            E.sound.active = $("#sfxactive")[0].checked;
    });
    $("#volume").bind("change", function(e) {E.sound.gain.value.setValue(e.value);});
    $("#speed").bind("change", function(e) {E.setSpeed(e.value);});

    $("#gfxcode").bind("blur", function(e) {E.graphics.setCode(e.target.value)});
    $("#sfxcode").bind("blur", function(e) {E.sound.setCode(e.target.value)});

    // Start
    requestAnimationFrame(E.update);
});

// Main update function
E.update = function() {
    E.vars.t += E.vars.td;

    if (E.graphics.active)
        E.graphics.draw();

    if (E.vars.t - E.lastSec >= 60 * (E.vars.td < 0) ? -1 : 1) {
        $("#time").text(Math.floor(E.vars.t / 60) + " sec");
        E.lastSec = E.vars.t;
    }

    if (!E.paused)
        requestAnimationFrame(E.update);
}

E.reset = function() {
    $("#gfxcode").text("");
    $("#sfxcode").text("");
    E.graphics.reset();
    E.sound.reset();
}

E.setSpeed = function(v) {
    $("#speedview").text(Math.round(v*10)/10 + "x");
    $("#speed").simpleSlider("setValue", v);
    E.vars.td = v;
}

// A polyfill for requestAnimationFrame written by Paul Irish
E.polyfill = function() {
    var lastTime = 0;
    var vendors = ["ms", "moz", "webkit", "o"];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + "RequestAnimationFrame"];
        window.cancelAnimationFrame = window[vendors[x] + "CancelAnimationFrame"]
            || window[vendors[x] + "CancelRequestAnimationFrame"];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
                timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        }
}

E.pause = function(bool) {
    if (bool == null)
        bool = !E.paused;
    else if (bool == E.paused)
        return;

    if (!bool)
    {
        requestAnimationFrame(E.update);
        if (E.sound.active)
            E.sound.connect();
    }
    else {
        E.sound.disconnect();
    }

    E.paused = bool;
    $("#playbutton")[0].src = bool ? "img/play.png" : "img/pause.png";
}

E.back = function() {
    E.vars.t = 0;
    E.vars.s = 0;
    if (E.graphics.active)
        E.graphics.draw();
    $("#time").text("0 sec");
}

E.reset = function() {
    $("#gfxcode")[0].value = "";
    $("#sfxcode")[0].value = "";
    E.graphics.reset();
    E.sound.reset();
    E.pause(true);
}