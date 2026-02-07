(() => {
  const { getLuma } = window.GlitchCore;

  const generateHistogram = (data) => {
    const bins = new Array(64).fill(0);
    for (let i = 0; i < data.length; i += 16) {
      const luma = getLuma(data[i], data[i + 1], data[i + 2]);
      const binIdx = Math.floor((luma / 255) * 63);
      bins[binIdx]++;
    }
    const max = Math.max(...bins);
    return bins.map((v) => v / max);
  };

  window.GlitchEffects = {
    ...window.GlitchEffects,
    generateHistogram,
  };
})();
