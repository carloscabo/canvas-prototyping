var
  s1;

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

  function Shard(x, y, w) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.shape = [-3,-3,-1,-3,-1,-2,0,-1,1,-2,1,-3,3,-3,3,-1,2,-1,1,0,2,1,3,1,3,3,1,3,1,2,1,2,0,1,-1,2,-1,3,-3,3,-3,1,-2,1,-1,0,-2,-1,-3,-1];
  }
  Shard.prototype.render = function() {
    var p = [];
    for (var i = 0; i < this.shape.length; i = i+2) {
      p.push(this.x + (this.shape[i] / 3 * this.w / 2)); // x
      p.push(this.y + (this.shape[i+1] / 3 * this.w / 2)); // y
    };
    cz1.pline(p, true);
  }

  s1 = new Shard(cz1.center.x, cz1.center.y, cz1.h*0.6);

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

    s1.render();

  };

  cz1.start();

});



