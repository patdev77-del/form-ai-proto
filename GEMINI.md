# Project Guidelines

This file is intended for high-level prompts, development focus items, and architectural notes for Gemini AI.

## Agent Rules
* For specific coding guidelines, please refer to: @.agents/rules/vue3-composition.md

## Current Focus
* Vue 3 Composition API
* TypeScript best practices
* Tailwind CSS / Standard CSS conventions

## Folder Structure
- `src/components/`: Vue components (e.g., `AIChatWindow.vue`)
- `src/stores/`: Pinia state management (e.g., `formStore.ts`)
- `src/App.vue`: Main application component
- `src/main.ts`: Setup and mount file
- `public/`: Static assets

## Scripts & Commands
- `npm run dev`: Start the development server (runs `vite`)
- `npm run build`: Build for production (runs `vite build`)
- `npm run preview`: Locally preview the production build (runs `vite preview`)
- `npm run lint`: Lint the codebase using ESLint
- `npm run format`: Format the codebase using Prettier
