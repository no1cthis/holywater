import { SECTIONS_WITH_MOVIES } from "../../../common/constants"; // Updated import
import type { SectionEnumType, Section as SectionType } from "../../../common/types";
import { formatMongoDocument } from "../../utils/mongodb/document-formatter";
import { createCrudService, type CreateFn, type UpdateFn } from "../crud-service";
import { Section } from "../models/section.model";


// Custom create function with section-specific logic
const customCreateSection: CreateFn<SectionType> = async (sectionData: Partial<SectionType>) => {
  try {
    // Check if section type should include movies
    if (!SECTIONS_WITH_MOVIES.includes(sectionData.type as SectionEnumType) && sectionData.items) {
      // Remove items for section types that shouldn't have them
      const { items, ...sectionDataWithoutItems } = sectionData;
      const section = await Section.create({
        ...sectionDataWithoutItems,
        items: [] // Set to empty array for consistency
      });
      return formatMongoDocument(section);
    }
    
    const section = await Section.create(sectionData);
    return formatMongoDocument(section);
  } catch (error) {
    console.error("Error creating section:", error);
    throw error;
  }
};

// Custom update function with section-specific logic
const customUpdateSection: UpdateFn<SectionType> = async (id: string, sectionData: Partial<SectionType>) => {
  try {
    // If the section type is being updated or items are being modified
    if (sectionData.type || sectionData.items) {
      // Get the current section to check its type or the new type if being updated
      const currentSection = await Section.findById(id);
      if (!currentSection) return null;
      
      const sectionType:SectionEnumType = sectionData.type || currentSection.type;
      
      // If section shouldn't have movie items but they're provided
      if (!SECTIONS_WITH_MOVIES.includes(sectionType) && sectionData.items) {
        // Remove items from the update data
        const { items: _items, ...updateDataWithoutItems } = sectionData;
        const section = await Section.findByIdAndUpdate(
          id, 
          { ...updateDataWithoutItems, items: [] }, 
          { new: true }
        );
        return formatMongoDocument(section);
      }
    }
    
    const section = await Section.findByIdAndUpdate(id, sectionData, { new: true });
    return formatMongoDocument(section);
  } catch (error) {
    console.error("Error updating section:", error);
    throw error;
  }
};

// Create a CRUD service for the Section model with custom implementations
const sectionService = createCrudService<SectionType>({
  model: Section,
  entityName: 'Section',
  customCreate: customCreateSection,
  customUpdate: customUpdateSection
});

// Export all CRUD operations
export const {
  create: createSection,
  delete: deleteSection,
  getById: getSectionById,
  getMany: getSections,
  update: updateSection
} = sectionService;