(() => {
  const { applyStructuralSort } = window.GlitchCore;
  const { applyRGBDrift, applyScanlineLogic, applyTearing } = window.GlitchEffects;

  const runVoidRot = (data, w, h, params, bounds) => {
    applyScanlineLogic(data, w, h, {
      mode: 'decay',
      strength: 0.2 * params.intensity,
      seed: params.seed,
      bounds,
    });
    applyTearing(data, w, h, params.intensity * 0.8, params.seed, bounds);
    applyRGBDrift(data, w, h, params.drift * 0.2, bounds);
    applyStructuralSort(data, w, h, {
      ...params,
      threshold: 0.8 - (params.intensity * 0.4),
      comparator: 'luma',
      bounds,
    });
  };

  window.GlitchAlgorithms = {
    ...window.GlitchAlgorithms,
    runVoidRot,
  };
})();
