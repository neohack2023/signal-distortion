(() => {
  const createStarterImage = (onLoad) => {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 800;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createLinearGradient(0, 0, 1200, 800);
    grad.addColorStop(0, '#1a1a2e');
    grad.addColorStop(0.5, '#16213e');
    grad.addColorStop(1, '#0f3460');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1200, 800);
    ctx.fillStyle = '#e94560';
    ctx.beginPath();
    ctx.arc(600, 400, 200, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 120px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('GLITCH', 600, 430);

    const url = canvas.toDataURL();
    const img = new Image();
    img.onload = () => onLoad(img, url);
    img.src = url;
  };

  const hideLoader = () => {
    const loader = document.getElementById('loader');
    if (loader) loader.style.opacity = '0';
    setTimeout(() => {
      if (loader) loader.style.display = 'none';
    }, 500);
  };

  window.GlitchUI = {
    createStarterImage,
    hideLoader,
  };
})();
