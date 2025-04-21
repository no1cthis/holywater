import type { RJSFSchema, UiSchema } from "@rjsf/utils";

import { SectionEnum } from "../common/types";
import { DesignImageWidget, MovieSelectWidget } from "../components/form/custom-form-widgets";

const sectionTypes = [
  { label: "Hero Slider", value: SectionEnum.HeroSlider },
  { label: "Top Chart", value: SectionEnum.TopChart },
  { label: "Most Trending", value: SectionEnum.MostTrending },
  { label: "Continue Watching", value: SectionEnum.ContinueWatching },
  { label: "Most Popular", value: SectionEnum.MostPopular },
];

// JSON Schema definition for Section
export const sectionJsonSchema: RJSFSchema ={
  // Use dependencies to conditionally show the items field
  dependencies: {
    type: {
      oneOf: [
        {
          properties: {
            items: {
              items: {
                type: "string"
              },
              title: "Movies",
              type: "array",
              uniqueItems: true
            },
            type: {
              enum: [SectionEnum.HeroSlider]
            }
          },
          required: ["items"] // Make items required only for HeroSlider
        },
        {
          properties: {
            type: {
              enum: [
                SectionEnum.TopChart, 
                SectionEnum.MostTrending, 
                SectionEnum.ContinueWatching, 
                SectionEnum.MostPopular
              ]
            }
          }
        }
      ]
    }
  },
  properties: {
    title: {
      title: "Title",
      type: "string",
    },
    description: {
      title: "Description",
      type: "string",
    },
    design: {
      description: "This image should show how this section should look",
      title: "Design Image",
      type: "string"
    },
    type: {
      enum: sectionTypes.map((t) => t.value),
      // Using enum as provided by RJSF
      // @ts-expect-error // JSON Schema doesn't support enumNames but RJSF does
      enumNames: sectionTypes.map((t) => t.label),
      title: "Section Type",
      type: "string",
    }
  },
  required: ["title", "type"],
  type: "object"
};


export const sectionUiSchema:UiSchema = {
    description: {
      "ui:options": {
        rows: 3,
      },
      "ui:widget": "textarea",
    },
    design: {
      "ui:widget": DesignImageWidget
    },
    items: {
      "ui:widget": MovieSelectWidget,
    }
  };