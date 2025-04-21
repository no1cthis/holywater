import type { ResourceProps } from "@refinedev/core";
import { MovieCreate, MovieEdit, MovieList, MovieShow } from "../pages/movies";
import { ScreenConfigurationCreate, ScreenConfigurationEdit, ScreenConfigurationList, ScreenConfigurationShow } from "../pages/screen-configurations";
import { SectionCreate, SectionEdit, SectionList, SectionShow } from "../pages/sections";

export const resources: ResourceProps[] = [
                  {
                    create: {
                      component: MovieCreate,
                      path: "/movies/create"
                    },
                    edit: {
                      component: MovieEdit,
                      path: "/movies/edit/:id"
                    },
                    list: {
                      component: MovieList,
                      path: "/movies"
                    },
                    meta: {
                      canDelete: true
                    },
                    name: "movies",
                    show: {
                      component: MovieShow,
                      path: "/movies/show/:id"
                    }
                  },
                  {
                    create: {
                      component: SectionCreate,
                      path: "/sections/create"
                    },
                    edit: {
                      component: SectionEdit,
                      path: "/sections/edit/:id"
                    },
                    list: {
                      component: SectionList,
                      path: "/sections"
                    },
                    meta: {
                      canDelete: true
                    },
                    name: "sections",
                    show: {
                      component: SectionShow,
                      path: "/sections/show/:id"
                    }
                  },
                   {
                    create: {
                      component: ScreenConfigurationCreate,
                      path: "/screen-configurations/create"
                    },
                    edit: {
                      component: ScreenConfigurationEdit,
                      path: "/screen-configurations/edit/:id"
                    },
                    list: {
                      component: ScreenConfigurationList,
                      path: "/screen-configurations"
                    },
                    meta: {
                      canDelete: true
                    },
                    name: "screen-configurations",
                    show: {
                      component: ScreenConfigurationShow,
                      path: "/screen-configurations/show/:id"
                    }
                  }
                ]