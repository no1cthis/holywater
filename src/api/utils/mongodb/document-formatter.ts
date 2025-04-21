import { Document } from 'mongoose';
/**
 * Type that adds MongoDB document fields to any type
 */
export type WithMongoId<T> = T & {
  __v?: number;
  _id?: any;
};

/**
 * Formats a MongoDB document by removing MongoDB-specific fields and replacing _id with id
 * @param doc MongoDB document or plain object with _id field
 * @returns A clean object with MongoDB internal fields removed and _id converted to id
 */
export function formatMongoDocument<T>(doc: Document | WithMongoId<T>): (T & { id: string }) {
  const typedDoc:WithMongoId<T> = doc instanceof Document ? doc.toObject() : doc;
   
  // Remove MongoDB specific fields and add id field
  const { __v, _id, ...rest } = typedDoc;
  
  return {
    ...rest,
    id: _id.toString(),
  } as T & { id: string };
}
