var canvas;
var mx, my, md, mdx, mdy;
var t, td, kx, ky;

var examples = {
    "simple grid": "(mx==x || my==y)*0xFF << 16 | (mx==x || my==y)*0xFF << 8 | (mx==x || my==y)*0xFF",
    "munching squares": "(x^y)*(t/100)",
    "munching triangles": "(x&y)*(t/100)",
    "something 3Dish": "(my-y)^(my-y)-(255-y)*x/255 + mx"
};

function calc(x, y) {
    return 0;
}

function draw() {
    try {
        fp.iterDraw(calc);
    }
    catch (e) {
        calc = function() {return 0xFF;}
    }
    fp.drawEnd();
    t += td;
    if (window.requestAnimationFrame != undefined)
        requestAnimationFrame(draw);
}

function refresh() {
    var code = $("#code").val();

    if (code == "")
        code = "0";

    calc = new Function("x", "y", "return " + code + ";");
}

function restart() {
    td = parseInt($("#speed").val());
    t = 0;
}

$(function() {
    for (var i in examples) {
        var n = $("<option>" + i + "</option>")
        n.appendTo($("#examples"))
    }

    $("#examples").bind("change", function(e) {
        $("#code").val(examples[$("#examples").val()]);
        refresh();
        restart();
    });

    $("#code").bind("change", function(e) {
        $("#examples").val(null);
    });
    $("#code").bind("blur", function(e) {
        refresh();
    })

    $("#refresh").bind("click", function(e) {
        refresh();
    })

    $("#restart").bind("click", function(e) {
        restart();
    })

    $("#speed").bind("change", function(e) {
        td = parseInt($("#speed").val());
    });
        
    $("#help").bind("mouseenter", function(e) {
        $(".helptext").fadeIn();
    });
    $("#help").bind("mouseleave", function(e) {
        $(".helptext").fadeOut();
    });


    canvas = $("#canvas");
    ctx = canvas[0].getContext("2d");
    restart();

    canvas.bind("mousemove", function(e) {
        dx = e.offsetX - mx;
        dy = e.offsetY - my;

        mx = e.offsetX;
        my = e.offsetY;

        if (!md) {
            mdx = mx;
            mdy = my;
        }
    });
    canvas.bind("mousedown", function(e) {
        md = 1;
        mdx = e.offsetX;
        mdy = e.offsetY;
    });
    canvas.bind("mouseup", function(e) {
        md = 0
    });
    canvas.bind("mouseleave", function(e) {
        mdx = -1;
        mdy = -1;
        md = 0;
    });
    canvas.bind("keypress", function(e) {
        console.log(e);
    });

    fp.drawStart(ctx, 256, 256);

    if (window.requestAnimationFrame != undefined)
        requestAnimationFrame(draw);
    else
        setInterval(draw, 60/1000);
});
