// http://www.gamasutra.com/blogs/AAdonaac/20150903/252889/Procedural_Dungeon_Generation_Algorithm.php

'use strict';

/* Global vars */
var gV = {
  radius: 768 / 2,
  grid: 8, // Pixels
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
    this.ctx.rect(- radius, - radius, this.w, this.h);
    this.ctx.fill();
  };

  cz1.beforeStart = function() {
    // Move 0, 0 to center
    cz1.fS = '#f00';
    cz1.ctx.translate(cz1.w / 2, cz1.h / 2);
  };

  cz1.beforeDraw = function() {

  };

  cz1.draw = function() {

    var
      p1 = getRandomPointInCircle ( -100, -100, 768 / 2 );
    cz1.plot( p1[0], p1[1], 4);
  };

  cz1.start();

});



function getRandomPointInCircle( x, y, radius ) {
  var
    t = 2 * Math.PI * Math.random(),
    u = Math.random() + Math.random(),
    r = null;
  if ( u > 1) {
    r = 2 - u;
  } else {
    r = u;
  }
  return [ x + ( radius * r * Math.cos( t ) ), y + ( radius * r * Math.sin(t) ) ];
}


