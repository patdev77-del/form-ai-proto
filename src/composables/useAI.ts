import { ref } from 'vue';
import { useFormStore } from '../stores/formStore';

export function useAI() {
  const store = useFormStore();
  const provider = ref('openai');
  const ollamaModel = ref('llava');
  const isGenerating = ref(false);

  async function generateSchema(promptText: string, imageBase64?: string | null) {
    if (!promptText && !imageBase64) return;

    store.isAiLoading = true;
    isGenerating.value = true;

    try {
      const userContent: any[] = [{ type: 'text', text: promptText || 'Convert this image into a Form.io JSON schema.' }];

      if (imageBase64) {
        userContent.push({
          type: 'image',
          image: new URL(imageBase64),
        });
      }

      const { createOpenAI } = await import('@ai-sdk/openai');
      const { generateText } = await import('ai');

      let aiModel;
      
      if (provider.value === 'openai') {
        const openai = createOpenAI({ apiKey: import.meta.env.VITE_OPENAI_KEY });
        aiModel = openai('gpt-4o');
      } else {
        const ollamaBase = createOpenAI({
          baseURL: 'http://localhost:11434/v1',
          apiKey: 'ollama' // dummy key for local API
        });
        aiModel = ollamaBase(ollamaModel.value || 'llava');
      }

      const { text } = await generateText({
        model: aiModel,
        system: 'You are a Form.io expert. Return ONLY valid JSON block. Ignore logos or decorative elements; focus only on inputs, labels, and buttons.',
        messages: [{ role: 'user', content: userContent }],
      });

      if (text) {
        const cleanedText = text.replace(/```json/gi, '').replace(/```/g, '').trim();
        try {
          store.updateSchema(JSON.parse(cleanedText));
        } catch (e) {
          console.error('Failed to parse text as JSON', e);
        }
      }
    } catch (error: any) {
      console.error('AI SDK Error:', error);
    } finally {
      store.isAiLoading = false;
      isGenerating.value = false;
    }
  }

  return {
    provider,
    ollamaModel,
    isGenerating,
    generateSchema,
  };
}
