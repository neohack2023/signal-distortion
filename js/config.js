(() => {
  const DEFAULT_PARAMS = {
    algorithm: 'data_mosher',
    intensity: 0.5,
    threshold: 0.4,
    drift: 0.2,
    seed: 12345,
    sortDirection: 'horizontal',
    segmentMode: 'runs',
    windowSize: 96,
    edgeGate: 0.15,
    maxRun: 512,
    rBits: 4,
    gBits: 8,
    bBits: 3,
    dither: 0.2,
    rebindingMode: 'luma_swap',
    paletteColors: 10,
    paletteChunk: 32,
    paletteMix: 1.0,
    scanlineMode: 'bands',
    scanlineCount: 4,
    scanlineStrength: 0.5,
    echoMode: 'add',
    echoShift: 24,
    echoAlpha: 0.4,
    echoBands: true,
  };

  const ALGORITHMS = [
    { id: 'data_mosher', name: 'Data Mosher', desc: 'Luma-gated sorting' },
    { id: 'spectral_drift', name: 'Spectral Drift', desc: 'RGB Channel offset' },
    { id: 'palette_collapse', name: 'Palette Collapse', desc: 'Chunk posterization' },
    { id: 'scanline_failure', name: 'Scanline Failure', desc: 'Buffer freeze' },
    { id: 'desync_echo', name: 'Desync Echo', desc: 'Ghost trails' },
    { id: 'void_rot', name: 'Void Rot', desc: 'Structural tearing' },
  ];

  const SORT_DIRECTIONS = [
    { id: 'horizontal', label: 'HORZ' },
    { id: 'vertical', label: 'VERT' },
    { id: 'both', label: 'BOTH' },
  ];

  const SEGMENT_MODES = [
    { id: 'runs', label: 'RUNS' },
    { id: 'windowed', label: 'WINDOW' },
  ];

  window.GlitchConfig = {
    DEFAULT_PARAMS,
    ALGORITHMS,
    SORT_DIRECTIONS,
    SEGMENT_MODES,
  };
})();
