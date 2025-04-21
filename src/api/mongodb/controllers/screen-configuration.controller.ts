import type { ScreenConfiguration as ScreenConfigurationType } from "../../../common/types";
import type { FullScreenConfiguration } from "../../types";
import { formatMongoDocument, type WithMongoId } from "../../utils/mongodb/document-formatter";
import { createCrudService, type GetByIdFn } from "../crud-service";
import { ActiveConfig } from "../models/active-config.model";
import { ScreenConfiguration } from "../models/screen-configuration.model";

// Custom getById function with deep population
const customGetById: GetByIdFn<ScreenConfigurationType> = async (id: string) => {
  try {
    const configuration = await ScreenConfiguration.findById(id).populate({
      path: "sections",
      populate: {
        model: "Movie",
        path: "items",
      },
    });
    
    if (!configuration) return null;
    return formatMongoDocument(configuration);
  } catch (error) {
    console.error("Error fetching screen configuration by id:", error);
    throw error;
  }
};

// Create a CRUD service for the ScreenConfiguration model with custom implementations
const screenConfigService = createCrudService<ScreenConfigurationType>({
  customGetById,
  entityName: 'ScreenConfiguration',
  model: ScreenConfiguration
});

// Export the standard CRUD operations
export const {
  create: createScreenConfiguration,
  delete: deleteScreenConfiguration,
  getById: getScreenConfigurationById,
  getMany: getScreenConfigurations,
  update: updateScreenConfiguration
} = screenConfigService;

/**
 * Set a configuration as the active one
 */
export const setActiveScreenConfiguration = async (id: string) => {
  try {
    // Verify that the requested configuration exists
    const configExists = await ScreenConfiguration.findById(id);
    if (!configExists) return null;

    // Upsert the active config document (create if not exists, update if exists)
    await ActiveConfig.findOneAndUpdate(
      {}, // empty filter to match any document (should only be one)
      {
        screenConfigId: id,
        updatedAt: new Date(),
      },
      {
        new: true,
        upsert: true, // create if it doesn't exist
      }
    );

    return formatMongoDocument(configExists);
  } catch (error) {
    console.error("Error setting active screen configuration:", error);
    throw error;
  }
};

/**
 * Get the currently active screen configuration with fully populated sections and items
 */
export const getActiveScreenConfiguration = async () => {
  try {
    // Find the active configuration reference
    const activeConfig = await ActiveConfig.findOne();
    if (!activeConfig) return null;

    // Get the actual configuration with deep population of sections and their movies
    const configuration = await ScreenConfiguration.findById(activeConfig.screenConfigId).populate({
      model: "Section",
      path: "sections",
      // Then populate the items (movies) in each section
      populate: {
        model: "Movie",
        path: "items",
        select: "-__v",
      },
      // Ensure we get all section fields
      select: "-__v",
    });

    if (!configuration) return null;

    // Convert the mongoose document to a plain object
    const formattedConfig: WithMongoId<FullScreenConfiguration> = configuration.toObject();

    // Format sections and their movies to have consistent IDs
    if (formattedConfig.sections) {
      formattedConfig.sections = formattedConfig.sections.map((section) => {
        // Format each section using our utility
        const formattedSection = formatMongoDocument(section);

        // Format items array if it exists
        if (section.items && section.items.length) {
          formattedSection.items = section.items.map(formatMongoDocument);
        }

        return formattedSection;
      });
    }

    // Format the final configuration object
    return {
      ...formattedConfig,
      __v: undefined,
      _id: undefined,
      id: formattedConfig._id.toString(),
    };
  } catch (error) {
    console.error("Error fetching active screen configuration:", error);
    throw error;
  }
};