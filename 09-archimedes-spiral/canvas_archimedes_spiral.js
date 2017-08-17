//'use strict';

/* Global vars */
var
  gV = {},
  cz1;

var capturer = new CCapture({
  format: 'gif',
  workersPath: '/js/lib/',
  framerate: 20,
  verbose: false
});

$(document).ready(function() {
  // La magia aquí!




  // Inicializamos el canvas
  cz1 = new Canvaz('#cnvz');
  // cz1.fullScreen();

  gV.radius = 60;
  gV.x = 0;
  gV.y = 0;
  gV.centerX = 0;
  gV.centerY = 0;
  gV.radius = cz1.w / 2 - 10;
  gV.coils = 50;
  gV.rotation = 2 * Math.PI;

  gV.thetaMax = gV.coils * 2 * Math.PI;
  gV.awayStep = gV.radius / gV.thetaMax;
  gV.chord = 4;
  gV.new_time = [];

  // HSL
  var palette = [
    [322, 35, 59], // [3, 91, 68],  // Rojo [248,108,101],
    [351, 46, 67], // [121, 35, 55],// Verde [98,180,99],
    [54, 100, 47]  // [43, 79, 59]  // Amarillo [233,187,68]
  ];

  // Canvas
  cz1.clear = function() {
    this.fS = '#242424';
    this.ctx.beginPath();
    this.ctx.rect( this.w / -2, this.h / -2, this.w, this.h );
    this.ctx.fill();
  };

  cz1.beforeStart = function() {
    gV.x = cz1.center.x;
    gV.y = cz1.center.y;
    cz1.ctx.translate( cz1.w / 2, cz1.h / 2 );

    for ( theta = gV.chord / gV.awayStep; theta <= gV.thetaMax;) {
      var
        away = gV.awayStep * theta,
        around = theta + gV.rotation;

        x = gV.centerX + Math.cos(around) * away,
        y = gV.centerY + Math.sin(around) * away;

      theta += gV.chord / away;

      gV.new_time.push( { 'x': x, 'y': y } );
    }

    // console.log( gV.new_time )

  };

  cz1.beforeDraw = function() {
    this.clear();

    cz1.fS = '#ccc';
    // cz1.ctx.scale( 0.9, 0.9);

    // capturer.start( cz1.$can[0] );
  };

  cz1.draw = function() {

    for (theta = gV.chord / gV.awayStep; theta <= gV.thetaMax;) {
      var
        away = gV.awayStep * theta,
        around = theta + gV.rotation;

        x = gV.centerX + Math.cos(around) * away,
        y = gV.centerY + Math.sin(around) * away;

        theta += gV.chord / away;

      // gV.new_time.push( [ x, y ] );
      cz1.plot( x , y, 2);
    }

    /*
    for (var index = 0, len = gV.new_time.length; index < len; index++) {
      var pos = gV.new_time[index];

    }
    */

    // console.log( gV.chord );
    gV.chord += 0.01;

    // capturer.capture( cz1.$can[0] );


  };

  cz1.start();

});



