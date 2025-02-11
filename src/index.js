class IDWatermark {

  #options = {};

  /**
   * Initializes the IDWatermark instance with the provided options.
   *
   * @param {Object} options - Configuration options for the watermark.
   */
  constructor(options = {}) {
    this.#options = Object.assign(IDWatermark.defaultOptions, options);
  }

  get fontFamily() {
    return this.#options.fontFamily;
  }

  set fontFamily(fontFamily) {
    this.#options.fontFamily = fontFamily;
  }

  get grayscale() {
    return this.#options.grayscale;
  }

  set grayscale(grayscale) {
    this.#options.grayscale = Boolean(grayscale);
  }

  get fontSize() {
    return this.#options.fontSize;
  }

  set fontSize(fontSize) {
    this.#options.fontSize = parseInt(fontSize, 10);
  }

  get baseHue() {
    return this.#options.baseHue;
  }

  set baseHue(baseHue) {
    this.#options.baseHue = parseInt(baseHue, 10);
  }

  get hueStep() {
    return this.#options.hueStep;
  }

  set hueStep(hueStep) {
    return this.#options.hueStep = parseInt(hueStep, 10);
  }

  get opacity() {
    return this.#options.opacity;
  }

  set opacity(opacity) {
    return this.#options.opacity = parseFloat(opacity);
  }

  get bitmapOptions() {
    return this.#options.bitmapOptions;
  }

  set bitmapOptions(bitmapOptions) {
    this.#options.bitmapOptions = bitmapOptions;
  }

  /**
   * Adds a watermark to an image.
   *
   * @param {File|Blob|ImageData|ImageBitmap|OffscreenCanvas|VideoFrame|HTMLImageElement|SVGImageElement|HTMLCanvasElement} imageInput - The input image.
   * @param {string} watermarkText - The text to be used as the watermark.
   * @param {Object} [encodeOptions={}] - Options for encoding the output image.
   * @returns {Promise<Blob>} - A promise that resolves to a blob of the watermarked image.
   */
    async addWatermark(imageInput, watermarkText, encodeOptions = {}) {

    const image = await IDWatermark.loadImage(imageInput, this.bitmapOptions);

    const canvas = new OffscreenCanvas(image.width, image.height);
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) throw new Error('Can\'t create the context of the canvas');

    ctx.drawImage(image, 0, 0);

    if (this.grayscale) IDWatermark.applyGrayscale(ctx);

    const pattern = this.createHolographicPattern(canvas.width, canvas.height, watermarkText);
    this.applyPattern(ctx, pattern);

    return canvas.convertToBlob(Object.assign({ type: 'image/png', quality: 1 }, encodeOptions));
  }

  /**
   * Creates a holographic pattern for the watermark.
   *
   * @param {number} width - The width of the canvas.
   * @param {number} height - The height of the canvas.
   * @param {string} text - The text to be used in the pattern.
   * @returns {OffscreenCanvas} - The canvas with the holographic pattern.
   */
  createHolographicPattern(width, height, text) {
    const canvas = new OffscreenCanvas(width, height);
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Can\'t create the context of the canvas');

    const fontSize = parseInt(this.fontSize);
    ctx.font = `${fontSize}px ${this.fontFamily}`;

    const baseText = `${text.toUpperCase()} ⁘ `;
    const textMetrics = ctx.measureText(baseText);
    const textWidth = textMetrics.width;

    const repeatsX = Math.ceil(width * 1.5 / textWidth);
    const fullText = baseText.repeat(repeatsX);

    const lineHeight = fontSize * 1.2;
    const numLines = Math.ceil(height * 1.5 / lineHeight);

    const angle = -Math.atan2(height, width);
    ctx.translate(width/2, height/2);
    ctx.rotate(angle);

    const diagonal = Math.sqrt(width * width + height * height);
    ctx.translate(-diagonal/2, -diagonal/2);

    for (let line = -10; line < numLines + 10; line++) {
      const baseY = line * lineHeight;
      const offsetX = (line % 2) * textWidth * 0.5;

      const lineWave = Math.sin(line * 0.2) * fontSize;

      ctx.save();
      ctx.translate(offsetX + lineWave, baseY);

      let currentX = 0;
      fullText.split('').forEach((char, index) => {
        if (char === ' ') currentX += parseInt(this.fontSize) * 0.3;
        else if (char === '⁘') currentX += fontSize * 0.5;
        else {
          const hue = (this.baseHue + line * 2 + index * this.hueStep) % 360;
          const saturation = hue < 60 || hue > 300 ? 85 : 75;
          const lightness = hue < 60 || hue > 300 ? 55 : 60;
          ctx.fillStyle = `hsl(${hue}, ${saturation}%, ${lightness}%)`;

          const charWave = Math.sin((currentX + baseY) * 0.05) * (fontSize * 0.2);

          ctx.save();
          ctx.translate(currentX, charWave);
          ctx.fillText(char, 0, 0);
          ctx.restore();

          currentX += ctx.measureText(char).width * 1.1;
        }
      });

      ctx.restore();
    }

    return canvas;
  }

  /**
   * Applies the holographic pattern to the canvas context.
   *
   * @param {CanvasRenderingContext2D|OffscreenCanvasRenderingContext2D} ctx - The canvas rendering context.
   * @param {OffscreenCanvas} pattern - The canvas containing the holographic pattern.
   */
  applyPattern(ctx, pattern) {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;

    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.globalCompositeOperation = 'overlay';

    ctx.drawImage(pattern, 0, 0, width, height);

    ctx.restore();
  }

  /**
   * Converts a Blob to a URL.
   *
   * @param {Blob} blob - The Blob to convert.
   * @returns {string} - The URL representing the Blob.
   */
  static blobToURL(blob) {
    return new URL.createObjectURL(blob);
  }

  /**
   * Applies a grayscale filter to the canvas context.
   *
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
   */
  static applyGrayscale(ctx) {
    const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      data[i] = gray;     // R
      data[i + 1] = gray; // G
      data[i + 2] = gray; // B
    }
    ctx.putImageData(imageData, 0, 0);
  }

  /**
   * Loads an image from a source.
   *
   * @param {File|Blob|ImageData|ImageBitmap|OffscreenCanvas|VideoFrame|HTMLImageElement|SVGImageElement|HTMLCanvasElement} input - The input image.
   * @param {Object} options - ImageBitmap options.
   * @returns {Promise<ImageBitmap>} - A promise that resolves to an ImageBitmap.
   */
  static async loadImage(input, options = {}) {
    return createImageBitmap(input, options);
  }

  /**
   * Returns the default options for the watermark.
   *
   * @returns {{hueStep: number, fontFamily: string, fontSize: number, baseHue: number, opacity: number, grayscale: boolean}}
   */
  static get defaultOptions() {
    return {
      fontSize: 12,
      fontFamily: 'Courier New',
      opacity: 1,
      baseHue: 270,
      hueStep: 3,
      grayscale: false,
      bitmapOptions: {},
    }
  }

}

export default IDWatermark;