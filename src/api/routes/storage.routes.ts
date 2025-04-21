import express from 'express';
import multer from 'multer';

import { deleteFile, generatePresignedDownloadUrl, uploadFile } from '../s3-bucket/s3-client';
import { generateFileKey } from '../utils/hash';

export const storageRoutes = express.Router();

// Configure multer memory storage for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  storage,
});

// Upload a file using form data
storageRoutes.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const { buffer, mimetype, originalname } = req.file;
    const fileExtension = originalname.split('.').pop() || '';
    const key = generateFileKey(buffer, fileExtension);

    const fileUrl = await uploadFile(key, buffer, mimetype);

    res.json({
      key,
      success: true,
      url: fileUrl,
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

// Upload a file using base64 data
storageRoutes.post('/upload-base64', express.json({ limit: '50mb' }), async (req, res) => {
  try {
    const { contentType, file, key } = req.body;
    
    if (!file) {
      return res.status(400).json({ error: 'No file data provided' });
    }
    
    // Extract the base64 data if it's a data URL
    let base64Data = file;
    if (file.startsWith('data:')) {
      base64Data = file.split(',')[1];
    }
    
    // Convert base64 to buffer
    const buffer = Buffer.from(base64Data, 'base64');
    
    // Use provided key or generate one
    const fileKey = key || generateFileKey(buffer, contentType.split('/')[1] || 'jpg');
    
    // Upload the file
    const fileUrl = await uploadFile(fileKey, buffer, contentType);
    
    res.json({
      key: fileKey,
      success: true,
      url: fileUrl,
    });
  } catch (error) {
    console.error('Error uploading base64 file:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

// Get a pre-signed URL for downloading a file
storageRoutes.get('/file/:key', async (req, res) => {
  try {
    const { key } = req.params;
    
    const presignedUrl = await generatePresignedDownloadUrl(key);
    
    res.json({
      success: true,
      url: presignedUrl,
    });
  } catch (error) {
    console.error('Error generating download URL:', error);
    res.status(500).json({ error: 'Failed to generate download URL' });
  }
});

// Delete a file
storageRoutes.delete('/file/:key', async (req, res) => {
  try {
    const { key } = req.params;
    
    await deleteFile(key);
    
    res.json({
      message: 'File deleted successfully',
      success: true,
    });
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({ error: 'Failed to delete file' });
  }
});

export default storageRoutes;