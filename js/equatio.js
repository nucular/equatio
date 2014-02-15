// This is the main object!
var E = {};

// And this the main initialization function!
$(function() {
    E.polyfill();
    E.sharing.load();
    requestAnimationFrame(E.update);

    // And connect all the event handlers
    $("#sharebutton").bind("click", E.sharing.share);
});

E.update = function() {
    //
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

E.setCode = function(c) {
    //
}