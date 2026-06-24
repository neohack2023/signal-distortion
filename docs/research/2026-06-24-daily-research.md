# Daily Research Note - 2026-06-24

Status: candidate/working note for developer + LLM review. Do not treat as canon until reviewed.

## Repo context read
- Repo context and recent PRs frame signal-distortion around effect receipts, mobile performance budgets, zero-upload privacy, and OffscreenCanvas-style separation.

## Why this matters
Signal effects should stay playful without becoming a battery-melting privacy goblin. Performance and privacy receipts make that reviewable.

## Useful findings
- MDN WebGPU docs support progressive enhancement and fallback checks for advanced GPU paths: https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API
- GitHub Actions secure-use guidance supports careful artifact/log handling and least-privilege workflows: https://docs.github.com/en/actions/reference/security/secure-use

## Candidate implementation ideas
1. Define `EffectRunReceipt` with input kind, effect chain, timing budget, frame budget, and export status.
2. Add a mobile budget table for low/mid/high effect intensity.
3. Keep zero-upload privacy wording in README and export docs.
4. Add CI smoke tests for effect config parsing.

## Risks / drift warnings
- Do not imply private/local processing if any upload path is added later.
- Avoid GPU-only effects without fallback.
- Keep generated effect chains candidate until previewed.

## Next suggested dev / LLM actions
- Draft performance/privacy receipt schema.
- Add one mobile budget fixture.
- Add docs warning for heavy effect chains.
