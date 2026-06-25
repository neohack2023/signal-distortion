# Daily Research Note - 2026-06-25

Status: candidate/working note for developer + LLM review. Do not treat as canon until reviewed.

## Repo context read
- Repo metadata describes signal-distortion as a web-based privacy-focused glitch-art tool with pixel sorting, channel drifting, buffer failure, and mobile optimization.
- Prior notes focused on effect receipts, mobile performance budgets, OffscreenCanvas paths, and zero-upload privacy.
- The repo benefits from visible creative controls paired with reproducible export recipes.

## Why this matters
Glitch-art output should feel wild, but the tool itself should be controlled: repeatable presets, local-only guarantees, and performance budgets for phones.

## Useful findings with citations
- Vite’s guide supports lightweight browser builds and current Node requirements. Source: https://vite.dev/guide/
- GitHub secure-use guidance recommends least-privilege automation and caution with generated artifacts. Source: https://docs.github.com/en/actions/reference/security/secure-use
- MDN WebGPU guidance supports capability detection if GPU acceleration is explored later. Source: https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API

## Candidate implementation ideas
1. Add `effect_recipe.json`: source hash, preset, slider values, seed, output size, export profile, and warnings.
2. Add a mobile performance budget table for image dimensions, worker use, and frame time.
3. Add a privacy note that confirms no upload path exists unless future features add one.
4. Add visual regression fixtures for one small test image.

## Risks / drift warnings
- Do not imply cloud processing when the tool is local-only.
- Keep experimental GPU features behind fallback logic.
- Avoid default presets that cause excessive flashing or unreadable output.

## Next suggested dev / LLM actions
- Draft `docs/EFFECT_RECIPES.md`.
- Add one fixture image and expected recipe metadata.
- Add a mobile smoke test target for common viewport sizes.
