import mongoose from "mongoose";

import type { Section as SectionType } from "../../../common/types";
import { jsonSchemaToMongooseSchema } from "../../../schemas/schema-converter";
import { sectionJsonSchema } from "../../../schemas/section.schema";

// Convert the JSON Schema to a Mongoose schema
const SectionSchema = jsonSchemaToMongooseSchema(sectionJsonSchema);

// Create the model from the schema
export const Section = mongoose.models.Section || mongoose.model<SectionType>("Section", SectionSchema);