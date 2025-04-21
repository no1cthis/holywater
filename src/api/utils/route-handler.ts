import type { Request, Router } from 'express';

import { handleRequest, sendNotFound, sendSuccess } from './api-response';
import type { QueryBuilderOptions } from './mongodb/query-builder';

/**
 * Options for route handlers
 */
export interface RouteOptions {
  /**
   * Controller methods
   */
  controllers: {
    create: (data: any) => Promise<any>;
    delete: (id: string) => Promise<any | null>;
    getById: (id: string) => Promise<any | null>;
    getMany: (options:QueryBuilderOptions) => Promise<any[]>;
    update: (id: string, data: any) => Promise<any | null>;
  };
  
  /**
   * Query param processing functions
   */
  queryProcessors?: {
    getFilterOptions?: (query: any) => any;
    getSortOptions?: (query: any) => any;
  };
  
  /**
   * Resource name (used in error messages)
   */
  resourceName: string;
  
  /**
   * Router instance
   */
  router: Router;
}

/**
 * Registers standard REST routes with proper error handling
 */
export const registerRoutes = (options: RouteOptions): void => {
  const {
    controllers,
    queryProcessors = {},
    resourceName,
    router
  } = options;
  
  // Helper for extracting IDs from query params
  const getIdsFromQuery = (req: Request) => 
    req.query.id ? (Array.isArray(req.query.id) ? req.query.id : [req.query.id]) as string[] : undefined;
  
  // GET list endpoint
  if (controllers.getMany) {
    router.get('/', async (req, res) => {
      // Process query parameters
      const sort = queryProcessors.getSortOptions?.(req.query);
      const filters = queryProcessors.getFilterOptions?.(req.query);
      const ids = getIdsFromQuery(req);
      
      return handleRequest(res, async () => controllers.getMany({filters, ids, sort}));
    });
  }
  
  // GET single item endpoint
  if (controllers.getById) {
    router.get('/:id', async (req, res) => {
      return handleRequest(res, async () => {
        const item = await controllers.getById(req.params.id);
        if (!item) return sendNotFound(res, resourceName);
        return sendSuccess(res, item);
      });
    });
  }
  
  // POST create endpoint
  if (controllers.create) {
    router.post('/', async (req, res) => {
      return handleRequest(res, async () => {
        const item = await controllers.create(req.body);
        return sendSuccess(res, item, 201);
      });
    });
  }
  
  // PUT update endpoint
  if (controllers.update) {
    router.put('/:id', async (req, res) => {
      return handleRequest(res, async () => {
        const item = await controllers.update(req.params.id, req.body);
        if (!item) return sendNotFound(res, resourceName);
        return sendSuccess(res, item);
      });
    });
    
    // Also add PATCH endpoint for Refine compatibility
    router.patch('/:id', async (req, res) => {
      return handleRequest(res, async () => {
        const item = await controllers.update(req.params.id, req.body);
        if (!item) return sendNotFound(res, resourceName);
        return sendSuccess(res, item);
      });
    });
  }
  
  // DELETE endpoint
  if (controllers.delete) {
    router.delete('/:id', async (req, res) => {
      return handleRequest(res, async () => {
        const item = await controllers.delete(req.params.id);
        if (!item) return sendNotFound(res, resourceName);
        return sendSuccess(res, { id: req.params.id });
      });
    });
  }
};