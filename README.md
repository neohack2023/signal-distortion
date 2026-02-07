GLITCH.ENG | Signal Distortion Unit
A browser-based, privacy-focused visual destruction tool designed for the modern web.
⚡ Origin & Inspiration
GLITCH.ENG was born out of a specific frustration: the lack of powerful, granular glitch art tools for mobile creators. While desktop users have access to processing scripts and complex software like After Effects, mobile users are often stuck with generic "filter" apps that apply pre-baked overlays.
We wanted to bring the raw, mathematical chaos of pixel sorting, buffer manipulation, and channel drifting directly to the browser. The goal was to create a "zero-upload" environment—where no image ever leaves your device—allowing for complete privacy and instant feedback.
It started as a simple experiment to sort pixels by brightness and evolved into a comprehensive suite of 6 unique distortion algorithms, specifically optimized to handle modern mobile photography formats like Apple's HEIC, bridging the gap between high-fidelity camera hardware and low-fidelity digital aesthetics.
🛠️ How to Use
GLITCH.ENG is a single-file application. There is no server to set up, no dependencies to install, and no build process required.
Launch: Simply open index.html in any modern web browser (Chrome, Safari, Firefox).
Upload: Click [ UPLOAD SOURCE ] to select an image.
Note: Supports JPG, PNG, WebP, and HEIC (iPhone) files.
Distort: Select an algorithm from the sidebar and adjust sliders to taste.
Export: Click [ EXPORT ARTIFACT ] to save the result as a PNG.
Backup: Click [ SYSTEM BACKUP ] to download a copy of the engine itself.
🎛️ Algorithm Guide
The engine features 6 distinct processing modes, each manipulating the image data differently:
1. Data Mosher
The Classic. Uses luma-gated pixel sorting combined with horizontal tearing. It isolates bright or dark areas of the image and "drags" them across the canvas, simulating a corrupted video keyframe.
Best for: Creating "melting" effects and liquid textures.
2. Spectral Drift
The Retrograde. Focuses on RGB channel separation and quantization. It offsets the Red, Green, and Blue channels spatially while reducing the color palette, mimicking a magnet held up to a CRT monitor.
Best for: VHS aesthetics, chromatic aberration, and lo-fi looks.
3. Palette Collapse
The Crusher. Uses a K-Means clustering approximation to reduce the image to a limited set of colors, then "rebounds" those colors into incorrect channels.
Best for: Posterized, high-contrast, and pop-art styles.
4. Scanline Failure
The Hardware glitch. Simulates a buffer overflow where rows of pixels are repeated, skipped, or decayed. It mimics a loose ribbon cable in a digital display.
Best for: Tech-noir, surveillance camera looks, and subtle interference.
5. Desync Echo
The Ghost. Creates a feedback loop where previous versions of the image are blended back on top with a slight offset, creating a motion-blur or "ghosting" trail.
Best for: Dreamy, ethereal, or drug-induced visual states.
6. Void Rot
The Destroyer. A heavy combination of structural tearing and decay scanlines. It aggressively shreds the image structure.
Best for: Horror themes, heavy distortion, and completely abstracting the source.
🎚️ Parameter Guide
Main Modulation
INTENSITY: The global strength multiplier. Controls how "much" of the effect is applied (e.g., how far pixels move, how many scanlines fail).
LUMA GATE: The threshold filter.
Low Value: Effects apply to almost everything.
High Value: Effects only apply to the brightest parts of the image.
CHROMA DRIFT: Controls the distance between Red, Green, and Blue channels. Crank this up for heavy color fringing.
Structural Controls
HORZ / VERT / BOTH: Determines the direction of pixel sorting and tearing.
RUNS vs WINDOW:
Runs: Sorts pixels until a threshold is met (more organic/streaky).
Window: Sorts pixels in fixed blocks (more grid-like/digital).
🧩 Extras & Advanced Features
Masking Mode: Click the [ MASK ] button in the preview window to draw a box. The glitch effects will only apply inside that box, leaving the rest of the image untouched.
Color Depth (Advanced Menu): Manually reduce the bit-depth of Red or Blue channels. Useful for emulating 8-bit or 16-bit era graphics.
Seed Reroll: The chaos is deterministic. If you don't like how a specific glitch looks, hit [ REROLL SEED ] to get a new random variation of the same effect.
HEIC Support: Integrated heic2any library automatically converts iPhone photos to readable data on the fly.
🐛 Known Issues / Bugs
High-Res Performance: Processing 12MP+ images (4000x3000) heavily relies on your device's CPU. On older mobile devices, dragging sliders might feel slightly sluggish as the engine re-calculates millions of pixels in real-time.
HEIC Conversion Speed: When uploading a generic HEIC file, there is a 1-3 second delay while the browser converts it to JPEG. This is normal behavior.
Memory Limits: Extremely large panoramas (>8000px wide) may crash the mobile browser tab due to RAM limits.
📄 License
This project is open-source. You are free to modify, distribute, and use it for personal or commercial art.
Engineered for signal loss.
