// And the Audiolet-based sound framework

E.sound = {};

E.sound.active = true;

E.sound.toggle = function(bool) {
    if (!bool)
        bool = !E.sound.active;

    $("#sfxactive")[0].checked = bool;
}