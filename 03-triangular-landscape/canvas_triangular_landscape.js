'use strict';

var
  cz1,
  horizon = {},
  timer_initial = 0,
  timer_last    = 0,
  floating_triangles = [],
  palette;


$(document).ready(function() {
  // La magia aquí!

  // Inicializamos el canvas
  cz1 = new Canvaz('#cnvz');
  cz1.fullScreen();

  // HSL
  palette = [
    [199, 78, 48], // [3, 91, 68],  // Rojo [248,108,101],
    [49,  97, 56], // [121, 35, 55],// Verde [98,180,99],
    [335, 85, 51]  // [43, 79, 59]  // Amarillo [233,187,68]
  ];

  /**
   * Dibuja las líneas horizontales que determinan los horizontes
   * @return {[type]} [description]
   */
  function drawHorizonLines() {
    for (var i in horizon.lines) {
      cz1.sS = '#666';
      cz1.line(-100, horizon.lines[i].y, cz1.w+100, horizon.lines[i].y);
    }
  }

  /**
   * Dibuja los objetos del paisaje
   * @return {[type]} [description]
   */
  function drawObjects() {
    cz1.lW = 2;


    for (var i in horizon.lines) {

      for (var j in horizon.lines[i].x) {
        if (horizon.lines[i].visible[j]) {
          cz1.lW = 2;
          cz1.sS = 'hsl(100,0%,'+(20+horizon.lines[i].scale*90)+'%)';
          var angle_to_focus0 = utilz.angleTo(
            horizon.lines[i].x[j],
            horizon.lines[i].y,
            horizon.focus0.x,
            horizon.focus0.y
          );
          drawTriangle(
            horizon.lines[i].x[j],
            horizon.lines[i].y,
            horizon.lines[i].radius,
            angle_to_focus0
          );
          cz1.ctx.closePath();
          cz1.ctx.stroke();
        }
      }
    }

    cz1.lW = 2;
    if (floating_triangles.length > 0) {
      for (var i = floating_triangles.length - 1; i >= 0; i--) {
        // cz1.sS = 'hsla('+floating_triangles[i].col[0]+','+floating_triangles[i].col[1]+'%,'+floating_triangles[i].col[2]+'%,'+(floating_triangles[i].scale*1.4)+')';
        cz1.fS = 'hsla('+floating_triangles[i].col[0]+','+floating_triangles[i].col[1]+'%,'+floating_triangles[i].col[2]+'%,'+(floating_triangles[i].scale*1.4)+')';
        // cz1.sS = 'rgb('+floating_triangles[i].col[0]+','+floating_triangles[i].col[1]+','+floating_triangles[i].col[2]+')';
        if (floating_triangles[i].y < (-1 * floating_triangles[i].radius )) {
          floating_triangles.splice(i, 1);
        } else {
          floating_triangles[i].angle_to_focus0 = floating_triangles[i].angle_to_focus0 * floating_triangles[i].angle_inc;
          var acceleration = -1.01;
          floating_triangles[i].vel = floating_triangles[i].vel * floating_triangles[i].acc;
          floating_triangles[i].y = floating_triangles[i].y - floating_triangles[i].vel;
          drawTriangle(
            floating_triangles[i].x,
            floating_triangles[i].y,
            floating_triangles[i].radius,
            floating_triangles[i].angle_to_focus0
          );
          cz1.ctx.fill();
          // cz1.ctx.stroke();
        }
      }
    }
  }

  /**
   * Realiza los cálculos de perspectiva iniciales
   * @return {[type]} [description]
   */
  function calculateGrid() {

    var
      increase = cz1.w / 4,
      base_points = [];

    // Calcula puntos a la izda y a la derecha del centro / foco
    // Y dibuja las líneas del grid
    for (var i = 0; i < 60; i++) {
      var x = i * increase - (30 * increase);
      base_points.push(x);
      // cz1.sS = '#333';
      // cz1.line(horizon.focus0.x, horizon.focus0.x, x, horizon.bottom);
      // cz1.line(horizon.focus1.x, horizon.focus1.y, x, horizon.bottom);
    }

    // cz1.sS = '#666';
    // cz1.line(0, horizon.top, cz1.w, horizon.top);
    // cz1.line(0, horizon.bottom, cz1.w, horizon.bottom);
    // cz1.fS = '#ccc';
    // cz1.plot(horizon.focus0.x, horizon.focus0.y, 2);
    // cz1.plot(horizon.focus1.x, horizon.focus1.y, 2);

    var
      h_deep = 14, // Número de "horizontes"
      len;
    horizon.lines = [];
    for (i = 0, len = h_deep; i < len; i++) {

      // Line intersection
      var point = checkLineIntersection(
        horizon.focus0.x,// x11,
        horizon.focus0.y, // y11,
        horizon.focus0.x, // x12,
        horizon.bottom, // y12,
        horizon.focus1.x, // x21,
        horizon.focus1.y, // y21,
        cz1.center.x - (increase * i), // x22,
        horizon.bottom// y22
      );

      var point_next = checkLineIntersection(
        horizon.focus0.x,// x11,
        horizon.focus0.y, // y11,
        horizon.focus0.x + increase, // x12,
        horizon.bottom, // y12,
        horizon.focus1.x, // x21,
        horizon.focus1.y, // y21,
        cz1.center.x - (increase * (i-1)), // x22,
        horizon.bottom// y22
      );

      var line = {};
      line.x = [];
      line.x.push(point.x);
      line.y = point.y;
      line.visible = [];
      line.visible.push(true);
      line.inc = point_next.x - point.x;
      line.scale = (point.y - horizon.top) / horizon.distance;

      var temp_x = point.x - line.inc;
      while (temp_x > (0 - (line.inc * 2))) {
        line.x.push(temp_x);
        line.visible.push(true);
        temp_x = temp_x - line.inc;
      }
      temp_x = point.x + line.inc;
      while (temp_x < (cz1.w + (line.inc * 2))) {
        line.x.push(temp_x);
        line.visible.push(true);
        temp_x = temp_x + line.inc;
      }

      line.x.sort(function(a, b){
        return b - a;
      });

      line.maxx = Math.max.apply(Math,(line.x));
      line.minx = Math.min.apply(Math,(line.x));

      // Eliminamos el primer punto porque al salirse por la izda se solapa con el correspondiente
      line.x.shift();
      line.visible.shift();

      horizon.lines.push(line);

    }

    horizon.lines.reverse(); // Far lines first ;)

    // A pesar de que tenemos una scala en % asociada a la distancia de los horizontes, queda mejor si lo tuneamos un poco y exageramos que los elementos lejanos sean más `pequeños
    for (var k = 0, len = horizon.lines.length; k < len; k++) {
      horizon.lines[k].scale = 0.8 * ((k+2) / (len+1)) * horizon.lines[k].scale;
      horizon.lines[k].radius = cz1.w / 6 * horizon.lines[k].scale * 1;
    }
  }

  /**
   * Antes de cada dibujado debemos actualizar la posición de los objetos
   *
   * El incremento de posición depende del espacio entre objetos y del tiempo
   * Si un objeto se sale por el borde izquiero volvermos a ponerlo en derecho
   */
  function updateObjectPosition() {

    var timerate = 2000; // Speed based on time
    var now = Date.now();
    var scale = (now - timer_last) / timerate;
    timer_last = now;

    for (var i in horizon.lines) {
      var x_adition = (horizon.lines[i].inc * scale);
      for (var j in horizon.lines[i].x) {
        horizon.lines[i].x[j] = horizon.lines[i].x[j] - x_adition;
        if (horizon.lines[i].x[j] < horizon.lines[i].minx) {
          horizon.lines[i].x[j] = horizon.lines[i].maxx - (horizon.lines[i].minx - horizon.lines[i].x[j]);
          horizon.lines[i].visible[j] = true;
        }
      }
    }
  }

  // ------------------------------------------------
  // Canvas -----------------------------------------
  // ------------------------------------------------

  cz1.clear = function() {

    this.ctx.clearRect(0, 0, this.w, this.h);

    cz1.fS = '#242424';

    /*var grd = this.ctx.createLinearGradient(0,0,0,this.h);
    grd.addColorStop(0,'#000000');
    grd.addColorStop(1,'#242424');
    this.fS = grd;*/

    this.ctx.rect(0, 0, this.w, this.h);
    this.ctx.fill();
  };

  cz1.beforeStart = function() {
    horizon.top = cz1.h / 4;
    horizon.bottom = cz1.h * 0.9;
    horizon.distance = horizon.bottom - horizon.top;
    // Primer foco / punto de fuga central
    horizon.focus0 = {};
    horizon.focus0.x = cz1.center.x;
    horizon.focus0.y = horizon.top;
    // Segundo foco / punto de fuga central
    horizon.focus1 = {};
    horizon.focus1.x = cz1.w * 0.9;
    horizon.focus1.y = horizon.top;

    calculateGrid();

    // Incia.lizar los timers
    timer_initial = Date.now();
    timer_last = timer_initial;

    setInterval(function(){
      pickFloatingTriangle();
    }, 1000);

    setInterval(function(){
      floatAllTriangles();
    }, 60000);
  };

  cz1.beforeDraw = function() {
    this.clear();
    updateObjectPosition();
  };

  cz1.draw = function() {

    // drawHorizonLines();
    drawObjects();

  };

  cz1.start();

});


function checkLineIntersection(x11, y11, x12, y12, x21, y21, x22, y22) {
  // if the lines intersect, the result contains the x and y of the intersection (treating the lines as infinite) and booleans for whether line segment 1 or line segment 2 contain the point
  var denominator, a, b, numerator1, numerator2, result = {
    x: null,
    y: null,
    onLine1: false,
    onLine2: false
  };
  denominator = ((y22 - y21) * (x12 - x11)) - ((x22 - x21) * (y12 - y11));
  if (denominator === 0) {
    return result;
  }
  a = y11 - y21;
  b = x11 - x21;
  numerator1 = ((x22 - x21) * a) - ((y22 - y21) * b);
  numerator2 = ((x12 - x11) * a) - ((y12 - y11) * b);
  a = numerator1 / denominator;
  b = numerator2 / denominator;

  // if we cast these lines infinitely in both directions, they intersect here:
  result.x = x11 + (a * (x12 - x11));
  result.y = y11 + (a * (y12 - y11));
  /*
  // it is worth noting that this should be the same as:
    x = x21 + (b * (x22 - x21));
    y = x21 + (b * (y22 - y21));
  */
  // if line1 is a segment and line2 is infinite, they intersect if:
  if (a > 0 && a < 1) {
    result.onLine1 = true;
  }
  // if line2 is a segment and line1 is infinite, they intersect if:
  if (b > 0 && b < 1) {
    result.onLine2 = true;
  }
  // if line1 and line2 are segments, they intersect if both of the above are true
  return result;
}

function drawTriangle(x_center, y_center, radius, initial_angle) {
  var angle, x1, y1, x2, y2, x3, y3;
  if (typeof initial_angle === 'undefined') {
    initial_angle = 0;
  }
  initial_angle = initial_angle + Math.PI/2;
  angle = (Math.PI/6) + initial_angle;
  x1 = radius * Math.cos(angle) + x_center;
  y1 = radius * Math.sin(angle) + y_center;
  angle = (3*Math.PI/2) + initial_angle;
  x2 = radius * Math.cos(angle) + x_center;
  y2 = radius * Math.sin(angle) + y_center;
  angle = (5*Math.PI/6) + initial_angle;
  x3 = radius * Math.cos(angle) + x_center;
  y3 = radius * Math.sin(angle) + y_center;

  // cz1.fS = '#000';
  // cz1.sS = '#CCC';
  // cz1.lW = 2;
  cz1.ctx.beginPath();
  cz1.ctx.moveTo(x1,y1);
  cz1.ctx.lineTo(x2,y2);
  cz1.ctx.lineTo(x3,y3);
  cz1.ctx.closePath();
  // cz1.ctx.fill();
  // cz1.ctx.stroke();
}

function pickFloatingTriangle() {
  var tri = {};
  var random_line = utilz.randomInt(0, horizon.lines.length - 1);
  tri.y      = horizon.lines[random_line].y;
  tri.scale  = horizon.lines[random_line].scale;
  tri.radius = horizon.lines[random_line].radius;
  var rindex = utilz.randomInt(0, horizon.lines[random_line].x.length - 1);
  tri.x      = horizon.lines[random_line].x[rindex];
  tri.angle_inc = 1.01;
  tri.acc = utilz.randomFloat(1.035, 1.065);
  tri.vel = 1;
  tri.angle_to_focus0 = utilz.angleTo(
    tri.x,
    tri.y,
    horizon.focus0.x,
    horizon.focus0.y
  );
  tri.col = palette[utilz.randomInt(0, 2)];
  if (horizon.lines[random_line].visible[rindex]) {
    horizon.lines[random_line].visible[rindex] = false;
    floating_triangles.push(tri)
  }
}

function floatAllTriangles() {
  for (var i in horizon.lines) {
    for (var j in horizon.lines[i].x) {
      if (horizon.lines[i].visible[j]) {

          var tri = {};
          tri.y      = horizon.lines[i].y;
          tri.scale  = horizon.lines[i].scale;
          tri.radius = horizon.lines[i].radius;
          tri.x      = horizon.lines[i].x[j];
          tri.angle_inc = 1.01;
          tri.acc = utilz.randomFloat(1.010, 1.035);
          tri.vel = 1;
          tri.angle_to_focus0 = utilz.angleTo(
            tri.x,
            tri.y,
            horizon.focus0.x,
            horizon.focus0.y
          );
          tri.col = palette[utilz.randomInt(0, 2)];
          horizon.lines[i].visible[j] = false;
          floating_triangles.push(tri);

        }
      }
    }
  }

