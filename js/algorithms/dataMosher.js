(() => {
  const { applyStructuralSort } = window.GlitchCore;
  const { applyTearing } = window.GlitchEffects;

  const runDataMosher = (data, w, h, params, bounds) => {
    applyStructuralSort(data, w, h, { ...params, bounds });
    applyTearing(data, w, h, params.intensity * 0.3, params.seed, bounds);
  };

  window.GlitchAlgorithms = {
    ...window.GlitchAlgorithms,
    runDataMosher,
  };
})();
