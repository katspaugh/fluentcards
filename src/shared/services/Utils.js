function rnd(n) {
  return Math.floor(Math.random() * n);
}

export function shuffle(arr) {
  const len = arr.length;
  for (let i = len - 1; i >= 0; i--) {
    let j = rnd(len);
    [ arr[i], arr[j] ] = [ arr[j], arr[i] ];
  }
  return arr;
}

export function randomItem(arr) {
  return arr[rnd(arr.length)];
}

export function escapeRegexp(text) {
  return text
    .replace(/\]/g, '\\]')
    .replace(/\^/g, '\\^')
    .replace(/-/g, '\\-')
    .replace(/./g, '[$&]')
}
