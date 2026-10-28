import { GoogleGenAI, type Content } from "@google/genai";
import { MODEL, SYSTEM_PROMPT, EXAMPLES, wrap } from "./prompt";
import {
  reviewSchema,
  reviewJsonSchema,
  type Review,
} from "../schemas/review";

// The client is made on the first call, not when the file is imported,
// so a missing key is a clear message instead of a crash at startup.
let client: GoogleGenAI | null = null;

function getClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is missing. Add it to .env, and to Vercel."
    );
  }
  if (client === null) {
    client = new GoogleGenAI({ apiKey });
  }
  return client;
}

// Two examples become two finished exchanges (user, then model),
// and the real description is the last turn.
function buildContents(description: string): Content[] {
  const shots: Content[] = EXAMPLES.flatMap((example) => [
    { role: "user", parts: [{ text: wrap(example.description) }] },
    {
      role: "model",
      parts: [{ text: JSON.stringify(example.review) }],
    },
  ]);
  return [
    ...shots,
    { role: "user", parts: [{ text: wrap(description) }] },
  ];
}

// Thrown when Gemini answered but the answer is unusable.
// The route turns it into a 502.
export class AiReplyError extends Error {}

export async function reviewProject(description: string): Promise<Review> {
  const response = await getClient().models.generateContent({
    model: MODEL,
    contents: buildContents(description),
    config: {
      systemInstruction: SYSTEM_PROMPT,
      responseMimeType: "application/json",
      responseJsonSchema: reviewJsonSchema,
      // No temperature on purpose: Google recommends the default for Gemini 3.
    },
  });

  // Check 1: is there any text? (A blocked reply has none.)
  const text = response.text;
  if (!text) {
    throw new AiReplyError("Gemini sent back no text");
  }

  // Check 2: is it JSON?
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    throw new AiReplyError("Gemini's reply was not JSON");
  }

  // Check 3: does it match our schema?
  const result = reviewSchema.safeParse(data);
  if (!result.success) {
    throw new AiReplyError("Gemini's reply did not match the schema");
  }

  return result.data;
}
