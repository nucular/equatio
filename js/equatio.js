// This is the main object!
var E = {};

// The predefined variables
E.vars = {
    t: 0,
    td: 1,
    x: 0, y: 0,
    mx: 0, my: 0,
    mld: 0, mrd: 0
}

E.paused = false;

// Main initialization function
$(function() {
    E.polyfill();
    E.sharing.load();

    // Connect all the event handlers
    $("#sharebutton").bind("click", E.sharing.share);
    $("#playbutton").bind("click", function() {E.toggle();});
    $("#backbutton").bind("click", E.back);

    // Start
    requestAnimationFrame(E.update);
});

// Main update function
E.update = function() {
    E.vars.t += E.vars.td;

    if (Math.round(E.vars.t) % 60 == 0) {
        $("#time").text((E.vars.t / 60) + " sec");
    }

    if (!E.paused)
        requestAnimationFrame(E.update);
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

E.toggle = function(bool) {
    if (!bool)
        bool = !E.paused;

    if (bool != E.paused && E.paused)
        requestAnimationFrame(E.update);

    E.paused = bool;
    $("#playbutton")[0].src = bool ? "img/play.png" : "img/pause.png";
}

E.back = function() {
    E.vars.t = 0;
    $("#time").text("0 sec");
}