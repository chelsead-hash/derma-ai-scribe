# Dermatology AI Model Card Generator

## Overview

The Dermatology AI Model Card Generator is a full-stack web application that automates the creation of compliant model cards for dermatology AI models. The application focuses on HTI-1 (Health Technology Integration) and OCR (Office of Civil Rights) compliance standards, providing a step-by-step workflow to search for models, extract relevant data from multiple sources, validate compliance, and generate comprehensive model cards.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Build Tool**: Vite for development and production builds
- **UI Framework**: Shadcn/ui components with Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens
- **State Management**: React hooks and React Query for server state
- **Routing**: React Router for client-side navigation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Development Server**: Custom Vite integration for SSR during development
- **Storage**: In-memory storage with interface for future database integration
- **External Integrations**: Web scraping, academic paper extraction, and GitHub API integration

### Data Storage Solutions
- **Current**: In-memory storage using Map-based implementation
- **Future-Ready**: Drizzle ORM configured for PostgreSQL with Neon database
- **Schema**: User management system with extensible design
- **Migration Support**: Drizzle-kit for database schema management

## Key Components

### 1. Multi-Step Workflow System
- **Step 1**: Model search by name or website URL
- **Step 2**: Validation of search results with confidence scoring
- **Step 3**: Data extraction from multiple sources (papers, GitHub, HuggingFace, websites)
- **Step 4**: Model card generation with compliance checking

### 2. Data Extraction Services
- **WebScrapingService**: Extracts data from model websites and documentation
- **ModelSearchService**: Searches across academic databases, GitHub, and HuggingFace
- **CardgenService**: Processes and structures extracted data for model cards
- **ComplianceService**: Validates HTI-1 and OCR compliance requirements

### 3. Source Integration
- **Academic Papers**: CrossRef API integration for DOI resolution and metadata extraction
- **GitHub Repositories**: GitHub API for repository analysis and README parsing
- **HuggingFace Models**: HuggingFace Hub API for model metadata and cards
- **Web Content**: Cheerio-based HTML parsing for general website extraction

### 4. Compliance Framework
- **HTI-1 Compliance**: Ensures transparency, performance metrics, and intended use documentation
- **OCR Compliance**: Validates bias testing, fairness metrics, and accessibility considerations
- **Validation Pipeline**: Automated checking with detailed issue reporting

## Data Flow

1. **User Input**: Model name or website URL entered through search interface
2. **Multi-Source Search**: Parallel queries to academic databases, GitHub, HuggingFace, and web sources
3. **Data Validation**: User confirms correct model identification with confidence scoring
4. **Extraction Process**: Automated parsing of papers, repositories, model cards, and websites
5. **Compliance Analysis**: Real-time checking against HTI-1 and OCR standards
6. **Model Card Generation**: Structured markdown generation with source attribution
7. **Export**: Downloadable model card with proper formatting and validation

## External Dependencies

### Core Framework Dependencies
- **React Ecosystem**: React 18+ with TypeScript, React Router, React Query
- **UI Components**: Radix UI primitives, Lucide React icons, Tailwind CSS
- **Build Tools**: Vite, esbuild, PostCSS, TypeScript compiler

### Backend Dependencies
- **Server Framework**: Express.js with TypeScript support
- **Data Processing**: Cheerio for HTML parsing, Axios for HTTP requests
- **Development Tools**: tsx for TypeScript execution, nodemon alternative

### Database & ORM
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Database**: Neon serverless PostgreSQL (configured but not yet implemented)
- **Validation**: Zod for schema validation and type safety

### External APIs
- **CrossRef API**: Academic paper metadata and DOI resolution
- **GitHub API**: Repository analysis and content extraction
- **HuggingFace Hub API**: Model metadata and model card access

## Deployment Strategy

### Development Environment
- **Local Development**: Vite dev server with HMR and TypeScript compilation
- **Port Configuration**: Application runs on port 5000 with external port 80
- **Error Handling**: Runtime error overlay and comprehensive logging

### Production Build
- **Frontend Build**: Vite production build with code splitting and optimization
- **Backend Build**: esbuild bundling for Node.js deployment
- **Static Assets**: Served from dist/public directory

### Replit Deployment
- **Platform**: Replit with Node.js 20 runtime
- **Autoscale**: Configured for automatic scaling based on demand
- **Environment**: Production environment variables for database and API keys

### Build Process
1. Frontend assets compiled with Vite
2. Backend code bundled with esbuild
3. Static files served through Express.js
4. Environment-specific configuration loading

## User Preferences

Preferred communication style: Simple, everyday language.

## Changelog

Changelog:
- June 24, 2025. Initial setup