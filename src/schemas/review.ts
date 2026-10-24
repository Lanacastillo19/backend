import { z } from "zod";

// What a client is allowed to send to POST /api/ai.
// Checked BEFORE anything is sent to Gemini, so a bad request costs no quota.
export const aiRequestSchema = z.object({
  prompt: z
    .string()
    .trim()
    .min(20, "Describe your task in at least 20 characters.")
    .max(2000, "Keep the description under 2000 characters."),
});

// What Gemini has to send BACK: a plan for one task.
// .describe() is not a comment: the text travels to Gemini inside the
// JSON Schema and tells the model what each field is for.
export const reviewSchema = z.object({
  summary: z
    .string()
    .describe("One sentence restating the task the user needs to do."),
  steps: z
    .array(z.string())
    .min(1)
    .max(4)
    .describe("One to four concrete steps, in order, to finish the task."),
  category: z
    .enum(["work", "personal", "urgent"])
    .describe(
      "work for school or job tasks, personal for everything else, urgent if it is due within two days."
    ),
  priority: z
    .number()
    .int()
    .min(1)
    .max(5)
    .describe("Whole number from 1 (can wait) to 5 (do it first)."),
});

// The TypeScript type, read straight out of the schema above.
export type Review = z.infer<typeof reviewSchema>;

// The same schema as plain JSON Schema: this is what Gemini is sent.
export const reviewJsonSchema = z.toJSONSchema(reviewSchema);