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
- `src/stores/`: Pinia state management (e.g., `formStore.js`)
- `src/App.vue`: Main application component
- `src/main.js`: Setup and mount file
- `public/`: Static assets

## Scripts & Commands
- `npm run dev`: Start the development server (runs `vite`)
- `npm run build`: Build for production (runs `vite build`)
- `npm run preview`: Locally preview the production build (runs `vite preview`)
