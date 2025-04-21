import type { Model } from 'mongoose';

import { formatMongoDocument, type WithMongoId } from '../utils/mongodb/document-formatter';
import { buildMongoQuery, type QueryBuilderOptions } from '../utils/mongodb/query-builder';

export type CreateFn<T> = (data: Partial<T>) => Promise<WithMongoId<T>>;
/**
 * CRUD service interface
 */
export interface CrudService<T> {
  create: CreateFn<T>;
  delete: DeleteFn<T>;
  getById: GetByIdFn<T>;
  getMany: GetManyFn<T>;
  update: UpdateFn<T>;
}
export type DeleteFn<T> = (id: string) => Promise<null | WithMongoId<T>>;
export type GetByIdFn<T> = (id: string) => Promise<null | WithMongoId<T>>;
/**
 * Type definitions for CRUD operations
 */
export type GetManyFn<T> = (options?: QueryBuilderOptions) => Promise<WithMongoId<T>[]>;

export type UpdateFn<T> = (id: string, data: Partial<T>) => Promise<null | WithMongoId<T>>;

/**
 * Create a default getMany function for a model
 */
export const createGetManyFn = <T>(model: Model<any>, entityName: string): GetManyFn<T> => {
  return async (options: QueryBuilderOptions = {}) => {
    try {
      const { query, sortOptions } = buildMongoQuery(options);
      
      const entities = await model.find(query).sort(sortOptions);
      return entities.map(entity => formatMongoDocument(entity));
    } catch (error) {
      console.error(`Error fetching ${entityName} list:`, error);
      throw error;
    }
  };
};

/**
 * Create a default getById function for a model
 */
export const createGetByIdFn = <T>(model: Model<any>, entityName: string): GetByIdFn<T> => {
  return async (id: string) => {
    try {
      const entity = await model.findById(id);
      if (!entity) return null;
      
      return formatMongoDocument(entity);
    } catch (error) {
      console.error(`Error fetching ${entityName} by id:`, error);
      throw error;
    }
  };
};

/**
 * Create a default create function for a model
 */
export const createCreateFn = <T>(model: Model<any>, entityName: string): CreateFn<T> => {
  return async (data: Partial<T>) => {
    try {
      const entity = await model.create(data);
      return formatMongoDocument(entity);
    } catch (error) {
      console.error(`Error creating ${entityName}:`, error);
      throw error;
    }
  };
};

/**
 * Create a default update function for a model
 */
export const createUpdateFn = <T>(model: Model<any>, entityName: string): UpdateFn<T> => {
  return async (id: string, data: Partial<T>) => {
    try {
      const entity = await model.findByIdAndUpdate(id, data, { new: true });
      if (!entity) return null;
      
      return formatMongoDocument(entity);
    } catch (error) {
      console.error(`Error updating ${entityName}:`, error);
      throw error;
    }
  };
};

/**
 * Create a default delete function for a model
 */
export const createDeleteFn = <T>(model: Model<any>, entityName: string): DeleteFn<T> => {
  return async (id: string) => {
    try {
      const entity = await model.findByIdAndDelete(id);
      if (!entity) return null;
      
      return formatMongoDocument(entity);
    } catch (error) {
      console.error(`Error deleting ${entityName}:`, error);
      throw error;
    }
  };
};

/**
 * Options for creating a CRUD service
 */
export interface CreateCrudServiceOptions<T> {
  customCreate?: CreateFn<T>;
  customDelete?: DeleteFn<T>;
  customGetById?: GetByIdFn<T>;
  customGetMany?: GetManyFn<T>;
  customUpdate?: UpdateFn<T>;
  entityName: string;
  model: Model<any>;
}

/**
 * Create a CRUD service with optional custom implementations
 */
export const createCrudService = <T>({
  customCreate,
  customDelete,
  customGetById,
  customGetMany,
  customUpdate,
  entityName,
  model
}: CreateCrudServiceOptions<T>): CrudService<T> => {
  return {
    create: customCreate || createCreateFn<T>(model, entityName),
    delete: customDelete || createDeleteFn<T>(model, entityName),
    getById: customGetById || createGetByIdFn<T>(model, entityName),
    getMany: customGetMany || createGetManyFn<T>(model, entityName),
    update: customUpdate || createUpdateFn<T>(model, entityName)
  };
};