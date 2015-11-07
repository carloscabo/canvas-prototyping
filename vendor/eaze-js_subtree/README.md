# eaze-js
Time (t) based JS easing functions (cubic, quad, quint, circ...)

## available functions

````javascript
eaze.linear(t);
eaze.lineal(t); // Alias to linear
eaze.in.quad(t);
eaze.in.cubic(t);
eaze.in.quart(t);
eaze.in.quint(t);
eaze.in.circ(t);
eaze.in.sine(t);
eaze.in.back(t);
eaze.in.bounce(t);
eaze.in.elastic(t, amplitude, period);
eaze.out.quad(t);
eaze.out.cubic(t);
eaze.out.quart(t);
eaze.out.quint(t);
eaze.out.circ(t);
eaze.out.sine(t);
eaze.out.back(t);
eaze.out.bounce(t);
eaze.out.elastic(t, amplitude, period);
eaze.in_out.quad(t);
eaze.in_out.cubic(t);
eaze.in_out.quart(t);
eaze.in_out.quint(t);
eaze.in_out.circ(t);
eaze.in_out.sine(t);
eaze.in_out.back(t);
eaze.in_out.bounce(t);
eaze.in_out.elastic(t, amplitude, period);
````

## usage

````javascript
  // t valur must be in the [0-1] range
  // result valuest in the [0-1] range too
  var r1 = eaze.in.quad(t);
  var r2 = eaze.out.quad(t);
  var r3 = eaze.in_out.quad(t);
  //...
````

## TO-DO
- Add tests
- Write a why this explanation with references
- Add interactive sample
