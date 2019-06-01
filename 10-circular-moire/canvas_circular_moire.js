'use strict';

/* Global vars */
var gV = {
  radius: 4,
  space: 64,
  circles_per_half_line: -1,
  num_vertical_lines: 0,
  circle_lines_dx: 0,
  circle_lines_dy: 0,
  cx: 0,
  cy: 0,
  diagonal: 0,
  current_rotation: 0,
  t0: 0
},
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
    this.ctx.rect(-gV.diagonal, -gV.diagonal, gV.diagonal*2, gV.diagonal*2);
    this.ctx.fill();
    this.fS = '#ccc';
  };

  cz1.beforeStart = function() {

    gV.t0 = Date.now();
    cz1.ctx.translate(cz1.center.x, cz1.center.x);

    gV.cx = cz1.center.x;
    gV.cy = cz1.center.y;
    gV.diagonal = Math.sqrt( cz1.w * cz1.w + cz1.h * cz1.w );

    const a = gV.radius + ( gV.space / 2 );
    gV.circle_lines_dx = gV.radius + ( gV.space / 2 );
    gV.circle_lines_dy = Math.sqrt( 3 ) * ( gV.radius + ( gV.space / 2 ) );

    gV.circles_per_half_line = Math.ceil( ( gV.diagonal / ( gV.radius * 2 + gV.space ) ) + 1 );
    gV.num_vertical_lines = Math.ceil( ( gV.diagonal / a ) + 1 );

    // this.ctx.globalCompositeOperation = 'source-atop';
    //this.ctx.globalCompositeOperation = 'exclusion';
    // cz1.fS = 'rgba(255, 255, 255, 0.50)';
  };

  cz1.beforeDraw = function() {
    this.clear();
  };

  cz1.draw = function() {
    this.ctx.save();


    const tn = Date.now();
    const diff = tn - gV.t0;

    // gV.current_rotation += diff / 1000;
    const a_inc = diff * 0.00005;
    gV.current_rotation += a_inc;
    // console.log(gV.current_rotation);

    this.ctx.rotate( gV.current_rotation );
    drawGrid();

    this.ctx.rotate( gV.current_rotation );
    drawGrid();

    cz1.fS = '#0e0';
    cz1.plot( 0, 0, 8);

    gV.t0 = tn;

    this.ctx.restore();
  };

  cz1.start();

});

function drawGrid ( ) {

  for (let index = 0; index < gV.num_vertical_lines; index++) {
    const dy = ( index * gV.circle_lines_dy );
    drawLine ( gV.circle_lines_dx * ( index % 2 ) , dy );
  }

  for (let index = 1; index < gV.num_vertical_lines; index++) {
    const dy = - ( index * gV.circle_lines_dy );
    drawLine ( gV.circle_lines_dx * ( index % 2 ) , dy );
  }
}


function drawLine ( dx, dy ) {

  for (let index = 0; index < gV.circles_per_half_line; index++) {
    const tx = dx + ( index * ( gV.radius * 2 + gV.space ) );
    cz1.plot( tx , dy, gV.radius );
  }

  for (let index = 1; index < gV.circles_per_half_line; index++) {
    const tx = dx - ( index * ( gV.radius * 2 + gV.space ) );
    cz1.plot( tx , dy, gV.radius );
  }

}

