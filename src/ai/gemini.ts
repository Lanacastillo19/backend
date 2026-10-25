<<<<<<< HEAD
import { GoogleGenAI, type Content } from "@google/genai";
import { MODEL, SYSTEM_PROMPT, EXAMPLES, wrap } from "./prompt";
=======
// ===== SESSION 11 / GT5: a NEW file ==================================
// ===== no Session 10 version -- nothing to compare it to ==============

import { GoogleGenAI, type Content } from "@google/genai";
import { MODEL, SYSTEM_PROMPT, EXAMPLES, wrap } from "./prompt.js";
>>>>>>> 2d71b80 (Add submission router and Mongoose schema)
import {
  reviewSchema,
  reviewJsonSchema,
  type Review,
<<<<<<< HEAD
} from "../schemas/review";

// The client is made on the first call, not when the file is imported,
// so a missing key is a clear message instead of a crash at startup.
let client: GoogleGenAI | null = null;

function getClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is missing. Add it to .env, and to Vercel."
=======
} from "../schemas/review.js";

// The same shape as connectDB in src/config/db.ts: nothing happens
// when this file is imported. The client is made on the first call,
// so a missing key is a sentence on the first AI request -- not a
// crash for every route in the app.
let client: GoogleGenAI | null = null;

function getClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is missing. Add it to .env, and to Vercel.",
>>>>>>> 2d71b80 (Add submission router and Mongoose schema)
    );
  }
  if (client === null) {
    client = new GoogleGenAI({ apiKey });
  }
  return client;
}

<<<<<<< HEAD
// Two examples become two finished exchanges (user, then model),
// and the real description is the last turn.
function buildContents(description: string): Content[] {
  const shots: Content[] = EXAMPLES.flatMap((example) => [
    { role: "user", parts: [{ text: wrap(example.description) }] },
    {
      role: "model",
=======
// The two examples become two finished exchanges -- a user turn, then
// the model's reply -- and the real description is the last turn.
// To the model it looks like a conversation it has already had twice.
function buildContents(description: string): Content[] {
  const shots: Content[] = EXAMPLES.flatMap((example) => [
    { role: "user" as const, parts: [{ text: wrap(example.description) }] },
    {
      role: "model" as const,
>>>>>>> 2d71b80 (Add submission router and Mongoose schema)
      parts: [{ text: JSON.stringify(example.review) }],
    },
  ]);
  return [
    ...shots,
    { role: "user", parts: [{ text: wrap(description) }] },
  ];
}

<<<<<<< HEAD
// Thrown when Gemini answered but the answer is unusable.
// The route turns it into a 502.
export class AiReplyError extends Error {}

export async function reviewProject(description: string): Promise<Review> {
=======
// Thrown when Gemini answered but the answer is unusable. The route
// turns it into a 502; anything else stays a 500.
export class AiReplyError extends Error {}

export async function reviewProject(
  description: string,
): Promise<Review> {
>>>>>>> 2d71b80 (Add submission router and Mongoose schema)
  const response = await getClient().models.generateContent({
    model: MODEL,
    contents: buildContents(description),
    config: {
      systemInstruction: SYSTEM_PROMPT,
<<<<<<< HEAD
      responseMimeType: "application/json",
      responseJsonSchema: reviewJsonSchema,
      // No temperature on purpose: Google recommends the default for Gemini 3.
    },
  });

  // Check 1: is there any text? (A blocked reply has none.)
=======
      // JSON, in exactly this shape. Without these two lines the
      // reply is prose, and prose cannot be put on a screen field
      // by field.
      responseMimeType: "application/json",
      responseJsonSchema: reviewJsonSchema,
      // No temperature here, on purpose. Google's guide for the
      // Gemini 3 models says to leave it at its default of 1.0.
    },
  });

  // ---- The three checks ------------------------------------------
  // 1. Is there any text at all? A reply blocked by Gemini's safety
  //    filters comes back with none.
>>>>>>> 2d71b80 (Add submission router and Mongoose schema)
  const text = response.text;
  if (!text) {
    throw new AiReplyError("Gemini sent back no text");
  }

<<<<<<< HEAD
  // Check 2: is it JSON?
=======
  // 2. Is it JSON? Asking for JSON makes this rare, not impossible.
>>>>>>> 2d71b80 (Add submission router and Mongoose schema)
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    throw new AiReplyError("Gemini's reply was not JSON");
  }

<<<<<<< HEAD
  // Check 3: does it match our schema?
=======
  // 3. The schema was a request, and this is the check. Nothing that
  //    arrived over the network is a Review until something has
  //    checked it is one.
>>>>>>> 2d71b80 (Add submission router and Mongoose schema)
  const result = reviewSchema.safeParse(data);
  if (!result.success) {
    throw new AiReplyError("Gemini's reply did not match the schema");
  }
<<<<<<< HEAD

  return result.data;
}
=======
  return result.data;
}
>>>>>>> 2d71b80 (Add submission router and Mongoose schema)
