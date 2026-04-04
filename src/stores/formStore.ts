import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";

export interface FormComponent {
  type: string;
  key: string;
  label: string;
  input?: boolean;
  action?: string;
  [key: string]: any;
}

export interface FormSchema {
  components: FormComponent[];
  [key: string]: any;
}

export interface FormState {
  schema: FormSchema;
  isAiLoading: boolean;
}

export const useFormStore = defineStore("form", {
  state: (): FormState => ({
    // Initial basic schema
    schema: useStorage<FormSchema>("form-schema", {
      components: [
        { type: "textfield", key: "firstName", label: "First Name", input: true },
        { type: "button", key: "submit", label: "Submit", action: "submit" },
      ],
    }).value, // useStorage from @vueuse/core returns a Ref-like object for the value
    isAiLoading: false,
  }),
  actions: {
    updateSchema(newSchema: FormSchema | string) {
      try {
        // Ensure it's a valid object before updating
        const parsedSchema =
          typeof newSchema === "string" ? JSON.parse(newSchema) : newSchema;
        this.schema = parsedSchema;
      } catch (e) {
        console.error("Invalid JSON update rejected", e);
      }
    },
  },
});
