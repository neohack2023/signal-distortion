(() => {
  const { clamp01, getEffectBounds, lumaDiff01 } = window.GlitchCore;

  const sortSegmentByIndices = (data, indices, comparator) => {
    const n = indices.length;
    if (n < 2) return;
    const pixels = new Array(n);
    for (let i = 0; i < n; i++) {
      const idx = indices[i];
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      const a = data[idx + 3];
      const val = comparator === 'luma' ? (0.2126 * r + 0.7152 * g + 0.0722 * b) : (r + g + b);
      pixels[i] = { r, g, b, a, val };
    }
    pixels.sort((p, q) => p.val - q.val);
    for (let i = 0; i < n; i++) {
      const idx = indices[i];
      const p = pixels[i];
      data[idx] = p.r;
      data[idx + 1] = p.g;
      data[idx + 2] = p.b;
      data[idx + 3] = p.a;
    }
  };

  const scanAndSortHorizontal = (data, width, height, params) => {
    const { threshold, comparator = 'luma', segmentMode = 'runs', windowSize = 96, edgeGate = 0, maxRun = 512, bounds = null } = params;
    const b = getEffectBounds(width, height, bounds);
    const gate = threshold * 255;
    const edgeGate01 = clamp01(edgeGate);

    for (let y = b.y; y < b.y2; y++) {
      const rowBase = y * width * 4;
      if (segmentMode === 'windowed') {
        for (let x0 = b.x; x0 < b.x2; x0 += windowSize) {
          const x1 = Math.min(b.x2, x0 + windowSize);
          const seg = [];
          for (let x = x0; x < x1; x++) {
            const idx = rowBase + x * 4;
            const l = (0.2126 * data[idx] + 0.7152 * data[idx + 1] + 0.0722 * data[idx + 2]);
            if (l > gate) seg.push(idx);
          }
          if (seg.length > 1) sortSegmentByIndices(data, seg, comparator);
        }
        continue;
      }
      let seg = [];
      for (let x = b.x; x < b.x2; x++) {
        const idx = rowBase + x * 4;
        const l = (0.2126 * data[idx] + 0.7152 * data[idx + 1] + 0.0722 * data[idx + 2]);
        const isActive = l > gate;
        const hasEdgeWall = edgeGate01 > 0 && x > b.x && lumaDiff01(data, idx, idx - 4) > edgeGate01;
        const shouldBreak = (!isActive) || hasEdgeWall || (seg.length >= maxRun);
        if (shouldBreak) {
          if (seg.length > 1) sortSegmentByIndices(data, seg, comparator);
          seg = [];
        } else {
          seg.push(idx);
        }
      }
      if (seg.length > 1) sortSegmentByIndices(data, seg, comparator);
    }
  };

  const scanAndSortVertical = (data, width, height, params) => {
    const { threshold, comparator = 'luma', segmentMode = 'runs', windowSize = 96, edgeGate = 0, maxRun = 512, bounds = null } = params;
    const b = getEffectBounds(width, height, bounds);
    const gate = threshold * 255;
    const edgeGate01 = clamp01(edgeGate);

    for (let x = b.x; x < b.x2; x++) {
      if (segmentMode === 'windowed') {
        for (let y0 = b.y; y0 < b.y2; y0 += windowSize) {
          const y1 = Math.min(b.y2, y0 + windowSize);
          const seg = [];
          for (let y = y0; y < y1; y++) {
            const idx = (y * width + x) * 4;
            const l = (0.2126 * data[idx] + 0.7152 * data[idx + 1] + 0.0722 * data[idx + 2]);
            if (l > gate) seg.push(idx);
          }
          if (seg.length > 1) sortSegmentByIndices(data, seg, comparator);
        }
        continue;
      }
      let seg = [];
      for (let y = b.y; y < b.y2; y++) {
        const idx = (y * width + x) * 4;
        const l = (0.2126 * data[idx] + 0.7152 * data[idx + 1] + 0.0722 * data[idx + 2]);
        const isActive = l > gate;
        const hasEdgeWall = edgeGate01 > 0 && y > b.y && lumaDiff01(data, idx, idx - width * 4) > edgeGate01;
        const shouldBreak = (!isActive) || hasEdgeWall || (seg.length >= maxRun);
        if (shouldBreak) {
          if (seg.length > 1) sortSegmentByIndices(data, seg, comparator);
          seg = [];
        } else {
          seg.push(idx);
        }
      }
      if (seg.length > 1) sortSegmentByIndices(data, seg, comparator);
    }
  };

  const applyStructuralSort = (data, w, h, p) => {
    const dir = p.sortDirection || 'horizontal';
    if (dir === 'horizontal') scanAndSortHorizontal(data, w, h, p);
    else if (dir === 'vertical') scanAndSortVertical(data, w, h, p);
    else if (dir === 'both') {
      scanAndSortHorizontal(data, w, h, p);
      scanAndSortVertical(data, w, h, p);
    }
  };

  window.GlitchCore = {
    ...window.GlitchCore,
    applyStructuralSort,
  };
})();
