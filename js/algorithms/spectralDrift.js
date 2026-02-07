(() => {
  const { applyStructuralSort } = window.GlitchCore;
  const { applyChannelQuantization, applyRGBDrift } = window.GlitchEffects;

  const runSpectralDrift = (data, w, h, params, bounds) => {
    applyRGBDrift(data, w, h, params.drift * 0.5 + 0.05, bounds);
    applyChannelQuantization(data, w, h, { ...params, bounds });
    applyStructuralSort(data, w, h, {
      ...params,
      threshold: 0.1 + (params.threshold * 0.6),
      comparator: 'sum',
      bounds,
    });
  };

  window.GlitchAlgorithms = {
    ...window.GlitchAlgorithms,
    runSpectralDrift,
  };
})();
