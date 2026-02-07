(() => {
  const { useState, useRef, useEffect, useCallback } = React;
  const { DEFAULT_PARAMS, ALGORITHMS, SORT_DIRECTIONS, SEGMENT_MODES } = window.GlitchConfig;
  const { createStarterImage, hideLoader } = window.GlitchUI;
  const { generateHistogram } = window.GlitchEffects;
  const {
    runDataMosher,
    runSpectralDrift,
    runPaletteCollapse,
    runScanlineFailure,
    runDesyncEcho,
    runVoidRot,
  } = window.GlitchAlgorithms;

  const algorithmRunners = {
    data_mosher: runDataMosher,
    spectral_drift: runSpectralDrift,
    palette_collapse: runPaletteCollapse,
    scanline_failure: runScanlineFailure,
    desync_echo: runDesyncEcho,
    void_rot: runVoidRot,
  };

  const GlitchEngine = () => {
    const [sourceImage, setSourceImage] = useState(null);
    const [sourceUrl, setSourceUrl] = useState(null);
    const [processedUrl, setProcessedUrl] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);
    const [dimensions, setDimensions] = useState({ w: 0, h: 0 });
    const [histogram, setHistogram] = useState([]);

    const [viewMode, setViewMode] = useState('split');
    const [sliderPos, setSliderPos] = useState(50);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [showAdvanced, setShowAdvanced] = useState(false);

    const [interactionMode, setInteractionMode] = useState('preview');
    const [selection, setSelection] = useState(null);
    const [isSelecting, setIsSelecting] = useState(false);
    const selectionStart = useRef({ x: 0, y: 0 });

    const sliderRef = useRef(null);
    const isDragging = useRef(false);
    const canvasRef = useRef(null);
    const fileInputRef = useRef(null);

    const handleImageLoad = (img, url) => {
      setErrorMsg(null);
      let w = img.width;
      let h = img.height;
      const maxDim = 1920;
      if (w > maxDim || h > maxDim) {
        const ratio = Math.min(maxDim / w, maxDim / h);
        w = Math.floor(w * ratio);
        h = Math.floor(h * ratio);
      }
      setSourceImage(img);
      setSourceUrl(url);
      setDimensions({ w, h });
    };

    const handleUpload = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      e.target.value = null;

      if (file.name.toLowerCase().endsWith('.heic')) {
        setErrorMsg('HEIC format not supported in this version. Please use JPG or PNG.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => handleImageLoad(img, event.target.result);
        img.onerror = () => setErrorMsg('Failed to load image data.');
        img.src = event.target.result;
      };
      reader.onerror = () => setErrorMsg('Failed to read file.');
      reader.readAsDataURL(file);
    };

    const [params, setParams] = useState(() => ({ ...DEFAULT_PARAMS }));

    useEffect(() => {
      createStarterImage(handleImageLoad);

      const loaderTimer = setTimeout(() => {
        hideLoader();
      }, 800);

      return () => clearTimeout(loaderTimer);
    }, []);

    const processImage = useCallback(async (img, w, h, currentParams, currentSelection) => {
      if (!img) return;
      setIsProcessing(true);
      setTimeout(() => {
        try {
          const canvas = canvasRef.current;
          if (!canvas) return;
          const ctx = canvas.getContext('2d', { willReadFrequently: true });
          canvas.width = w;
          canvas.height = h;
          ctx.drawImage(img, 0, 0, w, h);
          const imageData = ctx.getImageData(0, 0, w, h);
          const data = imageData.data;
          setHistogram(generateHistogram(data));

          const bounds = currentSelection || null;
          const runner = algorithmRunners[currentParams.algorithm];
          if (runner) {
            runner(data, w, h, currentParams, bounds);
          }

          ctx.putImageData(imageData, 0, 0);
          setProcessedUrl(canvas.toDataURL('image/png'));
          setIsProcessing(false);
        } catch (err) {
          setErrorMsg('Error: ' + err.message);
          setIsProcessing(false);
        }
      }, 10);
    }, []);

    useEffect(() => {
      if (!sourceImage || !dimensions.w || !dimensions.h) return;

      const timer = setTimeout(() => {
        processImage(sourceImage, dimensions.w, dimensions.h, params, selection);
      }, 20);

      return () => clearTimeout(timer);
    }, [params, selection, sourceImage, dimensions, processImage]);

    const updateParam = (key, value) => {
      setParams((prev) => ({ ...prev, [key]: value }));
    };
    const handleDownload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const link = document.createElement('a');
      link.download = `glitch_${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    };

    const handleMouseDown = (e) => {
      if (interactionMode === 'mask') {
        e.preventDefault();
        const rect = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        setIsSelecting(true);
        selectionStart.current = { x, y };
        setSelection({ x, y, w: 0, h: 0 });
      } else {
        isDragging.current = true;
      }
    };

    const handleMouseMove = useCallback((e) => {
      if (!sliderRef.current) return;
      const rect = sliderRef.current.getBoundingClientRect();
      const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
      const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
      const xRel = (clientX - rect.left) / rect.width;
      const yRel = (clientY - rect.top) / rect.height;

      if (isSelecting) {
        const start = selectionStart.current;
        const x = Math.min(start.x, xRel);
        const y = Math.min(start.y, yRel);
        const w = Math.abs(xRel - start.x);
        const h = Math.abs(yRel - start.y);
        setSelection({
          x: Math.max(0, x),
          y: Math.max(0, y),
          w: Math.min(1 - x, w),
          h: Math.min(1 - y, h),
        });
      } else if (isDragging.current) {
        setSliderPos(Math.max(0, Math.min(100, xRel * 100)));
      }
    }, [isSelecting]);

    const handleMouseUp = useCallback(() => {
      if (isSelecting) {
        setIsSelecting(false);
        if (selection && (selection.w < 0.01 || selection.h < 0.01)) setSelection(null);
      }
      isDragging.current = false;
    }, [selection, isSelecting]);

    useEffect(() => {
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('touchend', handleMouseUp);
      window.addEventListener('touchmove', handleMouseMove);
      return () => {
        window.removeEventListener('mouseup', handleMouseUp);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('touchend', handleMouseUp);
        window.removeEventListener('touchmove', handleMouseMove);
      };
    }, [handleMouseUp, handleMouseMove]);

    return (
      <div className="flex h-screen bg-slate-950 text-slate-200 font-sans overflow-hidden selection:bg-pink-500 selection:text-white">
        <div className={`flex-shrink-0 glass-panel flex flex-col z-40 transition-all duration-300 relative overflow-hidden ${isSidebarOpen ? 'w-80' : 'w-0 border-none'}`}>
          <div className="w-80 h-full flex flex-col">
            <div className="p-6 border-b border-slate-700/50 flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-pink-500 font-mono text-xl">⚡</span>
                  <h1 className="text-lg font-bold tracking-wider text-slate-100 font-mono">GLITCH.ENG</h1>
                </div>
                <p className="text-xs text-slate-500 font-mono tracking-wider">SIGNAL DISTORTION UNIT</p>
              </div>
              <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-slate-400 hover:text-white font-mono text-xs">[CLOSE]</button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest">:: SIGNAL ANALYSIS</div>
                <div className="h-16 bg-slate-900 border border-slate-700/50 rounded p-1 flex items-end gap-[1px]">
                  {histogram.length > 0 ? histogram.map((val, i) => (
                    <div key={i} className="flex-1 bg-cyan-500/40" style={{ height: `${val * 100}%` }} />
                  )) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-700 text-xs font-mono">NO SIGNAL</div>
                  )}
                </div>
              </div>
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-xs font-mono text-slate-400 uppercase tracking-widest">:: ALGORITHM</label>
                <div className="grid grid-cols-1 gap-2">
                  {ALGORITHMS.map((algo) => (
                    <button
                      key={algo.id}
                      onClick={() => updateParam('algorithm', algo.id)}
                      className={`cyber-button px-4 py-3 rounded text-left transition-all border ${params.algorithm === algo.id ? 'bg-slate-800 border-pink-500/50 text-white shadow-[0_0_15px_rgba(236,72,153,0.15)]' : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:bg-slate-800 hover:border-slate-600'}`}
                    >
                      <div className="font-bold text-sm font-mono">{algo.name}</div>
                      <div className="text-[10px] opacity-60 font-mono">{algo.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-mono text-slate-400 uppercase tracking-widest">:: STRUCTURE</div>
                <div className="grid grid-cols-3 gap-2">
                  {SORT_DIRECTIONS.map((dir) => (
                    <button
                      key={dir.id}
                      onClick={() => updateParam('sortDirection', dir.id)}
                      className={`flex flex-col items-center justify-center py-2 rounded border transition-all ${params.sortDirection === dir.id ? 'bg-slate-800 border-cyan-500/50 text-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.1)]' : 'bg-slate-900/50 border-slate-800 text-slate-500 hover:text-slate-300'}`}
                    >
                      <span className="text-[10px] mt-1 font-mono">{dir.label}</span>
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {SEGMENT_MODES.map((mode) => (
                    <button
                      key={mode.id}
                      onClick={() => updateParam('segmentMode', mode.id)}
                      className={`flex items-center justify-center gap-2 py-2 rounded border transition-all ${params.segmentMode === mode.id ? 'bg-slate-800 border-purple-500/50 text-purple-400' : 'bg-slate-900/50 border-slate-800 text-slate-500 hover:text-slate-300'}`}
                    >
                      <span className="text-xs font-mono">{mode.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {params.algorithm === 'scanline_failure' && (
                <div className="space-y-4 border border-green-900/30 bg-green-900/5 p-3 rounded-lg backdrop-blur-sm">
                  <div className="flex items-center gap-2 text-xs font-mono text-green-400 uppercase tracking-widest">:: BUFFER LOGIC</div>
                  <div className="grid grid-cols-3 gap-2">
                    {['repeat', 'bands', 'decay'].map((m) => (
                      <button
                        key={m}
                        onClick={() => updateParam('scanlineMode', m)}
                        className={`py-1 rounded text-[10px] font-mono border ${params.scanlineMode === m ? 'bg-green-900/40 border-green-500 text-green-200' : 'bg-slate-900/50 border-slate-700 text-slate-500'}`}
                      >
                        {m.toUpperCase()}
                      </button>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-mono text-slate-300">
                      <span>{params.scanlineMode === 'repeat' ? 'SKIP FREQ' : 'DENSITY'}</span>
                      <span>{params.scanlineCount}</span>
                    </div>
                    <input
                      type="range"
                      min="2"
                      max="50"
                      step="1"
                      value={params.scanlineCount}
                      onChange={(e) => updateParam('scanlineCount', parseInt(e.target.value))}
                      className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-green-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-mono text-slate-300">
                      <span>STRENGTH</span>
                      <span>{(params.scanlineStrength * 100).toFixed(0)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={params.scanlineStrength}
                      onChange={(e) => updateParam('scanlineStrength', parseFloat(e.target.value))}
                      className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-green-500"
                    />
                  </div>
                </div>
              )}

              {params.algorithm === 'desync_echo' && (
                <div className="space-y-4 border border-indigo-900/30 bg-indigo-900/5 p-3 rounded-lg backdrop-blur-sm">
                  <div className="flex items-center gap-2 text-xs font-mono text-indigo-400 uppercase tracking-widest">:: ECHO PARAMS</div>
                  <div className="grid grid-cols-3 gap-2">
                    {['add', 'sub', 'mix'].map((m) => (
                      <button
                        key={m}
                        onClick={() => updateParam('echoMode', m)}
                        className={`py-1 rounded text-[10px] font-mono border ${params.echoMode === m ? 'bg-indigo-900/40 border-indigo-500 text-indigo-200' : 'bg-slate-900/50 border-slate-700 text-slate-500'}`}
                      >
                        {m.toUpperCase()}
                      </button>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-mono text-slate-300">
                      <span>SHIFT (PX)</span>
                      <span>{params.echoShift}</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="100"
                      step="1"
                      value={params.echoShift}
                      onChange={(e) => updateParam('echoShift', parseInt(e.target.value))}
                      className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-mono text-slate-300">
                      <span>OPACITY</span>
                      <span>{(params.echoAlpha * 100).toFixed(0)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.05"
                      max="1"
                      step="0.05"
                      value={params.echoAlpha}
                      onChange={(e) => updateParam('echoAlpha', parseFloat(e.target.value))}
                      className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-300">BANDED ECHO</span>
                    <button onClick={() => updateParam('echoBands', !params.echoBands)} className="text-indigo-400 font-mono text-xs">{params.echoBands ? '[ ON ]' : '[ OFF ]'}</button>
                  </div>
                </div>
              )}

              <div className="space-y-6">
                <div className="flex items-center gap-2 text-xs font-mono text-slate-400 uppercase tracking-widest">:: MODULATION</div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span>INTENSITY</span>
                    <span className="text-pink-400">{(params.intensity * 100).toFixed(0)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={params.intensity}
                    onChange={(e) => updateParam('intensity', parseFloat(e.target.value))}
                    className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-pink-500"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span>LUMA GATE</span>
                    <span className="text-cyan-400">{(params.threshold * 100).toFixed(0)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={params.threshold}
                    onChange={(e) => updateParam('threshold', parseFloat(e.target.value))}
                    className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span>CHROMA DRIFT</span>
                    <span className="text-purple-400">{(params.drift * 100).toFixed(0)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={params.drift}
                    onChange={(e) => updateParam('drift', parseFloat(e.target.value))}
                    className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                  />
                </div>
              </div>

              <div className="border border-slate-800 rounded bg-slate-900/50 overflow-hidden">
                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="w-full flex items-center justify-between p-3 text-xs font-mono text-slate-400 uppercase tracking-widest hover:bg-slate-800 transition-colors"
                >
                  <div className="flex items-center gap-2">:: COLOR DEPTH</div>
                  <div className="text-[10px]">{showAdvanced ? '[-]' : '[+]'}</div>
                </button>
                {showAdvanced && (
                  <div className="p-3 space-y-5 border-t border-slate-800 bg-black/20">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-mono text-slate-300">
                        <span>R-BIT</span>
                        <span>{params.rBits}</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="8"
                        value={params.rBits}
                        onChange={(e) => updateParam('rBits', parseInt(e.target.value))}
                        className="w-full h-1 bg-slate-800 rounded accent-red-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-mono text-slate-300">
                        <span>B-BIT</span>
                        <span>{params.bBits}</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="8"
                        value={params.bBits}
                        onChange={(e) => updateParam('bBits', parseInt(e.target.value))}
                        className="w-full h-1 bg-slate-800 rounded accent-blue-500"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-700/50">
                <button
                  onClick={() => updateParam('seed', Math.random() * 10000)}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 py-2 px-4 rounded text-xs font-mono uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                >
                  [ REROLL SEED ]
                </button>
              </div>
            </div>
            <div className="p-6 border-t border-slate-700/50 bg-slate-900/50 backdrop-blur-md space-y-3">
              <input type="file" ref={fileInputRef} onChange={handleUpload} accept="image/*" className="hidden" />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 py-3 rounded-md text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 font-mono border border-slate-700"
              >
                [ UPLOAD SOURCE ]
              </button>
              <button
                onClick={handleDownload}
                disabled={!sourceUrl || isProcessing}
                className="w-full bg-pink-600 hover:bg-pink-500 text-white py-3 rounded-md text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(236,72,153,0.3)] disabled:opacity-50 disabled:shadow-none font-mono"
              >
                {isProcessing ? 'PROCESSING...' : '[ EXPORT ARTIFACT ]'}
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 bg-slate-950 relative overflow-hidden flex flex-col min-w-0 h-full">
          <div className="h-14 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between px-4 backdrop-blur z-20 flex-shrink-0">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors font-mono text-xs"
              >
                {isSidebarOpen ? '[CLOSE]' : '[MENU]'}
              </button>
              <div className="text-xs font-mono text-slate-500 hidden sm:flex gap-4 border-l border-slate-800 pl-4">
                {sourceImage && (
                  <>
                    <span>INPUT: {dimensions.w}x{dimensions.h}</span>
                    <span>SEED: {params.seed.toFixed(0)}</span>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 shadow-sm">
                <button
                  onClick={() => setInteractionMode('preview')}
                  title="Preview Mode"
                  className={`p-2 rounded flex items-center gap-2 transition-all ${interactionMode === 'preview' ? 'bg-pink-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
                >
                  <span className="text-[10px] font-bold uppercase font-mono">PREVIEW</span>
                </button>
                <button
                  onClick={() => setInteractionMode('mask')}
                  title="Masking Mode"
                  className={`p-2 rounded flex items-center gap-2 transition-all ${interactionMode === 'mask' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
                >
                  <span className="text-[10px] font-bold uppercase font-mono">MASK</span>
                </button>
              </div>
              {interactionMode === 'preview' && (
                <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 shadow-sm">
                  <button
                    onClick={() => setViewMode('source')}
                    className={`p-2 rounded transition-all text-[10px] font-mono font-bold ${viewMode === 'source' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}
                  >
                    SRC
                  </button>
                  <button
                    onClick={() => setViewMode('split')}
                    className={`p-2 rounded transition-all text-[10px] font-mono font-bold ${viewMode === 'split' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}
                  >
                    SPLIT
                  </button>
                  <button
                    onClick={() => setViewMode('result')}
                    className={`p-2 rounded transition-all text-[10px] font-mono font-bold ${viewMode === 'result' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}
                  >
                    RES
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 relative flex items-center justify-center p-0 overflow-hidden select-none bg-slate-950">
            <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#475569 1px, transparent 1px), linear-gradient(90deg, #475569 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
            {errorMsg && (
              <div className="absolute top-10 left-1/2 -translate-x-1/2 z-50 bg-red-900/90 text-white px-6 py-3 rounded border border-red-500 shadow-2xl flex items-center gap-3 text-sm font-mono">
                ERROR: {errorMsg}
              </div>
            )}

            {sourceUrl ? (
              <div
                ref={sliderRef}
                className={`relative shadow-[0_0_50px_rgba(0,0,0,0.5)] bg-black group flex items-center justify-center max-w-full max-h-full ${interactionMode === 'mask' ? 'cursor-crosshair' : 'cursor-ew-resize'}`}
                onMouseDown={handleMouseDown}
                onTouchStart={handleMouseDown}
                style={{ maxWidth: '100%', maxHeight: '100%' }}
              >
                <div className="relative" style={{ maxWidth: '100%', maxHeight: '100%' }}>
                  <img src={sourceUrl} className="block opacity-0 pointer-events-none" style={{ maxHeight: 'calc(100vh - 7rem)', maxWidth: '100%', objectFit: 'contain' }} alt="" />
                  <img src={sourceUrl} alt="Source" className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-300 ${viewMode === 'result' && interactionMode === 'preview' ? 'opacity-0' : 'opacity-100'}`} />
                  {processedUrl && (
                    <img
                      src={processedUrl}
                      alt="Processed"
                      className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-300 ${viewMode === 'source' && interactionMode === 'preview' ? 'opacity-0' : 'opacity-100'}`}
                      style={{
                        imageRendering: 'pixelated',
                        clipPath: (viewMode === 'split' && interactionMode === 'preview') ? `inset(0 0 0 ${sliderPos}%)` : 'none',
                        opacity: (viewMode === 'source' && interactionMode === 'preview')
                          ? 0
                          : ((interactionMode === 'mask' && !selection) ? 0.7 : 1),
                      }}
                    />
                  )}
                  {interactionMode === 'preview' && viewMode === 'split' && processedUrl && (
                    <div className="absolute top-0 bottom-0 w-0.5 bg-pink-500 z-10 cursor-ew-resize group-hover:shadow-[0_0_15px_rgba(236,72,153,0.8)] transition-all" style={{ left: `${sliderPos}%` }}>
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-pink-500 p-2 rounded-full shadow-lg border-2 border-slate-900 transition-transform hover:scale-110 font-mono text-[10px] text-white font-bold">&lt;&gt;</div>
                    </div>
                  )}
                  {interactionMode === 'mask' && (
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />
                      {selection && (
                        <div
                          className="absolute border-2 border-cyan-400 bg-cyan-400/5 shadow-[0_0_30px_rgba(34,211,238,0.2)]"
                          style={{
                            left: `${selection.x * 100}%`,
                            top: `${selection.y * 100}%`,
                            width: `${selection.w * 100}%`,
                            height: `${selection.h * 100}%`,
                          }}
                        >
                          <div className="absolute -top-3 -left-3 w-6 h-6 border-t-2 border-l-2 border-cyan-400"></div>
                          <div className="absolute -top-3 -right-3 w-6 h-6 border-t-2 border-r-2 border-cyan-400"></div>
                          <div className="absolute -bottom-3 -left-3 w-6 h-6 border-b-2 border-l-2 border-cyan-400"></div>
                          <div className="absolute -bottom-3 -right-3 w-6 h-6 border-b-2 border-r-2 border-cyan-400"></div>
                        </div>
                      )}
                      {isSelecting && !selection && (
                        <div className="absolute inset-0 flex items-center justify-center text-cyan-400/80 font-mono text-sm uppercase tracking-widest pointer-events-none animate-pulse">
                          DRAG TO SELECT REGION
                        </div>
                      )}
                    </div>
                  )}
                </div>
                {isProcessing && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-30 backdrop-blur-[2px]">
                    <div className="flex flex-col items-center gap-3">
                      <div className="text-4xl animate-spin">⚡</div>
                      <div className="text-xs font-mono text-pink-500 uppercase tracking-widest animate-pulse">PROCESSING...</div>
                    </div>
                  </div>
                )}
                {selection && interactionMode === 'mask' && (
                  <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-30">
                    <button
                      onClick={() => setSelection(null)}
                      className="bg-red-900/90 hover:bg-red-800 text-white px-6 py-3 rounded text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-xl border border-red-500/50 transition-all pointer-events-auto font-mono"
                    >
                      [ CLEAR MASK ]
                    </button>
                    <div className="bg-slate-900/90 text-cyan-400 px-6 py-3 rounded text-xs font-mono border border-cyan-500/30 shadow-xl flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
                      ACTIVE REGION
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-slate-700 gap-4">
                <div className="w-24 h-24 border-2 border-dashed border-slate-800 rounded-xl flex items-center justify-center text-4xl opacity-20 font-mono font-bold">+</div>
                <p className="font-mono text-xs uppercase tracking-widest opacity-50">NO SIGNAL INPUT</p>
              </div>
            )}
            <canvas ref={canvasRef} className="hidden" />
          </div>
        </div>
      </div>
    );
  };

  try {
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(<GlitchEngine />);
  } catch (err) {
    const loader = document.getElementById('loader');
    if (loader) {
      loader.innerHTML = `<div style="color:#ef4444; padding:20px; font-family:monospace; text-align:center;">
                <h1 style="font-size:24px; margin-bottom:10px;">SYSTEM CRITICAL ERROR</h1>
                <p style="color:#94a3b8">${err.message}</p>
            </div>`;
    }
    console.error(err);
  }
})();
