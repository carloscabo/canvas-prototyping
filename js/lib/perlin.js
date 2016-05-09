// Perlin Noise
// from: http://www.xna-connection.com/post/Algorithme-de-Perlin-Noise-en-C
var Perlin = function () {
    var mask = 0xff;
    var size = mask + 1;
    var values = new Uint8Array(size * 2);
    for (var i = 0; i < size; i++) {
        values[i] = values[size + i] = 0|(Math.random() * 0xff);
    }

    var lerp = function (t, a, b) {
        return a + t * (b - a);
    };
    var fade = function (t) {
        return t * t * t * (t * (t * 6 - 15) + 10);
    };

    var grad1d = function (hash, x) {
        return (hash & 1) === 0 ? x : -x;
    };
    var grad2d = function (hash, x, y) {
        var u = (hash & 2) === 0 ? x : -x;
        var v = (hash & 1) === 0 ? y : -y;
        return u + v;
    };
    var grad3d = function (hash, x, y, z) {
        var h = hash & 15;
        var u = h < 8 ? x : y;
        var v = h < 4 ? y : (h === 12 || h === 14 ? x : z);
        return ((h & 1) === 0 ? u : -u) + ((h & 1 === 0) ? v : -v);
    };

    var noise1d = function (x) {
        var intX = (0|x) & mask;
        var fracX = x - (0|x);
        var t = fade(fracX);
        var a = grad1d(values[intX], fracX);
        var b = grad1d(values[intX + 1], fracX - 1);
        return lerp(t, a, b);
    };
    var noise2d = function (x, y) {
        var intX = (0|x) & mask;
        var intY = (0|y) & mask;
        var fracX = x - (0|x);
        var fracY = y - (0|y);
        var r1 = values[intX] + intY;
        var r2 = values[intX + 1] + intY;
        var t1 = fade(fracX);
        var t2 = fade(fracY);

        var a1 = grad2d(values[r1], fracX, fracY);
        var b1 = grad2d(values[r2], fracX - 1, fracY);
        var a2 = grad2d(values[r1 + 1], fracX, fracY - 1);
        var b2 = grad2d(values[r2 + 1], fracX - 1, fracY - 1);
        return lerp(t2, lerp(t1, a1, b1), lerp(t1, a2, b2));
    };
    var noise3d = function (x, y, z) {
        var intX = (0|x) & mask;
        var intY = (0|y) & mask;
        var intZ = (0|z) & mask;
        var fracX = x - (0|x);
        var fracY = y - (0|y);
        var fracZ = z - (0|z);
        var r1 = values[intX] + intY;
        var r11 = values[r1] + intZ;
        var r12 = values[r1 + 1] + intZ;
        var r2 = values[intX + 1] + intY;
        var r21 = values[r2] + intZ;
        var r22 = values[r2 + 1] + intZ;
        var t1 = fade(fracX);
        var t2 = fade(fracY);
        var t3 = fade(fracZ);

        var a11 = grad3d(values[r11], fracX, fracY, fracZ);
        var b11 = grad3d(values[r21], fracX - 1, fracY, fracZ);
        var a12 = grad3d(values[r12], fracX, fracY - 1, fracZ);
        var b12 = grad3d(values[r22], fracX - 1, fracY - 1, fracZ);

        var a21 = grad3d(values[r11 + 1], fracX, fracY, fracZ - 1);
        var b21 = grad3d(values[r21 + 1], fracX - 1, fracY, fracZ - 1);
        var a22 = grad3d(values[r12 + 1], fracX, fracY - 1, fracZ - 1);
        var b22 = grad3d(values[r22 + 1], fracX - 1, fracY - 1, fracZ - 1);

        return lerp(t3,
                    lerp(t2, lerp(t1, a11, b11), lerp(t1, a12, b12)),
                    lerp(t2, lerp(t1, a21, b21), lerp(t1, a22, b22)));
    };

    return {
        get1d: noise1d,
        get2d: noise2d,
        get3d: noise3d,
    }
};
