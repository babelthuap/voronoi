import Canvas from './Canvas.js';
import {metrics, pair, rand, unpair} from './util.js';

const BLACK = new Uint8ClampedArray(3);
const NEIGHBOR_OFFSETS = [
           [1,  0],
  [0,  1], [1,  1],
];


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
    this.borderPixels_ = new Set();
    this.canvas_ = new Canvas();
    this.canvas_.attachToDom();
  }

  randomize(numTiles) {
    this.tiles_ = [];
    this.borderPixels_.clear();
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

  render(borders) {
    for (let tile of this.tiles_) {
      tile.rows.forEach(([startX, endX], y) => {
        this.canvas_.setRow(y, startX, endX, tile.color);
      });
    }
    if (borders) {
      if (this.borderPixels_.size === 0) {
        this.calculateBorders_();
      }
      // Draw borders
      this.borderPixels_.forEach(intPair => {
        const [x, y] = unpair(intPair);
        this.canvas_.setPixel(x, y, BLACK);
      });
    }
    this.canvas_.repaint();
    return this;
  }

  calculateBorders_() {
    const widthMinusOne = this.canvas_.width - 1;
    const heightMinusOne = this.canvas_.height - 1;
    for (let y = 0; y < heightMinusOne; y++) {
      for (let x = 0; x < widthMinusOne; x++) {
        for (let [dx, dy] of NEIGHBOR_OFFSETS) {
          const nbrX = x + dx;
          const nbrY = y + dy;
          const thisColor = this.canvas_.getPixel(x, y);
          const nbrColor = this.canvas_.getPixel(x + dx, y + dy);
          if (thisColor[0] !== nbrColor[0] ||
              thisColor[1] !== nbrColor[1] ||
              thisColor[2] !== nbrColor[2]) {
            this.borderPixels_.add(pair(x, y));
            break;
          }
        }
      }
    }
  }

  recolor(borders) {
    for (let tile of this.tiles_) {
      tile.color[0] = rand(256);
      tile.color[1] = rand(256);
      tile.color[2] = rand(256);
    }
    return this.render(borders);
  }
}
