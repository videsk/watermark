# IDWatermark

Una librería moderna para crear marcas de agua holográficas en imágenes utilizando OffscreenCanvas. Ideal para protección de documentos, certificados digitales o cualquier imagen que requiera una marca de agua con efecto holográfico.

## Características

- ✨ Efectos holográficos personalizables
- 🎨 Control total sobre colores y degradados
- 🖼️ Soporte para múltiples formatos de imagen
- 🚀 Rendimiento optimizado con OffscreenCanvas
- 👷 Compatible con Web Workers
- 🔄 Procesamiento asíncrono

## Instalación

```bash
npm install @videsk/id-watermark
```

## Uso Básico

```javascript
import IDWatermark from '@videsk/id-watermark';

const watermarker = new IDWatermark();

// Procesar una imagen
const imageBlob = await fetch('image.jpg').then(r => r.blob());
const watermarkedBlob = await watermarker.addWatermark(imageBlob, 'CONFIDENTIAL');
```

## Configuración

La librería acepta las siguientes opciones de configuración:

```javascript
const watermarker = new IDWatermark({
  fontSize: 12,          // Tamaño de la fuente
  fontFamily: 'Courier New', // Familia de fuente
  opacity: 1,           // Opacidad de la marca de agua (0-1)
  baseHue: 270,         // Color base (0-360)
  hueStep: 3,           // Incremento de color entre caracteres
  grayscale: false,     // Convertir imagen a escala de grises
  bitmapOptions: {}     // Opciones para createImageBitmap
});
```

## Entendiendo los Valores de Hue

El efecto holográfico se basa en la manipulación del espacio de color HSL (Hue, Saturation, Lightness). El parámetro `hue` determina el color base y su progresión:

### baseHue (0-360)

El valor `baseHue` representa el color inicial en el círculo cromático:

- 0/360: Rojo
- 60: Amarillo
- 120: Verde
- 180: Cian
- 240: Azul
- 270: Violeta (valor por defecto)
- 300: Magenta

### hueStep

El `hueStep` controla cuánto cambia el color entre caracteres consecutivos:

- Valores bajos (1-5): Cambios suaves y graduales
- Valores medios (5-15): Efecto rainbow moderado
- Valores altos (15+): Cambios dramáticos de color

### Ejemplos de Combinaciones

```javascript
// Efecto holográfico suave en tonos violetas
const subtleHolographic = new IDWatermark({
  baseHue: 270,
  hueStep: 3
});

// Efecto rainbow vibrante
const rainbowEffect = new IDWatermark({
  baseHue: 0,
  hueStep: 15
});

// Efecto monocromático azul
const blueMonochrome = new IDWatermark({
  baseHue: 240,
  hueStep: 1
});
```

## API

### Métodos Principales

#### `addWatermark(imageInput, watermarkText, encodeOptions)`

Añade una marca de agua a una imagen.

```javascript
const result = await watermarker.addWatermark(
  imageBlob,
  'CONFIDENTIAL',
  { type: 'image/jpeg', quality: 0.9 }
);
```

##### Parámetros
- `imageInput`: File | Blob | ImageData | ImageBitmap | OffscreenCanvas | VideoFrame | HTMLImageElement
- `watermarkText`: string
- `encodeOptions`: Object (opcional)
  - `type`: string (e.g., 'image/jpeg', 'image/png')
  - `quality`: number (0-1)

### Propiedades Configurables

Todas las propiedades pueden ser modificadas en tiempo de ejecución:

```javascript
watermarker.fontSize = 24;
watermarker.opacity = 0.7;
watermarker.baseHue = 180;
```

## Uso con Web Workers (Ejemplo Conceptual)

```javascript
// main.js
const worker = new Worker('watermark.worker.js', { type: 'module' });

// Enviar tarea al worker
worker.postMessage({
  type: 'ADD_WATERMARK',
  payload: {
    image: imageBlob,
    text: 'CONFIDENTIAL',
    options: { baseHue: 270, hueStep: 3 }
  }
}, [imageBlob]);

// Recibir resultado
worker.onmessage = (e) => {
  if (e.data.type === 'WATERMARK_COMPLETE') {
    const watermarkedBlob = e.data.payload;
    // Usar el blob resultante
  }
};
```

## Compatibilidad

- Navegadores modernos que soporten OffscreenCanvas
- Chrome 69+
- Firefox 79+
- Edge 79+
- Safari 16.4+

## Licencia

MIT