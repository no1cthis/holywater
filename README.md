# Holywater Project

## Overview
The Holywater project is a full-stack application built using modern web technologies. It leverages React for the frontend, Express for the backend, MongoDB for data storage, and S3 bucket emulators for file storage. The project is designed to provide a seamless experience for managing and previewing dynamic content.

## Key Features
- **React Frontend**: A dynamic and responsive user interface built with React.
- **Express Backend**: A robust backend API powered by Express.
- **MongoDB Integration**: MongoDB is used as the primary database, configured dynamically using JSON schemas.
- **S3 Bucket Emulators**: Emulated S3 buckets are used for file storage, ensuring compatibility with cloud storage solutions.

## JSON Schema as the Source of Truth
The project uses JSON schemas as the single source of truth for data modeling. These schemas are used to:
- Configure MongoDB collections and documents.
- Define the structure of forms and UI components.

## Section Configuration
I assume that the application supports both dynamic and manual section configurations:
- **Dynamic Sections**: These sections are populated automatically based on dynamic data.
- **Hero Section**: This is a manually configurable section where users can set movies explicitly. In my project HeroSlider use this approach. You can set movies to it

## Preview Component
I assume that to ensure consistency between the admin panel and the web application, the project should use the same company internal UI package that use to create app to build preview components. So I build preview based on design sketches, because I don't have this package, this providing users with a clear understanding of how the content should appear on the website.

## Technologies Used
- **Frontend**: React, TypeScript
- **Backend**: Express, Node.js
- **Database**: MongoDB
- **File Storage**: S3 bucket emulators

## Getting Started
1. Clone the repository.
2. Install dependencies using `pnpm install`.
3. Start the development server using `pnpm start`.
4. Access the application at `http://localhost:3000`.

## Folder Structure
- `src/`: Contains the source code for the application.
  - `api/`: Backend API logic, including routes, controllers, and services.
  - `components/`: Reusable React components.
  - `schemas/`: JSON schemas for data modeling.
  - `utils/`: Utility functions and helpers.

## Contributing
Contributions are welcome! Please follow the standard Git workflow for submitting changes.