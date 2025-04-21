/**
 * Enum for section types used throughout the application
 */
export const SectionEnum = {
  ContinueWatching: "ContinueWatching",
  HeroSlider: "HeroSlider",
  MostPopular: "MostPopular",
  MostTrending: "MostTrending",
  TopChart: "TopChart"
} as const;
export type SectionEnumType = typeof SectionEnum[keyof typeof SectionEnum];

/**
 * Auto-populated sections that don't require explicit items selection
 */
export interface AutoPopulatedSection extends BaseSection {
  items?: string[]; // Optional as these will be auto-populated
  type: SectionEnumType
}

/**
 * Base section interface with common properties
 */
export interface BaseSection {
  description?: string;
  design?: string; // Added design field for section layout image
  id: string;
  title: string;
  type: SectionEnumType;
}

/**
 * Hero Slider section that requires movie items
 */
export interface HeroSliderSection extends BaseSection {
  items: string[]; // Reference to movie IDs
}

/**
 * Movie type representing a movie item
 */
export interface Movie {
  description: string;
  episodes?: number;
  id: string;
  poster: string;
  tags: string[];
  title: string;
  views: number;
}

/**
 *  Screen configuration interface representing a collection of sections
 */
export interface ScreenConfiguration {
  description?: string;
  id: string;
  name: string;
  sections: string[]; // Reference to section IDs
}

/**
 * Union type representing all possible section types
 */
export type Section = AutoPopulatedSection | HeroSliderSection;

export const sectionTypeColors: Record<SectionEnumType, string> = {
  [SectionEnum.ContinueWatching]: "cyan",
  [SectionEnum.HeroSlider]: "magenta",
  [SectionEnum.MostPopular]: "purple",
  [SectionEnum.MostTrending]: "green",
  [SectionEnum.TopChart]: "gold",
}