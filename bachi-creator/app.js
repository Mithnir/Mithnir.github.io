var BACHI_PREVIEW;
var b;
console.log(window.screen.width);
console.log(window.devicePixelRatio);


function derivative(f) {
  let h = 0.001;
  return function(x) { return (f(x + h) - f(x - h)) / (2 * h); };
}


var newtonPrevGuess = 0;


// will be in loop lock if no 0 intersect
// needs difference check
function newtonsMethod(fn, guess) {
  if (guess === null || guess === undefined) {
    guess = 0;
  }

  let precision = 0.001;
  console.log(guess);

  if (Math.abs(newtonPrevGuess - guess) > precision) {
    newtonPrevGuess = guess;
    let approx = guess - (fn(guess) / derivative(fn)(guess));

    return newtonsMethod(fn, approx);
  } else {
      return guess;
  }
}


class CutGuide {
  constructor(params) {
    
  }
}


class Bachi {
  constructor(preview_element, length, radius, curve_length, sharpness, curvature) {
    this.preview_element = preview_element;
    this.preview_path = this.preview_element.querySelector("#bachi-preview-path");
    this.cog_dot = this.preview_element.querySelector("#bachi-cog");
    this.center = this.preview_element.querySelector('#bachi-center');
    this.point = this.preview_element.querySelector('#bachi-point');
    
    this.change({
      length: length,
      radius: radius,
      curve_length: curve_length,
      sharpness: sharpness,
      curvature: curvature
    });
    
    this.grip_length;
    this.center_of_gravity;
    this.update();
  }

  change(params) {
    Object.entries(params).forEach(([k, v]) => {
      this[k] = parseFloat(v);
    });
  }

  getCoG() {
    let n0 = (this.length - this.curve_length);  // grip half area
    let n1 = -this.curve_length*((3*this.curvature - 6)*this.sharpness - 6*this.curvature - 10)*0.05;  // constrained bezier curve half area
    
    this.center_of_gravity = (n0 + n1) * 0.5;  // average area = center of gravity
    this.cog_dot.setAttribute('cx', this.center_of_gravity);
    return this.center_of_gravity;
  }

  // get curve tangent intersect point
  getSlopeThroughPoint(x, y) {

    let f = function(t0) {
      // let x0 = 3*t*(1-t)*(1-t)*this.curvature*this.curve_length+3*t*t*(1-t)*this.curve_length+t*t*t*this.curve_length;
      // let y0 = (1-t)*(1-t)*(1-t)*this.radius + 3*t*(1-t)*(1-t)*this.radius+3*t*t*(1-5)*this.sharpness*this.radius;

      let t1 = t0*t0;
      let t2 = t1*t0;
      
      let i0 = 1-t0;
      let i1 = i0*i0;
      let i2 = i1*i0;

      let fx = function(x) { return this.curve_length*(t2 + 3*(t1*i0 + t0*i1*this.curvature)) + l0 };
      let fy = function(x) { return this.radius*(1 - i2 - 3*(t0*i1 + t1*i0*this.sharpness)) };

      let dfx = derivative(fx);
      let dfy = derivative(fy);

      let m1 = dfx(t0)/dfy(t0);
      let m2 = (x-fx(t0))/(y-fy(t0));

      return m1 - m2;

    }

    let m0 = newtonsMethod(0);
    // 0:0.5 = flat
    // 0.5:1 = curve
    // let dt = 2*t;
    // let l0 = this.length - this.curve_length;
    // if (t <= 0.5) {
    //   return {x: dt*l0, y: 0}
    // } else {
    //   let t0 = dt-1;
    //   let t1 = t0*t0;
    //   let t2 = t1*t0;
    //   let i0 = 1-t0;
    //   let i1 = i0*i0;
    //   let i2 = i1*i0;
    //   let x0 = this.curve_length*(t2 + 3*(t1*i0 + t0*i1*this.curvature)) + l0;
    //   let y0 = this.radius*(1 - i2 - 3*(t0*i1 + t1*i0*this.sharpness));
    //   return {x: x0, y: y0}
    // }
  }

  update() {

    let n0 = this.length - this.curve_length;
    let n1 = n0 + this.curve_length*this.curvature;
    let n2 = this.radius*(1 + this.sharpness);
    let n3 = 2*this.radius;

    let template = `M0 0 L0 ${n3} L${n0} ${n3} C${n1} ${n3}, ${this.length} ${n2}, ${this.length} ${this.radius} S${n1} 0, ${n0} 0 Z`;
    // M0 0 L0 r Ln0 r C${1 + curve} 2, 2 ${1 + sharpness}, 2 1 S${1 + curve} 0, 1 0 Z

    let aspect = `-.25 -.25 ${this.length+2} ${n3}`;
    this.preview_element.setAttribute('viewBox', aspect);
    this.preview_path.setAttribute('d', template);
    this.cog_dot.setAttribute('cy', this.radius);
    this.center.setAttribute('cx', this.length * 0.5);
  }
}


function updateBachi(el) {
  let n = el.getAttribute('name');
  let l = {};
  l[n] = el.value;
  b.change(l);
  b.getCoG();
  b.update();
}


// function updatePoint(el) {
//   let v = parseFloat(el.value);
//   // console.log(v);
//   let p0 = b.getPoint(v);
//   // console.log(p0);
//   b.point.setAttribute('cx', p0.x);
//   b.point.setAttribute('cy', p0.y);
  
// }


window.onload = () => {
  BACHI_PREVIEW = document.getElementById("bachi-preview");

  let sharp = 0.552284749831;
  let curve = 0.552284749831;

  b = new Bachi(BACHI_PREVIEW, 36, 1, 18, sharp, curve);
  b.change({a: "test"});
}