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

export function stopwatch(fn) {
  let start = performance.now();
  fn();
  console.log((performance.now() - start).toFixed(1), 'ms');
}
