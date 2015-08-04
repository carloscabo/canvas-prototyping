var
  p,
  pRadius = 20,
  cz1,
  shape,
  physics,
  points = [],
  loop_count = 0,
  attraction = 5000,
  far_particles = [];

$(document).ready(function() {
  // La magia aquí!

  // Inicializamos el canvas
  cz1 = new Canvaz("#cnvz");
  cz1.fullScreen();

  // HSL
  var palette = [
    [322, 35, 59], // [3, 91, 68],  // Rojo [248,108,101],
    [351, 46, 67], // [121, 35, 55],// Verde [98,180,99],
    [54, 100, 47]  // [43, 79, 59]  // Amarillo [233,187,68]
  ]

  // Canvas

  cz1.clear = function() {
    this.fS = '#242424';
    this.ctx.beginPath();
    this.ctx.rect(0, 0, this.w, this.h);
    this.ctx.fill();
  }

  cz1.beforeStart = function() {

  }

  cz1.beforeDraw = function() {
    this.clear();

  }

  cz1.draw = function() {

    cz1.sS = '#666';
    cz1.fS = '#f00';

    cz1.plot(cz1.center.x, cz1.center.y, 60);

  };

  cz1.start();

});



