(() => {
  const { clamp255, colorKey, getEffectBounds, makeRng } = window.GlitchCore;

  const applyPaletteCollapse = (data, width, height, opts) => {
    const { colors = 8, seed = 0, chunkHeight = 32, sampleCount = 800, preQuant = 16, mix = 1.0, bounds = null } = opts;
    const b = getEffectBounds(width, height, bounds);
    const rng = makeRng(seed);
    const nearest = (r, g, b, pal) => {
      let best = 0;
      let bestD = Infinity;
      for (let i = 0; i < pal.length; i++) {
        const p = pal[i];
        const d = (r - p[0]) ** 2 + (g - p[1]) ** 2 + (b - p[2]) ** 2;
        if (d < bestD) {
          bestD = d;
          best = i;
        }
      }
      return pal[best];
    };
    for (let y0 = b.y; y0 < b.y2; y0 += chunkHeight) {
      const y1 = Math.min(b.y2, y0 + chunkHeight);
      const freq = new Map();
      const chunkId = (y0 / chunkHeight) | 0;
      for (let s = 0; s < sampleCount; s++) {
        const rx = b.x + Math.floor(rng(chunkId * 100000 + s) * (b.w));
        const ry = y0 + Math.floor(rng(chunkId * 200000 + s) * (y1 - y0));
        const idx = (ry * width + rx) * 4;
        const k = colorKey(data[idx], data[idx + 1], data[idx + 2], preQuant);
        const entry = freq.get(k);
        if (entry) entry.count++;
        else freq.set(k, { r: data[idx], g: data[idx + 1], b: data[idx + 2], count: 1 });
      }
      const candidates = Array.from(freq.values()).sort((a, b) => b.count - a.count).slice(0, Math.max(colors * 3, colors));
      if (candidates.length === 0) continue;
      const palette = [];
      palette.push([candidates[0].r, candidates[0].g, candidates[0].b]);
      while (palette.length < colors && palette.length < candidates.length) {
        let bestIdx = -1;
        let bestScore = -1;
        for (let i = 0; i < candidates.length; i++) {
          const c = candidates[i];
          let minD = Infinity;
          for (let p of palette) minD = Math.min(minD, (c.r - p[0]) ** 2 + (c.g - p[1]) ** 2 + (c.b - p[2]) ** 2);
          const score = minD * (1 + c.count * 0.1);
          if (score > bestScore) {
            bestScore = score;
            bestIdx = i;
          }
        }
        if (bestIdx === -1) break;
        const pick = candidates[bestIdx];
        palette.push([pick.r, pick.g, pick.b]);
        candidates.splice(bestIdx, 1);
      }
      for (let y = y0; y < y1; y++) {
        for (let x = b.x; x < b.x2; x++) {
          const idx = (y * width + x) * 4;
          const [rp, gp, bp] = nearest(data[idx], data[idx + 1], data[idx + 2], palette);
          data[idx] = clamp255(data[idx] + (rp - data[idx]) * mix);
          data[idx + 1] = clamp255(data[idx + 1] + (gp - data[idx + 1]) * mix);
          data[idx + 2] = clamp255(data[idx + 2] + (bp - data[idx + 2]) * mix);
        }
      }
    }
  };

  window.GlitchEffects = {
    ...window.GlitchEffects,
    applyPaletteCollapse,
  };
})();
