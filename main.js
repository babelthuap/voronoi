import Voronoi from './js/Voronoi.js';
import {extractUrlParams, stopwatch} from './js/util.js';

const urlParams = extractUrlParams();
const numTiles = parseInt(urlParams['n']) ||
    Math.round(window.innerWidth * window.innerHeight / 10000);
const metric = [1, 2, 3].includes(parseInt(urlParams['metric'])) ?
    parseInt(urlParams['metric']) :
    2;

let v;

stopwatch('initial render', () => {
  v = new Voronoi().randomize(numTiles).partition(metric).render();
});

v.canvas_.addEventListener('mousedown', () => {
  stopwatch('recolor', () => v.recolor());
});

document.addEventListener('keydown', e => {
  if (e.keyCode === 86 /* 'v' */) {
    stopwatch('rerender', () => v.randomize(numTiles).partition().render());
  }
});

window.addEventListener('resize', () => {
  stopwatch('resize', () => v.resize());
});
