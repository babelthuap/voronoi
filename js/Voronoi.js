import Canvas from './Canvas.js';
import {metrics, rand} from './util.js';

const BLACK = new Uint8ClampedArray(3);

class Tile {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.color = new Uint8ClampedArray([rand(256), rand(256), rand(256)]);
    this.rows = new Map();
  }

  addPixel(x, y) {
    if (this.rows.has(y)) {
      this.rows.get(y)[1] = x; // Assuming we always add to the right.
    } else {
      this.rows.set(y, [x, x]);
    }
    return this;
  }
}

export default class Voronoi {
  constructor() {
    this.tiles_ = [];
    this.canvas_ = new Canvas();
    this.canvas_.attachToDom();
  }

  randomize(numTiles) {
    this.tiles_ = [];
    const width = this.canvas_.width;
    const height = this.canvas_.height;
    while (this.tiles_.length < numTiles) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      this.tiles_.push(new Tile(x, y));
    }
    return this;
  }

  partition(metric) {
    if (this.tiles_.length === 0) {
      console.error(`Can't partition with empty tiles array.`);
      return this;
    }
    const distFunction = metrics[metric];
    const width = this.canvas_.width;
    const height = this.canvas_.height;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let closestTile;
        let minDist = Infinity;
        for (let tile of this.tiles_) {
          const dist = distFunction(x, y, tile.x, tile.y);
          if (dist < minDist) {
            minDist = dist;
            closestTile = tile;
          }
        }
        closestTile && closestTile.addPixel(x, y);
      }
    }
    return this;
  }

  render() {
    const widthMinusOne = this.canvas_.width - 1;
    for (let tile of this.tiles_) {
      let prevStart = Infinity;
      let prevEnd = -Infinity;
      tile.rows.forEach(([startX, endX], y) => {
        const clamp = n => n < startX ? startX : (n > endX ? endX : n);
        this.canvas_.setRow(y, startX, endX, tile.color);
        if (startX !== 0) {
          this.canvas_.setPixel(startX, y, BLACK);
        }
        if (y > 0) {
          if (startX < prevStart) {
            this.canvas_.setRow(y, clamp(startX + 1), clamp(prevStart - 1), BLACK);
          }
          if (endX > prevEnd) {
            this.canvas_.setRow(y, clamp(prevEnd + 1), clamp(endX - 1), BLACK);
          }
        }
        if (endX !== widthMinusOne) {
          this.canvas_.setPixel(endX, y, BLACK);
        }
        prevStart = startX;
        prevEnd = endX;
      });
    }
    this.canvas_.repaint();
    return this;
  }

  recolor() {
    for (let tile of this.tiles_) {
      tile.color[0] = rand(256);
      tile.color[1] = rand(256);
      tile.color[2] = rand(256);
    }
    return this.render();
  }
}
