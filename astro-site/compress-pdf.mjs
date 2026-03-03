import { PDFDocument } from 'pdf-lib';
import { promises as fs } from 'fs';
import path from 'path';

const publicDir = './public';
const inputPdf = path.join(publicDir, 'TUHIN_MOHANTA_BIO.pdf');
const outputPdf = path.join(publicDir, 'TUHIN_MOHANTA_BIO_compressed.pdf');

async function compressPdf() {
  console.log('Starting PDF optimization...\n');
  
  try {
    // Read the original PDF
    const originalData = await fs.readFile(inputPdf);
    const originalSize = originalData.length;
    console.log(`Original size: ${(originalSize / 1024).toFixed(2)} KB (${(originalSize / (1024 * 1024)).toFixed(2)} MB)`);
    
    // Load the PDF
    const pdfDoc = await PDFDocument.load(originalData, {
      updateMetadata: false
    });
    
    // Get page count
    const pages = pdfDoc.getPageCount();
    console.log(`Pages: ${pages}`);
    
    // Save with compression
    const compressedData = await pdfDoc.save({
      useObjectStreams: true,
      addDefaultPage: false,
      objectsPerTick: 50
    });
    
    // Write compressed PDF
    await fs.writeFile(outputPdf, compressedData);
    
    const compressedSize = compressedData.length;
    const savedBytes = originalSize - compressedSize;
    const savedPercent = ((savedBytes / originalSize) * 100).toFixed(1);
    
    console.log(`\nCompressed size: ${(compressedSize / 1024).toFixed(2)} KB (${(compressedSize / (1024 * 1024)).toFixed(2)} MB)`);
    console.log(`Saved: ${(savedBytes / 1024).toFixed(2)} KB (${savedPercent}%)`);
    
    if (savedBytes > 10240) { // If saved more than 10KB
      console.log('\n✓ Compression successful! Replacing original with compressed version...');
      await fs.copyFile(outputPdf, inputPdf);
      await fs.unlink(outputPdf);
      console.log('✓ Original PDF replaced with compressed version');
    } else {
      console.log('\n⚠ Minimal compression achieved. PDF may already be optimized.');
      console.log('  For better compression, consider using Ghostscript or online tools.');
      await fs.unlink(outputPdf);
    }
    
  } catch (error) {
    console.error('Error compressing PDF:', error.message);
    process.exit(1);
  }
}

compressPdf();
