'use strict';

/* Global vars */
var gV = {
  cx: 0,
  cy: 0,
  map: {
    offset_x: 0,
    offset_y: 0,
    w: 910,
    h: 450
  },
  dots: {
    radius: 4,
    spacing: 0
  }
},
cz1,
matrix,
ripple = null;

function Dot () {
  this.x = 0;
  this.y = 0;
  this.size = 0.1;
  this.color = 0;
}

function Ripple (cx, cy, duration) {
  this.cx = cx;
  this.cy = cy;
  this.init_time =  Date.now();
  this.duration = 2000;
  this.radius = 150;
}

function Matrix(cols, rows) {
  var matrix = new Array(cols);
  for(var i = 0; i < matrix.length; i++) {
    matrix[i] = new Array(rows);
  }
  return matrix;
}
// var myMatrix = Matrix(4, 9);
// myMatrix[3][5] = "booger";

//
// DOM READY!
//
$(document).ready(function() {
  // La magia aquí!

  function createDotArray() {
    var img = new Image();
    img.onload = function(){
      var canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      var ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      readImgData(canvas, ctx);
    };
    img.src = 'img/mapa_04.png';
  }

  function readImgData(canvas, ctx) {
    var
      w = canvas.width,
      h = canvas.height,
      imgd = ctx.getImageData(0, 0, w, h),
      pix = imgd.data,
      col = 0,
      row = 0;

    // Crea la matriz
    matrix = Matrix(w, h);

    // Recorre los pixels de 4 en 4
    for (var i = 0, n = pix.length; i < n; i += 4) {
      // pix[i  ]; // red
      // pix[i+1]; // green
      // pix[i+2]; // blue
      // i+3 is alpha (the fourth element)

      // Normalice X/Y
      var
        x = col / w,
        y = row / h,
        dot = new Dot(); // Creamos el punto

      // Posotion normalized
      dot.x = x;
      dot.y = y;
      // Color and size
      if (pix[i] > 0) { // Red
        dot.color = 1;
        dot.size = pix[i] / 255;
      } else if (pix[i+2] > 0) { // Blue
        dot.color = 2;
        dot.size = pix[i+2] / 255;
      } else { // Black
        dot.size = 0.1;
      }
      // Push dot to matrix
      matrix[col][row] = dot;
      // Increase cols / rows
      col++;
      if (col === w) {
        col = 0;
        row++;
      }
    }

    matrixReady()
    // return matrix;
  }

  function matrixReady() {
    // matrix_copy = matrix.slice();
    // console.log(matrix_copy);
    cz1.start();
  }

  createDotArray();

  // Inicializamos el canvas
  cz1 = new Canvaz('#cnvz');
  // cz1.fullScreen();

  // HSL
  var palette = [
    [200,200,200], // Gris claro
    [190,190,190], // Gris medio
    [185,193, 23]  // Verde gonico
  ];

  // Canvas
  cz1.clear = function() {
    this.fS = '#ffffff';
    this.ctx.beginPath();
    this.ctx.rect(0, 0, this.w, this.h);
    this.ctx.fill();
  };

  cz1.beforeStart = function() {
    gV.cx = cz1.center.x;
    gV.cy = cz1.center.y;
  };

  cz1.beforeDraw = function() {
    this.clear();
  };

  cz1.draw = function() {

    // Dibuja el ripple
    if (ripple) {
      cz1.lW = 2;
      var now = Date.now();
      var t = (Date.now() - ripple.init_time) / ripple.duration;
      var ease = EasingFunctions.easeOutCubic(t);
      if (ease > 1) {
        ripple = null;
      } else {
        // Radio del ripple actual
        var rr = ease * ripple.radius;
        // console.log(rr);
        // Fuerza del ripple, mas debil cuanto más lejos float [0 -1]
        var rs = (1-ease)*1;

        // Draw ripple circle
        /*cz1.sS = 'rgba(238,0,0,'+rs+')';
        cz1.circle(
          ripple.cx,
          ripple.cy,
          rr
        );*/
      }
    }

    // Dibuja el mapa
    for(var i = 0; i < matrix.length; i++) {
      for(var j = 0; j < matrix[j].length; j++) {
        // console.log(matrix[i][j]);
        var dot = matrix[i][j];
        var x = gV.map.offset_x + (dot.x * gV.map.w);
        var y = gV.map.offset_y + (dot.y * gV.map.h);
        var dr = 1;
        var scale = 0;

        cz1.fS = 'rgb('+palette[dot.color].join(',')+')';

        // Hay ripple activo?
        if (ripple) {
          // Distancia al centro del ripple
          var dc = utilz.dist(x, y, ripple.cx, ripple.cy);
          if (dc < ripple.radius) {
            // cz1.fS = '#ee0000';

            if (Math.abs(rr-dc) < 20) {
              dr = 1-(Math.abs(rr-dc)/20); // Float [0-1]
              scale = gV.dots.radius * dot.size * dr * rs * 1.5;
              y = y - scale * 2;
              x = x + scale;
              // var r = parseInt(utilz.lerp(palette[dot.color][0], palette[2][0], dr), 10);
              // var g = parseInt(utilz.lerp(palette[dot.color][1], palette[2][1], dr), 10);
              // var b = parseInt(utilz.lerp(palette[dot.color][2], palette[2][2], dr), 10);
              // cz1.fS = 'rgb('+r+','+g+','+b+')';
            }

          }
        }
        cz1.plot( x, y, gV.dots.radius * dot.size + scale);

      } // for j
    } // for i

    // Comienza onda en zona 'verde'
    if(!ripple) {
      do {
        var px = utilz.randomInt(0, matrix.length-1);
        var py = utilz.randomInt(0, matrix[0].length-1);
      } while (matrix[px][py].color !== 2);

      ripple = new Ripple(
        gV.map.offset_x + (matrix[px][py].x * gV.map.w),
        gV.map.offset_y + (matrix[px][py].y * gV.map.h)
      );
    }

  }; // Draw

  $(document).on('click', function(e) {
    e.preventDefault();
    ripple = new Ripple(
      gV.cx,
      gV.cy
    );
  });

});



