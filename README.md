# GLITCH.ENG

**Signal Distortion Unit** is a browser-based image corruption engine for creating glitch art without uploading source images to a remote server.

It turns ordinary images into damaged signals through pixel sorting, RGB displacement, palette reduction, scanline failures, echo trails, and structural tearing. The interface is designed to work on both desktop and mobile browsers while keeping the editing loop immediate and local.

## What It Does

GLITCH.ENG provides six destructive image-processing modes:

| Algorithm | Processing behavior | Useful for |
| --- | --- | --- |
| **Data Mosher** | Luma-gated pixel sorting with directional displacement | Melted forms, streaks, and dragged textures |
| **Spectral Drift** | RGB-channel offsets and channel quantization | Chromatic separation, CRT damage, and lo-fi color fracture |
| **Palette Collapse** | Chunk-based posterization and palette rebinding | Reduced-color graphics, hard contrast, and pop-art corruption |
| **Scanline Failure** | Repeated, skipped, frozen, or weakened pixel bands | Display faults, surveillance noise, and broken-screen effects |
| **Desync Echo** | Offset image feedback blended into the current frame | Ghost trails, motion residue, and layered silhouettes |
| **Void Rot** | Aggressive tearing combined with structural decay | Heavy abstraction, horror imagery, and near-total source destruction |

## Core Features

- Local, browser-side image processing
- Six independent distortion algorithms
- Live parameter adjustment
- Horizontal, vertical, and combined structural processing
- Run-based and fixed-window pixel sorting
- Luma threshold and edge-gating controls
- RGB bit-depth reduction and chroma drift
- Palette, scanline, echo, and rebinding controls
- Selection masking for localized damage
- Before-and-after comparison views
- Signal histogram display
- Deterministic seeds with reroll support
- PNG export
- Responsive desktop and mobile interface

## Privacy Model

Image decoding, processing, preview generation, and export happen in the browser. GLITCH.ENG does not include an application server or an image-upload pipeline.

The interface does load framework, styling, and font resources from external CDNs, so opening the application may still create normal network requests for those dependencies. Your selected image is processed locally by the browser.

## Running the Project

No build step or package installation is required.

### Option 1: Open directly

1. Download or clone the repository.
2. Open `index.html` in a modern browser.
3. Select an image using the upload control.
4. Choose an algorithm and adjust its parameters.
5. Export the processed result as a PNG.

### Option 2: Serve locally

Some browsers apply stricter rules to files opened through `file://`. A small local web server provides the most consistent behavior.

```bash
python3 -m http.server 8080
```

Then open:

```text
http://localhost:8080
```

## Supported Input

The current version accepts browser-readable raster image formats such as:

- JPEG
- PNG
- WebP

**HEIC is not currently supported.** Convert HEIC images to JPEG or PNG before importing them.

## Processing Limits

Imported images are resized for processing when either dimension exceeds 1,920 pixels. This keeps the editing loop responsive and reduces browser memory pressure, especially on mobile devices.

Performance still depends on image complexity, algorithm choice, and device hardware. Large images and aggressive settings may take longer to recalculate.

## Controls

### Primary modulation

- **Intensity** controls the overall strength of the selected algorithm.
- **Luma Gate** determines which brightness ranges are affected.
- **Chroma Drift** controls RGB-channel separation.
- **Seed** controls deterministic variation. Rerolling produces a different result without changing the rest of the setup.

### Structural processing

- **HORZ** processes rows.
- **VERT** processes columns.
- **BOTH** combines both directions.
- **RUNS** builds variable-length distortion segments from threshold conditions.
- **WINDOW** processes fixed-size blocks for a more mechanical result.

### Advanced processing

Depending on the selected algorithm, advanced controls expose:

- Window and run size
- Edge gating
- Per-channel bit depth
- Dithering
- Channel rebinding
- Palette size and chunking
- Scanline mode, count, and strength
- Echo blend mode, shift, alpha, and banding

### Masking

Switch to mask mode and draw a rectangular selection over the preview. Processing is then limited to that selected region. Clear the mask to return to full-frame distortion.

## Project Structure

```text
signal-distortion/
├── index.html
└── js/
    ├── app.js
    ├── config.js
    ├── algorithms/
    ├── core/
    ├── effects/
    └── ui/
```

- `index.html` loads the interface and browser dependencies.
- `js/app.js` manages application state, image loading, preview processing, masking, comparison, and export.
- `js/config.js` defines algorithms and default parameters.
- `js/algorithms/` contains the six processing pipelines.
- `js/effects/` contains reusable image-manipulation operations.
- `js/core/` contains structural sorting and shared utilities.
- `js/ui/` contains starter-image and interface support code.

## Browser Dependencies

The application currently loads the following resources from CDNs:

- React 18
- ReactDOM 18
- Babel Standalone
- Tailwind CSS
- Google Fonts

Because Babel transforms JSX in the browser, this project favors portability and easy experimentation over production bundle optimization.

## Known Constraints

- HEIC files are rejected by the current loader.
- Processing runs on the browser's main thread and may pause briefly on slower devices.
- Export output is PNG.
- Very aggressive settings can intentionally destroy most recognizable source detail.
- Direct `file://` execution may behave differently across browsers. Use a local server when necessary.

## Development Direction

Potential next steps include:

- Web Worker or OffscreenCanvas processing
- Native HEIC conversion
- Preset import and export
- Multi-effect processing chains
- Undo and history snapshots
- Full-resolution background export
- Offline dependency bundling

## License

No license file is currently included in this repository. Until one is added, standard copyright rules apply.

---

**Engineered for signal loss.**