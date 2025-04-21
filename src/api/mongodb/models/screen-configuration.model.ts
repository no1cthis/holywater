import mongoose from "mongoose";

import type { ScreenConfiguration as ScreenConfigurationType } from "../../../common/types";
import { jsonSchemaToMongooseSchema } from "../../../schemas/schema-converter";
import { screenConfigurationJsonSchema } from "../../../schemas/screen-configuration.schema";

// Convert the JSON Schema to a Mongoose schema
const ScreenConfigurationSchema = jsonSchemaToMongooseSchema(screenConfigurationJsonSchema);

export const ScreenConfiguration = mongoose.models.ScreenConfiguration || 
  mongoose.model<ScreenConfigurationType>("ScreenConfiguration", ScreenConfigurationSchema);