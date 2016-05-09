'use strict';

/* Global vars */
var gV = {
  radius: 250,
  x: 0,
  y: 0,
  c: 1,
  amplifier: 0,
  t0: 0
},
cz1;

$(document).ready(function() {
  // La magia aquí!

  // Inicializamos el canvas
  cz1 = new Canvaz('#cnvz');
  // cz1.fullScreen();

  var n = new Perlin();

  // HSL
  var palette = [
    [322, 35, 59], // [3, 91, 68],  // Rojo [248,108,101],
    [351, 46, 67], // [121, 35, 55],// Verde [98,180,99],
    [54, 100, 47]  // [43, 79, 59]  // Amarillo [233,187,68]
  ];

  // Canvas
  cz1.clear = function() {
    this.fS = '#323232';
    this.ctx.beginPath();
    this.ctx.rect(0, 0, this.w, this.h);
    this.ctx.fill();
  };

  cz1.beforeStart = function() {
    gV.t0 = Date.now();
    gV.x = cz1.center.x;
    gV.y = cz1.center.y;
  };

  cz1.beforeDraw = function() {
    this.clear();
  };

  cz1.draw = function() {
    // cz1.sS = '#666';
    cz1.fS = '#fff';

    var
      t = Date.now(),
      inc = t * 0.00008;
    gV.c++;

    if (t - gV.t0 > 3000) {
      // console.log( 'punp' );
    }


    for (var i = 0; i < 100; i++) {

      var
        a = (2 * Math.PI) * ( i / 100 ) + inc,

        wave_amount = 2,
        wave_height = 40,
        radius_addon = wave_height * Math.sin( (a + inc / 2 ) * wave_amount ) * 1.1,
        // radius_addon = 0,

        wave_amount_2 = 3,
        wave_height_2 = 60,
        radius_addon_2 = wave_height_2 * Math.sin( (Math.PI / 2.2 + a + inc / 2 ) * wave_amount_2 ),
        // radius_addon_2 = 0,

        wave_amount_3 = 4,
        wave_height_3 = 50,
        radius_addon_3 = wave_height_3 * Math.sin( ( Math.PI / 3 + a + inc) * wave_amount_3 ),
        // radius_addon_3 = 0,

        x = gV.x + ( 100 - radius_addon + radius_addon_2 + radius_addon_3 + (n.get1d( gV.c / 30 ) * 25) + (gV.amplifier * 100) ) * Math.cos(a + gV.c / 330), // (n.get1d( gV.c / 50 ) * 25) //
        y = gV.y + ( 100 + radius_addon + radius_addon_2 + radius_addon_3 + (n.get1d( gV.c / 30 ) * 15) + (gV.amplifier * 100) ) * Math.sin(a + gV.c / 330); // (n.get1d( gV.c / 50 ) * 15) //

      cz1.plot(x, y, 2);
    }
  };

  cz1.start();

});
