import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';

const publicDir = './public';
const inputImage = path.join(publicDir, 'profile.jpg');

// Sizes for responsive images
const sizes = [
  { width: 400, suffix: '-sm' },
  { width: 800, suffix: '-md' },
  { width: 1200, suffix: '' } // Original size
];

async function optimizeImages() {
  console.log('Starting image optimization...\n');
  
  try {
    // Get original image metadata
    const metadata = await sharp(inputImage).metadata();
    console.log(`Original: ${metadata.width}x${metadata.height}, ${metadata.format}`);
    
    // Get original file size
    const originalStats = await fs.stat(inputImage);
    console.log(`Original size: ${(originalStats.size / 1024).toFixed(2)} KB\n`);
    
    let totalSaved = 0;
    
    // Process each size
    for (const { width, suffix } of sizes) {
      const baseName = 'profile';
      
      // Skip if requested width is larger than original
      if (width > metadata.width) continue;
      
      // Create optimized JPEG
      const jpegPath = path.join(publicDir, `${baseName}${suffix}.jpg`);
      await sharp(inputImage)
        .resize(width, null, { withoutEnlargement: true })
        .jpeg({ quality: 85, progressive: true })
        .toFile(jpegPath);
      
      const jpegStats = await fs.stat(jpegPath);
      console.log(`✓ ${baseName}${suffix}.jpg (${width}px): ${(jpegStats.size / 1024).toFixed(2)} KB`);
      
      // Create WebP version
      const webpPath = path.join(publicDir, `${baseName}${suffix}.webp`);
      await sharp(inputImage)
        .resize(width, null, { withoutEnlargement: true })
        .webp({ quality: 85 })
        .toFile(webpPath);
      
      const webpStats = await fs.stat(webpPath);
      console.log(`✓ ${baseName}${suffix}.webp (${width}px): ${(webpStats.size / 1024).toFixed(2)} KB`);
      
      // Create AVIF version (best compression)
      const avifPath = path.join(publicDir, `${baseName}${suffix}.avif`);
      await sharp(inputImage)
        .resize(width, null, { withoutEnlargement: true })
        .avif({ quality: 75 })
        .toFile(avifPath);
      
      const avifStats = await fs.stat(avifPath);
      console.log(`✓ ${baseName}${suffix}.avif (${width}px): ${(avifStats.size / 1024).toFixed(2)} KB\n`);
      
      if (suffix === '') {
        totalSaved = originalStats.size - jpegStats.size;
      }
    }
    
    console.log(`\nOptimization complete!`);
    console.log(`Space saved (JPEG): ${(totalSaved / 1024).toFixed(2)} KB`);
    console.log(`Use <picture> element in HTML for best results.`);
    
  } catch (error) {
    console.error('Error optimizing images:', error);
    process.exit(1);
  }
}

optimizeImages();
