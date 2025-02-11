const translations = {
    es: {
        title: 'Demo Watermark SDK',
        selectImage: 'Seleccionar Imagen',
        watermarkText: 'Texto de Marca de Agua',
        fontSize: 'Tamaño de Fuente (px)',
        opacity: 'Opacidad',
        baseColor: 'Color Base (Hue 0-360)',
        colorStep: 'Paso de Color',
        originalImage: 'Imagen Original',
        result: 'Resultado',
        applyWatermark: 'Aplicar Marca de Agua',
        downloadImage: 'Descargar Imagen',
        placeholder: 'CONFIDENCIAL',
        errorMessage: 'Por favor selecciona una imagen y escribe el texto de la marca de agua',
        processError: 'Error al procesar la imagen'
    },
    en: {
        title: 'Watermark SDK Demo',
        selectImage: 'Select Image',
        watermarkText: 'Watermark Text',
        fontSize: 'Font Size (px)',
        opacity: 'Opacity',
        baseColor: 'Base Color (Hue 0-360)',
        colorStep: 'Color Step',
        originalImage: 'Original Image',
        result: 'Result',
        applyWatermark: 'Apply Watermark',
        downloadImage: 'Download Image',
        placeholder: 'CONFIDENTIAL',
        errorMessage: 'Please select an image and enter watermark text',
        processError: 'Error processing image'
    }
};

let currentLang = 'es';

function changeLang(lang) {
    currentLang = lang;
    updateTexts();
}

function updateTexts() {
    const texts = translations[currentLang];
    document.title = texts.title;
    document.querySelector('h1').textContent = texts.title;
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (element.tagName === 'INPUT' && element.getAttribute('placeholder')) {
            element.placeholder = texts[key];
        } else {
            element.textContent = texts[key];
        }
    });
}

const form = document.getElementById('watermarkForm');
const imageInput = document.getElementById('imageInput');
const watermarkText = document.getElementById('watermarkText');
const preview = document.getElementById('preview');
const downloadBtn = document.getElementById('downloadBtn');
const originalPreview = document.getElementById('originalPreview');
const langSelector = document.getElementById('langSelector');

// Cambio de idioma
langSelector.addEventListener('change', (e) => {
    changeLang(e.target.value);
});

imageInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            originalPreview.src = e.target.result;
            originalPreview.classList.remove('hidden');
        };
        reader.readAsDataURL(file);
    }
});

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const file = imageInput.files[0];
    if (!file || !watermarkText.value) {
        alert(translations[currentLang].errorMessage);
        return;
    }

    try {
        const watermarker = new IDWatermark({
            fontSize: document.getElementById('fontSize').value,
            opacity: parseFloat(document.getElementById('opacity').value),
            baseHue: parseInt(document.getElementById('baseHue').value),
            hueStep: parseInt(document.getElementById('hueStep').value)
        });

        const result = await watermarker.addWatermark(file, watermarkText.value, true);
        const url = URL.createObjectURL(result);

        preview.src = url;
        preview.classList.remove('hidden');
        downloadBtn.classList.remove('hidden');
        downloadBtn.href = url;
        downloadBtn.download = `watermarked-${file.name}`;
    } catch (error) {
        console.error('Error al procesar la imagen:', error);
        alert(translations[currentLang].processError);
    }
});

updateTexts();