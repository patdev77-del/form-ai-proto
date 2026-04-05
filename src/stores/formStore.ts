import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";
import { z } from "zod";

export const FormComponentSchema = z.looseObject({
  type: z.string(),
  key: z.string(),
  label: z.string(),
  placeholder: z.string().optional(),
  input: z.boolean().default(true),
  action: z.string().optional(),
  validate: z.object({
    required: z.boolean().optional(),
  }).catchall(z.any()).optional(),
});

export const FormSchemaSchema = z.looseObject({
  components: z.array(FormComponentSchema),
});

export type FormComponent = z.infer<typeof FormComponentSchema>;
export type FormSchema = z.infer<typeof FormSchemaSchema>;

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
        { type: "button", key: "submit", label: "Submit", input: false, action: "submit" },
      ],
    }).value, // useStorage from @vueuse/core returns a Ref-like object for the value
    isAiLoading: false,
  }),
  actions: {
    updateSchema(newSchema: any) {
      try {
        const parsedObject = typeof newSchema === "string" ? JSON.parse(newSchema) : newSchema;
        
        // Zod Runtime Validation
        const validatedSchema = FormSchemaSchema.parse(parsedObject);
        this.schema = validatedSchema;
      } catch (e) {
        if (e instanceof z.ZodError) {
          console.error("Zod Schema Validation Error:", e.issues);
        } else {
          console.error("Invalid JSON update rejected", e);
        }
      }
    },
  },
});
