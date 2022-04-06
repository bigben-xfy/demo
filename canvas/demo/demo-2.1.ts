import { vec2 } from 'gl-matrix';
import Ticker from '../utils/ticker';
import Stats from 'stats.js';
import { isBboxIntersect, mergeBbox, Bbox, isInCircle } from '../utils/math';

class Ball {
  position = vec2.create();
  radius = 25;
  fill = 'blue';
  activeFill = 'red';
  offscreenCanvas = document.createElement('canvas');
  selected = false;

  get bbox() {
    const [x, y] = this.position;
    const d = this.radius * 2;
    return {
      x: x - this.radius,
      y: y - this.radius,
      w: d,
      h: d,
    };
  }

  constructor(x = 0, y = 0) {
    vec2.set(this.position, x, y);
  }

  draw(context: CanvasRenderingContext2D) {
    const [x, y] = this.position;
    context.beginPath();
    context.arc(x, y, this.radius, 0, Math.PI * 2);
    const gradient = context.createRadialGradient(
      x + 5,
      y - 5,
      this.radius * 0.25,
      x,
      y,
      this.radius
    );
    gradient.addColorStop(0, 'white');
    gradient.addColorStop(1, this.selected ? this.activeFill : this.fill);
    context.fillStyle = gradient;
    context.fill();
  }

  isPointIn(point: vec2) {
    return isInCircle(this.position, this.radius, point);
  }

  translate(x: number, y: number) {
    this.position[0] += x;
    this.position[1] += y;
    return this;
  }
}

class Scene {
  canvas = document.createElement('canvas');
  context: CanvasRenderingContext2D;
  children: Ball[] = [];
  // 需求重绘的区域
  repaintRect: Bbox = null;

  constructor() {
    this.canvas.width = 800;
    this.canvas.height = 600;
    this.context = this.canvas.getContext('2d');
    this.repaintRect = {
      x: 0,
      y: 0,
      w: 800,
      h: 600,
    };
  }

  render() {
    if (!this.repaintRect) return;
    let { x, y, w, h } = this.repaintRect;
    this.context.clearRect(x, y, w, h);
    this.context.save();
    this.context.beginPath();
    this.context.rect(x, y, w, h);
    this.context.clip();
    this.children.forEach((child) => {
      if (isBboxIntersect(this.repaintRect, child.bbox)) {
        child.draw(this.context);
      }
    });
    this.context.restore();
    this.repaintRect = null;
  }
}

const scene = new Scene();
const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);
document.body.appendChild(scene.canvas);

for (let i = 0; i < 3000; i++) {
  const { width, height } = scene.canvas;
  scene.children.push(
    new Ball(
      Math.round(Math.random() * width),
      Math.round(Math.random() * height)
    )
  );
}

new Ticker().add(() => {
  stats.begin();
  scene.render();
  stats.end();
});

let target: Ball = null;
scene.canvas.addEventListener('mousedown', (e) => {
  const { clientX, clientY } = e;
  const point = vec2.create();
  vec2.set(point, clientX, clientY);
  const leng = scene.children.length;
  for (let i = leng - 1; i >= 0; i--) {
    const ball = scene.children[i];
    if (ball.isPointIn(point)) {
      target = ball;
      ball.selected = true;

      scene.repaintRect = target.bbox;
      break;
    }
  }
});

document.addEventListener('mousemove', (e) => {
  if (!target) return;
  const { movementX, movementY } = e;
  const prevBbox = target.bbox;
  target.translate(movementX, movementY);
  const currBbox = target.bbox;
  let bbox = mergeBbox(prevBbox, currBbox);
  if (scene.repaintRect) {
    scene.repaintRect = mergeBbox(bbox, scene.repaintRect);
  } else {
    scene.repaintRect = bbox;
  }
});

document.addEventListener('mouseup', () => {
  if (!target) return;
  target.selected = false;

  scene.repaintRect = target.bbox;

  // end
  target = null;
});

export default null;
