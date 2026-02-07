(() => {
  const { getEffectBounds, makeRng } = window.GlitchCore;

  const applyScanlineLogic = (data, width, height, opts) => {
    const { mode = 'repeat', freq = 4, strength = 0.5, seed = 0, bounds = null } = opts;
    const b = getEffectBounds(width, height, bounds);
    const rng = makeRng(seed);
    const copyRow = (srcY, destY) => {
      if (srcY < 0 || srcY >= height || destY < 0 || destY >= height) return;
      const srcOff = (srcY * width + b.x) * 4;
      const destOff = (destY * width + b.x) * 4;
      data.copyWithin(destOff, srcOff, srcOff + b.w * 4);
    };
    if (mode === 'repeat') {
      const n = Math.max(2, Math.floor(freq));
      for (let y = b.y; y < b.y2; y++) if (y % n === 0 && y > b.y) copyRow(y - 1, y);
    } else if (mode === 'bands') {
      let inBand = false;
      let bandRemaining = 0;
      let holdRow = 0;
      const bandChance = 0.005 + (freq * 0.005);
      const maxLen = Math.floor(height * (0.02 + strength * 0.15));
      for (let y = b.y; y < b.y2; y++) {
        if (inBand) {
          copyRow(holdRow, y);
          bandRemaining--;
          if (bandRemaining <= 0) inBand = false;
        } else if (rng(y) < bandChance) {
          inBand = true;
          bandRemaining = Math.floor(rng(y + 999) * maxLen);
          holdRow = Math.max(b.y, y - 1);
        }
      }
    } else if (mode === 'decay') {
      for (let y = b.y + 1; y < b.y2; y++) {
        const prob = ((y - b.y) / b.h) * strength * 0.8;
        if (rng(y * 13) < prob) copyRow(y - 1, y);
      }
    }
  };

  window.GlitchEffects = {
    ...window.GlitchEffects,
    applyScanlineLogic,
  };
})();
