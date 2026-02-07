(() => {
  const { clamp255, getEffectBounds } = window.GlitchCore;

  const applyRGBDrift = (data, width, height, amount, bounds = null) => {
    const offset = Math.floor(amount * width * 0.1);
    if (offset === 0) return;
    const b = getEffectBounds(width, height, bounds);
    const tempData = new Uint8ClampedArray(data);
    for (let y = b.y; y < b.y2; y++) {
      for (let x = b.x; x < b.x2; x++) {
        const idx = (y * width + x) * 4;
        const xR = Math.min(width - 1, Math.max(0, x - offset));
        const idxR = (y * width + xR) * 4;
        const xB = Math.min(width - 1, Math.max(0, x + offset));
        const idxB = (y * width + xB) * 4;
        data[idx] = tempData[idxR];
        data[idx + 2] = tempData[idxB + 2];
      }
    }
  };

  window.GlitchEffects = {
    ...window.GlitchEffects,
    applyRGBDrift,
  };
})();
