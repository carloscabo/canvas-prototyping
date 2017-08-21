// http://www.gamasutra.com/blogs/AAdonaac/20150903/252889/Procedural_Dungeon_Generation_Algorithm.php

'use strict';

/* Global vars */
var gV = {
  radius: 768 / 2,

  room_nuber: 50,
  max_room_w: 16,
  min_room_w: 6,
  max_room_h: 16,
  min_room_h: 6,

  grid: 8, // Pixels

  x: 0,
  y: 0
},
rooms = [],
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

  // ----------------------------------
  // ----------------------------------
  // ----------------------------------
  cz1.beforeStart = function() {

    // Set fill
    cz1.fS = '#f00';

    // Move 0, 0 to center
    cz1.ctx.translate(cz1.w / 2, cz1.h / 2);

    // Create rooms
    for (var i = 0; i < gV.room_nuber; i++) {
      var
        p1 = getRandomPointInCircle (0, 0, gV.radius / 2);
      rooms.push( {
        x: p1[0],
        y: p1[1],
        w: gV.min_room_w + Math.floor( Math.random() * ( gV.max_room_w - gV.min_room_w ) ),
        h: gV.min_room_h + Math.floor( Math.random() * ( gV.max_room_h - gV.min_room_h ) )
      } );
    }

    console.log( rooms );
  };

  // ----------------------------------
  // ----------------------------------
  // ----------------------------------
  cz1.beforeDraw = function() {

  };

  cz1.drawOnce = function() {

    for (var i = 0, len = rooms.length; i < len; i++) {
      var
        room = rooms[i];
      drawRoom( room );

    }


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


function drawRoom( room ) {
  cz1.lW = '1px';
  cz1.fS = 'rgba(45, 93, 180, 0.75)';
  cz1.sS = '#fff';

  cz1.rect(room.x, room.y, room.w * gV.grid, room.h * gV.grid );
  cz1.ctx.fill();
}

