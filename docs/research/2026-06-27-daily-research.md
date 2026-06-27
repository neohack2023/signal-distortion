# Daily Research Note - 2026-06-27

Status: candidate/working note for developer + LLM review. Do not treat as canon until reviewed.

## Repo context read
- Prior passes identify signal-distortion as a browser/mobile visual effects project with effect receipts, zero-upload privacy, and performance budgets.
- Recent notes focused on mobile performance and OffscreenCanvas-style separation.

## Why this matters
Signal effects can drift into GPU fireworks fast. A receipt-first pipeline keeps each distortion preset explainable, testable, and mobile-safe.

## Useful findings with citations
- WebGPU should be feature-detected and treated as device-dependent: https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API
- Vite supports fast local browser app iteration: https://vite.dev/guide/
- GitHub Actions secure-use guidance recommends least-privilege CI and careful artifacts: https://docs.github.com/en/actions/reference/security/secure-use

## Candidate implementation ideas
1. Add an `effect-receipt` schema with preset_id, input_mode, shader_or_canvas_path, frame_budget_ms, fallback_path, and privacy_status.
2. Add a mobile budget doc: 30fps/60fps target, max texture size notes, reduced-motion mode.
3. Add one CPU/canvas fallback fixture before WebGPU expansion.
4. Add a CI check that validates preset metadata only.

## Risks / drift warnings
- Do not require upload/cloud processing for privacy-sensitive media.
- Do not ship GPU-only effects without fallback.
- Do not judge quality without frame-budget evidence.

## Next suggested dev / LLM actions
- Draft preset receipt schema.
- Add one low-cost fallback effect.
- Add a manual mobile test checklist.
