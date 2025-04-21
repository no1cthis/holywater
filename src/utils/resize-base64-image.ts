/**
 * Concatenates multiple base64 images vertically into a single image
 * 
 * @param images - Array of base64 image strings or image URLs
 * @param spacing - Vertical spacing between images in pixels
 * @param maxWidth - Maximum width of the resulting image
 * @param format - Output format (jpeg, png, webp)
 * @param quality - Output quality (0-1)
 * @returns Promise resolving to a base64 string of the concatenated image
 */
export async function concatenateImagesVertically(
  images: string[],
  spacing = 10,
  maxWidth = 800,
  format: 'jpeg' | 'png' | 'webp' = 'jpeg',
  quality = 0.95
): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      if (!images.length) {
        reject(new Error('No images provided'));
        return;
      }
      
      // Load all images and get their dimensions
      const imageElements: HTMLImageElement[] = [];
      let totalHeight = 0;
      const canvasWidth = maxWidth; // Always use maxWidth for canvas width
      
      // Create and load all image elements
      for (let i = 0; i < images.length; i++) {
        const img = new Image();
        
        // Set crossOrigin to anonymous to prevent tainting the canvas
        // This is important for images loaded from external sources
        img.crossOrigin = "anonymous";
        
        await new Promise<void>((resolveImg) => {
          img.onload = () => {
            // Calculate image dimensions proportional to maxWidth
            const aspectRatio = img.width / img.height;
            // Always set width to maxWidth, regardless of original image size
            const scaledWidth = maxWidth;
            const scaledHeight = scaledWidth / aspectRatio;
            
            // Track total height
            totalHeight += scaledHeight;
            
            // Save image with its scaled dimensions
            imageElements.push(img);
            resolveImg();
          };
          
          img.onerror = (e) => {
            console.error(`Failed to load image at index ${i}:`, e);
            resolveImg(); // Continue even if one image fails
          };
          
          // Properly handle image source based on format
          const imgSrc = images[i].trim();
          if (imgSrc.startsWith('data:')) {
            // It's already a data URL
            img.src = imgSrc;
          } else if (imgSrc.startsWith('http://') || imgSrc.startsWith('https://') || imgSrc.startsWith('//')) {
            // It's a URL, use directly
            img.src = imgSrc;
          } else if (/^[A-Za-z0-9+/=]+$/.exec(imgSrc)) {
            // It looks like raw base64 without data URL prefix
            img.src = `data:image/jpeg;base64,${imgSrc}`;
          } else {
            // Not recognizable format, treat as URL
            img.src = imgSrc;
          }
        });
      }
      
      // If no images were successfully loaded, reject
      if (imageElements.length === 0) {
        reject(new Error('No images could be loaded successfully'));
        return;
      }
      
      // Add spacing between images (but not after the last one)
      totalHeight += spacing * (imageElements.length - 1);
      
      // Create canvas for the combined image
      const canvas = document.createElement('canvas');
      canvas.width = canvasWidth;
      canvas.height = totalHeight || 100; // Minimum 100px height if no images loaded
      
      const ctx = canvas.getContext('2d', { alpha: true });
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }
      
      // Fill with white background
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw images vertically
      let currentY = 0;
      for (const img of imageElements) {
        // Calculate scaled dimensions - always use maxWidth
        const aspectRatio = img.width / img.height;
        const scaledWidth = maxWidth;
        const scaledHeight = scaledWidth / aspectRatio;
        
        // Center image horizontally (should always be centered perfectly now)
        const x = 0;
        
        try {
          // Draw image
          ctx.drawImage(img, x, currentY, scaledWidth, scaledHeight);
          
          // Move down for next image
          currentY += scaledHeight + spacing;
        } catch (err) {
          console.error('Error drawing image on canvas:', err);
          // Continue with next image
        }
      }
      
      try {
        // Convert canvas to base64 with appropriate quality
        const mimeType = `image/${format}`;
        const outputQuality = format === 'png' ? 1 : quality;
        const concatenatedBase64 = canvas.toDataURL(mimeType, outputQuality);
        
        resolve(concatenatedBase64);
      } catch (err) {
        // If toDataURL fails, it's likely because the canvas is tainted
        console.error('Error converting canvas to data URL:', err);
        reject(new Error('Failed to export canvas: images may be from different origins'));
      }
    } catch (error) {
      console.error('Error concatenating images:', error);
      reject(new Error('Failed to concatenate images'));
    }
  });
}

/**
 * Convenience function to get a base64 image from a File object
 * 
 * @param file - File object (from input or drag/drop)
 * @returns Promise resolving to a base64 string with data URL prefix
 */
export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => { resolve(reader.result as string); };
    reader.onerror = (error) => { reject(error); };
  });
}

/**
 * Gets a file, converts it to base64, resizes it and returns as base64
 * 
 * @param file - File object to process
 * @param width - Target width in pixels
 * @param height - Target height in pixels
 * @param format - Output format
 * @param quality - Output quality (0-1)
 * @returns Promise resolving to a base64 string of the resized image
 */
export async function processImageFile(
  file: File,
  width = 800,
  height = 600,
  format: 'jpeg' | 'png' | 'webp' = 'jpeg',
  quality = 0.95
): Promise<string> {
  try {
    const base64 = await fileToBase64(file);
    return await resizeBase64Image(base64, width, height, format, quality);
  } catch (error) {
    console.error('Error processing image file:', error);
    throw new Error('Failed to process image file');
  }
}

/**
 * Resizes a base64 image to specified dimensions using browser APIs
 * 
 * @param base64Image - Base64 image data string (can include or exclude data URL prefix)
 * @param width - Target width in pixels
 * @param height - Target height in pixels
 * @param format - Output format (jpeg, png, webp)
 * @param quality - Output quality (0-1)
 * @returns Promise resolving to a base64 string of the resized image with data URL prefix
 */
export async function resizeBase64Image(
  base64Image: string,
  width = 800,
  height = 600,
  format: 'jpeg' | 'png' | 'webp' = 'jpeg',
  quality = 0.95
): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      // Create an image element
      const img = new Image();
      
      // Handle image load
      img.onload = () => {
        // Create canvas with desired dimensions
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        // Draw image on canvas with resizing
        const ctx = canvas.getContext('2d', { alpha: true });
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }
        
        // Improve image rendering quality
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        
        // Get scale factor to maintain aspect ratio
        const scale = Math.max(width / img.width, height / img.height);
        
        // Calculate centered position
        const scaledWidth = img.width * scale;
        const scaledHeight = img.height * scale;
        const x = (width - scaledWidth) / 2;
        const y = (height - scaledHeight) / 2;
        
        // Clear the canvas first
        ctx.clearRect(0, 0, width, height);
        
        // Draw the image centered and covering the canvas
        ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
        
        // Convert canvas to base64 with appropriate quality
        const mimeType = `image/${format}`;
        // Use maximum quality for PNG (lossless format)
        const outputQuality = format === 'png' ? 1 : quality;
        const resizedBase64 = canvas.toDataURL(mimeType, outputQuality);
        
        resolve(resizedBase64);
      };
      
      // Handle errors
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
      
      // Set source of image (handle both raw base64 and data URL)
      if (base64Image.startsWith('data:')) {
        img.src = base64Image;
      } else {
        img.src = `data:image/jpeg;base64,${base64Image}`;
      }
    } catch (error) {
      console.error('Error resizing image:', error);
      reject(new Error('Failed to resize image'));
    }
  });
}