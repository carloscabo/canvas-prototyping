'use strict';

/* Global vars */
var gV = {
  radius: 0,
  deep: 14,
  final_angle: Math.PI / 3, // 60º
  // Elemtents to be draw
  circles: [],
  circles_radius: [],

  // Colores gradientes
  grd_fondo: null

},
cz1;

$(document).ready(function() {
  // La magia aquí!

  // Inicializamos el canvas
  cz1 = new Canvaz('#cnvz');

  cz1.beforeStart = function() {

    gV.radius = -1 * cz1.h * 0.5 * 0.92;

    this.ctx.translate(400,400);

    // Calculate circles
    var last = 0;

    for (var i = 0; i < gV.deep; i++) {
      var
        circle = [],
        t = i / gV.deep,
        f = eaze.out.quint(t);

      for (var j = 0; j < i; j++) {
        var
          angle = (gV.final_angle / i) * j,
          py = f * gV.radius,
          point = utilz.rotatePoint(0, 0, 0, py, angle);

        if (point[1] !== 0) {
          circle.push(point);
        }
        if (j === 0) {
          // Este es el radio correcto
          var r = Math.abs(last - py);
          // Pero le aplicacamos un corrector
          gV.circles_radius.push(r);
          // console.log(py);
          last = py;
        }
        // cz1.plot(point[0], point[1], 2);
      };
      gV.circles.push(circle);
    }; // for i

    cz1.lW = 1.1;
    gV.grd_fondo = cz1.ctx.createRadialGradient(
      0,
      0,
      Math.abs(gV.radius)*0.98,
      0,
      0,
      Math.abs(gV.radius)
    );
    gV.grd_fondo.addColorStop(0,"#242424");
    gV.grd_fondo.addColorStop(1,"#404040");
  };

  cz1.beforeDraw = function() {
    // Erase all
    this.clear(-400,-400,800,800);

    // Add bg circle
    cz1.ctx.globalCompositeOperation = 'source-over';
    cz1.fS = gV.grd_fondo;
    cz1.plot(0, 0, Math.abs(gV.radius-4));
    cz1.circle(0, 0, Math.abs(gV.radius-4));
  };

  //
  // Draw
  //
  cz1.draw = function() {

    for (var i = gV.circles.length - 1; i >= 0; i--) {
      // cz1.ctx.rotate(Math.PI / 30 / i);

      for (var k = 0; k < 6; k++) {

        cz1.ctx.rotate(gV.final_angle);
        var line_alpha = 1 - (i / gV.deep);

        // Draws sll circles in current level
        for (var j = 0; j < gV.circles[i].length; j++) {
          var grd = cz1.ctx.createRadialGradient(
            gV.circles[i][j][0],
            gV.circles[i][j][1],
            gV.circles_radius[i-1]*0.64,
            gV.circles[i][j][0],
            gV.circles[i][j][1],
            gV.circles_radius[i-1]);
          grd.addColorStop(0,"#000000");
          grd.addColorStop(1,"#202020");
          cz1.fS = grd;
          cz1.sS = "#999";
          cz1.sS = "rgba(220,220,220,"+line_alpha+")";
          cz1.ctx.globalCompositeOperation = 'screen';
          cz1.circle(
            gV.circles[i][j][0],
            gV.circles[i][j][1],
            gV.circles_radius[i-1]
          );
          cz1.plot(
            gV.circles[i][j][0],
            gV.circles[i][j][1],
            gV.circles_radius[i-1]
          );
        };

        // Cover central part of current level of circles
        if (i > 1 && i < (gV.deep*0.75)) {
          var grd_tapa = cz1.ctx.createRadialGradient(
            0,
            0,
            Math.abs(gV.circles[i][0][1])*0.75,
            0,
            0,
            Math.abs(gV.circles[i][0][1]));
          grd_tapa.addColorStop(0,"rgba(36,36,36,1)");
          grd_tapa.addColorStop(1,"rgba(36,36,36,0)");
          cz1.fS = grd_tapa;
          cz1.ctx.globalCompositeOperation = 'source-over';
          cz1.plot(0, 0, Math.abs(gV.circles[i][0][1]));

        }

      }; // Rotate stage
    }; // For i



  };

  cz1.start();

});



