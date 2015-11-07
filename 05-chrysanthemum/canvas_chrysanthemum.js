'use strict';

/* Global vars */
var gV = {
  radius: 60,
  x: 0,
  y: 0,
  segments: []
},
cz1;

$(document).ready(function() {
  // La magia aquí!

  // Inicializamos el canvas
  cz1 = new Canvaz('#cnvz');

  cz1.drawOnce = function() {
    cz1.sS = '#666';
    cz1.fS = '#f00';
    cz1.ctx.translate(400,400);

    var
      radius = -380,
      radius_current = radius,
      deep = 14,
      segments_all = new Array(),
      final_angle = Math.PI / 3; // 1/6 circunference

    cz1.plot(0, 0, 2);

    var circles = [];
    var circle_radius = [];
    var last = 0;

    cz1.fS = 'rgba(255,255,0,0.5)';
    for (var i = 0; i < deep; i++) {
      var circle = [];

      var t = i / deep;
      var f = eaze.out.quint(t);
      // console.log(f);

      for (var j = 0; j < i; j++) {
        var angle = (final_angle / i) * j;
        var py = f * radius;
        var point = utilz.rotatePoint(0, 0, 0, py, angle);
        if (point[1] !== 0) {
          circle.push(point);
        }
        if (j === 0) {
          // Este es el radio correcto
          var r = Math.abs(last - py);
          // Pero le aplicacamos un corrector
          circle_radius.push(r);
          // console.log(py);
          last = py;
        }
        // cz1.plot(point[0], point[1], 2);
      };
      circles.push(circle);

    }; // for i

    //
    // Draw
    //

    cz1.lW = 1.1;

    var grd_fondo = cz1.ctx.createRadialGradient(
      0,
      0,
      Math.abs(radius)*0.98,
      0,
      0,
      Math.abs(radius)
    );
    grd_fondo.addColorStop(0,"#242424");
    grd_fondo.addColorStop(1,"#404040");
    cz1.fS = grd_fondo;
    cz1.plot(0, 0, Math.abs(radius-4));
    cz1.circle(0, 0, Math.abs(radius-4));

    // cz1.ctx.globalCompositeOperation = 'screen';
    // cz1.ctx.globalCompositeOperation = 'lighten';


      for (var i = circles.length - 1; i >= 0; i--) {
        // cz1.ctx.rotate(Math.PI / 30 / i);

        for (var k = 0; k < 6; k++) {

          cz1.ctx.rotate(final_angle);
          var line_alpha = 1 - (i / deep);
          console.log(1 - (i / deep));

          for (var j = 0; j < circles[i].length; j++) {
            var grd = cz1.ctx.createRadialGradient(
              circles[i][j][0],
              circles[i][j][1],
              circle_radius[i-1]*0.64,
              circles[i][j][0],
              circles[i][j][1],
              circle_radius[i-1]);
            grd.addColorStop(0,"#000000");
            grd.addColorStop(1,"#202020");
            cz1.fS = grd;
            cz1.sS = "#999";
            cz1.sS = "rgba(220,220,220,"+line_alpha+")";
            cz1.ctx.globalCompositeOperation = 'screen';
            cz1.circle(circles[i][j][0], circles[i][j][1], circle_radius[i-1]);
            cz1.plot(circles[i][j][0], circles[i][j][1], circle_radius[i-1]);
          };

          // cz1.ctx.rotate(Math.PI / 30 / i * -1);
          // console.log(circles[i-1][0][1]);
          if (i > 1 && i < (deep*0.75)) {
            var grd_tapa = cz1.ctx.createRadialGradient(
              0,
              0,
              Math.abs(circles[i][0][1])*0.75,
              0,
              0,
              Math.abs(circles[i][0][1]));
            grd_tapa.addColorStop(0,"rgba(36,36,36,1)");
            grd_tapa.addColorStop(1,"rgba(36,36,36,0)");
            cz1.fS = grd_tapa;
            cz1.ctx.globalCompositeOperation = 'source-over';
            cz1.plot(0, 0, Math.abs(circles[i][0][1]));
            // cz1.sS = "red";
            // cz1.circle(0, 0, Math.abs(circles[i][0][1]));
          }

        }; // Rotate stage
      }; // For i



  };

  cz1.drawOnce();

});



