// Color shader and recoloring system
const slotColors = {
    blue: 240,
    'light-blue': 210,
    green: 120,
    'light-green': 90,
    yellow: 60,
    'dark-yellow': 45,
    red: 0,
    pink: 330
};
const grayscaleCache = {};

// Apply CSS filter to shift image color
function applyColorShader(slot) {
    const image = slot.querySelector('.character-image');
    const slotColorName = playerSlots[parseInt(slot.dataset.player, 10) - 1].colorVariant;
    const character = characters[parseInt(slot.dataset.characterIndex, 10)];
    processAndCacheImage(image, character, slotColorName).then(blobUrl => {
        if (blobUrl) { if (image.dataset.blobUrl) URL.revokeObjectURL(image.dataset.blobUrl); image.src = blobUrl; image.dataset.blobUrl = blobUrl; }
    });
}

function applyColorShaderToImage(image, slotColorName) {
    if (!image) return Promise.resolve();
    return new Promise(resolve => {
        const process = async () => {
            const slot = image.closest('.character-slot');
            const idx = slot ? parseInt(slot.dataset.characterIndex, 10) : 0;
            const slotIndex = slot ? parseInt(slot.dataset.player, 10) - 1 : 0;
            const colorVariant = playerSlots[slotIndex]?.colorVariant || slotColorName;
            const character = characters[idx] || { name: 'Unknown' };
            const blobUrl = await processAndCacheImage(image, character, colorVariant);
            if (blobUrl) { if (image.dataset.blobUrl) URL.revokeObjectURL(image.dataset.blobUrl); image.src = blobUrl; image.dataset.blobUrl = blobUrl; }
            resolve();
        };
        if (image.complete && image.naturalWidth) process(); else image.addEventListener('load', process, { once: true });
    });
}

function processAndCacheImage(img, characterData, colorVariant) {
    return (async () => {
        // Use original colored asset; recolor only grayscale trim regions
        return paletteRecolor(img, characterData, colorVariant, true);
    })();
}