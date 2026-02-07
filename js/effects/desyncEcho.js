(() => {
  const { clamp255, getEffectBounds, makeRng } = window.GlitchCore;

  const applyDesyncEcho = (data, width, height, opts) => {
    const { intensity = 0.5, seed = 12345, maxShiftPx = 12, mode = 'add', echoAlpha = 0.35, lumaMask = 0.0, invertMask = false, perBand = false, bandHeight = 24, bounds = null } = opts || {};
    if (intensity <= 0 || echoAlpha <= 0) return;
    const b = getEffectBounds(width, height, bounds);
    const src = new Uint8ClampedArray(data);
    const rng = makeRng(seed);
    const baseX = Math.round((rng(1) - 0.5) * 2 * maxShiftPx * intensity);
    const baseY = Math.round((rng(2) - 0.5) * 2 * (maxShiftPx * 0.4) * intensity);
    const blendChannel = (val, bVal, alpha, blendMode) => {
      if (blendMode === 'add') return clamp255(val + bVal * alpha);
      if (blendMode === 'sub') return clamp255(val - bVal * alpha);
      return clamp255(val + (bVal - 128) * alpha);
    };
    const getMask = (r, g, bVal) => {
      if (lumaMask <= 0) return 1.0;
      const l = (0.2126 * r + 0.7152 * g + 0.0722 * bVal) / 255;
      let m = invertMask ? 1 - l : l;
      return (1 - lumaMask) + (lumaMask * m);
    };
    for (let y = b.y; y < b.y2; y++) {
      let dx = baseX;
      let dy = baseY;
      if (perBand) {
        const band = Math.floor(y / Math.max(1, bandHeight));
        dx = Math.round((rng(1000 + band) - 0.5) * 2 * maxShiftPx * intensity);
        dy = Math.round((rng(2000 + band) - 0.5) * 2 * (maxShiftPx * 0.25) * intensity);
      }
      const srcY = Math.max(0, Math.min(height - 1, y + dy));
      for (let x = b.x; x < b.x2; x++) {
        const srcX = Math.max(0, Math.min(width - 1, x + dx));
        const idx = (y * width + x) * 4;
        const sIdx = (srcY * width + srcX) * 4;
        const mask = getMask(data[idx], data[idx + 1], data[idx + 2]);
        const a = echoAlpha * intensity * mask;
        data[idx] = blendChannel(data[idx], src[sIdx], a, mode);
        data[idx + 1] = blendChannel(data[idx + 1], src[sIdx + 1], a, mode);
        data[idx + 2] = blendChannel(data[idx + 2], src[sIdx + 2], a, mode);
      }
    }
  };

  window.GlitchEffects = {
    ...window.GlitchEffects,
    applyDesyncEcho,
  };
})();
