# IDWatermark

Une bibliothèque moderne pour créer des filigranes holographiques sur des images en utilisant OffscreenCanvas. Idéale pour la protection de documents, les certificats numériques ou toute image nécessitant un filigrane à effet holographique.

## Caractéristiques

- ✨ Effets holographiques personnalisables
- 🎨 Contrôle total sur les couleurs et les dégradés
- 🖼️ Support de multiples formats d'image
- 🚀 Performance optimisée avec OffscreenCanvas
- 👷 Compatible avec les Web Workers
- 🔄 Traitement asynchrone

## Installation

```bash
npm install @videsk/id-watermark
```

## Utilisation de Base

```javascript
import IDWatermark from '@videsk/id-watermark';

const watermarker = new IDWatermark();

// Traiter une image
const imageBlob = await fetch('image.jpg').then(r => r.blob());
const watermarkedBlob = await watermarker.addWatermark(imageBlob, 'CONFIDENTIEL');
```

## Configuration

La bibliothèque accepte les options de configuration suivantes :

```javascript
const watermarker = new IDWatermark({
  fontSize: 12,          // Taille de la police
  fontFamily: 'Courier New', // Famille de police
  opacity: 1,           // Opacité du filigrane (0-1)
  baseHue: 270,         // Couleur de base (0-360)
  hueStep: 3,           // Incrément de couleur entre les caractères
  grayscale: false,     // Convertir l'image en niveaux de gris
  bitmapOptions: {}     // Options pour createImageBitmap
});
```

## Comprendre les Valeurs de Teinte (Hue)

L'effet holographique est basé sur la manipulation de l'espace colorimétrique HSL (Teinte, Saturation, Luminosité). Le paramètre `hue` détermine la couleur de base et sa progression :

### baseHue (0-360)

La valeur `baseHue` représente la couleur initiale dans le cercle chromatique :

- 0/360 : Rouge
- 60 : Jaune
- 120 : Vert
- 180 : Cyan
- 240 : Bleu
- 270 : Violet (valeur par défaut)
- 300 : Magenta

### hueStep

Le `hueStep` contrôle l'évolution de la couleur entre les caractères consécutifs :

- Valeurs basses (1-5) : Changements doux et graduels
- Valeurs moyennes (5-15) : Effet arc-en-ciel modéré
- Valeurs élevées (15+) : Changements dramatiques de couleur

### Exemples de Combinaisons

```javascript
// Effet holographique subtil en tons violets
const subtleHolographic = new IDWatermark({
  baseHue: 270,
  hueStep: 3
});

// Effet arc-en-ciel vibrant
const rainbowEffect = new IDWatermark({
  baseHue: 0,
  hueStep: 15
});

// Effet monochrome bleu
const blueMonochrome = new IDWatermark({
  baseHue: 240,
  hueStep: 1
});
```

## API

### Méthodes Principales

#### `addWatermark(imageInput, watermarkText, encodeOptions)`

Ajoute un filigrane à une image.

```javascript
const result = await watermarker.addWatermark(
  imageBlob,
  'CONFIDENTIEL',
  { type: 'image/jpeg', quality: 0.9 }
);
```

##### Paramètres
- `imageInput` : File | Blob | ImageData | ImageBitmap | OffscreenCanvas | VideoFrame | HTMLImageElement
- `watermarkText` : string
- `encodeOptions` : Object (optionnel)
  - `type` : string (ex: 'image/jpeg', 'image/png')
  - `quality` : number (0-1)

### Propriétés Configurables

Toutes les propriétés peuvent être modifiées pendant l'exécution :

```javascript
watermarker.fontSize = 24;
watermarker.opacity = 0.7;
watermarker.baseHue = 180;
```

## Utilisation avec Web Workers (Exemple Conceptuel)

```javascript
// main.js
const worker = new Worker('watermark.worker.js', { type: 'module' });

// Envoyer la tâche au worker
worker.postMessage({
  type: 'ADD_WATERMARK',
  payload: {
    image: imageBlob,
    text: 'CONFIDENTIEL',
    options: { baseHue: 270, hueStep: 3 }
  }
}, [imageBlob]);

// Recevoir le résultat
worker.onmessage = (e) => {
  if (e.data.type === 'WATERMARK_COMPLETE') {
    const watermarkedBlob = e.data.payload;
    // Utiliser le blob résultant
  }
};
```

## Compatibilité

- Navigateurs modernes supportant OffscreenCanvas
- Chrome 69+
- Firefox 79+
- Edge 79+
- Safari 16.4+

## Licence

MIT