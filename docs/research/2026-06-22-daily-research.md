# Daily Research Note - 2026-06-22

Status: candidate/working note for developer + LLM review. Do not treat as canon until reviewed.

## Repo context read
- Prior notes identify Signal Distortion Unit as a browser-based privacy-focused visual destruction tool for mobile creators.
- The app is single-file, zero-upload, dependency-light, and supports local image distortion modes such as Data Mosher, Spectral Drift, Palette Collapse, Scanline Failure, Desync Echo, and Void Rot.
- Known issues include high-resolution CPU cost, HEIC conversion delay, and mobile memory limits.

## Why this matters
The product promise is mobile-local chaos with privacy intact. The useful next research is memory-safe export receipts and performance budgets before adding any more distortion gremlins.

## Useful findings with citations
- MDN WebGPU docs recommend capability detection before using GPU paths. Source: https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API
- web.dev recommends performance budgets as explicit limits on metrics that affect site performance. Source: https://web.dev/articles/performance-budgets-101
- GitHub Actions secure-use guidance recommends careful artifact handling and least-privilege automation. Source: https://docs.github.com/en/actions/reference/security/secure-use

## Candidate implementation ideas
1. Add `DistortionExportReceipt`: input dimensions, working canvas size, mode, slider values, seed, output size, privacy note.
2. Add a mobile performance budget table for preview, working canvas, and export.
3. Add downscale warnings for images over a configurable pixel count.
4. Research Web Worker or OffscreenCanvas before WebGPU.

## Risks / drift warnings
- Do not break zero-upload posture.
- Do not add GPU-only paths without CPU fallback.
- Do not add new effects before existing modes can be reproduced from receipts.

## Next dev / LLM actions
- Draft sidecar receipt schema.
- Add a test matrix for small, large, panorama, and HEIC-converted images.
- Add a one-page mobile memory budget.
