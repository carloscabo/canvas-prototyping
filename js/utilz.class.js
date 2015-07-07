/**
* Utilz is a Javascript "library" to help in common
* mathematic oprations that I found usefull in my
* HTML5 / Canvas projects.
*
* by Carlos Cabo 2015 http://carloscabo.com
*
* Some formulas borrowed from Processing.js, wikipedia or other authors
*/

var utilz = utilz || {};

// Viewport size
utilz.w = document.documentElement.clientWidth;
utilz.h = document.documentElement.clientHeight;

// Read url vars
utilz.getUrlVars = function () {
  var vars = [], hash;
  var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
  for(var i = 0; i < hashes.length; i++) {
    hash = hashes[i].split('=');
    vars.push(hash[0]);
    vars[hash[0]] = hash[1];
  }
  return vars;
};

// Math utils

/**
 * Combines 2 integer numbers in a new integer. Can be reversed
 * var newNumber = utilz.cantorPair(123,789);
 * var originalNumbers = utilz.reverseCantorPair(newNumber);
 * @param  {[type]} x Integer number
 * @param  {[type]} y Integer number
 * @return {[type]}   Resulting integer
 */
utilz.cantorPair = function(x, y) {
  var z = ((x + y) * (x + y + 1)) / 2 + y;
  return z;
};

utilz.reverseCantorPair = function(z) {
  var pair = [];
  var t = Math.floor((-1 + Math.sqrt(1 + 8 * z))/2);
  var x = t * (t + 3) / 2 - z;
  var y = z - t * (t + 1) / 2;
  pair[0] = x;
  pair[1] = y;
  return pair;
};

/**
 * Radians to Degrees and back
 * @param  {[type]} rad [description]
 * @return {[type]}     [description]
 */
utilz.radToDeg = function (rad) {
  return rad * (180 / Math.PI);
}
utilz.degToRad = function (deg) {
  return deg * (Math.PI / 180);
}

/**
 * Calculates a number between two numbers at a specific increment.
 * The amt parameter is the amount to interpolate between the two
 * values where 0.0 equal to the first point, 0.1 is very near the
 * first point, 0.5 is half-way in between, etc.
 * The lerp function is convenient for creating motion along a
 * straight path and for drawing dotted lines.
 * @param  {[type]} value1 [description]
 * @param  {[type]} value2 [description]
 * @param  {[type]} amt    [description]
 * @return {[type]}        [description]
 */
utilz.lerp = function(value1, value2, amt) {
  return value1 + (value2 - value1) * amt;
};

/**
 * Interpolates between 2 angles, from 0 to 360 degrees.
 * @param  {[type]} ang1    [description]
 * @param  {[type]} ang2    [description]
 * @param  {[type]} percent [description]
 * @return {[type]}         [description]
 */
utilz.angleLerp = function (ang1, ang2, percent) {
  var ret;
  var diff = Math.abs(ang2 - ang1);
  if (diff > 180) {
    if(ang2 > ang1) {
      ang1 += 360;
    } else {
      ang2 += 360;
    }
  }
  // Interpolacion
  ret = (ang1 + ((ang2 - ang1) * percent));
  if (ret < 0 || ret > 360) {
    ret = ret % 360;
  }
  return ret;
};

utilz.angleLerpAlt = function (ang1, ang2, percent) {
  var rad1 = matz.degToRad(ang1);
  var rad2 = matz.degToRad(ang2);
  return matz.radToDeg(matz.lerp(rad1, rad2, percent));
};

// Interpolate HSL color

utilz.hslLerp = function(hsl1, hsl2, percent) {
  var
    h1 = hsl1[0],
    s1 = hsl1[1],
    l1 = hsl1[2],
    h2 = hsl2[0],
    s2 = hsl2[1],
    l2 = hsl2[2],
    result = [],
    precision = 2;

  result[0] = this.angleLerp(h1, h2, percent);
  result[1] = this.lerp(s1, s2, percent);
  result[2] = this.lerp(l1, l2, percent);

  return result;
}

// Normalization utils

/**
 * Normalizes a number from another range into a value between 0 and 1.
 * @param  {[type]} aNumber [description]
 * @param  {[type]} low     [description]
 * @param  {[type]} high    [description]
 * @return {[type]}         [description]
 */
utilz.norm = function (aNumber, low, high) {
    return (aNumber - low) / (high - low);
};
utilz.norm01 = utilz.norm; // Alias for the function

// Inverse normaliztion between 1 and 0
utilz.norm10 = function (aNumber, low, high) {
    return Math.abs(((aNumber - low) / (high - low))-1);
};

utilz.norm101 = function (aNumber, low, high) {
  return Math.abs(((aNumber - low) / (high - low))-0.5)*2;
};

utilz.norm010 = function (aNumber, low, high) {
  return Math.abs((Math.abs(((aNumber - low) / (high - low))-0.5)*2)-1);
};

/**
 * Re-maps a number from one range to another. In the example above,
 * the number '25' is converted from a value in the range 0..100 into a value that ranges from
 * the left edge (0) to the right edge (width) of the screen.
 * @param  {[type]} value  [description]
 * @param  {[type]} origin_min [description]
 * @param  {[type]} origin_max [description]
 * @param  {[type]} dest_min   [description]
 * @param  {[type]} dest_max   [description]
 * @return {[type]}            Resulting value
 */
utilz.map = function (value, origin_min, origin_max, dest_min, dest_max) {
  return dest_min + (dest_max - dest_min) * ((value - origin_min) / (origin_max- origin_min));
};

/**
 * Calculates the distance between two points. (2D / 3D)
 * @return {[type]} [description]
 */
utilz.dist = function() {
  var dx, dy, dz;
  if (arguments.length === 4) {
    dx = arguments[0] - arguments[2];
    dy = arguments[1] - arguments[3];
    return Math.sqrt(dx * dx + dy * dy);
  }
  if (arguments.length === 6) {
    dx = arguments[0] - arguments[3];
    dy = arguments[1] - arguments[4];
    dz = arguments[2] - arguments[5];
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }
};

// Duplicates an object
utilz.cloneObject = function(source) {
  for (var i in source) {
    if (typeof source[i] == 'source') {
      this[i] = new cloneObject(source[i]);
    } else{
      this[i] = source[i];
    }
  }
}

/**
 * Get random integer in a interval
 * @param  {[type]} min [description]
 * @param  {[type]} max [description]
 * @return {[type]}     [description]
 */
utilz.randomInt = function(min, max) {
  return Math.floor(Math.random()*(max-min+1)+min);
};

/**
 * Get random float in a interval
 * @param  {[type]} min [description]
 * @param  {[type]} max [description]
 * @return {[type]}     [description]
 */
utilz.randomFloat = function (min, max) {
  if (min == max) {
    return min;
  } else {
    return Math.random() * (max - min) + min;
  }
};

/**
 * Comprueba la existencia de un valor en un array
 * console.log(["foo", "bar", "test"].exists("foo"));
 * @param  {[type]} search [description]
 * @return {[type]}        [description]
 */
Array.prototype.exists = function(search){
  for (var i=0; i<this.length; i++)
    if (this[i] == search) return true;
  return false;
};

