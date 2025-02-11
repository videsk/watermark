# IDWatermark

一个使用 OffscreenCanvas 创建全息水印的现代库。适用于文档保护、数字证书或任何需要全息水印效果的图像。

## 特点

- ✨ 可自定义全息效果
- 🎨 完全控制颜色和渐变
- 🖼️ 支持多种图像格式
- 🚀 使用 OffscreenCanvas 优化性能
- 👷 兼容 Web Workers
- 🔄 异步处理

![watermark-id](/example.png)

## 安装

```bash
npm install @videsk/id-watermark
```

## 基本用法

```javascript
import IDWatermark from '@videsk/id-watermark';

const watermarker = new IDWatermark();

// 处理图像
const imageBlob = await fetch('image.jpg').then(r => r.blob());
const watermarkedBlob = await watermarker.addWatermark(imageBlob, '机密');
```

## 配置

库接受以下配置选项：

```javascript
const watermarker = new IDWatermark({
  fontSize: 12,          // 字体大小
  fontFamily: 'Courier New', // 字体系列
  opacity: 1,           // 水印不透明度 (0-1)
  baseHue: 270,         // 基础色相 (0-360)
  hueStep: 3,           // 字符间的颜色增量
  grayscale: false,     // 转换为灰度图像
  bitmapOptions: {}     // createImageBitmap 的选项
});
```

## 理解色相值

全息效果基于 HSL（色相、饱和度、亮度）颜色空间的操作。`hue` 参数决定基础颜色及其渐变：

### baseHue (0-360)

`baseHue` 值代表色轮中的初始颜色：

- 0/360：红色
- 60：黄色
- 120：绿色
- 180：青色
- 240：蓝色
- 270：紫色（默认值）
- 300：品红色

### hueStep

`hueStep` 控制连续字符之间的颜色变化：

- 低值 (1-5)：平滑渐变
- 中值 (5-15)：适中的彩虹效果
- 高值 (15+)：戏剧性的颜色变化

### 组合示例

```javascript
// 紫色调的微妙全息效果
const subtleHolographic = new IDWatermark({
  baseHue: 270,
  hueStep: 3
});

// 鲜艳的彩虹效果
const rainbowEffect = new IDWatermark({
  baseHue: 0,
  hueStep: 15
});

// 蓝色单色效果
const blueMonochrome = new IDWatermark({
  baseHue: 240,
  hueStep: 1
});
```

## API

### 主要方法

#### `addWatermark(imageInput, watermarkText, encodeOptions)`

向图像添加水印。

```javascript
const result = await watermarker.addWatermark(
  imageBlob,
  '机密',
  { type: 'image/jpeg', quality: 0.9 }
);
```

##### 参数
- `imageInput`：File | Blob | ImageData | ImageBitmap | OffscreenCanvas | VideoFrame | HTMLImageElement
- `watermarkText`：string
- `encodeOptions`：Object（可选）
  - `type`：string（例如：'image/jpeg', 'image/png'）
  - `quality`：number（0-1）

### 可配置属性

所有属性都可以在运行时修改：

```javascript
watermarker.fontSize = 24;
watermarker.opacity = 0.7;
watermarker.baseHue = 180;
```

## Web Workers 使用示例（概念性）

```javascript
// main.js
const worker = new Worker('watermark.worker.js', { type: 'module' });

// 发送任务到 worker
worker.postMessage({
  type: 'ADD_WATERMARK',
  payload: {
    image: imageBlob,
    text: '机密',
    options: { baseHue: 270, hueStep: 3 }
  }
}, [imageBlob]);

// 接收结果
worker.onmessage = (e) => {
  if (e.data.type === 'WATERMARK_COMPLETE') {
    const watermarkedBlob = e.data.payload;
    // 使用生成的 blob
  }
};
```

## 浏览器兼容性

- 支持 OffscreenCanvas 的现代浏览器
- Chrome 69+
- Firefox 79+
- Edge 79+
- Safari 16.4+

## 许可证

MIT