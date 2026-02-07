(() => {
  const { getEffectBounds, makeRng } = window.GlitchCore;

  const applyTearing = (data, width, height, intensity, seed = 0, bounds = null) => {
    if (intensity <= 0) return;
    const b = getEffectBounds(width, height, bounds);
    const rng = makeRng(seed);
    const tempData = new Uint8ClampedArray(data);
    const chunks = 20 + Math.floor(intensity * 50);
    const maxShift = Math.floor(width * intensity * 0.5);
    for (let i = 0; i < chunks; i++) {
      const r1 = rng(i);
      const r2 = rng(i + 1000);
      const r3 = rng(i + 2000);
      const rowStart = b.y + Math.floor(r1 * b.h);
      const rowHeight = Math.floor(r2 * (b.h / 10));
      const shift = Math.floor((r3 - 0.5) * 2 * maxShift);
      for (let y = rowStart; y < Math.min(b.y2, rowStart + rowHeight); y++) {
        for (let x = b.x; x < b.x2; x++) {
          const targetIdx = (y * width + x) * 4;
          let srcX = (x - shift) % width;
          if (srcX < 0) srcX += width;
          const srcIdx = (y * width + srcX) * 4;
          data[targetIdx] = tempData[srcIdx];
          data[targetIdx + 1] = tempData[srcIdx + 1];
          data[targetIdx + 2] = tempData[srcIdx + 2];
          data[targetIdx + 3] = tempData[srcIdx + 3];
        }
      }
    }
  };

  window.GlitchEffects = {
    ...window.GlitchEffects,
    applyTearing,
  };
})();
