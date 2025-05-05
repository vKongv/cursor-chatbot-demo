# Project Details: ai-chatbot

---

## Project-Wide Information

### 1. Overview

- **Description**: A free, open-source chatbot application template built with Next.js and the Vercel AI SDK. It provides a foundation for building powerful, interactive chat experiences.
- **Key Features**:
  - Next.js App Router (with RSCs and Server Actions)
  - Vercel AI SDK for LLM integration (Text, Structured Objects, Tools)
  - shadcn/ui components with Tailwind CSS styling
  - Radix UI primitives for accessibility
  - Data persistence using Neon Serverless Postgres (via Drizzle ORM)
  - File storage using Vercel Blob
  - Authentication via Auth.js
  - Support for multiple AI model providers (xAI, OpenAI, Anthropic, etc.)
- **Target Audience**: Developers looking to quickly build and deploy AI-powered chatbot applications.

### 2. Project Metadata

- **Languages**: TypeScript, SQL (for migrations)
- **Versions**:
  - Project: 3.0.19
  - Next.js: ~15.3.0-canary.31
  - React: ~19.0.0-rc
  - AI SDK: ~1.2.11 (@ai-sdk/react), ~4.3.13 (ai)
  - Auth.js: ~5.0.0-beta.25
  - Drizzle ORM: ~0.34.0
  - Tailwind CSS: ~3.4.1
- **Key Dependencies**:
  - `next`: Framework
  - `react`: UI Library
  - `@ai-sdk/react`, `ai`: Vercel AI SDK for chat interactions
  - `next-auth`: Authentication
  - `drizzle-orm`, `@vercel/postgres`: Database ORM and adapter
  - `@vercel/blob`: File storage
  - `shadcn/ui`, `tailwindcss`, `@radix-ui/*`: UI components and styling
  - `typescript`: Language
  - `zod`: Schema validation

### 3. Architecture (High-Level)

- **Overview**: This is a full-stack application built using Next.js. The frontend is rendered using React Server Components (RSC) and Client Components. Backend logic is handled by Next.js API Routes and Server Actions. The Vercel AI SDK integrates with various Large Language Models (LLMs). Data (chat history, user info) is stored in a Neon Serverless Postgres database accessed via Drizzle ORM. User authentication is managed by Auth.js. File uploads are handled by Vercel Blob storage.
- **Data Flow**:
  1. User interacts with the chat interface (React components).
  2. Frontend sends requests to Next.js API routes (`/api/chat`) or invokes Server Actions.
  3. Backend interacts with the AI SDK to get responses from the configured LLM.
  4. Backend reads/writes chat history and user data to the Postgres database via Drizzle.
  5. File uploads go through the backend to Vercel Blob.
  6. Responses (including AI messages and data) are streamed back or returned to the frontend for display.

### 4. APIs/Endpoints (Cross-Repo Interactions)

- **Primary Consumers**: Frontend React components within this repository.
- **Key Interactions**:
  - `/api/auth/*`: Handled by Auth.js for login, logout, session management.
  - `/api/chat`: Handles streaming chat responses from the AI model.
  - `/api/files/upload`: Manages file uploads to Vercel Blob.
  - `/api/history`: Fetches chat history.
  - `/api/suggestions`: Gets suggested follow-up actions.
  - `/api/vote`: Records user feedback on messages.
  - `/api/document`: Handles document creation/updates via AI tools.
  - Server Actions (`actions.ts` in `app/(auth)` and `app/(chat)`): Handle specific backend logic like authentication actions or chat-related operations directly callable from RSCs/Client Components.

### 5. Known Issues/Bugs (Project-Wide)

- `To be determined`

### 6. Contribution Guidelines (Project-Wide)

- **General Workflow**: `Requires clarification` (No CONTRIBUTING.md found)
- **Branching Strategy**: `Requires clarification`
- **Pull Request Process**: `Requires clarification`

### 7. Future Roadmap

- `To be determined`

---

## Repository-Specific Information

### ai-chatbot (This Repository)

- **Directory Structure**:

  ```
  ├── app/               # Next.js App Router: Contains layouts, pages, API routes, core application logic
  │   ├── (auth)/        # Authentication related pages, API routes, and logic (Auth.js)
  │   ├── (chat)/        # Main chat interface pages, API routes, and logic
  │   └── layout.tsx     # Root layout component
  │   └── globals.css    # Global styles
  ├── artifacts/         # Components related to displaying different types of AI tool outputs (code, images, text, sheets)
  ├── components/        # Shared React components used across the application
  │   ├── ui/            # UI primitives from shadcn/ui
  │   └── *.tsx          # Application-specific components (chat, messages, sidebar, etc.)
  ├── hooks/             # Custom React hooks for shared client-side logic
  ├── lib/               # Core libraries, utilities, and configurations
  │   ├── ai/            # AI SDK configuration, prompts, models, tools
  │   ├── db/            # Database schema (Drizzle), migrations, queries
  │   ├── editor/        # Configuration and components related to text/code editors
  │   └── utils.ts       # General utility functions
  ├── public/            # Static assets (images, icons)
  ├── tests/             # Automated tests (E2E with Playwright, potentially others)
  │   ├── e2e/           # End-to-end tests
  │   ├── pages/         # Page object models for E2E tests
  │   └── prompts/       # Test prompts
  ├── .env.example       # Example environment variables
  ├── next.config.ts     # Next.js configuration
  ├── tailwind.config.ts # Tailwind CSS configuration
  ├── tsconfig.json      # TypeScript configuration
  ├── drizzle.config.ts  # Drizzle ORM configuration
  ├── package.json       # Project metadata, dependencies, and scripts
  └── README.md          # Project overview and setup instructions
  ```

- **Architecture**:

  - **Framework/Runtime**: Next.js 15 (App Router) using Node.js. Leverages React Server Components (RSC) and Server Actions for backend logic alongside traditional API Routes.
  - **UI**: React 19 with Server and Client Components. UI built using shadcn/ui components, which are based on Radix UI primitives and styled with Tailwind CSS.
  - **Styling**: Tailwind CSS for utility-first styling, configured in `tailwind.config.ts` and `app/globals.css`. `tailwind-merge` and `clsx` used for managing classes.
  - **State Management**: Primarily relies on React's built-in state management (useState, useContext). `useSWR` and `@ai-sdk/react` hooks (`useChat`, `useCompletion`) are used for data fetching and managing AI interaction state. `usehooks-ts` provides additional utility hooks.
  - **Routing**: Handled by the Next.js App Router based on directory structure within `app/`. Route groups `(auth)` and `(chat)` organize related routes.
  - **API Layer**: Combination of Next.js API Routes (in `app/**/api/`) for RESTful endpoints (like chat streaming, file uploads) and Server Actions (in `actions.ts` files) for direct RPC-style calls from components.
  - **AI Integration**: Uses Vercel AI SDK (`ai` and `@ai-sdk/*` packages). Configuration, model definitions, and custom AI tools are located in `lib/ai/`.
  - **Database**: Neon Serverless Postgres accessed via Drizzle ORM. Schema defined in `lib/db/schema.ts`, migrations in `lib/db/migrations/`, queries in `lib/db/queries.ts`. `drizzle-kit` used for managing migrations.
  - **Authentication**: Implemented using `next-auth` (Auth.js v5). Configuration in `app/(auth)/auth.ts` and related files. Supports credentials (username/password) and potentially other providers.
  - **File Storage**: Uses `@vercel/blob` for storing uploaded files, likely via `/app/(chat)/api/files/upload/route.ts`.
  - **Editors**: Integrates CodeMirror (`codemirror`, `@codemirror/*`) for code editing/display and ProseMirror (`prosemirror-*`) likely for rich text editing capabilities.

- **Codebase Conventions**:

  - **Language**: TypeScript is used throughout the project (`tsconfig.json`).
  - **Formatting/Linting**: Enforced by BiomeJS (`biome.jsonc`) and ESLint (`.eslintrc.json`), configured in `package.json` scripts (`lint`, `format`). Includes Tailwind CSS plugin for class sorting/linting.
  - **Component Structure**: Reusable UI components are in `components/`. shadcn/ui components are in `components/ui/`. Feature-specific components might reside closer to their routes (e.g., within `app/(chat)/`). Artifact components are in `artifacts/`.
  - **Styling**: Utility-first approach with Tailwind CSS. Custom global styles in `app/globals.css`.
  - **API Routes/Actions**: API logic is placed in `app/**/api/` directories or `actions.ts` files co-located with features.
  - **Database Logic**: Schema, queries, and migration logic are centralized in `lib/db/`.
  - **AI Logic**: AI-related configurations, prompts, and tool definitions are centralized in `lib/ai/`.
  - **Naming**: Generally uses kebab-case for files/directories and PascalCase for React components.
  - **Environment Variables**: Managed via `.env` file (using `.env.example` as template) and Vercel environment variables.

- **Setup and Installation**:

  - Clone the repository.
  - Install Vercel CLI: `npm i -g vercel`
  - Link to Vercel: `vercel link`
  - Pull environment variables: `vercel env pull` (or manually create `.env` from `.env.example` and fill values). Requires `AUTH_SECRET` and potentially API keys for AI providers, database connection string (Neon), and Vercel Blob store.
  - Install dependencies: `pnpm install`
  - Run database migrations: `pnpm run db:migrate` (or handled by `build` script)
  - Start development server: `pnpm dev`
  - Access at: `http://localhost:3000`

- **Key Functions/Classes/Components**:

  - `app/(chat)/page.tsx`: Main entry point for the chat interface.
  - `app/(chat)/api/chat/route.ts`: Backend API route for handling chat requests and streaming AI responses.
  - `components/chat.tsx`: Core component managing the chat UI and interactions.
  - `components/messages.tsx`: Renders the list of chat messages.
  - `components/message.tsx`: Renders an individual chat message, potentially including artifacts.
  - `components/multimodal-input.tsx`: Handles user input (text, potentially files).
  - `hooks/use-messages.tsx`: Custom hook likely managing message state.
  - `lib/ai/models.ts`: Defines and configures available AI models.
  - `lib/ai/tools/*`: Defines tools the AI can use (e.g., `create-document`, `get-weather`).
  - `lib/db/schema.ts`: Defines the database table structure using Drizzle ORM.
  - `lib/db/queries.ts`: Contains functions for database operations.
  - `app/(auth)/auth.ts`: Core configuration for Auth.js.
  - `app/(auth)/login/page.tsx`: Login page component.

- **Testing**:

  - **Framework**: Playwright is used for End-to-End (E2E) testing (`@playwright/test`).
  - **Location**: Tests are located in the `tests/` directory, specifically `tests/e2e/`. Page objects are in `tests/pages/`.
  - **Execution**: Run tests using `pnpm test`. Requires `PLAYWRIGHT=True` environment variable.
  - **Configuration**: `playwright.config.ts`.

- **Known Issues/Bugs**:
  - `To be determined`

---
