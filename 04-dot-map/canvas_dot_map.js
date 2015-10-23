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
matrix;

function Dot () {
  this.x = 0;
  this.y = 0;
  this.size = 0.1;
  this.color = 0;
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
    cz1.start();
  }

  createDotArray();

  // Inicializamos el canvas
  cz1 = new Canvaz('#cnvz');
  // cz1.fullScreen();

  // HSL
  var palette = [
    [216,216,216], // Gris claro
    [200,200,200], // Gris medio
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
    // cz1.sS = '#666';
    cz1.plot(gV.cx, gV.cy, gV.radius);

    for(var i = 0; i < matrix.length; i++) {
      for(var j = 0; j < matrix[j].length; j++) {
        // console.log(matrix[i][j]);
        var dot = matrix[i][j];
        var x = gV.map.offset_x + (dot.x * gV.map.w);
        var y = gV.map.offset_y + (dot.y * gV.map.h);
        // console.log('rgba('+palette[dot.color].join(',')+')');
        cz1.fS = 'rgb('+palette[dot.color].join(',')+')';
        cz1.plot( x, y, gV.dots.radius * dot.size);
        // console.log(dot.size);
      }
    }
  };



});



