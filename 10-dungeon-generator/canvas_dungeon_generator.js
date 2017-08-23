// http://www.gamasutra.com/blogs/AAdonaac/20150903/252889/Procedural_Dungeon_Generation_Algorithm.php

// 'use strict';

for(var n in Object.getOwnPropertyNames(Math)){
  if (typeof Math[n] === 'function') Math[n] = wrap(Math[n]);
}
function wrap(fn){
  return function(){
      var res = fn.apply(this, arguments);
      if (isNaN(res)) debugger; //throw new Error('NaN found!')/*or
      return res;
  };
}

/* Global vars */
var gV = {
  radius: 215/ 2,

  room_number: 20,
  max_room_w: 16,
  min_room_w: 2,
  max_room_h: 16,
  min_room_h: 2,

  grid: 10, // Pixels

  x: 0,
  y: 0,

  average_area: 0,

  // Areas over the average by this factor
  // Define the main rooms of the dungeos
  average_area_limit: 1.45,

  overlapping: true
},
rooms = [],
main_rooms = [],
cz1;

$(document).ready(function() {
  // La magia aquí!

  // Inicializamos el canvas
  cz1 = new Canvaz('#cnvz');
  // cz1.fullScreen();

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
    this.ctx.rect(- cz1.w / 2, - cz1.h / 2, cz1.w, cz1.h);
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
    for (var i = 0; i < gV.room_number; i++) {
      var
        // p1 = getRandomPointInEllipse (0, 0, gV.radius / 2, gV.radius / 2);
        p1 = getRandomPointInEllipse(0, 0, 128, 128),
        room = {
          'x': p1[0],
          'y': p1[1],
          'w': gV.min_room_w + Math.round(Math.random() * (gV.max_room_w - gV.min_room_w)),
          'h': gV.min_room_h + Math.round(Math.random() * (gV.max_room_h - gV.min_room_h))
        };

      room.area = room.w * room.h;
      gV.average_area += room.area;
      rooms.push( room );
    }

    // Not iot realli the average
    gV.average_area = gV.average_area / gV.room_number;

    for (var j = 0, len = rooms.length; j < len; j++) {
      var
        room = rooms[j];
      if (room.area > gV.average_area * gV.average_area_limit) {
        main_rooms.push( room );
      }
    }

    console.log( rooms );
  };

  // ----------------------------------
  // ----------------------------------
  // ----------------------------------
  cz1.beforeDraw = function() {
    // cz1.clear();
  };

  cz1.draw = function() {

    cz1.clear();

    drawGrid();

    spaceRooms( rooms );

    // Draw all rooms
    for (var i = 0, len = rooms.length; i < len; i++) {
      var
        room = rooms[i];
      drawRoom( room );
    }


  };

  cz1.start();

});


function roomOverlapping ( r1, r2 ) {
  var
    r2_l = r2.x,
    r2_r = r2.x + r2.w * gV.grid,
    r2_t = r2.y,
    r2_b = r2.y + r2.h * gV.grid,
    r1_l = r1.x,
    r1_r = r1.x + r1.w * gV.grid,
    r1_t = r1.y,
    r1_b = r1.y + r1.h * gV.grid;

  return !(r2_l > r1_r ||
    r2_r < r1_l ||
    r2_t > r1_b ||
    r2_b < r1_t);
}

function getRandomPointInEllipse(x, y, ellipse_w, ellipse_h ) {
  var
    t = 2 * Math.PI * Math.random(),
    u = Math.random() + Math.random(),
    r = null;
  if ( u > 1) {
    r = 2 - u;
  } else {
    r = u;
  }

  var
    _x = x + ( ellipse_w * r * Math.cos(t) ),
    _y = y + ( ellipse_h * r * Math.sin(t) );

  _x = snapToGrid( _x, gV.grid );
  _y = snapToGrid( _y, gV.grid );

  return [ _x, _y ];
}

function drawRoom( room ) {
  cz1.lW = '1px';
  cz1.fS = 'rgba(45, 93, 180, 0.75)';
  cz1.sS = '#fff';

  if  ( room.area > gV.average_area * gV.average_area_limit ) {
    cz1.fS = 'rgba(180, 93, 45, 0.75)';
  }
  // cz1.rect(room.x, room.y, room.w * gV.grid, room.h * gV.grid );
  cz1.ctx.beginPath();
  cz1.ctx.rect( room.x, room.y, room.w * gV.grid, room.h * gV.grid );
  cz1.ctx.closePath();
  cz1.ctx.fill();
}

function snapToGrid ( val, gridSize ) {
  return Math.round(val / gridSize) * gridSize;
};

// function snapAllToGrid( rooms, gridSize) {
//   for (var i = 0, len = rooms.length; i < len; i++) {
//     rooms[i].x = snapToGrid(rooms[i].x, gridSize);
//     rooms[i].y = snapToGrid(rooms[i].y, gridSize);
//   }

//   if ( anyRoomOverlaps(rooms) ) {
//     console.log('Overlapps!');
//   } else {
//     console.log( 'No overlapping!' );
//   }

// };

function drawGrid() {
  var
    r = 100;
  cz1.fS = '#ccc';
  for (var i = -r; i < r; i++) {
    for (var j = -r; j < r; j++) {
      cz1.ctx.beginPath();
      cz1.ctx.rect(i * gV.grid, j * gV.grid, 1, 1);
      cz1.ctx.closePath();
      cz1.ctx.fill();
    }
  }
};

function spaceRooms ( rooms ) {
  // Move to avoid overlap
  var
    rooms_overlapping = false;

  for (var i = 0, len = rooms.length; i < len; i++) {
    var
      r1 = rooms[i];
    r1.x = Math.round(r1.x);
    r1.y = Math.round(r1.y);
    for (var j = 0; j < len; j++) {
      if (i !== j) {
        var
          r2 = rooms[j];

        // If rooms overlap
        if ( roomOverlapping(r1, r2) ) {

          rooms_overlapping = true;
          // console.log( 'overlaps' );
          var
            d = utilz.dist(r1.x, r1.y, r2.x, r2.y),
            dx = r2.x - r1.x,
            dy = r2.y - r1.y,
            normal = {},
            vector = {},
            midpoint = {};

          normal.x = dx / d;
          normal.y = dy / d;
          // midpoint.x = (r1.x + r2.x) / 2;
          // midpoint.y = (r1.y + r2.y) / 2;

          r1.x -= snapToGrid( normal.x * gV.grid, gV.grid );
          r1.y -= snapToGrid( normal.y * gV.grid, gV.grid );
          r2.x -= snapToGrid( normal.x * -gV.grid, gV.grid );
          r2.y -= snapToGrid( normal.y * -gV.grid, gV.grid );
        }
      }
    }
  }
}


function anyRoomOverlaps ( rooms ) {
  // Move to avoid overlap
  var
    rooms_overlapping = false;

  for (var i = 0, len = rooms.length; i < len; i++) {
    var
      r1 = rooms[i];
    for (var j = 0; j < len; j++) {
      if (i !== j) {
        var
          r2 = rooms[j];
        // If rooms overlap
        if (roomOverlapping(r1, r2)) {
          rooms_overlapping = true;
        }
      }
    }
  }
  return rooms_overlapping;
}

