'use strict';

/* Global vars */
var gV = {
  radius: 250,
  points: 200,
  x: 0,
  y: 0
},
cz1;

$(document).ready(function() {
  // La magia aquí!

  // Inicializamos el canvas
  cz1 = new Canvaz('#cnvz');
  cz1.fullScreen();

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
    this.ctx.rect(0, 0, this.w, this.h);
    this.ctx.fill();
  };

  cz1.beforeStart = function() {
    gV.x = cz1.center.x;
    gV.y = cz1.center.y;
  };

  cz1.beforeDraw = function() {
    this.clear();
    gV.x = gV.x - 4;
    // If plot leaves the screen in the left put it in the right
    if (gV.x < (gV.radius * -1)) {
      gV.x = cz1.w + gV.radius;
    }
  };

  cz1.drawOnce = function() {
    cz1.sS = '#666';
    cz1.sS = 'rgba(255,255,255,0.1)';
    cz1.fS = '#f00';
    cz1.gCO = 'add';

    var
      points = [],
      num_points = 300;
    for (var i = 0; i < num_points; i++) {
      var
        x = gV.x + gV.radius * Math.cos( Math.PI * 2 / num_points * i),
        y = gV.y + gV.radius * Math.sin( Math.PI * 2 / num_points * i);
      points.push( [x,y] );
      // cz1.plot(x, y, 2);
    }
    var random_point = points[Math.floor(Math.random()*points.length)];
    for (var i = 0, len = points.length; i < len; i++) {
      cz1.line( random_point[0], random_point[1],points[i][0], points[i][1] );
    }
  };

  cz1.start();

});
