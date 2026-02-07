(() => {
  const clamp01 = (v) => Math.max(0, Math.min(1, v));
  const clamp255 = (v) => (v < 0 ? 0 : v > 255 ? 255 : v);
  const getLuma01 = (r, g, b) => (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  const getLuma = (r, g, b) => 0.2126 * r + 0.7152 * g + 0.0722 * b;

  const getEffectBounds = (w, h, bounds) => {
    if (!bounds) return { x: 0, y: 0, w: w, h: h, x2: w, y2: h };
    const bx = Math.floor(bounds.x * w);
    const by = Math.floor(bounds.y * h);
    const bw = Math.floor(bounds.w * w);
    const bh = Math.floor(bounds.h * h);
    const x = Math.max(0, bx);
    const y = Math.max(0, by);
    const wSafe = Math.min(w - x, bw);
    const hSafe = Math.min(h - y, bh);
    return { x, y, w: wSafe, h: hSafe, x2: x + wSafe, y2: y + hSafe };
  };

  const makeRng = (seed) => (n = 0) => {
    let t = (seed + n) + 0x6d2b79f5;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  const lumaDiff01 = (data, idxA, idxB) => {
    const a = getLuma01(data[idxA], data[idxA + 1], data[idxA + 2]);
    const b = getLuma01(data[idxB], data[idxB + 1], data[idxB + 2]);
    return Math.abs(a - b);
  };

  const colorKey = (r, g, b, q = 16) => {
    const rb = (r * q / 256) | 0;
    const gb = (g * q / 256) | 0;
    const bb = (b * q / 256) | 0;
    return (rb << 16) | (gb << 8) | bb;
  };

  const quantize8bitToN = (v, bits) => {
    if (bits >= 8) return v;
    if (bits <= 0) return 0;
    const levels = (1 << bits) - 1;
    const q = Math.round((v / 255) * levels);
    return Math.round((q / levels) * 255);
  };

  window.GlitchCore = {
    clamp01,
    clamp255,
    getLuma01,
    getLuma,
    getEffectBounds,
    makeRng,
    lumaDiff01,
    colorKey,
    quantize8bitToN,
  };
})();
