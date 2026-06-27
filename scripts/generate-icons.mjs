#!/usr/bin/env node
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');
const publicDir = path.join(rootDir, 'public');
const iconsDir = path.join(publicDir, 'icons');

// Create icons directory if it doesn't exist
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Icon sizes to generate
const sizes = [16, 32, 72, 96, 128, 144, 152, 192, 256, 384, 512];
const maskableSizes = [192, 512];

// Create a simple geometric SVG icon (◈ glyph, #C9A84C fill, #080808 bg)
const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="#080808"/>
  <g transform="translate(256, 256)">
    <!-- Outer diamond -->
    <path d="M -80 0 L 0 -80 L 80 0 L 0 80 Z" fill="none" stroke="#C9A84C" stroke-width="8"/>
    <!-- Inner diamond -->
    <path d="M -40 0 L 0 -40 L 40 0 L 0 40 Z" fill="none" stroke="#C9A84C" stroke-width="6"/>
    <!-- Center dot -->
    <circle cx="0" cy="0" r="8" fill="#C9A84C"/>
  </g>
</svg>`;

const svgBuffer = Buffer.from(svgIcon);

async function generateIcons() {
  console.log('🎨 Generating icons...');

  try {
    // Generate regular icons
    for (const size of sizes) {
      const filename = `icon-${size}.png`;
      const filepath = path.join(iconsDir, filename);
      await sharp(svgBuffer).resize(size, size).png().toFile(filepath);
      console.log(`✓ Generated ${filename}`);
    }

    // Generate maskable icons
    for (const size of maskableSizes) {
      const filename = `icon-maskable-${size}.png`;
      const filepath = path.join(iconsDir, filename);
      await sharp(svgBuffer).resize(size, size).png().toFile(filepath);
      console.log(`✓ Generated ${filename}`);
    }

    // Generate favicon
    const faviconPath = path.join(publicDir, 'favicon.ico');
    await sharp(svgBuffer).resize(32, 32).png().toFile(path.join(iconsDir, 'favicon.png'));
    console.log('✓ Generated favicon.png');

    // Generate apple-touch-icon
    const applePath = path.join(publicDir, 'apple-touch-icon.png');
    await sharp(svgBuffer).resize(180, 180).png().toFile(applePath);
    console.log('✓ Generated apple-touch-icon.png');

    console.log('✅ Icon generation complete!');
  } catch (e) {
    console.error('❌ Icon generation failed:', e.message);
    process.exit(1);
  }
}

generateIcons();
