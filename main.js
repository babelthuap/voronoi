import Voronoi from './js/Voronoi.js';
import {extractUrlParams, stopwatch} from './js/util.js';

const urlParams = extractUrlParams();
const numTiles = urlParams['n'] || 100;

let v;

stopwatch(() => {
  v = new Voronoi().randomize(numTiles).partition().render();
});

v.canvas_.addEventListener('mousedown', () => {
  stopwatch(() => v.recolor());
});
