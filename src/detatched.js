function invertHex(hex) {
  return (Number(`0x1${hex}`) ^ 0xFFFFFF).toString(16).substr(1).toUpperCase()
}

function vh(v) {
  let h = Math.max(document.documentElement
  .clientHeight, window.innerHeight || 0);
  return (v * h) / 100;
}

function vw(v) {
  let w = Math.max(document.documentElement
  .clientWidth, window.innerWidth || 0);
  return (v * w) / 100;
}
