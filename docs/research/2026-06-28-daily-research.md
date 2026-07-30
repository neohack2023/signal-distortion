# Daily Research Note - 2026-06-28

Status: candidate / working note for developer + LLM review. Do not treat as canon until reviewed.

## Repo context read
- README defines GLITCH.ENG as a browser-based, privacy-focused visual destruction tool for mobile creators.
- It emphasizes zero-upload processing, six distortion algorithms, HEIC support, deterministic seed reroll, and known high-res mobile performance limits.
- Recent open PR history focused on effect receipts, mobile frame budgets, and fallback paths.

## Why this matters
The tool’s identity is high-control browser glitching without uploads. A per-effect receipt plus mobile performance budget would make outputs repeatable and help avoid slider chaos turning into untraceable artifacts.

## Useful findings
- GitHub Actions secure-use guidance recommends least-privilege automation and careful secret/log handling. Source: https://docs.github.com/en/actions/reference/security/secure-use
- Browser graphics/performance research should stay capability-aware; WebGPU is available only behind feature detection. Source: https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API
- Vite can be considered later if the single-file app grows beyond simple maintenance. Source: https://vite.dev/guide/

## Implementation ideas
1. Add `EffectReceipt`: source dimensions, algorithm, seed, slider values, mask bounds, processing time, memory warning, and output checksum.
2. Add a mobile budget table for common source sizes: 1080p, 12MP, panorama.
3. Add a quality toggle: preview scale vs export scale.
4. Add a warning when HEIC conversion or canvas allocation exceeds safe thresholds.

## Risks / drift warnings
- Do not abandon zero-upload privacy without explicit architecture review.
- Avoid adding frameworks before the single-file workflow actually hurts maintenance.
- Do not promise large panorama support on mobile without memory tests.

## Next dev / LLM actions
- Draft `docs/effect-receipt-format.md`.
- Add a manual performance log template.
- Add UI copy for preview-scale vs export-scale behavior.
