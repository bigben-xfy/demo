import { vec2 } from 'gl-matrix';

export interface Bbox {
  x: number;
  y: number;
  w: number;
  h: number;
}

/**
 * 判断包围盒是否相交
 * @param a
 * @param b
 */
export function isBboxIntersect(a: Bbox, b: Bbox) {
  // a
  const aXMin = a.x;
  const aYMin = a.y;
  const aXMax = a.x + a.w;
  const aYMax = a.y + a.h;
  // b
  const bXMin = b.x;
  const bYMin = b.y;
  const bXMax = b.x + b.w;
  const bYMax = b.y + b.h;
  return !(aXMax < bXMin || aXMin > bXMax || aYMax < bYMin || aYMin > bYMax);
}

/**
 * 合并包围盒
 * @param a
 * @param b
 */
export function mergeBbox(a: Bbox, b: Bbox) {
  // a
  const aXMin = a.x;
  const aYMin = a.y;
  const aXMax = a.x + a.w;
  const aYMax = a.y + a.h;
  // b
  const bXMin = b.x;
  const bYMin = b.y;
  const bXMax = b.x + b.w;
  const bYMax = b.y + b.h;

  const xMin = Math.min(aXMin, bXMin);
  const yMin = Math.min(aYMin, bYMin);
  const xMax = Math.max(aXMax, bXMax);
  const yMax = Math.max(aYMax, bYMax);
  return {
    x: xMin,
    y: yMin,
    w: xMax - xMin,
    h: yMax - yMin,
  };
}

/**
 * 判断是否在包围盒内
 * @param bbox
 * @param px
 * @param py
 */
export function isInBbox(bbox: Bbox, px: number, py: number) {
  const { x, y, w, h } = bbox;
  return x <= px && px <= x + w && y <= py && py <= y + h;
}

/**
 * 判断点是否在线段上
 * @param a
 * @param b
 * @param p
 * @returns
 */
export function onSegment(a: vec2, b: vec2, p: vec2) {
  return (
    vec2.distance(a, p) + vec2.distance(b, p) - vec2.distance(a, b) <= 1e-6
  );
}

/**
 * 判断点是否在多边形内
 * @param vertices
 * @param p
 * @returns
 */
export function isInPolygon(vertices: vec2[], p: vec2) {
  let flag = false;
  const leng = vertices.length;
  if (leng < 3) return false;
  for (let i = 0; i < leng; i++) {
    const p1 = vertices[i];
    const p2 = vertices[(i + 1) % leng];
    // 如果点在边上，直接判定为true
    if (onSegment(p1, p2, p)) return true;
    // 先排除边与射线平行、边在射线上方、边在射线下方、边的下端点在射线上
    if (p1[1] > p[1] !== p2[1] > p[1]) {
      if (
        p[0] <=
        p1[0] - ((p1[0] - p2[0]) / (p1[1] - p2[1])) * (p1[1] - p[1])
      ) {
        flag = !flag;
      }
    }
  }
  return flag;
}

/**
 * 判断点是否在圆内
 * @param o 圆心坐标
 * @param r 圆的半径
 * @param p 检测点坐标
 * @returns
 */
export function isInCircle(o: vec2, r: number, p: vec2) {
  return vec2.distance(o, p) <= r;
}

/**
 * 判断点是否在椭圆内
 * @param o 椭圆中心坐标
 * @param radiusX 横轴半径
 * @param radiusY 纵轴半径
 * @param p 监测点坐标
 * @returns
 */
export function isInEllipse(
  o: vec2,
  radiusX: number,
  radiusY: number,
  p: vec2
) {
  const [x, y] = o;
  const [px, py] = p;
  return (px - x) ** 2 / radiusX ** 2 + (py - y) ** 2 / radiusY <= 1;
}

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

/**
 * 判断点是否在矩形内
 * @param rect
 * @param p
 * @returns
 */
export function isInRect(rect: Rect, p: vec2) {
  const { x, y, w, h } = rect;
  const [px, py] = p;
  return x <= px && px <= x + w && y <= py && py <= y + h;
}

export function numberToRgb(number: number) {
  // 256 * 256 = 65536;
  const r = Math.floor(number / 65536);
  const g = Math.floor((number % 65536) / 256);
  const b = Math.floor(number % 256);
  return `rgb(${r},${g},${b})`;
}

export function rgbToNumber(r: number, g: number, b: number) {
  return r * 65536 + g * 256 + b;
}

export function createRandomPolygon(canvasWidth: number, canvasHeight: number) {
  const vertices: vec2[] = [];
  const center = vec2.fromValues(
    Math.round(Math.random() * canvasWidth),
    Math.round(Math.random() * canvasHeight)
  );
  const radians = Math.PI / 4;
  for (let i = 0; i < 8; i++) {
    const vertex = vec2.fromValues(Math.round(Math.random() * 10) + 20, 0);
    vec2.add(vertex, center, vertex);
    vec2.rotate(vertex, vertex, center, radians * i);
    vertex[0] = Math.round(vertex[0]);
    vertex[1] = Math.round(vertex[1]);
    vertices.push(vertex);
  }
  return vertices;
}
