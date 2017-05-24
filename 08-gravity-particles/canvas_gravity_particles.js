'use strict';

/* Global vars */
var gV = {
  particle_radius: 12,
  cx: 0,
  cy: 0,
  num_particles: 100,
  is_mouse_down: false
},
cz1, // Canvas
particles = []; // Particles array

function randomPointInsideCircle( cx, cy, cr) {
  var
    t = 2 * Math.PI * Math.random(),
    u = Math.random() + Math.random(),
    r = 0;
  if ( u > 1 ) {
    r =1;
  } else {
    r = u;
  }
  // Inside circle
  cr = Math.random() * cr;
  return { x: cx + cr * Math.cos( t ), y: cy + cr * Math.sin( t ) };
}

// Particle
function Particle ( id, pos, vel, radius, mass ) {
  this.id = id;
  this.acc = { x: 0, y: 0 };
  this.pos = pos;
  this.vel = vel;
  this.radius = radius;
  this.mass = mass;
}

Particle.prototype.calculateForces = function ( forces ) {
  var
    totalaccX = 0,
    totalaccY = 0;

  for ( var i = 0, len = forces.length; i < len; i++ ) {
    // inlining what should be Vector object methods for performance reasons
    var
      force   = forces[i],
      vectorX = force.pos.x - this.pos.x,
      vectorY = force.pos.y - this.pos.y,
      force   = force.mass / Math.pow((vectorX * vectorX + force.mass / 2 + vectorY * vectorY + force.mass / 2), 1.5);
    totalaccX += vectorX * force;
    totalaccY += vectorY * force;
  }
  this.acc = {
    x: totalaccX,
    y: totalaccY
  };
  // console.log( this.acc );
};

Particle.prototype.update = function () {
  this.vel.x += this.acc.x;
  this.vel.y += this.acc.y;
  this.pos.x += this.vel.x;
  this.pos.y += this.vel.y;
};

$(document).ready(function() {
  // La magia aquí!

  // Inicializamos el canvas
  cz1 = new Canvaz('#cnvz');
  cz1.fullScreen();

  var
    center,
    pulse;

  // HSL
  var
    palette = [
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
    gV.cx = cz1.center.x;
    gV.cy = cz1.center.y;
    for (var i = 0, len = gV.num_particles; i < len; i++) {
      particles.push(
        new Particle(
          i, // Numeric id
          randomPointInsideCircle(gV.cx, gV.cy, Math.max(cz1.w, cz1.h) / 2 * 0.8)
          /*
          {
            x: parseInt( Math.random() * cz1.w, 10 ),
            y: parseInt( Math.random() * cz1.h, 10 )
          }*/,
          {
            x: Math.random() * 2 - 1,
            y: Math.random() * 2 - 1
          },
          gV.particle_radius, // Radius
          100000 // Mass
        )
      );
    }

    // Center force
    center = new Particle(
      'A',
      {
        x: gV.cx,
        y: gV.cy
      },
      {
        x: 0,
        y: 0
      },
      180000, // Radius
      20000
    );

    // Center force
    pulse = new Particle(
      'A',
      {
        x: gV.cx,
        y: gV.cy
      },
      {
        x: 0,
        y: 0
      },
      2000, // Radius
      800
    );

  };

  cz1.beforeDraw = function() {
    this.clear(); // Clear stage
  };

  cz1.draw = function() {
    cz1.sS = '#666';
    cz1.fS = '#f00';

    var
      temp_forces = [];

    temp_forces.push( center );
    if (gV.is_mouse_down && temp_forces.length < 2 ) {
      console.log(temp_forces.length);
      temp_forces.push(pulse);
    }

    for (var i = 0, len = particles.length; i < len; i++) {
      var
        p1 = particles[i];

      if (p1.pos.x < 0 || p1.pos.x > cz1.w || p1.pos.y < 0 || p1.pos.y > cz1.h) {
        console.log('outside');
        p1.pos.x = 10;
        p1.pos.y = 10;
        p1.acc.x = 0;
        p1.acc.y = 0;
        p1.vel.x = 0;
        p1.vel.y = 0;
      };

      cz1.fS = '#f00';
      for (var j = 0; j < len; j++) {
        if ( i !== j ) {
          var
            p2 = particles[j],
            dx = p2.pos.x - p1.pos.x,
            dy = p2.pos.y - p1.pos.y,
            d = utilz.dist( p1.pos.x, p1.pos.y, p2.pos.x, p2.pos.y );
          if ( d < gV.particle_radius * 2 ) {
            var
            normalX = dx / d,
            normalY = dy / d,
            midpointX = (p1.pos.x + p2.pos.x) / 2,
            midpointY = (p1.pos.y + p2.pos.y) / 2;

            p1.pos.x = midpointX - normalX * p1.radius;
            p1.pos.y = midpointY - normalY * p1.radius;
            p2.pos.x = midpointX + normalX * p2.radius;
            p2.pos.y = midpointY + normalY * p2.radius;

            var
              dVector = ( p1.vel.x - p2.vel.x ) * normalX;
            dVector += (p1.vel.y - p2.vel.y) * normalY;

            var dvx = dVector * normalX;
            var dvy = dVector * normalY;
            p1.vel.x -= dvx;
            p1.vel.y -= dvy;
            p1.vel.x *= 0.9;
            p1.vel.y *= 0.9;
            cz1.fS = '#fff';
          }
        }
      }

      // temp_forces = particles.slice(0);
      // temp_forces.splice(i, 1);
      p1.update();
      p1.calculateForces(temp_forces);
      cz1.plot( p1.pos.x, p1.pos.y, p1.radius );
    }

  };

  cz1.start();

});

$(document)
.on('mousedown touchstart',function(e) {
  gV.is_mouse_down = true;
})
.on('mouseup touchend', function (e) {
  gV.is_mouse_down = false;
});

