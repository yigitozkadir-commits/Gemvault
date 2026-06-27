import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, '../dist');

function getFileSize(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return stats.size;
  } catch {
    return 0;
  }
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return (bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i];
}

console.log('\n📦 Bundle Statistics\n');

const files = [
  'index.html',
  'main.js',
  'sw.js',
  'styles.css',
];

let totalSize = 0;

files.forEach(file => {
  const filePath = path.join(distDir, file);
  const size = getFileSize(filePath);
  if (size > 0) {
    console.log(`  ${file.padEnd(20)} ${formatBytes(size).padStart(10)}`);
    totalSize += size;
  }
});

// Also check all .js and .css files in dist
const allFiles = fs.readdirSync(distDir, { recursive: true }) || [];
allFiles.forEach(file => {
  if ((file.endsWith('.js') || file.endsWith('.css')) && !file.includes('node_modules')) {
    const filePath = path.join(distDir, file);
    const size = getFileSize(filePath);
    if (size > 0 && !files.includes(file)) {
      totalSize += size;
    }
  }
});

console.log(`\n  Total:                ${formatBytes(totalSize).padStart(10)}`);
console.log('\n✓ Build complete!\n');
