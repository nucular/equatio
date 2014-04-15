// And the Audiolet-based sound framework

E.sound = {};

E.sound.active = false;
E.sound.connected = false;

E.sound.load = function() {
    E.sound.audiolet = new Audiolet();
    E.sound.gain = new Gain(E.sound.audiolet);
    E.sound.node = new E.sound.EquatioNode(E.sound.audiolet);
    E.sound.node.connect(E.sound.gain);
    E.sound.gain.value.setValue(0.5);
}

E.sound.connect = function() {
    if (!E.sound.connected) {
        E.sound.gain.connect(E.sound.audiolet.device);
        E.sound.connected = true;
    }
}

E.sound.disconnect = function() {
    E.sound.gain.disconnect(E.sound.audiolet.device);
    E.sound.connected = false;
}

E.sound.set = function(bool) {
    if (!bool)
        E.sound.disconnect();
    else
        E.sound.connect();

    E.sound.active = bool;
    $("#sfxactive")[0].checked = bool;
}

E.sound.setCode = function(c) {
    $("#sfxerror").css("color", "#050");
    if (c == "") {
        $("#sfxerror").text("No code");
        E.sound.reset();
        return;
    }

    // Check for syntax errors beforehand
    try {
        eval(c);
    }
    catch (e) {
        // Skip reference errors to variables
        if (!E.vars.hasOwnProperty(e.message.split(" ")[0]))
        {
            E.sound.reset();
            $("#sfxerror").css("color", "#900").text(e.message);
            return;
        }
    }

    var code = "var s = E.vars.s, t = E.vars.t, td = E.vars.td, mx = E.vars.mx, my = E.vars.my, z = E.vars.z;\
        var mld = E.vars.mld, mrd = E.vars.mrd, mmd = E.vars.mmd;\
        var output = this.outputs[0];\
        E.output = output;\
        for (var i = 0; i < output.samples.length; i++) {\
            output.samples[i] = (" + c + ") % 256 / 256;\
            s += td;\
        }\
        E.vars.s = s;\
        if (output.samples.length >= 1)\
            E.vars.v = (E.vars.v + output.samples[0]) / 2;";

    E.sound.EquatioNode.prototype.generate = new Function("inputBuffers", "outputBuffers", code);

    try {
        E.sound.node.generate();
        $("#sfxerror").text("No error");
    }
    catch (e) {
        E.sound.reset();
        $("#sfxerror").css("color", "#900").text(e.message);
    }
}

E.sound.reset = function() {
    E.sound.EquatioNode.prototype.generate = function() {};
}

E.sound.setVolume = function(v) {
    $("#volume").simpleSlider("setValue", v);
    E.sound.gain.value.setValue(v);
}


// The AudioletNode that is routed to the equatio variables
E.sound.EquatioNode = function(audiolet, value) {
    AudioletNode.call(this, audiolet, 0, 2);
    this.linkNumberOfOutputChannels(0, 2);
}
extend(E.sound.EquatioNode, AudioletNode);

E.sound.EquatioNode.prototype.generate = function(inputBuffers, outputBuffers) {
    //
}

E.sound.EquatioNode.prototype.toString = function() {
    return "EquatioNode";
}