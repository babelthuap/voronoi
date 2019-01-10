export function extractUrlParams() {
  return location.search.split(/[?&]/).filter(e => e).reduce((map, e) => {
    const [k, v] = e.split('=');
    map[k] = v;
    return map;
  }, {});
}

export function rand(n) {
  return Math.floor(Math.random() * n);
}

export function stopwatch(label, fn) {
  const start = performance.now();
  fn();
  const duration = performance.now() - start;
  console.log(label, `${duration.toFixed(1)} ms`);
  return duration;
}

export const metrics = {
  1: (x1, y1, x2, y2) => Math.abs(x1 - x2) + Math.abs(y1 - y2),
  2: (x1, y1, x2, y2) => (x1 - x2) ** 2 + (y1 - y2) ** 2,
  3: (x1, y1, x2, y2) => Math.abs(x1 - x2) ** 3 + Math.abs(y1 - y2) ** 3,
};
