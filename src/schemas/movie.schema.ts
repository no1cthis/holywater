import type { RJSFSchema } from "@rjsf/utils";

import { ImageUploadWidget, TagsWidget } from "../components/form/custom-form-widgets";

// I assume that company already has a structure for storing movies, so I don't add fields like "releaseDate", "duration", etc. 

// JSON Schema definition for Movie
export const movieJsonSchema:RJSFSchema = {
  properties: {
    title: {
      description: "Movie title displayed in the UI",
      title: "Title",
      type: "string"
    },
    description: {
      description: "Brief synopsis of the movie",
      title: "Description",
      type: "string"
    },
    poster: {
      description: "URL to the movie poster image",
      title: "Poster URL",
      type: "string"
    },
    tags: {
      description: "Categories or genres that the movie belongs to",
      items: {
        type: "string"
      },
      title: "Tags",
      type: "array"
    },

  },
  required: ["title", "description", "poster"],
  type: "object"
};

// UI Schema for form rendering
export const movieUiSchema = {
  description: {
    "ui:options": {
      rows: 5,
    },
    "ui:widget": "textarea",
  },
  poster: {
    "ui:widget": ImageUploadWidget
  },
  tags: {
    "ui:widget": TagsWidget,
  }
};

// Export a type based on the JSON Schema
export interface MovieJsonSchema {
  description: string;
  episodes?: number;
  poster: string;
  tags?: string[];
  title: string;
  views?: number;
}