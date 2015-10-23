'use strict';

Array.matrix = function(numrows, numcols, initial) {
  var arr = [];
  for (var i = 0; i < numrows; ++i) {
    var columns = [];
      for (var j = 0; j < numcols; ++j) {
        columns[j] = initial;
      }
    arr[i] = columns;
  }
  return arr;
};

/* Global vars */
var gV = {
  radius: 60,
  x: 0,
  y: 0
},
cz1,
buffer,
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
    matrix[i] = new Array(cols);
  }
  return matrix;
}
// var myMatrix = Matrix(4, 9);
// myMatrix[3][5] = "booger";

function createDotArray() {
  var img = new Image();
  img.onload = function(){
    console.log(img.width);
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
      dot.size = 255 / pix[i];
    } else if (pix[i+2] > 0) { // Blue
      dot.color = 2;
      dot.size = 255 / pix[i+2];
    } else { // Black
      dot.size = 0.1;
    }
    // Push dot to matrix
    matrix[col][row] = dot;
    // Increase cols / rows
    col++;
    if (col == w) {
      col = 0;
      row++;
    }
  }

  // console.log(pix)
}

$(document).ready(function() {
  // La magia aquí!

  createDotArray();

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

  cz1.draw = function() {
    cz1.sS = '#666';
    cz1.fS = '#f00';
    cz1.plot(gV.x, gV.y, gV.radius);
  };

  cz1.start();

});



