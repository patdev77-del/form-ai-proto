<template>
  <div class="app-container">
    <header class="toolbar">
      <h1>Vue Form.io AI Architect</h1>
      <button @click="viewMode = 'builder'">Builder</button>
      <button @click="viewMode = 'preview'">Preview</button>
    </header>

    <main class="main-content">
      <section class="pane visual-pane">
        <FormBuilder v-if="viewMode === 'builder'" :form="store.schema" @change="onBuilderChange" />
        <Form v-else :form="store.schema" />
      </section>

      <section class="pane json-pane">
        <h3>JSON Schema</h3>
        <textarea class="json-editor-textarea" v-model="jsonString" @input="onJsonInput" spellcheck="false"></textarea>
      </section>

      <AIChatWindow />
    </main>
  </div>
</template>

<script setup>
  import { ref, computed, watch } from 'vue';
  import { useFormStore } from './stores/formStore';
  import { FormBuilder, Form } from '@formio/vue';
  import AIChatWindow from './components/AIChatWindow.vue';

  const store = useFormStore();
  const viewMode = ref('builder');

  // Local sync for the textarea to avoid cursor jumping
  const jsonString = ref(JSON.stringify(store.schema, null, 2));

  // Sync store -> textarea
  watch(
    () => store.schema,
    (newVal) => {
      jsonString.value = JSON.stringify(newVal, null, 2);
    },
    { deep: true },
  );

  function onBuilderChange(schema) {
    // Update store from visual builder
    store.updateSchema(schema);
  }

  function onJsonInput() {
    // Update store from raw text input
    store.updateSchema(jsonString.value);
  }
</script>

<style scoped>
  /* Layout Containers */
  .app-container {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background-color: #f8f9fa;
    font-family: 'Inter', sans-serif;
  }

  .toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    height: 60px;
    background: #2c3e50;
    color: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .main-content {
    display: grid;
    grid-template-columns: 1fr 450px; /* Adjust 450px to your preferred JSON sidebar width */
    flex: 1;
    overflow: hidden; /* Prevents whole page from scrolling */
  }

  /* Pane Styling */
  .pane {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow-y: auto;
    border-right: 1px solid #dee2e6;
    background: white;
  }

  .visual-pane {
    padding: 25px;
  }

  /* JSON Pane Container */
.json-pane {
  background-color: #1e1e1e; /* VS Code Dark background */
  display: flex;
  flex-direction: column;
  border-left: 2px solid #333;
}

.json-pane h3 {
  background-color: #252526;
  color: #858585;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 1px;
  padding: 10px 15px;
  margin: 0;
  text-transform: uppercase;
  border-bottom: 1px solid #333;
}

/* The actual Textarea */
.json-editor-textarea {
  flex: 1;
  background: transparent;
  color: #d4d4d4; /* Off-white text */
  border: none;
  padding: 20px;
  font-family: 'Fira Code', 'Consolas', 'Monaco', monospace;
  font-size: 12px;
  line-height: 1.6;
  resize: none;
  outline: none;
  tab-size: 2;
  transition: color 0.2s ease;
}

/* Subtle glow when the AI is updating the JSON */
.json-pane.is-updating {
  box-shadow: inset 0 0 10px rgba(0, 123, 255, 0.3);
}

/* Selection color */
.json-editor-textarea::selection {
  background: #264f78;
}
</style>
