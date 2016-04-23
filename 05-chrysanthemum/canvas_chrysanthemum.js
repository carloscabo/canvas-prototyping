'use strict';

/* Global vars */
var gV = {
  radius: 0,
  deep: 14,
  final_angle: 1.0471975511965976, // Math.PI / 3, // 60º
  final_angle_factor: 1,
  subangle_factor: 1,
  speed: 25000,
  // Elemtents to be draw
  circles: [],
  circles_radius: [],
  circles_distance_to_center: [0],
  easing: 'quint',
  // Colores gradientes
  grd_fondo: null,
  // Time
  t0: 0,
  tb: 0,
  t_factor: 0,
  // Functions
  'restart': function() {
    cz1.restart();
  },
  'save_image': function() {
    cz1.saveCanvasToPng('../img/carlos_cabo_gonzalez_logo_home.png');
  }
},
cz1;

$(document).ready(function() {
  // La magia aquí!

  var palette = [
    [ 30,  81, 52 ],
    [ 220, 77, 48 ]
  ];

  // Inicializamos el canvas
  cz1 = new Canvaz('#cnvz');
  cz1.fullScreen();

  var DATgui = new dat.GUI();
  DATgui.add(gV, 'deep', 2, 28);
  DATgui.add(gV, 'speed', 1000, 50000);
  DATgui.add(gV, 'final_angle_factor', -10.0, 1);
  DATgui.add(gV, 'subangle_factor', -5, 5);
  DATgui.add(gV, 'easing', [ 'quint', 'cubic', 'quad', 'back', 'bounce' ] );
  DATgui.add(gV, 'restart');
  DATgui.add(gV, 'save_image');
  // DATgui.add(gV, 'save_image');
  document.getElementById('settings-box').appendChild(DATgui.domElement);

  //
  // Prepairing circle data
  //
  cz1.beforeStart = function() {

    cz1.ctx.translate(cz1.w/2,cz1.h/2);
    gV.radius = -1 * cz1.h * 0.5 * 0.80;

    // Calculate circles
    var last = 0;

    for (var i = 0; i < gV.deep; i++) {
      var
        circle = [],
        t = i / gV.deep,
        f = eaze.out[gV.easing](t);

      for (var j = 0; j < i; j++) {
        var
          angle = (gV.final_angle / i) * j * gV.subangle_factor,
          py = f * gV.radius,
          point = utilz.rotatePoint(0, 0, 0, py, angle);

        if (point[1] !== 0) {
          circle.push(point);
        }
        if (j === 0) {
          var r = Math.abs(last - py);
          gV.circles_radius.push(r);
          gV.circles_distance_to_center.push(py);
          last = py;
        }
        // cz1.plot(point[0], point[1], 2);
      };
      gV.circles.push(circle);
    }; // for i

    cz1.lW = 1.2;

    /*gV.grd_fondo = cz1.ctx.createRadialGradient(
      0,
      0,
      Math.abs(gV.radius)*0.98,
      0,
      0,
      Math.abs(gV.radius)
    );
    gV.grd_fondo.addColorStop(0,"#242424");
    gV.grd_fondo.addColorStop(1,"#404040");*/

    gV.t0 = Date.now();
  };

  cz1.beforeDraw = function() {
    // Erase all
    /*this.clear(
      -1 * cz1.w/2,
      -1 * cz1.h/2,
      cz1.w,
      cz1.h
    );*/

    this.ctx.rect(
      -1 * cz1.w/2,
      -1 * cz1.h/2,
      cz1.w,
      cz1.h
    );
    cz1.ctx.globalCompositeOperation = 'source-over';
    cz1.fS = "rgb(24,24,24)"
    this.ctx.fill();

    // Add bg circle
    /*cz1.ctx.globalCompositeOperation = 'source-over';
    cz1.fS = gV.grd_fondo;
    cz1.plot(0, 0, Math.abs(gV.radius-4));
    cz1.circle(0, 0, Math.abs(gV.radius-4));*/

  };

  //
  // Draw
  //
  cz1.draw = function() {

    for (var i = gV.circles.length - 1; i >= 0; i--) {

      // Rotate level of circles
      var tn = Date.now(); // Time now
      gV.t_factor = (tn - gV.t0) / gV.speed / (i + gV.final_angle_factor);
      if (gV.tp > 1) { gV.tp = gV.tp -1; gV.t0 = tn; }

      var stage_angle = 2 * Math.PI * gV.t_factor;
      cz1.ctx.rotate(stage_angle);

      var line_alpha = 1 - (i / gV.deep);

      var col = utilz.hslLerp(palette[0], palette[1], Math.abs(gV.circles_distance_to_center[i] / gV.radius));

      // Draw 6 times
      for (var k = 0; k < 6; k++) {

        cz1.ctx.rotate(gV.final_angle);
        // debugger;

        // Draws all circles in current level
        for (var j = 0; j < gV.circles[i].length; j++) {
          cz1.ctx.globalCompositeOperation = 'screen';

          var grd = cz1.ctx.createRadialGradient(
            gV.circles[i][j][0],
            gV.circles[i][j][1],
            gV.circles_radius[i-1]*0.64,
            gV.circles[i][j][0],
            gV.circles[i][j][1],
            gV.circles_radius[i-1]
          );
          grd.addColorStop(0,"hsla(342, 77%, 48%, 0.12)");
          grd.addColorStop(1,"hsla(342, 77%, 48%, 0.6)");
          grd.addColorStop(0,"hsla("+col[0]+","+col[1]+"%,"+col[2]+"%, 0.10)");
          grd.addColorStop(1,"hsla("+col[0]+","+col[1]+"%,"+col[2]+"%, 0.75)");
          cz1.fS = grd;
          cz1.plot(
            gV.circles[i][j][0],
            gV.circles[i][j][1],
            gV.circles_radius[i-1]
          );
          /*cz1.plot(
            gV.circles[i][j][0],
            gV.circles[i][j][1],
            gV.circles_radius[i-1]
          );*/

          cz1.sS = "hsla("+col[0]+","+col[1]+"%,"+col[2]+"%,"+line_alpha+")";
          cz1.circle(
            gV.circles[i][j][0],
            gV.circles[i][j][1],
            gV.circles_radius[i-1]
          );
        };

        // Cover central part of current level of circles
        if ( i > 1 ) {
          var grd_tapa = cz1.ctx.createRadialGradient(
            0,
            0,
            Math.abs(gV.circles[i][0][1])*0.78,
            0,
            0,
            Math.abs(gV.circles[i][0][1])
          );
          grd_tapa.addColorStop(0,"rgba(24,24,24,1)");
          grd_tapa.addColorStop(1,"rgba(24,24,24,0)");
          cz1.fS = grd_tapa;
          cz1.ctx.globalCompositeOperation = 'source-over';
          cz1.plot(0, 0, Math.abs(gV.circles[i][0][1]));
        }

      }; // Draw level

      // Rotate level of circles
      cz1.ctx.rotate(-stage_angle);

    }; // For i

  };

  // Called on window resize
  cz1.restart = function () {
    cz1.stopAnim();
    cz1.fullScreen();

    gV.radius = 0,
    gV.circles.length = 0;
    gV.circles_radius.length = 0;
    gV.circles_distance_to_center = [0];

    cz1.start();
  }

  cz1.start();

});
