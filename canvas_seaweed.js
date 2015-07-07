var
  p,
  pRadius = 10,
  cz1,
  shape,
  physics,
  points = [],
  loop_count = 0;

$(document).ready(function() {
  // La magia aquí!

  // Inicializamos el canvas
  cz1 = new Canvaz("#cnvz");
  cz1.fullScreen();

  // Inicializamos la física
  physics = new Physics(0); // 0.1

  p_num = 3;

  var yi = cz1.h *0.20;
  var yf = cz1.h *0.9;
  var yh = yf - yi;
  var inc = yh / p_num;

  // Springs var
  var strength = 1; // What is the strength of the bond?
  var drag = 0.2; // How much drag is on the string?
  var rest = pRadius * 2; // What is the rest length of the spring?

  // HSL
  var palette = [
    [322, 35, 59], // [3, 91, 68],  // Rojo [248,108,101],
    [351, 46, 67], // [121, 35, 55],// Verde [98,180,99],
    [54, 100, 47]  // [43, 79, 59]  // Amarillo [233,187,68]
  ]

  function P(x, y) {
    // Initial position, in the circle
    this.ix = x;
    this.iy = y;
    // this.r = 50;
    this.m = 20;

    this.particle = physics.makeParticle(this.m, this.ix, this.iy);
  };
  Object.defineProperty(P.prototype, 'x', {
    get: function() {
      return this.particle.position.x;
    }
  });
  Object.defineProperty(P.prototype, 'y', {
    get: function() {
      return this.particle.position.y;
    }
  });

  P.prototype.render = function() {
    cz1.plot(this.x, this.y, 2);
    cz1.circle(this.x, this.y, pRadius);
  }

  // Canvas

  cz1.clear = function() {
    this.fS = '#242424';
    this.ctx.beginPath();
    this.ctx.rect(0, 0, this.w, this.h);
    this.ctx.fill();
  }

  cz1.beforeStart = function() {

    points.length = 0;


    for (var i = 0; i < p_num; i++) {
      points.push(new P(cz1.center.x+utilz.randomInt(-5,5), yi + (inc*i)));
      if (i > 0 && typeof points[i-1] !== 'undefined') {
        physics.makeSpring(points[i].particle, points[i-1].particle, strength, drag, rest);
      }
    };
    physics.makeSpring(points[0].particle, points[points.length-1].particle, strength,  drag, rest);

    // Attractor
    points.push(new P(cz1.center.x, cz1.center.y));
    points[points.length-1].particle.fixed = true;

    // points[0].particle.fixed = true;
    // points[0].x = cz1.center.x;
    // points[p_num-2].particle.fixed = true;
    // points[p_num-2].x = cz1.center.x;
    // Atractor
    // points[p_num-1].particle.fixed = true;

  }

  cz1.beforeDraw = function() {
    this.clear();
    physics.update();

    // Centrar el attracotr
    points[points.length-1].particle.x = cz1.center.x;
    points[points.length-1].particle.y = cz1.center.y;

    if (loop_count == 100) {
      loop_count = 0;

      array_pos = utilz.randomInt(1,p_num-2);
      var new_x = points[array_pos].x + (points[array_pos].x - points[array_pos-1].x)/2;
      var new_y = points[array_pos].y + (points[array_pos].y - points[array_pos-1].y)/2;
      points.splice(array_pos, 0, new P(new_x, new_y));
      p_num++;

      physics.springs.splice(array_pos-1, 1);

      var s = new Spring(points[array_pos-1].particle, points[array_pos].particle, strength, drag, rest);
      physics.springs.splice(array_pos-1, 0, s);
      var s = new Spring(points[array_pos].particle, points[array_pos+1].particle, strength, drag, rest);
      physics.springs.splice(array_pos, 0, s);

      physics.makeAttraction(points[array_pos].particle, points[points.length-1].particle, 5000, cz1.w/2);

    }


    // Actualizar la física de las partículas
    // Para que no colisionen
    var diameter = pRadius*2;

    for (var i = 0, l = points.length-1; i < l; i++) {

      var particle = points[i].particle;
      var pos = particle.position.clone();

      for (var j = i; j < l; j++) {

        if (j == i) {
          continue;
        }

        var a = particle;
        var b = points[j].particle;
        var d = a.distanceTo(b);

        if (d <= diameter) {

          var v = a.velocity.clone();
          a.velocity.copy(b.velocity).multiplyScalar(0.75);
          b.velocity.copy(v).multiplyScalar(0.75);

          if (d < diameter) {

            // Force particles to be tangential.
            // i.e: No sphere is ever within another sphere.

            var makeup = (diameter - d) / 2;
            var angle = Math.atan2(b.position.y - a.position.y, b.position.x - a.position.x);

            b.position.x += makeup * Math.cos(angle);
            b.position.y += makeup * Math.sin(angle);

            angle += Math.PI;

            a.position.x += makeup * Math.cos(angle);
            a.position.y += makeup * Math.sin(angle);

          }
        }
      }
    }
    loop_count++;
  }

  cz1.draw = function() {

    cz1.sS = '#666';

    // Dibujar líneas entre partículas
    for (var i = physics.springs.length - 1; i >= 0; i--) {
      cz1.line(
        physics.springs[i].a.position.x,
        physics.springs[i].a.position.y,
        physics.springs[i].b.position.x,
        physics.springs[i].b.position.y
      );
    };
    cz1.line(
        physics.springs[physics.springs.length - 1].a.position.x,
        physics.springs[physics.springs.length - 1].a.position.y,
        physics.springs[0].b.position.x,
        physics.springs[0].b.position.y
      );

    // Dibujar partículas
    cz1.fS = '#ccc';
    cz1.sS = '#633';
    for (var i = points.length - 2; i >= 0; i--) {
      points[i].render();
    };

    // Attactor
    cz1.sS = '#000';
    cz1.fS = '#6f6';
    points[points.length-1].render();

  };

  physics.play();

  setTimeout(function(){
    cz1.start();
  },500);

});



