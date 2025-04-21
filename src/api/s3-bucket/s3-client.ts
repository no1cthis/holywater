import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import { BUCKET_NAME } from '../../common/constants';
import { s3EmulatorConfig } from './emulator/s3-emulator';

// Initialize the S3 client with emulator config
const s3Client = new S3Client(s3EmulatorConfig);

/**
 * Delete a file from S3
 * 
 * @param key - The key (filename) of the object to delete
 */
export async function deleteFile(key: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  await s3Client.send(command);
}

/**
 * Generate a pre-signed URL for downloading a file
 * 
 * @param key - The key (filename) of the object to download
 * @param expiresIn - The number of seconds before the URL expires (default: 3600)
 * @returns - A pre-signed URL that can be used to download the file
 */
export async function generatePresignedDownloadUrl(key: string, expiresIn = 3600): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  return await getSignedUrl(s3Client, command, { expiresIn });
}

/**
 * Generate a pre-signed URL for direct client uploads
 * 
 * @param key - The key (filename) for the object
 * @param expiresIn - The number of seconds before the URL expires (default: 3600)
 * @returns - A pre-signed URL that can be used to upload a file directly
 */
export async function generatePresignedUploadUrl(key: string, expiresIn = 3600): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  return await getSignedUrl(s3Client, command, { expiresIn });
}

// Ensure the default bucket exists
// This function can be called when your server starts
export async function initializeS3Bucket(bucketName = 'holywater-bucket'): Promise<void> {

  try {
    // We need to fetch the AWS SDK dynamically to avoid issues with initialization order
    const { CreateBucketCommand, HeadBucketCommand, S3Client } = await import('@aws-sdk/client-s3');
    
    const s3Client = new S3Client(s3EmulatorConfig);
    
    // Check if bucket already exists before trying to create it
    try {
      await s3Client.send(
        new HeadBucketCommand({
          Bucket: bucketName,
        })
      );
      console.log(`Bucket '${bucketName}' already exists, skipping creation`);
      return;
    } catch (checkError) {
      // If the bucket doesn't exist, we'll get an error and continue to create it
      // Otherwise, we'll log and re-throw any unexpected errors
      if ((checkError as Error).name !== 'NotFound' && 
          (checkError as Error).name !== 'NoSuchBucket' && 
          !String((checkError as Error).message).includes('does not exist')) {
        console.error('Error checking bucket existence:', checkError);
        throw checkError;
      }
    }
    
    // Create the bucket since it doesn't exist
    await s3Client.send(
      new CreateBucketCommand({
        Bucket: bucketName,
      })
    );
    
    console.log(`Default bucket '${bucketName}' created successfully`);
  } catch (error) {
    console.error('Error initializing S3 bucket:', error);
    throw error; // Re-throw the error to be handled by the caller
  }
}

/**
 * Upload a file to S3
 * 
 * @param key - The key (filename) under which to store the object
 * @param body - The file content (Buffer, Readable stream, or string)
 * @param contentType - The content type of the file
 * @returns - The URL of the uploaded file
 */
export async function uploadFile(key: string, body: Buffer | string, contentType: string): Promise<string> {
  const command = new PutObjectCommand({
    Body: body,
    Bucket: BUCKET_NAME,
    ContentType: contentType,
    Key: key,
  });

  await s3Client.send(command);
  
  // In a real environment, you'd return a proper URL
  // For the emulator, we construct a URL that points to the local endpoint
  return `${s3EmulatorConfig.endpoint as string}/${BUCKET_NAME}/${key}`;
}