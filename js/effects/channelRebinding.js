(() => {
  const { clamp255, getEffectBounds, getLuma01, makeRng } = window.GlitchCore;

  const applyChannelRebinding = (data, width, height, opts) => {
    const { mode = 'luma_swap', lumaSwapThreshold = 0.65, darkCollapseThreshold = 0.18, seed = 0, chunkHeight = 24, chunkStrength = 1.0, bounds = null } = opts;
    const b = getEffectBounds(width, height, bounds);
    const rng = makeRng(seed);
    if (mode === 'chunk_map') {
      const maps = [
        (r, g, b) => [r, g, b],
        (r, g, b) => [b, g, r],
        (r, g, b) => [g, r, b],
        (r, g, b) => [r, b, g],
        (r, g, b) => [b, r, g],
        (r, g, b) => [g, b, r],
      ];
      for (let y = b.y; y < b.y2; y++) {
        const chunkId = Math.floor(y / chunkHeight);
        const pick = Math.floor(rng(chunkId) * maps.length);
        const mapFn = maps[pick];
        for (let x = b.x; x < b.x2; x++) {
          const idx = (y * width + x) * 4;
          const r0 = data[idx];
          const g0 = data[idx + 1];
          const b0 = data[idx + 2];
          const [rm, gm, bm] = mapFn(r0, g0, b0);
          data[idx] = clamp255(r0 + (rm - r0) * chunkStrength);
          data[idx + 1] = clamp255(g0 + (gm - g0) * chunkStrength);
          data[idx + 2] = clamp255(b0 + (bm - b0) * chunkStrength);
        }
      }
      return;
    }
    for (let y = b.y; y < b.y2; y++) {
      for (let x = b.x; x < b.x2; x++) {
        const i = (y * width + x) * 4;
        const r = data[i];
        const g = data[i + 1];
        const bVal = data[i + 2];
        const l = getLuma01(r, g, bVal);
        if (mode === 'luma_swap' && l >= lumaSwapThreshold) {
          data[i] = bVal;
          data[i + 2] = r;
        }
        if (mode === 'dark_collapse' && l <= darkCollapseThreshold) {
          const mono = Math.round(0.15 * r + 0.75 * g + 0.10 * bVal);
          data[i] = Math.round(mono * 0.5);
          data[i + 1] = mono;
          data[i + 2] = Math.round(mono * 0.35);
        }
      }
    }
  };

  window.GlitchEffects = {
    ...window.GlitchEffects,
    applyChannelRebinding,
  };
})();
