import type { RJSFSchema } from "@rjsf/utils";
import type mongoose from "mongoose";
import { Schema } from "mongoose";

/**
 * Converts a JSON Schema to a Mongoose schema
 */
export function jsonSchemaToMongooseSchema(jsonSchema: RJSFSchema): mongoose.Schema {
  const schemaDefinition: Record<string, any> = {};
  
  // Process each property in the JSON Schema
  if (jsonSchema.properties) {
    Object.entries(jsonSchema.properties).forEach(([key, value]) => {
      schemaDefinition[key] = convertJsonSchemaPropertyToMongoose(value, key);
    });
  }
  
  // Process dependencies to extract additional properties
  if (jsonSchema.dependencies) {
    const dependencyProperties = extractPropertiesFromDependencies(jsonSchema.dependencies);
    
    // Add dependency properties that aren't already in the schema
    Object.entries(dependencyProperties).forEach(([key, value]) => {
      if (!schemaDefinition[key]) {
        schemaDefinition[key] = convertJsonSchemaPropertyToMongoose(value, key);
      }
    });
  }
  
  // Create a Mongoose schema with timestamps option
  return new Schema(schemaDefinition, { timestamps: true });
}

/**
 * Converts a JSON Schema property definition to a Mongoose schema type definition
 */
function convertJsonSchemaPropertyToMongoose(property: any, schemaProperty: string): any {
  // Base type mapping
  const typeMap: Record<string, any> = {
    "boolean": Boolean,
    "number": Number,
    "object": Object,
    "string": String,
  };
  
  // Handle different property types
  if (!property?.type) {
    return {};
  }
  
  let mongooseType: any = {};
  const isRequired = Array.isArray(property.required) && property.required.includes(schemaProperty);
  
  // Handle basic types
  if (typeMap[property.type]) {
    mongooseType = { type: typeMap[property.type] };
    if (isRequired) {
      mongooseType.required = true;
    }
    
    // Handle additional validations/options
    if (property.enum) {
      mongooseType.enum = property.enum;
    }
    
    if (property.default !== undefined) {
      mongooseType.default = property.default;
    }
  }
  
  // Handle array type
  else if (property.type === 'array') {
    if (property.items && property.items.type === 'string' && schemaProperty === 'items') {
      // Special case for arrays of ObjectId references (like movie items)
      mongooseType = [{ ref: "Movie", type: Schema.Types.ObjectId }];
    } else if (property.items && typeMap[property.items.type]) {
      mongooseType = [{ type: typeMap[property.items.type] }];
    } else {
      mongooseType = [Schema.Types.Mixed];
    }
  }
  
  return mongooseType;
}

/**
 * Extracts properties from dependencies in JSON Schema
 */
function extractPropertiesFromDependencies(dependencies: any): Record<string, any> {
  const extractedProperties: Record<string, any> = {};
  
  if (!dependencies) return extractedProperties;
  
  // Process each dependency
  Object.values(dependencies).forEach((dependency: any) => {
    // Handle oneOf case (common in form schemas with conditional fields)
    if (dependency.oneOf && Array.isArray(dependency.oneOf)) {
      dependency.oneOf.forEach((option: any) => {
        if (option.properties) {
          Object.entries(option.properties).forEach(([key, value]) => {
            // Only add if not already defined (avoid overwriting)
            if (!extractedProperties[key]) {
              extractedProperties[key] = value;
            }
          });
        }
      });
    }
  });
  
  return extractedProperties;
}