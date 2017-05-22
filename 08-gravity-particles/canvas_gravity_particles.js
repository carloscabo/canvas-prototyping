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
function Particle ( id, position, velocity, radius, mass ) {
  this.id = id;
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
      100
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
            d = utilz.dist( p.position.x, p.position.y, p_target.position.x, p_target.position.y );
         if ( d < gV.particle_radius * 2 ) {
          var
            dx = p.position.x - p_target.position.x,
            dy = p.position.y - p_target.position.y,
            angle = Math.atan2(dy, dx),
            sin = Math.sin(angle),
            cos = Math.cos(angle),

            //rotate ball0's velocity
            vel0 = rotate(p.velocity.x, p.velocity.x, sin, cos, true),

            //rotate ball1's velocity
            vel1 = rotate(p_target.velocity.x, p_target.velocity.x, sin, cos, true),

            vxTotal = vel0.x - vel1.x,
            vyTotal = vel0.y - vel1.y;
            vel0.x = ((p.mass - p_target.mass) * vel0.x + 2 * p_target.mass * vel1.x) / (p.mass + p_target.mass);
            vel1.x = vxTotal + vel0.x;

            p.position.x += vel0.x;
            p_target.position.x += vel1.x;

            cz1.fS = '#fff';
          }
        }
      }

      p.calculateForces( temp_forces );
      p.update();
      cz1.plot( p.position.x, p.position.y, p.radius );
    }

  };

  cz1.start();

});



