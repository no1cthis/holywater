import { useMany } from "@refinedev/core";
import { useCallback, useEffect, useRef, useState } from "react";

import type { Section } from "../common/types";
import { concatenateImagesVertically } from "../utils/resize-base64-image";

/**
 * Hook for generating visual preview of screen configuration
 * @returns {Object} Object containing section data and functions to manage it
 */
export const useScreenPreview = (sectionIds?: string[]) => {
  const [previewSections, setPreviewSections] = useState<Section[]>([]);
  const [concatenatedPreview, setConcatenatedPreview] = useState<string>("");
  const [isConcatenating, setIsConcatenating] = useState<boolean>(false);
  const prevSectionIdsRef = useRef<string[]>([]);
  const [shouldRegenerate, setShouldRegenerate] = useState<boolean>(false);

  // Use useMany hook to fetch sections data in the order they appear in sectionIds
  const { data: sectionsData, isLoading: sectionsLoading } = useMany<Section>({
    ids: sectionIds || [],
    queryOptions: {
      enabled: !!sectionIds?.length,
    },
    resource: "sections",
  });

  // Check if section order has changed by comparing current and previous section IDs
  const hasSectionOrderChanged = () => {
    if (!sectionIds) return false;
    if (sectionIds.length !== prevSectionIdsRef.current.length) return true;

    // Compare each ID in order
    for (let i = 0; i < sectionIds.length; i++) {
      if (sectionIds[i] !== prevSectionIdsRef.current[i]) {
        return true;
      }
    }
    return false;
  };

  // Set preview sections whenever section data changes
  useEffect(() => {
    if (sectionsData?.data && sectionIds) {
      // Ensure sections are ordered according to the sectionIds array
      const orderedSections: Section[] = [];
      
      // Map ids to maintain the order from sectionIds
      for (const id of sectionIds) {
        const section = sectionsData.data.find(s => s.id === id);
        if (section) {
          orderedSections.push(section);
        }
      }
      
      setPreviewSections(orderedSections);
      
      // Check if section order has changed and regenerate if needed
      if (hasSectionOrderChanged()) {
        // Don't clear the preview - only set the flag to regenerate
        setShouldRegenerate(true);
      }
      
      // Update ref with current section IDs for future comparison
      prevSectionIdsRef.current = sectionIds;
    }
  }, [sectionsData, sectionIds]);

  // Trigger regeneration when shouldRegenerate is true
  useEffect(() => {
    if (shouldRegenerate && sectionIds?.length && !isConcatenating) {
      generateConcatenatedPreview();
      setShouldRegenerate(false);
    }
  }, [shouldRegenerate, sectionIds, isConcatenating]);

  // Function to concatenate section images vertically
  const generateConcatenatedPreview = useCallback(async () => {
    if (!sectionIds?.length) {
      setConcatenatedPreview("");
      return;
    }
    
    setIsConcatenating(true);
    // Don't clear the existing preview until we have a new one
    
    try {
      if (previewSections.length > 0) {
        // Filter out sections without design images
        const sectionImages = previewSections
          .filter(section => section.design)
          .map(section => section.design as string);
          
        if (sectionImages.length === 0) {
          throw new Error("No images available to concatenate");
        }
        
        // Concatenate images
        const result = await concatenateImagesVertically(
          sectionImages,
          20,  // 20px spacing between images
          1200,  // 800px max width
          'jpeg',
          0.9
        );
        
        // Only update the preview when the new image is ready
        setConcatenatedPreview(result);
      } else if (previewSections.length === 0) {
        // Only clear the preview if there are no sections
        setConcatenatedPreview("");
      }
    } catch (error) {
      console.error("Error concatenating images:", error);
    } finally {
      setIsConcatenating(false);
      setShouldRegenerate(false);
    }
  }, [previewSections, sectionIds]);

  return {
    concatenatedPreview,
    generateConcatenatedPreview,
    isConcatenating,
    previewSections,
    sectionsLoading,
  };
};