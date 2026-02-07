(() => {
  const { applyStructuralSort } = window.GlitchCore;
  const { applyScanlineLogic } = window.GlitchEffects;

  const runScanlineFailure = (data, w, h, params, bounds) => {
    applyScanlineLogic(data, w, h, {
      mode: params.scanlineMode,
      freq: params.scanlineCount,
      strength: params.scanlineStrength,
      seed: params.seed,
      bounds,
    });
    if (params.intensity > 0.5) {
      applyStructuralSort(data, w, h, {
        threshold: 0.7,
        sortDirection: 'horizontal',
        segmentMode: 'runs',
        maxRun: 64,
        bounds,
      });
    }
  };

  window.GlitchAlgorithms = {
    ...window.GlitchAlgorithms,
    runScanlineFailure,
  };
})();
