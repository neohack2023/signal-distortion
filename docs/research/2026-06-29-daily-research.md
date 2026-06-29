# Daily Research Note - 2026-06-29

Status: candidate / working note. Review before promotion.

## Repo context read
- Prior repo context frames signal-distortion as a browser visual/effect tool with zero-upload privacy, mobile performance concerns, export receipts, and effect-state receipts.
- Recent research passes emphasized mobile performance budgets and OffscreenCanvas/export boundaries.

## Why this matters
Signal effects are strongest when they are reproducible and exportable. The useful lane is a small performance-and-effect receipt that explains what changed, how heavy it is, and whether it can export reliably.

## Useful findings
- MDN WebGPU docs support progressive enhancement and capability checks before using GPU paths: https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API
- Vite provides a compact local dev/build loop for browser-first experiments: https://vite.dev/guide/
- GitHub Actions secure-use guidance recommends least-privilege tokens and careful artifact/log handling: https://docs.github.com/en/actions/reference/security/secure-use

## Candidate implementation ideas
1. Add an `EffectReceipt`: input mode, effect chain, intensity, frame budget, export support, and warnings.
2. Add a mobile budget table: target FPS, max canvas size, memory warning threshold, and fallback mode.
3. Add fixtures for export-safe vs preview-only effect chains.
4. Keep any worker/OffscreenCanvas path behind feature detection and a fallback renderer.

## Risks / drift warnings
- Do not claim mobile-safe until a budget test exists.
- Do not mix preview-only effects with export guarantees.
- Avoid uploading or remote-processing user media unless the privacy model changes explicitly.

## Next suggested dev / LLM actions
- Draft the effect receipt schema.
- Add one performance smoke check.
- Keep zero-upload privacy prominent in docs and UI copy.