<script setup>
  import { ref } from 'vue';
  import { useFormStore } from '../stores/formStore';
  import axios from 'axios';

  const store = useFormStore();
  const prompt = ref('');
  const fileInput = ref(null);
  const attachedImage = ref(null); // Stores the Base64 string

  // 1. Convert Image to Base64
  function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      attachedImage.value = e.target.result; // This is the data:image/png;base64,... string
    };
    reader.readAsDataURL(file);
  }

  // 2. Send to OpenAI with Vision support
  async function sendToAI() {
    if (!prompt.value && !attachedImage.value) return;

    store.isAiLoading = true;

    // Prepare messages array
    const userContent = [{ type: 'text', text: prompt.value || 'Convert this image into a Form.io JSON schema.' }];

    if (attachedImage.value) {
      userContent.push({
        type: 'image_url',
        image_url: { url: attachedImage.value },
      });
    }

    try {
      const res = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4o',
          messages: [
            {
              role: 'system',
              content:
                'You are a Form.io expert. Return ONLY valid JSON. Ignore logos or decorative elements; focus only on inputs, labels, and buttons.',
            },
            { role: 'user', content: userContent },
          ],
          response_format: { type: 'json_object' },
        },
        {
          headers: { Authorization: `Bearer ${import.meta.env.VITE_OPENAI_KEY}` },
        },
      );

      store.updateSchema(JSON.parse(res.data.choices[0].message.content));

      // Reset state
      prompt.value = '';
      attachedImage.value = null;
    } catch (err) {
      console.error('Vision Error:', err);
    } finally {
      store.isAiLoading = false;
    }
  }
</script>

<template>
  <div class="chat-widget">
    <div class="chat-header">AI Form Assistant</div>

    <div class="chat-history">
      <p v-if="attachedImage" class="preview-text">📸 Image attached</p>
      <p v-else>Describe your form or upload a screenshot.</p>
    </div>

    <div class="chat-input-area">
      <input type="file" ref="fileInput" style="display: none" accept="image/*" @change="handleImageUpload" />

      <button class="btn-icon" @click="fileInput.click()">📎</button>

      <input v-model="prompt" placeholder="Type a command..." @keyup.enter="sendToAI" />

      <button class="btn-send" :disabled="store.isAiLoading" @click="sendToAI">
        {{ store.isAiLoading ? '...' : 'Send' }}
      </button>
    </div>
  </div>
</template>

<style lang="css" scoped>
  .chat-widget {
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 350px;
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

  .chat-input-area {
    padding: 10px;
    border-top: 1px solid #eee;
    display: flex;
    gap: 8px;
  }

  .chat-input-area input {
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
