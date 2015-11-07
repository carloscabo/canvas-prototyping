/*
 * JS Easing Functions considering only the time (t)
 * t value for the range [0, 1] => [0, 1]
 *
 * Any speed improvement will be great aprettiated!
 *
 * Based in the work of many others
 * http://gizma.com/easing/
 * https://github.com/CharlotteGore/functional-easing
 *
 * Carlos Cabo (@putuko) 2015 V.1.00
 * https://github.com/carloscabo/eaze-js
 */

eaze = {
  // No easing, no acceleration
  linear: function (t) { return t; },
  lineal: function (t) { return t; }, // Alias
  // IN => Accelerating from zero velocity
  in: {
    quad:  function (t) { return t*t; },
    cubic: function (t) { return t*t*t; },
    quart: function (t) { return t*t*t*t; },
    quint: function (t) { return t*t*t*t*t; },
    circ:  function (t) { return Math.sqrt(1-t*t)-1; },
    sine:  function (t) { return -1*Math.cos(t*(Math.PI/2))+1; },
    back:  function (t, overshoot) {
      if (!overshoot && overshoot !== 0) {
        overshoot = 1.70158;
      }
      return 1*t*t*((overshoot+1)*t-overshoot);
    },
    bounce: function (t) { return 1-eaze.out.bounce(1-t); },
    elastic: function (t, amplitude, period) {
      var offset;
      // escape early for 0 and 1
      if (t === 0 || t === 1) { return t; }
      if (!period) { period = 0.3; }
      if (!amplitude){
        amplitude = 1;
        offset = period/4;
      } else {
        offset = period/(Math.PI*2.0)*Math.asin(1/amplitude);
      }
      t=t-1;
      return -(amplitude*Math.pow(2,10*t)*Math.sin(((t-offset)*(Math.PI*2))/period));
    },
  },
  // OUT => Decelerating to zero velocity
  out: {
    quad:  function (t) { return t*(2-t); },
    cubic: function (t) { return (--t)*t*t+1; },
    quart: function (t) { return 1-(--t)*t*t*t; },
    quint: function (t) { return 1+(--t)*t*t*t*t; },
    circ:  function (t) { return Math.sqrt(1-(--t)*t); },
    sine:  function (t) { return Math.sin(t*(Math.PI/2)); },
    back:  function (t, overshoot) {
      if(!overshoot && overshoot !== 0) {
        overshoot = 1.70158;
      }
      t=t-1;
      return t*t*((overshoot+1)*t+overshoot)+1;
    },
    bounce: function (t) {
      if (t < 0.36363636363636365) {
        return 7.5625*t*t;
      } else if (t < 0.7272727272727273) {
        t = t - 0.5454545454545454;
        return 7.5625*t*t+0.75;
      } else if (t < 0.9090909090909091) {
        t = t - 0.8181818181818182;
        return 7.5625*t*t+0.9375;
      } else {
        t = t - 0.9545454545454546;
        return 7.5625*t*t+0.984375;
      }
    },
    elastic: function (t, amplitude, period){
      var offset;
      // escape early for 0 and 1
      if (t === 0 || t === 1) { return t; }
      if (!period) { period = 0.3; }
      if (!amplitude) {
        amplitude = 1;
        offset = period/4;
      } else {
        offset = period/(Math.PI*2.0)*Math.asin(1/amplitude);
      }
      return amplitude*Math.pow(2,-10*t)*Math.sin((t-offset)*(Math.PI*2)/period)+1;
    },
  },
  // IN_OUT => Acceleration until halfway, then deceleration
  in_out: {
    quad:  function (t) { return t<.5 ? 2*t*t : -1+(4-2*t)*t; },
    cubic: function (t) { return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1; },
    quart: function (t) { return t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t; },
    quint: function (t) { return t<.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t; },
    circ:  function (t) { t=t/2; return (Math.sqrt(1-t*t)-1)/-2; },
    sine:  function (t) { return (Math.cos(Math.PI*t)-1)/-2; },
    back:  function (t, overshoot) {
      if(!overshoot && overshoot !== 0){
        overshoot = 1.70158;
      }
      t = t / 2;
      overshoot = overshoot * 1.525;
      return (t * t * ((overshoot + 1) * t - overshoot)) / 2;
    },
    bounce: function (t) {
      if (t < 0.5){
        return eaze.in.bounce(t*2)*0.5;
      }
      return eaze.out.bounce(t*2-1)*0.5+1* 0.5;
    },
    elastic: function (t, amplitude, period) {
      var offset;
      t = (t/2)-1;
      // escape early for 0 and 1
      if (t === 0 || t === 1) { return t; }
      if (!period){ period = 0.44999999999999996; }
      if (!amplitude){
        amplitude = 1;
        offset = period/4;
      } else {
        offset = period/(Math.PI*2.0)*Math.asin(1/amplitude);
      }
      return (amplitude*Math.pow(2,10*t)*Math.sin((t-offset)*(Math.PI*2)/period))/-2;
    }
  }
}
