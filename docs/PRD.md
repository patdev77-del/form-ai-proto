This **Product Requirements Document (PRD)** outlines the development of a Vue-based AI Form Builder prototype.

---

# PRD: AI-Powered Form Builder Prototype

## 1. Executive Summary

**Project Goal:** Create a rapid prototyping tool that allows users to generate, edit, and preview **Form.io** schemas using a visual builder, direct JSON manipulation, and an AI-driven chat interface (OpenAI).

## 2. Target Personas

- **Developers:** Who need to quickly scaffold complex JSON schemas.
- **Business Analysts:** Who want to convert a screenshot of a paper form into a digital version using AI.
- **Support Agents:** Who need a "micro-support" chat to troubleshoot form logic.

## 3. Functional Requirements

### 3.1 Core Form Engine

| Feature            | Description                                                                 |
| :----------------- | :-------------------------------------------------------------------------- |
| **Visual Builder** | Integration of `@formio/vue` drag-and-drop interface.                       |
| **JSON Editor**    | Real-time editable JSON view (Monaco/CodeMirror) synced with the builder.   |
| **Form Renderer**  | A "Preview Mode" to test the generated form's functionality and validation. |

### 3.2 AI Assistant (OpenAI Integration)

| Feature               | Description                                                                              |
| :-------------------- | :--------------------------------------------------------------------------------------- |
| **Text-to-Form**      | User types "Create a contact form with email and phone" $\rightarrow$ AI generates JSON. |
| **Voice-to-Form**     | Integration of Web Speech API to dictate form requirements.                              |
| **Vision/Screenshot** | Users upload an image of a form; AI parses fields and adds them to the schema.           |
| **Drafting Mode**     | AI suggests improvements (e.g., "Add validation to this email field").                   |

### 3.3 UI/UX & Support

- **Split-Screen Layout:** Simultaneous view of Builder, JSON, and Chat.
- **Micro-Support:** A persistent chat bubble providing "How-to" help for Form.io components.
- **State Persistence:** LocalStorage or Pinia store to prevent data loss on refresh.

## 4. Technical Requirements

- **Frontend:** Vue 3 (Vite), Pinia for state management.
- **Form Logic:** `formiojs` and `@formio/vue`.
- **LLM API:** OpenAI API (GPT-4o for Vision and JSON schema reliability).
- **Real-time Sync:** A debounced watcher to sync the JSON editor and the Builder component.

## 5. User Flow

1.  **Input:** User uploads a screenshot or types a prompt in the Chat window.
2.  **Processing:** The prompt is sent to OpenAI with a System Prompt defining the Form.io schema structure.
3.  **Update:** The returned JSON is validated and injected into the Pinia store.
4.  **Reflection:** The Visual Builder and JSON Editor update instantly to reflect the new state.
5.  **Refinement:** User manually tweaks the UI or asks the AI to "Make the 'Name' field required."

## 6. Success Metrics

- **Accuracy:** AI generates valid, renderable Form.io JSON in >90% of requests.
- **Latency:** AI response and UI sync completed under 3 seconds.
- **Usability:** Seamless bi-directional sync (Manual Edit $\leftrightarrow$ AI Edit).

---
