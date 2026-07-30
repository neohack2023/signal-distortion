# Daily Research Note - 2026-06-23

Status: candidate/working note for developer + LLM review. Do not treat as canon until reviewed.

## Repo context read
- Signal Distortion centers on effect receipts, mobile performance budgets, privacy boundaries, and visual/audio transforms.
- Prior notes emphasize zero-upload behavior and explicit render/export receipts.

## Why this matters
The repo should know why an effect was applied, how expensive it is, and whether it stays local before adding more distortion presets.

## Useful findings with citations
- MDN documents `AnalyserNode` access to time and frequency data for browser-side signal features. Source: https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode
- GitHub secure-use guidance supports careful workflow permissions and generated-artifact handling. Source: https://docs.github.com/en/actions/reference/security/secure-use

## Implementation ideas
1. Add an `effect_receipt` with source signal, parameters, expected output, runtime budget, and privacy note.
2. Add mobile performance budgets for preview FPS and memory usage.
3. Add fixtures for no-audio, low-signal, clipping, and export mismatch.
4. Add a local-only processing statement in docs before upload/export features.

## Risks / drift warnings
- Do not add presets without parameter receipts.
- Avoid cloud processing assumptions unless explicitly documented.
- Keep aesthetic labels separate from measurable signal changes.

## Next suggested dev / LLM actions
- Draft `docs/EFFECT_RECEIPTS.md`.
- Add first mobile budget checklist.
- Add a fixture for clipping/overdrive safety warnings.
