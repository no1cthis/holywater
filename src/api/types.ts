import type { Movie, ScreenConfiguration, Section } from "../common/types";
import type { WithMongoId } from "./utils/mongodb/document-formatter";


export type FullScreenConfiguration = Omit<ScreenConfiguration, "sections"> & {
  sections: WithMongoId<FullSection>[];
}

export type FullSection = Omit<Section, "items"> & {
  items: WithMongoId<Movie>[];
}