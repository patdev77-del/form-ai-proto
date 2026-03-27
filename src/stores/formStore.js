import { defineStore } from 'pinia';

export const useFormStore = defineStore('form', {
  state: () => ({
    // Initial basic schema
    schema: {
      components: [
        { type: 'textfield', key: 'firstName', label: 'First Name', input: true },
        { type: 'button', key: 'submit', label: 'Submit', action: 'submit' },
      ],
    },
    isAiLoading: false,
  }),
  actions: {
    updateSchema(newSchema) {
      try {
        // Ensure it's a valid object before updating
        this.schema = typeof newSchema === 'string' ? JSON.parse(newSchema) : newSchema;
      } catch (e) {
        console.error('Invalid JSON update rejected');
      }
    },
  },
});
