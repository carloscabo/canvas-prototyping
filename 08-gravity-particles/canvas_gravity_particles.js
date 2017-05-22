'use strict';

/* Global vars */
var gV = {
  particle_radius: 18,
  cx: 0,
  cy: 0,
  num_particles: 30
},
cz1, // Canvas
particles = []; // Particles array

function rotate(x, y, sin, cos, reverse) {
  return {
    x: (reverse) ? (x * cos + y * sin) : (x * cos - y * sin),
    y: (reverse) ? (y * cos - x * sin) : (y * cos + x * sin)
  };
}

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
    center;

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
          randomPointInsideCircle(gV.cx, gV.cy, cz1.w / 2 * 0.8)
          /*
          {
            x: parseInt( Math.random() * cz1.w, 10 ),
            y: parseInt( Math.random() * cz1.h, 10 )
          }*/,
          {
            x: 0,
            y: 0
          },
          gV.particle_radius, // Radius
          1 // Mass
        )
      );
    }

    // Center force
    center = new Particle(
      -1,
      {
        x: gV.cx,
        y: gV.cy
      },
      {
        x: 0,
        y: 0
      },
      10, // Radius
      1000
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

    for (var i = 0, len = particles.length; i < len; i++) {
      var
        p = particles[i];

      // temp_forces = particles.slice(0);
      // temp_forces.splice(i, 1);

      cz1.fS = '#f00';
      for (var j = 0; j < len; j++) {
        if ( i !== j ) {
          var
            p_target = particles[j],
            d = utilz.dist( p.pos.x, p.pos.y, p_target.pos.x, p_target.pos.y );
          if ( d < gV.particle_radius * 2 ) {
            var
              dx = p.pos.x - p_target.pos.x,
              dy = p.pos.y - p_target.pos.y,
              normalX = dx / d,
              normalY = dy / d,
              midpointX = (p.pos.x + p_target.pos.x) / 2,
              midpointY = (p.pos.y + p_target.pos.y) / 2;

            p.pos.x = midpointX - normalX * p.radius;
            p.pos.y = midpointY - normalY * p.radius;
            p_target.x = midpointX + normalX * p_target.radius;
            p_target.y = midpointY + normalY * p_target.radius;

            var
              dVector = (p.vel.x - p_target.vel.x) * normalX;

            dVector += (p.vel.y - p_target.vel.y) * normalY;

            var
              dvx = dVector * normalX,
              dvy = dVector * normalY;
            p.vel.x -= dvx;
            p.vel.y -= dvy;
            p_target.vel.x += dvx;
            p_target.vel.y += dvy;

            cz1.fS = '#fff';
          }
        }
      }

      p.calculateForces( temp_forces );
      p.update();
      cz1.plot( p.pos.x, p.pos.y, p.radius );
    }

  };

  cz1.start();

});



