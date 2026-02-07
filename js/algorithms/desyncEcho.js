(() => {
  const { applyDesyncEcho, applyRGBDrift, applyTearing } = window.GlitchEffects;

  const runDesyncEcho = (data, w, h, params, bounds) => {
    applyRGBDrift(data, w, h, params.drift * 0.3, bounds);
    applyDesyncEcho(data, w, h, {
      ...params,
      maxShiftPx: params.echoShift,
      lumaMask: params.threshold,
      bandHeight: 32,
      bounds,
    });
    if (params.intensity > 0.6) {
      applyTearing(data, w, h, params.intensity * 0.2, params.seed, bounds);
    }
  };

  window.GlitchAlgorithms = {
    ...window.GlitchAlgorithms,
    runDesyncEcho,
  };
})();
