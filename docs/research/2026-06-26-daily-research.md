# Daily Research Note - 2026-06-26

Status: candidate / working note for developer and LLM review.

## Repo context read
- Repo direction centers on browser/mobile-friendly signal distortion effects, receipts, performance budgets, and zero-upload privacy.
- Prior notes emphasized effect receipts and mobile performance constraints.

## Why this matters
The next useful research slice is an effect-budget receipt that links each visual/audio distortion to device cost and user-visible result.

## Useful findings
- MDN Web Audio `AnalyserNode` documents time-domain and frequency-domain data access for browser analysis: https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode
- Vite provides a lightweight app build baseline for browser tools: https://vite.dev/guide/
- GitHub Actions secure-use guidance supports least-privilege validation for generated artifacts: https://docs.github.com/en/actions/reference/security/secure-use

## Candidate implementation ideas
1. Add `EffectBudgetReceipt`: effect id, input size, frame time estimate, memory note, mobile risk, and fallback path.
2. Add a fixture that classifies effects as safe, caution, or blocked for mobile.
3. Add docs for zero-upload local processing promises.
4. Add LLM rule: suggest parameter changes, not hidden cloud processing.

## Risks / drift warnings
- Do not exceed mobile budgets without a visible warning.
- Do not imply privacy if files leave device/runtime.
- Avoid adding heavy dependencies before baseline profiling.

## Next suggested dev / LLM actions
- Draft the receipt schema.
- Add one performance-budget fixture.
- Add a docs badge for local-only processing status.
