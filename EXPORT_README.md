# Dermatology AI Model Card Generator - Export Guide

## How to Extract This Code

### Method 1: Direct Download (Recommended)
1. **Download Archive**: Use the file `project_export.tar.gz` in the root directory
2. **Extract**: Run `tar -xzf project_export.tar.gz` on your local machine
3. **Install Dependencies**: Run `npm install` in the extracted directory

### Method 2: Git Clone (If connected to Git)
```bash
git clone <your-replit-git-url>
cd <project-name>
npm install
```

### Method 3: Manual File Copy
1. Download individual files from the Replit file browser
2. Maintain the directory structure as shown below

## Project Structure
```
dermatology-ai-card-generator/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/              # Shadcn/ui components
│   │   │   ├── DataExtractionStep.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── ModelCardGeneration.tsx
│   │   │   ├── SearchStep.tsx
│   │   │   ├── StepIndicator.tsx
│   │   │   └── ValidationStep.tsx
│   │   ├── hooks/
│   │   │   ├── use-mobile.tsx
│   │   │   └── use-toast.ts
│   │   ├── lib/
│   │   │   └── utils.ts
│   │   ├── pages/
│   │   │   ├── Index.tsx
│   │   │   └── NotFound.tsx
│   │   ├── services/
│   │   │   ├── CardgenService.ts
│   │   │   ├── ComplianceService.ts
│   │   │   └── ModelSearchService.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   └── index.html
├── server/
│   ├── index.ts
│   ├── routes.ts
│   ├── storage.ts
│   └── vite.ts
├── shared/
│   └── schema.ts
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.ts
├── components.json
└── drizzle.config.ts
```

## Setup Instructions for Local Development

### Prerequisites
- Node.js 20 or later
- npm or yarn

### Installation
1. Extract/clone the project
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

### Key Features
- HTI-1 and OCR compliant model card generation
- Multi-step workflow for model discovery
- Automated data extraction from papers, repos, and cards
- Real-time compliance validation
- Professional UI with Tailwind CSS and Shadcn/ui

### Technologies Used
- **Frontend**: React 18, TypeScript, Vite
- **UI Framework**: Tailwind CSS, Shadcn/ui components
- **Backend**: Express.js, TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Routing**: React Router
- **State Management**: React Query

### Environment Setup
The project is configured for:
- Development: Hot reload with Vite
- Production: Built static files served by Express
- Database: PostgreSQL (optional for basic functionality)

### Notes
- All dependencies are listed in package.json
- The project uses modern ES modules
- Configured for both development and production environments
- Security: Client/server separation maintained