# GLITCH.ENG

**Signal Distortion Unit** is a browser-based image-processing tool for creating destructive digital-art effects with pixel sorting, channel drift, palette reduction, scanline failures, echo trails, and structural tearing.

The image-processing pipeline runs in your browser. Source images are read locally, processed on a canvas, and exported as PNG files without an application server or upload endpoint.

> **Privacy note:** Your selected image is not intentionally uploaded by GLITCH.ENG. The current build does load application libraries and fonts from third-party CDNs, so an internet connection is required unless those dependencies are hosted locally.

## Features

- Six distortion algorithms with live parameter updates
- Source, result, and draggable split-preview modes
- Region masking for localized effects
- Deterministic seed rerolling for alternate variations
- RGB bit-depth controls
- Signal histogram display
- Local PNG export
- Responsive browser interface for desktop and mobile use

## Run the Application

GLITCH.ENG does not require a package manager or build command.

1. Clone or download this repository.
2. Open `index.html` in a modern browser.
3. Select **UPLOAD SOURCE** and choose an image.
4. Select an algorithm and adjust the controls.
5. Use **EXPORT ARTIFACT** to save the processed image as a PNG.

Because React, Babel, Tailwind CSS, and fonts are loaded from external CDNs, the current version normally requires an internet connection when the page starts.

## Supported Images

The browser is asked to accept image files, and common browser-readable formats such as the following should work:

- JPEG / JPG
- PNG
- WebP

**HEIC is not supported in the current version.** Convert HEIC images to JPEG, PNG, or WebP before loading them.

Images whose width or height exceeds 1920 pixels are resized proportionally before processing. This improves responsiveness and reduces memory pressure, but exported results use the resized working dimensions rather than the original full resolution.

## Workflow

### 1. Load a source

Select **UPLOAD SOURCE** to choose an image from your device. A built-in starter image is displayed when the application first opens.

### 2. Choose an algorithm

The selected algorithm determines the main distortion process. Shared structural and modulation controls can still influence multiple modes.

### 3. Adjust the effect

Changes are reprocessed automatically. No separate apply button is required.

### 4. Inspect the result

Use the preview controls in the top bar:

- **SRC** displays the source image.
- **SPLIT** displays a draggable source/result comparison.
- **RES** displays the processed result.

### 5. Export

Select **EXPORT ARTIFACT** to download the current canvas as a timestamped PNG file.

## Algorithm Reference

### Data Mosher

Performs luma-gated structural sorting. Pixels are grouped and reordered according to brightness thresholds, direction, and segmentation mode.

**Useful for:** stretched textures, horizontal or vertical smears, liquid-looking displacement, and broken-frame artifacts.

### Spectral Drift

Offsets and quantizes color channels to produce RGB separation and reduced color fidelity.

**Useful for:** chromatic displacement, CRT-like color failure, degraded digital color, and lo-fi signal effects.

### Palette Collapse

Reduces local color complexity through chunk-based palette processing and channel rebinding.

**Useful for:** posterization, hard color blocks, pop-art treatment, and compressed-palette artifacts.

### Scanline Failure

Processes image rows using repeat, band, or decay behavior.

**Useful for:** frozen buffers, repeated rows, damaged displays, scanline loss, and surveillance-style interference.

Additional controls appear for this algorithm:

- **Mode:** Repeat, Bands, or Decay
- **Density / Skip Frequency:** Controls how frequently rows are affected
- **Strength:** Controls the intensity of the scanline operation

### Desync Echo

Blends shifted image data back into the frame using additive, subtractive, or mixed echo behavior.

**Useful for:** ghost trails, offset doubles, motion residue, and layered signal feedback.

Additional controls appear for this algorithm:

- **Mode:** Add, Subtract, or Mix
- **Shift:** Pixel distance used by the echo
- **Opacity:** Echo contribution strength
- **Banded Echo:** Restricts echo behavior into bands

### Void Rot

Combines aggressive structural tearing with destructive channel and scanline behavior.

**Useful for:** severe image breakdown, horror textures, shredded geometry, and abstraction of the source.

## Control Reference

### Structure

**Direction**

- **HORZ:** Processes primarily across rows
- **VERT:** Processes primarily across columns
- **BOTH:** Combines horizontal and vertical processing

**Segmentation**

- **RUNS:** Uses threshold-bounded pixel runs for irregular streaks
- **WINDOW:** Uses fixed-size processing windows for more block-like distortion

### Modulation

- **Intensity:** Global effect strength used by the active algorithm
- **Luma Gate:** Brightness threshold that determines which image regions are eligible for some operations
- **Chroma Drift:** Controls color-channel displacement or related color distortion

### Color Depth

The advanced color-depth panel exposes separate red and blue bit-depth controls. Lower values reduce channel precision and produce stronger quantization artifacts.

### Seed

**REROLL SEED** generates another deterministic variation while retaining the current algorithm and parameter settings.

## Masking

Select **MASK**, then drag across the image to define a rectangular processing region. The active distortion is limited to that region.

Use **CLEAR MASK** to remove the selection and return processing to the full image.

Mask coordinates are stored relative to the displayed image, so the selected region remains aligned with the processed canvas.

## Architecture

The project is a static, client-side application organized into several layers:

```text
index.html
js/
├── app.js                 # React interface and processing lifecycle
├── config.js              # Defaults, algorithm registry, UI options
├── algorithms/            # Composite distortion modes
├── core/                  # Shared sorting and utility logic
├── effects/               # Reusable pixel-processing operations
└── ui/                    # Starter image and interface helpers
```

Processing follows this path:

```text
source image
    ↓
canvas draw
    ↓
ImageData pixel buffer
    ↓
selected algorithm
    ↓
canvas update
    ↓
PNG preview and export
```

## Technical Notes

- Processing occurs on the browser main thread.
- Parameter changes trigger automatic reprocessing after a short delay.
- The canvas uses `willReadFrequently` because pixel buffers are read repeatedly.
- Export uses `canvas.toDataURL('image/png')`.
- Very large inputs are downscaled to keep processing practical.
- The application currently depends on CDN-hosted React 18, ReactDOM, Babel, Tailwind CSS, JetBrains Mono, and Inter.

## Limitations

- HEIC files are rejected by the current upload handler.
- Inputs larger than 1920 pixels on either axis are downscaled.
- Large or complex images may process slowly on older phones and low-power devices.
- Repeated slider movement can cause visible processing overlays because each change recalculates the pixel buffer.
- The current CDN-based setup is not fully offline and may be affected by network restrictions, content blockers, or CDN outages.
- Processing and export are raster-only; project files and editable effect presets are not currently saved.

## Development

The application can be modified directly without compiling a bundle. Most changes fall into one of these areas:

- Add shared pixel operations in `js/effects/`
- Add or revise composite modes in `js/algorithms/`
- Register algorithms and defaults in `js/config.js`
- Update controls and processing flow in `js/app.js`

When adding a new algorithm:

1. Implement its runner in `js/algorithms/`.
2. expose it through `window.GlitchAlgorithms`.
3. Load its script in `index.html` before `js/app.js`.
4. Register its ID, name, and description in `js/config.js`.
5. Add the runner to `algorithmRunners` in `js/app.js`.
6. Document any mode-specific controls here.

## License

No license file is currently included in this repository. Until a license is added, normal copyright restrictions apply even though the source is publicly visible.

Add an explicit `LICENSE` file before inviting reuse, redistribution, modification, or commercial use.

---

**Engineered for signal loss.**