(() => {
  const { clamp255, getEffectBounds, makeRng, quantize8bitToN } = window.GlitchCore;

  const applyChannelQuantization = (data, width, height, opts) => {
    const { rBits = 8, gBits = 8, bBits = 8, dither = 0, seed = 0, ditherMode = 'luma', bounds = null } = opts;
    const b = getEffectBounds(width, height, bounds);
    const rng = makeRng(seed);
    for (let y = b.y; y < b.y2; y++) {
      for (let x = b.x; x < b.x2; x++) {
        const i = (y * width + x) * 4;
        let r = data[i];
        let g = data[i + 1];
        let bVal = data[i + 2];
        if (dither > 0) {
          const n = (rng(i) - 0.5) * 2;
          const amp = Math.floor(dither * 12);
          if (ditherMode === 'luma') {
            r = clamp255(r + n * amp);
            g = clamp255(g + n * amp);
            bVal = clamp255(bVal + n * amp);
          } else if (ditherMode === 'rgb') {
            r = clamp255(r + (rng(i + 1) - 0.5) * 2 * amp);
            g = clamp255(g + (rng(i + 2) - 0.5) * 2 * amp);
            bVal = clamp255(bVal + (rng(i + 3) - 0.5) * 2 * amp);
          }
        }
        data[i] = quantize8bitToN(r, rBits);
        data[i + 1] = quantize8bitToN(g, gBits);
        data[i + 2] = quantize8bitToN(bVal, bBits);
      }
    }
  };

  window.GlitchEffects = {
    ...window.GlitchEffects,
    applyChannelQuantization,
  };
})();
