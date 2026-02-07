(() => {
  const { applyChannelRebinding, applyPaletteCollapse, applyRGBDrift } = window.GlitchEffects;

  const runPaletteCollapse = (data, w, h, params, bounds) => {
    applyPaletteCollapse(data, w, h, {
      ...params,
      colors: Math.max(2, Math.floor(params.paletteColors)),
      chunkHeight: Math.max(4, Math.floor(params.paletteChunk)),
      mix: params.paletteMix,
      bounds,
    });
    applyChannelRebinding(data, w, h, {
      ...params,
      mode: 'chunk_map',
      chunkHeight: Math.max(8, Math.floor(params.paletteChunk * 0.75)),
      chunkStrength: 0.75,
      bounds,
    });
    applyRGBDrift(data, w, h, 0.06 + params.drift * 0.12, bounds);
  };

  window.GlitchAlgorithms = {
    ...window.GlitchAlgorithms,
    runPaletteCollapse,
  };
})();
