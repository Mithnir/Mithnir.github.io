var BACHI_PREVIEW;
var b;
console.log(window.screen.width);
console.log(window.devicePixelRatio);


class Bachi {
  constructor(preview_element, length, radius, curve_length, sharpness, curvature) {
    this.preview_element = preview_element;
    this.preview_path = this.preview_element.querySelector("#bachi-preview-path");
    this.cog_dot = this.preview_element.querySelector("#bachi-cog");
    this.center = this.preview_element.querySelector('#bachi-center');
    
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

  update() {

    let n0 = this.length - this.curve_length;
    let n1 = n0 + this.curve_length*this.curvature;
    let n2 = this.radius*(1 + this.sharpness);
    let n3 = 2*this.radius;

    let template = `M0 0 L0 ${n3} L${n0} ${n3} C${n1} ${n3}, ${this.length} ${n2}, ${this.length} ${this.radius} S${n1} 0, ${n0} 0 Z`;
    // M0 0 L0 r Ln0 r C${1 + curve} 2, 2 ${1 + sharpness}, 2 1 S${1 + curve} 0, 1 0 Z

    let aspect = `0 0 ${this.length} ${n3}`;
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


window.onload = () => {
  BACHI_PREVIEW = document.getElementById("bachi-preview");

  let sharp = 0.552284749831;
  let curve = 0.552284749831;

  b = new Bachi(BACHI_PREVIEW, 36, 1, 18, sharp, curve);
  b.change({a: "test"});
}