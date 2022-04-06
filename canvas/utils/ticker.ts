type Fn = (t?: number) => void;

export class Ticker {
  queue: Fn[] = [];

  constructor() {
    this.loop();
  }

  /**
   * 添加到回调队列
   * @param fn
   */
  add(fn: Fn) {
    this.queue.push(fn);
  }

  clear() {
    this.queue.length = 0;
  }

  loop() {
    const timestamp = Date.now();
    this.queue.forEach((fn) => {
      fn(timestamp);
    });
    requestAnimationFrame(() => {
      this.loop();
    });
  }
}

export default Ticker;
