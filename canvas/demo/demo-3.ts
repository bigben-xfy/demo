/**
 * 数学拾取方案
 */
import { vec2 } from 'gl-matrix';
import Ticker from '../utils/ticker';
import Stats from 'stats.js';
import { isInPolygon, createRandomPolygon } from '../utils/math';

class Polygon {
  vertices: vec2[] = [];
  selected = false;
  fill = 'blue';
  activeFill = 'red';

  constructor(vertices: vec2[] = []) {
    this.vertices = vertices;
  }

  draw(context: CanvasRenderingContext2D) {
    const leng = this.vertices.length;
    if (leng < 3) return;
    context.beginPath();
    for (let i = 0; i < leng; i++) {
      const p = this.vertices[i];
      if (i === 0) {
        context.moveTo(p[0], p[1]);
      } else {
        context.lineTo(p[0], p[1]);
      }
    }
    context.closePath();
    context.fillStyle = this.selected ? this.activeFill : this.fill;
    context.fill();
  }

  isPointIn(p: vec2) {
    return isInPolygon(this.vertices, p);
  }
}

class Scene {
  canvas = document.createElement('canvas');
  context: CanvasRenderingContext2D;
  children: Polygon[] = [];

  constructor() {
    this.canvas.width = 800;
    this.canvas.height = 600;
    this.context = this.canvas.getContext('2d');
  }

  render() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.children.forEach((child) => {
      child.draw(this.context);
    });
  }

  /**
   * 返回被拾取元素索引
   * @param x
   * @param y
   * @returns
   */
  hitTest(x: number, y: number) {
    const leng = this.children.length;
    const p = vec2.fromValues(x, y);
    for (let i = leng - 1; i >= 0; i--) {
      const child = this.children[i];
      if (child.isPointIn(p)) {
        return i;
      }
    }
    return -1;
  }
}

const scene = new Scene();
const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);
document.body.appendChild(scene.canvas);

scene.children.push(
  new Polygon([
    vec2.fromValues(100, 100),
    vec2.fromValues(200, 100),
    vec2.fromValues(200, 200),
    vec2.fromValues(100, 200),
  ]),
  new Polygon([
    vec2.fromValues(300, 100),
    vec2.fromValues(400, 100),
    vec2.fromValues(400, 200),
  ]),
  new Polygon([
    vec2.fromValues(500, 100),
    vec2.fromValues(550, 100),
    vec2.fromValues(550, 150),
    vec2.fromValues(600, 150),
    vec2.fromValues(600, 100),
    vec2.fromValues(650, 100),
    vec2.fromValues(650, 200),
    vec2.fromValues(500, 200),
  ]),
  new Polygon([
    vec2.fromValues(200, 300),
    vec2.fromValues(300, 400),
    vec2.fromValues(250, 390),
    vec2.fromValues(280, 460),
    vec2.fromValues(180, 410),
    vec2.fromValues(100, 470),
    vec2.fromValues(141, 399),
    vec2.fromValues(211, 344),
  ])
);

for (let i = 0; i < 10; i++) {
  scene.children.push(new Polygon(createRandomPolygon(400, 300)));
}

new Ticker().add(() => {
  stats.begin();
  scene.render();
  stats.end();
});

let target: Polygon = null;
scene.canvas.addEventListener('mousemove', (e) => {
  if (target) {
    target.selected = false;
  }
  const { clientX, clientY } = e;
  console.time('hitTest');
  const index = scene.hitTest(clientX, clientY);
  console.timeEnd('hitTest');
  if (index > -1) {
    target = scene.children[index];
    target.selected = true;
  }
});

export default null;
