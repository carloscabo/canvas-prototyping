'use strict';

/* Global vars */
var gV = {
  force_radius: 4,
  cx: 0,
  cy: 0,
  num_particles: 30
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
function Particle ( position, velocity, radius, mass ) {
  this.acceleration = { x: 0, y: 0 };
  this.position = position;
  this.velocity = velocity;
  this.radius = radius;
  this.mass = mass;
}

Particle.prototype.calculateForces = function ( forces ) {
  var
    totalAccelerationX = 0,
    totalAccelerationY = 0;

  for ( var i = 0, len = forces.length; i < len; i++ ) {
    // inlining what should be Vector object methods for performance reasons
    var
      force   = forces[i],
      vectorX = force.position.x - this.position.x,
      vectorY = force.position.y - this.position.y,
      force   = force.mass / Math.pow((vectorX * vectorX + force.mass / 2 + vectorY * vectorY + force.mass / 2), 1.5);
    totalAccelerationX += vectorX * force;
    totalAccelerationY += vectorY * force;
  }
  this.acceleration = {
    x: totalAccelerationX,
    y: totalAccelerationY
  };
  // console.log( this.acceleration );
};

Particle.prototype.update = function () {
  this.velocity.x += this.acceleration.x;
  this.velocity.y += this.acceleration.y;
  this.position.x += this.velocity.x;
  this.position.y += this.velocity.y;
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
          18, // Radius
          1 // Mass
        )
      );
    }

    // Center force
    center = new Particle(
      {
        x: gV.cx,
        y: gV.cy
      },
      {
        x: 0,
        y: 0
      },
      10, // Radius
      10000000
    );

  };

  cz1.beforeDraw = function() {
    this.clear(); // Clear stage
  };

  cz1.draw = function() {
    cz1.sS = '#666';
    cz1.fS = '#f00';

    for (var i = 0, len = particles.length; i < len; i++) {
      var
        p = particles[i],
        temp_forces = [];

      // temp_forces = particles.slice(0);
      // temp_forces.splice(i, 1);
      temp_forces.push( center );

      p.calculateForces( temp_forces );
      p.update();
      cz1.plot( p.position.x, p.position.y, p.radius );
    }

  };

  cz1.start();

});



