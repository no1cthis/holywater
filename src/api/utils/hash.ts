import crypto from 'crypto';

/**
 * Generates a hash from file content
 * @param buffer The file buffer to hash
 * @param algorithm Hash algorithm to use (defaults to sha256)
 * @returns A hex string hash of the content
 */
export function generateContentHash(buffer: Buffer, algorithm = 'sha256'): string {
  const hash = crypto.createHash(algorithm);
  hash.update(buffer);
  return hash.digest('hex');
}

/**
 * Generates a content hash and appends the file extension
 * @param buffer The file buffer to hash
 * @param fileExtension The file extension (without the dot)
 * @returns A filename with content hash and extension
 */
export function generateFileKey(buffer: Buffer, fileExtension: string): string {
  const hash = generateContentHash(buffer);
  return `${hash}.${fileExtension}`;
}