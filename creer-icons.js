/**
 * Script pour créer les icônes PWA
 * Exécutez : node creer-icons.js
 */

const fs = require('fs');
const path = require('path');

// Create icons directory
const iconsDir = path.join(__dirname, 'public', 'icons');
if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
    console.log('✅ Dossier icons créé');
}

// SVG template for Meca Master icon
function generateSVG(size) {
    const fontSize = size * 0.6;
    const radius = size * 0.2;
    
    return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad${size}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#FF8C42;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#FF6B35;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${radius}" ry="${radius}" fill="url(#grad${size})"/>
  <text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" 
        fill="white" font-family="Arial, sans-serif" font-weight="bold" font-size="${fontSize}">M</text>
</svg>`;
}

// Save SVG as a PNG (we'll use base64 data URIs for now)
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

console.log('\n🎨 Création des icônes Meca Master...\n');

sizes.forEach(size => {
    const svg = generateSVG(size);
    const svgPath = path.join(iconsDir, `icon-${size}x${size}.svg`);
    fs.writeFileSync(svgPath, svg);
    console.log(`✅ icon-${size}x${size}.svg créé`);
});

console.log('\n⚠️  IMPORTANT : Convertissez les SVG en PNG');
console.log('   Pour une installation réelle, il faut des fichiers PNG.');
console.log('\n   Options :');
console.log('   1. Utilisez GENERER-ICONS.html (ouvrez dans navigateur)');
console.log('   2. Utilisez un convertisseur en ligne');
console.log('   3. Installez "sharp" : npm install sharp');
console.log('\n📁 Les SVG sont dans : public/icons/');
console.log('\n✨ Meca Master est presque prêt à être installé !\n');
