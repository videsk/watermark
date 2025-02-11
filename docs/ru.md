# IDWatermark

Современная библиотека для создания голографических водяных знаков на изображениях с использованием OffscreenCanvas. Идеально подходит для защиты документов, цифровых сертификатов или любых изображений, требующих голографического водяного знака.

## Особенности

- ✨ Настраиваемые голографические эффекты
- 🎨 Полный контроль над цветами и градиентами
- 🖼️ Поддержка различных форматов изображений
- 🚀 Оптимизированная производительность с OffscreenCanvas
- 👷 Совместимость с Web Workers
- 🔄 Асинхронная обработка

## Установка

```bash
npm install @videsk/id-watermark
```

## Базовое использование

```javascript
import IDWatermark from '@videsk/id-watermark';

const watermarker = new IDWatermark();

// Обработка изображения
const imageBlob = await fetch('image.jpg').then(r => r.blob());
const watermarkedBlob = await watermarker.addWatermark(imageBlob, 'СЕКРЕТНО');
```

## Конфигурация

Библиотека принимает следующие параметры конфигурации:

```javascript
const watermarker = new IDWatermark({
  fontSize: 12,          // Размер шрифта
  fontFamily: 'Courier New', // Семейство шрифтов
  opacity: 1,           // Прозрачность водяного знака (0-1)
  baseHue: 270,         // Базовый цвет (0-360)
  hueStep: 3,           // Приращение цвета между символами
  grayscale: false,     // Преобразование в оттенки серого
  bitmapOptions: {}     // Опции для createImageBitmap
});
```

## Понимание значений Hue

Голографический эффект основан на манипуляции цветовым пространством HSL (Тон, Насыщенность, Яркость). Параметр `hue` определяет базовый цвет и его прогрессию:

### baseHue (0-360)

Значение `baseHue` представляет начальный цвет в цветовом круге:

- 0/360: Красный
- 60: Жёлтый
- 120: Зелёный
- 180: Голубой
- 240: Синий
- 270: Фиолетовый (значение по умолчанию)
- 300: Пурпурный

### hueStep

`hueStep` контролирует изменение цвета между последовательными символами:

- Низкие значения (1-5): Плавные и постепенные изменения
- Средние значения (5-15): Умеренный эффект радуги
- Высокие значения (15+): Драматические изменения цвета

### Примеры комбинаций

```javascript
// Тонкий голографический эффект в фиолетовых тонах
const subtleHolographic = new IDWatermark({
  baseHue: 270,
  hueStep: 3
});

// Яркий эффект радуги
const rainbowEffect = new IDWatermark({
  baseHue: 0,
  hueStep: 15
});

// Синий монохромный эффект
const blueMonochrome = new IDWatermark({
  baseHue: 240,
  hueStep: 1
});
```

## API

### Основные методы

#### `addWatermark(imageInput, watermarkText, encodeOptions)`

Добавляет водяной знак на изображение.

```javascript
const result = await watermarker.addWatermark(
  imageBlob,
  'СЕКРЕТНО',
  { type: 'image/jpeg', quality: 0.9 }
);
```

##### Параметры
- `imageInput`: File | Blob | ImageData | ImageBitmap | OffscreenCanvas | VideoFrame | HTMLImageElement
- `watermarkText`: string
- `encodeOptions`: Object (опционально)
  - `type`: string (например, 'image/jpeg', 'image/png')
  - `quality`: number (0-1)

### Настраиваемые свойства

Все свойства можно изменять во время выполнения:

```javascript
watermarker.fontSize = 24;
watermarker.opacity = 0.7;
watermarker.baseHue = 180;
```

## Использование с Web Workers (Концептуальный пример)

```javascript
// main.js
const worker = new Worker('watermark.worker.js', { type: 'module' });

// Отправка задачи в worker
worker.postMessage({
  type: 'ADD_WATERMARK',
  payload: {
    image: imageBlob,
    text: 'СЕКРЕТНО',
    options: { baseHue: 270, hueStep: 3 }
  }
}, [imageBlob]);

// Получение результата
worker.onmessage = (e) => {
  if (e.data.type === 'WATERMARK_COMPLETE') {
    const watermarkedBlob = e.data.payload;
    // Использование полученного blob
  }
};
```

## Совместимость с браузерами

- Современные браузеры с поддержкой OffscreenCanvas
- Chrome 69+
- Firefox 79+
- Edge 79+
- Safari 16.4+

## Лицензия

MIT