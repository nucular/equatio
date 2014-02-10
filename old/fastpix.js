/*
Fast per-pixel drawing and some tools for it, by nucular
Public Domain
*/

var fp = {};

fp.drawStart = function(context, width, height) {
    fp.ctx = context;
    fp.cw = width;
    fp.ch = height;

    fp.imgdata = context.getImageData(0, 0, fp.cw, fp.ch);

    fp.buf = new ArrayBuffer(fp.imgdata.data.length);
    fp.buf8 = new Uint8ClampedArray(fp.buf);
    fp.data = new Uint32Array(fp.buf);
}

fp.put = function(x, y, r, g, b, a) {
    fp.data[y * fp.cw + x] = ((a || 255) << 24) | (b << 16) | (g << 8) | r;
}

fp.iterDraw = function(func) {
    for (var y = 0; y < fp.ch; y++) {
        for (var x = 0; x < fp.cw; x++) {
            fp.data[y * fp.cw + x] = (255 << 24) | func(x, y);
        }
    }
}

fp.drawEnd = function() {
    fp.imgdata.data.set(fp.buf8);
    fp.ctx.putImageData(fp.imgdata, 0, 0);
}