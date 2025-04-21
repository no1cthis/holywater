import type { RJSFSchema } from "@rjsf/utils";

import { SectionSelectWidget } from "../components/form/custom-form-widgets";

// JSON Schema definition for ScreenConfiguration
export const screenConfigurationJsonSchema: RJSFSchema = {
  properties: {
    name: {
      description: "Configuration name displayed in the UI",
      title: "Name",
      type: "string"
    },
    description: {
      description: "Brief description of this screen configuration",
      title: "Description",
      type: "string"
    },
    sections: {
      description: "Section IDs included in this configuration",
      items: {
        type: "string"
      },
      title: "Sections",
      type: "array"
    }
  },
  required: ["name", "sections"],
  type: "object"
};

// UI Schema for form rendering
export const screenConfigurationUiSchema = {
  description: {
    "ui:options": {
      rows: 3,
    },
    "ui:widget": "textarea"
  },
  sections: {
    "ui:widget": SectionSelectWidget,
  }
};

// Export a type based on the JSON Schema
export interface ScreenConfigurationJsonSchema {
  description?: string;
  name: string;
  sections: string[];
}