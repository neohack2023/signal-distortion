# Daily Research Note - 2026-06-21

Status: candidate/working note for developer + LLM review. Do not treat as canon until reviewed.

## Repo context read
- README describes GLITCH.ENG / Signal Distortion Unit as a browser-based, privacy-focused visual destruction tool for mobile creators.
- The app is single-file, zero-upload, dependency-light, and supports JPG, PNG, WebP, and HEIC conversion.
- Current distortion modes include Data Mosher, Spectral Drift, Palette Collapse, Scanline Failure, Desync Echo, and Void Rot.
- Known issues include high-resolution CPU cost, HEIC conversion delay, and mobile memory limits.

## Why this matters
The repo’s strength is mobile-local privacy and fast visual destruction. Research should focus on performance, memory safety, and repeatable exports before adding more effects.

## Current external findings
- MDN WebGPU guidance recommends capability detection through `navigator.gpu`, adapter request, and device request before using GPU paths. Source: https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API
- GitHub Actions secure-use guidance recommends least-privilege automation and careful handling of untrusted content/artifacts. Source: https://docs.github.com/en/actions/reference/security/secure-use

## Candidate implementation ideas
1. Add a performance budget table for mobile image sizes: thumbnail preview, medium working canvas, original export path.
2. Add a memory-safe downscale prompt for images over a configurable pixel count.
3. Add an effect receipt in exported PNG metadata or sidecar JSON: algorithm, seed, sliders, input dimensions, output dimensions.
4. Add a Web Worker or OffscreenCanvas research spike before attempting WebGPU.

## Risks / drift warnings
- Do not break zero-upload privacy posture.
- Do not add GPU paths without CPU fallback and memory guards.
- Avoid adding algorithms before existing modes have repeatable parameter receipts.

## Next dev / LLM actions
- Draft mobile performance budget docs.
- Add sidecar export receipt schema.
- Add a test image matrix: small, 12MP, panoramic, HEIC converted.
