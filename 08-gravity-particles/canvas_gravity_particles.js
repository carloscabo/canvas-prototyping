'use strict';

// #fae6ba rgb(250,230,186)   hsl(41,86%,85%)
// #006e84 rgb(0,110,132)     hsl(190,100%,26%)
// #83d9cf rgb(131, 217, 207) hsl(173, 53 %,68 %)
// #ffffff rgb(255, 255, 255) hsl(0, 0 %,100 %)
// #eb00db rgb(235, 0, 219)   hsl(304, 100 %,46 %)

var colors = [ // HSL
  [ 41,86,85],
  [ 190,100,26],
  [ 173, 53 ,68 ],
  [ 0, 0 ,100 ],
  [ 304, 100 ,46 ]
]

/* Global vars */
var gV = {
  particle_radius: 20,
  cx: 0,
  cy: 0,
  num_particles: 300,
  is_mouse_down: false
},
cz1, // Canvas
particles = []; // Particles array

function  applyForce() {
  var
    totalaccX = 0,
    totalaccY = 0;

  for (var i = 0, len = particles.length; i < len; i++) {
    var
      p = particles[i],
      distance = Math.sqrt(
        cz1.center.x * p.pos.x +
        cz1.center.y * p.pos.y
      ),
      forceDirection = {
        x: p.pos.x / distance,
        y: p.pos.y / distance
      },
      maxDistance = Math.max( cz1.w, cz1.h ),
      force = (maxDistance - distance) / maxDistance;

    if (force < 0) force = 0;

    p.vel.x += forceDirection.x * force * 100; // * timeElapsedSinceLastFrame;
    p.vel.y += forceDirection.y * force * 100; // * timeElapsedSinceLastFrame;
  }

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
  this.color = colors[Math.floor(Math.random() * colors.length)];
}

Particle.prototype.calculateForces = function ( forces ) {
  var
    totalaccX = 0,
    totalaccY = 0;

  for ( var i = 0, len = forces.length; i < len; i++ ) {
    // inlining what should be Vector object methods for performance reasons
    var
      f = forces[i],
      vectorX = forces[i].pos.x - this.pos.x,
      vectorY = forces[i].pos.y - this.pos.y,
      force = forces[i].mass / Math.pow((vectorX * vectorX + forces[i].mass / 2 + vectorY * vectorY + forces[i].mass / 2), 1.5);

    totalaccX += vectorX * force;
    totalaccY += vectorY * force;
  }
  this.acc.x = totalaccX;
  this.acc.y = totalaccY;
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
    particles = [];
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
          8 + Math.random() * gV.particle_radius, // Radius
          1 // Mass
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
      200000, // Radius
      10000000
    );

    // Center force
    pulse = new Particle(
      'B',
      {
        x: gV.cx,
        y: gV.cy
      },
      {
        x: 0,
        y: 0
      },
      800, // Radius
      -2000
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

      /*
      if (p1.pos.x < 0 || p1.pos.x > cz1.w || p1.pos.y < 0 || p1.pos.y > cz1.h) {
        console.log('outside');
        p1.pos.x = 10;
        p1.pos.y = 10;
        p1.acc.x = 0;
        p1.acc.y = 0;
        p1.vel.x = 0;
        p1.vel.y = 0;
      };
      */

      cz1.fS = 'hsl(' + p1.color[0] + ',' + p1.color[1] + '%,' + Math.floor(p1.color[2] * 0.8) + '%)';
      for (var j = 0; j < len; j++) {
        if ( i !== j ) {
          var
            p2 = particles[j],
            dx = p2.pos.x - p1.pos.x,
            dy = p2.pos.y - p1.pos.y,
            d = utilz.dist( p1.pos.x, p1.pos.y, p2.pos.x, p2.pos.y );
          if ( d < ( p1.radius + p2.radius ) ) {
            var
            normalX = dx / d,
            normalY = dy / d,
            // midpointX = (p1.pos.x + p2.pos.x) / 2, // Same size
            midpointX = (( p1.pos.x * p2.radius) + ( p2.pos.x * p1.radius)) / (p1.radius + p2.radius),
            midpointY = (( p1.pos.y * p2.radius) + ( p2.pos.y * p1.radius)) / (p1.radius + p2.radius);

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
            p1.vel.x *= 0.8;
            p1.vel.y *= 0.8;
            cz1.fS = 'hsl(' + p1.color[0] + ',' + p1.color[1] + '%,' + Math.floor(p1.color[2] * 1.0) + '%)';
          }
        }
      }

      // temp_forces = particles.slice(0);
      // temp_forces.splice(i, 1);
      p1.update();
      p1.calculateForces(temp_forces);
      cz1.plot( p1.pos.x, p1.pos.y, p1.radius - 2 );
    }

  };

  cz1.start();

});

$(document)
.on('click',function(e) {
  applyForce();
});

