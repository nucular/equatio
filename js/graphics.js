// The main graphic framework for equatio

E.graphics = {}

E.graphics.active = true;

E.graphics.toggle = function(bool) {
    if (!bool)
        bool = !E.graphics.active;

    $("#gfxactive")[0].checked = bool;
}

E.graphics.draw = function() {
    //
}