# Daily Research Note - 2026-06-22

Status: candidate/working note for developer + LLM review. Do not treat as canon until reviewed.

## Repo context read
- README frames Signal Distortion / GLITCH.ENG as a browser-based, privacy-focused visual destruction tool for mobile creators.
- Current constraints include single-file operation, zero-upload privacy, dependency-light design, image import/export, and mobile memory limits.
- Prior notes identify performance budgets, parameter receipts, and worker/offscreen experiments as safer next steps than adding more effects.

## Why this matters
The strongest feature is not another distortion knob; it is mobile-local reliability. The next research target should make effects repeatable, bounded, and exportable without boiling the phone.

## Useful findings with sources
- MDN documents `OffscreenCanvas` as a way to decouple canvas work from the DOM and run rendering in a worker context. Source: https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas
- MDN WebGPU guidance requires capability detection before entering GPU paths, which supports a fallback-first design. Source: https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API
- GitHub Actions secure-use guidance is relevant for checking generated artifacts and keeping automation least-privilege. Source: https://docs.github.com/en/actions/reference/security/secure-use

## Candidate implementation ideas
1. Add `EffectReceipt`: input dimensions, working dimensions, output dimensions, algorithm, seed, sliders, memory tier, and export timestamp.
2. Add a `performance-budget.md` table for small, 12MP, panorama, and converted HEIC images.
3. Add a worker/offscreen spike behind a feature flag before any WebGPU path.
4. Add a sidecar JSON export option for repeatable creative receipts.

## Risks / drift warnings
- Do not break zero-upload privacy posture.
- Do not add GPU-only effects without CPU fallback.
- Avoid adding new effects before current effects have stable parameter receipts.

## Next dev / LLM actions
- Draft `EffectReceipt` and performance budget docs.
- Add one test matrix with small, large, wide, and converted image cases.
- Add a feature-flag note for worker/offscreen rendering experiments.
