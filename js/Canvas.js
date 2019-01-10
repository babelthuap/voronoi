export default class Canvas {
  constructor(initialColor = 'white') {
    this.root_ = document.createElement('canvas');
    this.root_.width = this.width = window.innerWidth;
    this.root_.height = this.height = window.innerHeight;
    this.ctx_ = this.root_.getContext('2d');
    this.ctx_.fillStyle = initialColor;
    this.ctx_.fillRect(0, 0, this.width, this.height);
    this.imageData_ = this.ctx_.getImageData(0, 0, this.width, this.height);
  }

  attachToDom() {
    if (document.body.children[0] !== this.root_) {
      [...document.body.children].forEach(child => child.remove());
      document.body.appendChild(this.root_);
    }
  }

  repaint() {
    this.ctx_.putImageData(this.imageData_, 0, 0);
  }

  setPixel(x, y, rgb) {
    this.imageData_.data.set(rgb, 4 * (x + this.width * y));
  }

  getPixel(x, y) {
    const red = 4 * (x + this.width * y);
    return this.imageData_.data.subarray(red, red + 3);
  }

  setRow(y, startX, endX, rgb) {
    const startRed = 4 * (startX + this.width * y);
    const endRed = 4 * (endX + this.width * y);
    for (let i = startRed; i <= endRed; i += 4) {
      this.imageData_.data.set(rgb, i);
    }
  }

  addEventListener(...args) {
    this.root_.addEventListener(...args);
  }

  removeEventListener(...args) {
    this.root_.removeEventListener(...args);
  }
}
