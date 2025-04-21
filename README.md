# Holywater Project

## Key Features
- **React Frontend**: A dynamic and responsive user interface built with React.
- **Express Backend**: A robust backend API powered by Express.
- **MongoDB Integration**: MongoDB is used as the primary database, configured dynamically using JSON schemas.
- **S3 Bucket Emulators**: Emulated S3 buckets are used for file storage, ensuring compatibility with cloud storage solutions.

## JSON Schema as the Source of Truth
The project uses JSON schemas as the single source of truth for data modeling. These schemas are used to:
- Configure MongoDB collections and documents.
- Define the structure of forms and UI components.

## Data Schemas

### Movie Schema
The `movieJsonSchema` defines the structure for movie data. It includes the following fields:
- **title** (string, required): Movie title displayed in the UI.
- **description** (string, required): Brief synopsis of the movie.
- **poster** (string, required): URL to the movie poster image.
- **tags** (array of strings, optional): Categories or genres that the movie belongs to.

### Screen Configuration Schema
The `screenConfigurationJsonSchema` defines the structure for screen configurations. It includes the following fields:
- **name** (string, required): Configuration name displayed in the UI.
- **description** (string, optional): Brief description of this screen configuration.
- **sections** (array of strings, required): Section IDs included in this configuration.

### Section Schema
The `sectionJsonSchema` defines the structure for sections. It includes the following fields:
- **title** (string, required): Title of the section.
- **description** (string, optional): Description of the section.
- **design** (string, optional): URL to an image showing the design of the section.
- **type** (string, required): Type of the section (e.g., Hero Slider, Top Chart, etc.).
- **items** (array of strings, optional): List of movie IDs (required for Hero Slider type).

Each schema is accompanied by a UI schema to customize the form rendering.

## Section Configuration
I assume that the application supports both dynamic and manual section configurations:
- **Dynamic Sections**: These sections are populated automatically based on dynamic data.
- **Hero Section**: This is a manually configurable section where users can set movies explicitly. In my project HeroSlider use this approach. You can set movies to it

## Preview Component
I assume that to ensure consistency between the admin panel and the web application, the project should use the same back-end UI package that is used to create the components on the website. Since I don't have this package, I create a preview based on the thumbnails that have been uploaded, which gives users a clear understanding of how the content should look on the website.

## Technologies Used
- **Frontend**: React, TypeScript
- **Backend**: Express, Node.js
- **Database**: MongoDB
- **File Storage**: S3 bucket emulators

## Getting Started
1. Clone the repository.
2. Install dependencies using `pnpm install`.
3. Start the development server using `pnpm start`.
4. Access the application at `http://localhost:5173/`.

## Folder Structure

- `src/`: Contains the source code for the application.
  - `api/`: Backend API logic, including routes, controllers, services, and utilities.
    - `mongodb/`: MongoDB-related logic, including models, controllers, and CRUD services.
    - `routes/`: API route definitions for various resources.
    - `s3-bucket/`: S3 bucket integration and emulators.
    - `utils/`: Helper functions for API operations, such as filtering, sorting, and response formatting.
  - `common/`: Shared constants and type definitions used across the application.
  - `components/`: Reusable React components for UI and functionality.
    - `buttons/`: Custom button components.
    - `filters/`: Components for filtering data.
    - `form/`: Custom form widgets for JSON schema forms.
    - `layout/`: Layout components.
    - `ui/`: General UI components like previews and selectors.
  - `hooks/`: Custom React hooks for managing state and logic.
  - `pages/`: Page components for different sections of the application.
    - `movies/`: Pages for managing movies (create, edit, list, show).
    - `screen-configurations/`: Pages for managing screen configurations.
    - `sections/`: Pages for managing sections.
  - `providers/`: Context providers for global state management.
  - `routing/`: Resource routing configuration for the application.
  - `schemas/`: JSON schemas and utilities for data modeling.
  - `utils/`: General utility functions for tasks like image processing and uploads.