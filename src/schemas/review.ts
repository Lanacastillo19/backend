<<<<<<< HEAD
import { z } from "zod";

// What a client is allowed to send to POST /api/ai.
// Checked BEFORE anything is sent to Gemini, so a bad request costs no quota.
=======
// ===== SESSION 11 / GT5: a NEW file ==================================
// ===== no Session 10 version -- nothing to compare it to ==============

import { z } from "zod";

// What a client is allowed to send to POST /api/ai. Checked before
// anything is sent to Gemini, because every request that reaches
// Gemini is counted against your free quota -- a request that was
// never going to work should cost nothing.
>>>>>>> 2d71b80 (Add submission router and Mongoose schema)
export const aiRequestSchema = z.object({
  prompt: z
    .string()
    .trim()
<<<<<<< HEAD
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
=======
    .min(20, "Describe your project in at least 20 characters.")
    .max(2000, "Keep the description under 2000 characters."),
});

// What Gemini has to send BACK, written for this app: the ITELECT4
// submission tracker, where a student describes the project they are
// about to submit. This one schema is used three ways:
//   1. z.infer below turns it into the Review type for TypeScript.
//   2. z.toJSONSchema at the bottom turns it into the JSON Schema
//      that is sent to Gemini with every request.
//   3. reviewSchema.safeParse in src/ai/gemini.ts checks the reply.
// .describe() is not a comment: the text travels to Gemini inside
// the JSON Schema and tells the model what each field is for.
export const reviewSchema = z.object({
  summary: z
    .string()
    .describe("One plain sentence restating what the student built."),
  strengths: z
    .array(z.string())
    .min(1)
    .max(3)
    .describe("One to three things the description shows they did well."),
  improvements: z
    .array(z.string())
    .min(1)
    .max(3)
    .describe(
      "One to three concrete actions to take before submitting, each one doable today.",
    ),
  readiness: z
    .enum(["ready", "almost", "not-yet"])
    .describe(
      'How close the project is to submission: "ready" if nothing important is missing, "almost" if one or two things are, "not-yet" if the description is too thin to judge.',
    ),
});

export type Review = z.infer<typeof reviewSchema>;

// Computed once, when this file is first imported -- not per request.
export const reviewJsonSchema = z.toJSONSchema(reviewSchema);
>>>>>>> 2d71b80 (Add submission router and Mongoose schema)
