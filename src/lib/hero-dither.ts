const bayer = [
  0, 48, 12, 60, 3, 51, 15, 63,
  32, 16, 44, 28, 35, 19, 47, 31,
  8, 56, 4, 52, 11, 59, 7, 55,
  40, 24, 36, 20, 43, 27, 39, 23,
  2, 50, 14, 62, 1, 49, 13, 61,
  34, 18, 46, 30, 33, 17, 45, 29,
  10, 58, 6, 54, 9, 57, 5, 53,
  42, 26, 38, 22, 41, 25, 37, 21,
].map((level) => (level + 0.5) / 64);

export function mountDither(
  canvas: HTMLCanvasElement,
  source: string,
  onReady: () => void,
  motion: MediaQueryList,
) {
  const buffer = document.createElement("canvas");
  const drawingContext = canvas.getContext("2d");
  const samplingContext = buffer.getContext("2d", { willReadFrequently: true });
  if (!drawingContext || !samplingContext) return null;
  const context: CanvasRenderingContext2D = drawingContext;
  const sampler: CanvasRenderingContext2D = samplingContext;

  const image = new Image();
  const styles = getComputedStyle(canvas);
  const readNumber = (token: string) => Number(styles.getPropertyValue(token));
  const cellSize = readNumber("--hero-dot-size");
  const focusY = readNumber("--hero-image-focus");
  const period = readNumber("--hero-sweep-period");
  const interval = readNumber("--hero-frame-interval");
  const strength = readNumber("--hero-sweep-strength");
  const gamma = readNumber("--hero-dither-gamma");
  const shadowCutoff = readNumber("--hero-shadow-cutoff");

  function sampleColor(token: string) {
    sampler.fillStyle = styles.getPropertyValue(token).trim();
    sampler.fillRect(0, 0, 1, 1);
    return sampler.getImageData(0, 0, 1, 1).data;
  }

  const low = sampleColor("--hero-ink-low");
  const high = sampleColor("--hero-ink-high");

  let frame: ImageData | undefined;
  let values = new Float32Array(0);
  let sweepAngles = new Float32Array(0);
  let visible = false;
  let paused = false;
  let request = 0;
  let phase = 0;
  let lastPaint = 0;
  let deviceCellSize = 1;

  function paint(animate: boolean) {
    if (!frame) return;

    const { data, width, height } = frame;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const index = y * width + x;
        const band = animate ? (0.5 + 0.5 * Math.cos(sweepAngles[index] - phase)) ** 6 : 0;
        const threshold = bayer[(y % 8) * 8 + x % 8];
        const density = values[index] * (1 + strength * band);
        data[index * 4 + 3] = density > threshold ? 255 : 0;
      }
    }
    sampler.putImageData(frame, 0, 0);
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(buffer, 0, 0, width * deviceCellSize, height * deviceCellSize);
  }

  function measure() {
    if (!image.naturalWidth) return;
    const { width, height } = canvas.getBoundingClientRect();
    if (!width || !height) return;

    const dpr = window.devicePixelRatio || 1;
    const outputWidth = Math.max(1, Math.round(width * dpr));
    const outputHeight = Math.max(1, Math.round(height * dpr));
    const nextCellSize = Math.max(1, Math.round(cellSize * dpr));
    if (frame && canvas.width === outputWidth && canvas.height === outputHeight && deviceCellSize === nextCellSize) return;
    const firstFrame = !frame;
    deviceCellSize = nextCellSize;
    const columns = Math.ceil(outputWidth / deviceCellSize);
    const rows = Math.ceil(outputHeight / deviceCellSize);

    const ratio = Math.max(columns / image.naturalWidth, rows / image.naturalHeight);
    const cropWidth = columns / ratio;
    const cropHeight = rows / ratio;
    const cropX = (image.naturalWidth - cropWidth) / 2;
    const cropY = (image.naturalHeight - cropHeight) * focusY;

    canvas.width = outputWidth;
    canvas.height = outputHeight;
    context.imageSmoothingEnabled = false;
    buffer.width = columns;
    buffer.height = rows;
    sampler.imageSmoothingQuality = "high";
    sampler.drawImage(image, cropX, cropY, cropWidth, cropHeight, 0, 0, columns, rows);
    const pixels = sampler.getImageData(0, 0, columns, rows).data;
    frame = sampler.createImageData(columns, rows);
    values = new Float32Array(columns * rows);
    sweepAngles = new Float32Array(values.length);

    for (let index = 0; index < values.length; index++) {
      const offset = index * 4;
      const luminance = pixels[offset] / 255;
      const shadowFade = Math.min(1, luminance / shadowCutoff);
      values[index] = luminance ** gamma * shadowFade;
      sweepAngles[index] = 2 * Math.PI * ((index % columns) / columns * 0.9 + Math.floor(index / columns) / rows * 0.35);

      for (let channel = 0; channel < 3; channel++) {
        frame.data[offset + channel] = low[channel] + (high[channel] - low[channel]) * luminance;
      }
    }

    paint(!motion.matches);
    if (firstFrame) onReady();
  }

  function tick(now: number) {
    if (now - lastPaint >= interval) {
      const elapsed = now - lastPaint;
      phase = (phase + elapsed * 2 * Math.PI / period) % (2 * Math.PI);
      lastPaint = now;
      paint(true);
    }
    request = requestAnimationFrame(tick);
  }

  function syncAnimation() {
    if (visible && frame && !paused && !motion.matches && !document.hidden) {
      if (!request) {
        lastPaint = performance.now();
        request = requestAnimationFrame(tick);
      }
    } else {
      cancelAnimationFrame(request);
      request = 0;
    }
  }

  function updateMotion() {
    paint(!motion.matches);
    syncAnimation();
  }

  const resize = new ResizeObserver(measure);
  const intersection = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    syncAnimation();
  });

  image.onload = () => {
    measure();
    resize.observe(canvas);
    intersection.observe(canvas);
  };
  image.src = source;
  window.addEventListener("resize", measure);
  document.addEventListener("visibilitychange", syncAnimation);
  motion.addEventListener("change", updateMotion);

  return {
    setPaused(value: boolean) {
      paused = value;
      syncAnimation();
    },
    dispose() {
      image.onload = null;
      resize.disconnect();
      intersection.disconnect();
      cancelAnimationFrame(request);
      window.removeEventListener("resize", measure);
      document.removeEventListener("visibilitychange", syncAnimation);
      motion.removeEventListener("change", updateMotion);
    },
  };
}
