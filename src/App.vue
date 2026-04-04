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
        <div class="editor-container">
          <JsonEditor
            v-model:json="localSchema"
            :mainMenuBar="false"
            :navigationBar="false"
            :statusBar="false"
            class="jse-theme-dark"
            @update:json="onJsonChange"
          />
        </div>
      </section>

      <AIChatWindow />
    </main>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue';
  import { useFormStore, type FormSchema } from './stores/formStore';
  import { FormBuilder, Form } from '@formio/vue';
  import AIChatWindow from './components/AIChatWindow.vue';
  import JsonEditor from 'vue3-ts-jsoneditor';
  import { useDebounceFn } from '@vueuse/core';

  const store = useFormStore();
  const viewMode = ref<'builder' | 'preview'>('builder');

  // Create a clean local copy for the editor to avoid DataCloneError
  const localSchema = ref<FormSchema>(JSON.parse(JSON.stringify(store.schema)));

  // Sync Store -> Editor (when AI or Visual Builder updates the store)
  watch(
    () => store.schema,
    (newVal) => {
      // Create a deep copy to strip any non-serializable properties added by Formio
      const cleanSchema = JSON.parse(JSON.stringify(newVal));
      
      // Only update if it's actually different to avoid circular loops
      if (JSON.stringify(cleanSchema) !== JSON.stringify(localSchema.value)) {
        localSchema.value = cleanSchema;
      }
    },
    { deep: true },
  );

  // Sync Editor -> Store (when user edits JSON manually)
  const onJsonChange = useDebounceFn((newSchema: any) => {
    if (newSchema && typeof newSchema === 'object') {
      // Stripping potential proxies or non-serializable junk from the editor too
      store.updateSchema(JSON.parse(JSON.stringify(newSchema)));
    }
  }, 500);

  function onBuilderChange(schema: FormSchema) {
    // Update store from visual builder
    store.updateSchema(schema);
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

/* The actual Editor Container */
.editor-container {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

:deep(.jse-main) {
  border: none;
}

:deep(.jse-contents) {
  border: none;
}

/* Subtle glow when the AI is updating the JSON */
.json-pane.is-updating {
  box-shadow: inset 0 0 10px rgba(0, 123, 255, 0.3);
}
</style>
