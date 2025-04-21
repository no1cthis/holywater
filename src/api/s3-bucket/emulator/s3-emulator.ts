import type { S3ClientConfig } from '@aws-sdk/client-s3';
import fs from 'fs';
import path from 'path';
import S3rver from 's3rver';
import { BUCKET_NAME } from '../../../common/constants';



// Ensure tmp directory exists
const tmpDir = path.resolve('./.tmp/s3');
if (!fs.existsSync(tmpDir)) {
  fs.mkdirSync(tmpDir, { recursive: true });
}

const corsConfigXml = `
<CORSConfiguration xmlns="http://s3.amazonaws.com/doc/2006-03-01/">
  <CORSRule>
    <AllowedOrigin>*</AllowedOrigin>
    <AllowedMethod>GET</AllowedMethod>
    <AllowedMethod>PUT</AllowedMethod>
    <AllowedMethod>POST</AllowedMethod>
    <AllowedMethod>DELETE</AllowedMethod>
    <AllowedHeader>*</AllowedHeader>
  </CORSRule>
</CORSConfiguration>
`;

export const s3Emulator = new S3rver({
  address: 'localhost',
  allowMismatchedSignatures: true,
  configureBuckets: [{
    configs: [corsConfigXml],
    name: BUCKET_NAME
  }],
  directory: tmpDir,
  port: 4569,
  silent: false,
});

console.log('S3 emulator is running on http://localhost:4569');

export const s3EmulatorConfig:S3ClientConfig = {
  credentials: {
    accessKeyId: 'S3RVER',
    secretAccessKey: 'S3RVER',
  },
  endpoint: 'http://localhost:4569',
  forcePathStyle: true,
  region: 'us-east-1',
};


// Call this to initialize the default bucket
// Commented out to allow manual initialization from the application
// createDefaultBucket();

// Cleanup function to close the server when the application exits
process.on('SIGINT', async () => {
  try {
    await s3Emulator.close();
    console.log('S3 emulator has been stopped');
  } catch (err) {
    console.error('Error stopping S3 emulator:', err);
  }
  process.exit(0);
});