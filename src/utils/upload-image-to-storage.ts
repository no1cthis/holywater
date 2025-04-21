import axios from 'axios';

/**
 * Uploads a data URL image to S3 storage and returns the storage URL.
 * If the provided URL is already a storage URL (not a data URL), returns it unchanged.
 * 
 * @param imageDataUrl - The image as a data URL (e.g., "data:image/jpeg;base64,...")
 * @returns The URL of the image in storage or the original URL if not a data URL
 */
export async function uploadImageToStorage(imageDataUrl: string): Promise<string> {
  // If not a data URL, return as is
  if (!imageDataUrl.startsWith('data:')) {
    return imageDataUrl;
  }

  try {
    // Get content type from the data URL
    const contentType = imageDataUrl.split(';')[0].split(':')[1];
    
    // Upload to S3 using the upload-base64 endpoint
    const response = await axios.post('/api/s3/upload-base64', {
      contentType,
      file: imageDataUrl,
    });
    
    // Return the storage URL
    return response.data.url;
  } catch (error) {
    console.error("Error uploading image to storage:", error);
    throw new Error("Failed to upload image to storage");
  }
}