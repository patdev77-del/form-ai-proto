<script setup lang="ts">
  import { ref, computed } from 'vue';
  import { useFormStore } from '../stores/formStore';
  import { useDraggable, useFileDialog, useBase64, useFetch } from '@vueuse/core';
  import { useAI } from '../composables/useAI';

  const store = useFormStore();
  const prompt = ref('');
  
  const { provider, ollamaModel, generateSchema } = useAI();

  // 1. Convert Image to Base64 via VueUse
  const { files, open, reset: resetFiles } = useFileDialog({
    accept: 'image/*',
    multiple: false,
  });

  // Reactive computed for the first selected file
  const selectedFile = computed(() => files.value?.[0]);
  const { base64: attachedImage } = useBase64(selectedFile);

  // 2. Send to AI
  async function sendToAI() {
    if (!prompt.value && !attachedImage.value) return;
    await generateSchema(prompt.value, attachedImage.value);
    prompt.value = '';
    resetFiles();
  }

  // --- Dragging Logic with VueUse ---
  const chatWidget = ref<HTMLElement | null>(null);
  const chatHeader = ref<HTMLElement | null>(null);

  const initialX = typeof window !== 'undefined' ? window.innerWidth - 570 : 0;
  const initialY = typeof window !== 'undefined' ? window.innerHeight - 460 : 0;

  const { style, isDragging } = useDraggable(chatWidget, {
    handle: chatHeader,
    initialValue: { x: initialX, y: initialY }
  });
</script>

<template>
  <div 
    ref="chatWidget"
    class="chat-widget"
    :style="style"
  >
    <div 
      ref="chatHeader"
      class="chat-header"
      :style="{ cursor: isDragging ? 'grabbing' : 'grab' }"
    >
      AI Form Assistant
    </div>

    <div class="chat-history">
      <p v-if="attachedImage" class="preview-text">📸 Image attached</p>
      <p v-else>Describe your form or upload a screenshot.</p>
    </div>

    <div class="model-settings">
      <select v-model="provider" class="provider-select">
        <option value="openai">OpenAI (gpt-4o)</option>
        <option value="ollama">Ollama (Local)</option>
      </select>
      <input 
        v-if="provider === 'ollama'" 
        v-model="ollamaModel" 
        placeholder="Model (e.g. llava)" 
        class="model-input"
      />
    </div>

    <div class="chat-input-area">
      <button class="btn-icon" @click="open()">📎</button>

      <textarea v-model="prompt" placeholder="Type a command..." @keyup.enter="sendToAI" />

      <button class="btn-send" :disabled="store.isAiLoading" @click="sendToAI">
        {{ store.isAiLoading ? '...' : 'Send' }}
      </button>
    </div>
  </div>
</template>

<style lang="css" scoped>
  .chat-widget {
    position: fixed;
    width: 550px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border: 1px solid #e0e0e0;
    z-index: 1000;
  }

  .chat-header {
    background: #007bff;
    color: white;
    padding: 12px 15px;
    font-weight: bold;
    display: flex;
    justify-content: space-between;
  }

  .chat-history {
    height: 300px;
    padding: 15px;
    overflow-y: auto;
    font-size: 14px;
    background: #fdfdfd;
  }

  .model-settings {
    padding: 8px 15px;
    background: #f8f9fa;
    border-top: 1px solid #eee;
    display: flex;
    gap: 10px;
  }

  .provider-select, .model-input {
    padding: 6px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 13px;
    flex: 1;
    outline: none;
  }

  .chat-input-area {
    padding: 10px;
    border-top: 1px solid #eee;
    display: flex;
    gap: 8px;
  }

  .chat-input-area textarea {
    flex: 1;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    outline: none;
  }

  .btn-send {
    background: #007bff;
    color: white;
    border: none;
    padding: 8px 15px;
    border-radius: 4px;
    cursor: pointer;
    transition: opacity 0.2s;
  }

  .btn-send:disabled {
    background: #ccc;
  }

  .btn-icon {
    background: #f0f0f0;
    border: 1px solid #ddd;
    border-radius: 4px;
    cursor: pointer;
    padding: 5px 10px;
    font-size: 1.2rem;
  }

  .preview-text {
    background: #e7f3ff;
    color: #007bff;
    padding: 5px 10px;
    border-radius: 4px;
    font-size: 12px;
    margin-bottom: 10px;
  }

  /* Ensure the chat history area shows the loading state clearly */
  .chat-history {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
  }
</style>
