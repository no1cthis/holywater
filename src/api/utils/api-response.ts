import type { Response } from 'express';

/**
 * Standard response structure for error responses only
 */
export interface ApiErrorResponse {
  error: string;
  success: boolean;
}

/**
 * Safe JSON stringify that handles circular references
 */
const safeStringify = (obj: any): string => {
  const seen = new WeakSet();
  return JSON.stringify(obj, (_key, value) => {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return '[Circular Reference]';
      }
      seen.add(value);
    }
    return value;
  });
};

/**
 * Send a success response - sends data directly without wrapping it in a custom structure
 * @param res Express response object
 * @param data Data to include in the response
 * @param message Optional success message (will be ignored)
 * @param statusCode HTTP status code (default: 200)
 */
export const sendSuccess = <T>(
  res: Response,
  data?: T,
  statusCode = 200
): Response => {
  try {
    // Prevent sending response if headers already sent
    if (res.headersSent) {
      console.warn('Headers already sent, cannot send success response');
      return res;
    }
    
    // Try to directly serialize and send the data
    return res.status(statusCode).json(data);
  } catch (error) {
    // If normal JSON serialization fails (e.g., circular references),
    // try using a safer approach
    console.warn('Error serializing response data, using safe stringify instead:', error);
    
    // Set the proper content type for JSON
    res.setHeader('Content-Type', 'application/json');
    
    // Use our safe stringify and send the response manually
    return res.status(statusCode).send(safeStringify(data));
  }
};

/**
 * Send an error response
 * @param res Express response object
 * @param error Error message or object
 * @param statusCode HTTP status code (default: 500)
 */
export const sendError = (
  res: Response,
  error: Error | string,
  statusCode = 500
): Response => {
  // Prevent sending response if headers already sent
  if (res.headersSent) {
    console.warn('Headers already sent, cannot send error response');
    return res;
  }
  
  // Log error to console
  console.error(error);
  
  const errorMessage = error instanceof Error ? error.message : String(error);
  
  const response: ApiErrorResponse = {
    error: errorMessage,
    success: false
  };
  
  try {
    return res.status(statusCode).json(response);
  } catch (err) {
    // If JSON serialization fails, use a simpler approach
    res.setHeader('Content-Type', 'application/json');
    res.statusMessage = (err as Error).message || 'Internal Server Error';
    return res.status(statusCode).send(safeStringify(response));
  }
};

/**
 * Send a "not found" error response
 * @param res Express response object
 * @param resourceName Name of the resource that wasn't found
 */
export const sendNotFound = (
  res: Response,
  resourceName: string
): Response => {
  return sendError(res, `${resourceName} not found`, 404);
};

/**
 * Handle API request with standardized error handling
 * @param res Express response object
 * @param fn Async function to execute
 */
export const handleRequest = async <T>(
  res: Response,
  fn: () => Promise<Response | T>,
  notFoundCheck?: (result: T) => boolean,
  resourceName?: string
): Promise<void> => {
  if (res.headersSent) {
    console.warn('Headers already sent, skipping request handler');
    return;
  }
  
  try {
    const result = await fn();
    
    // If fn returned a Response object, it means it already sent the response
    // Using instanceof with imported Response type doesn't work correctly
    // Instead check if it has the expected properties of a Response object
    if (result && typeof result === 'object' && 'headersSent' in result) {
      return;
    }
    
    // Check for not found condition if specified
    if (notFoundCheck && result && notFoundCheck(result as T)) {
      sendNotFound(res, resourceName || 'Resource');
      return;
    }
    
    sendSuccess(res, result);
  } catch (error) {
    sendError(res, error as Error);
  }
};