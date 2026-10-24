import { GoogleGenAI, type Content } from "@google/genai";
import { MODEL, SYSTEM_PROMPT, EXAMPLES, wrap } from "./prompt";
import {
  reviewSchema,
  reviewJsonSchema,
  type Review,
} from "../schemas/review";

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

export class AiReplyError extends Error {}

export async function reviewProject(
  description: string
): Promise<Review> {
  try {
    // Ensure MODEL falls back to a valid model string if undefined
    const selectedModel = MODEL || "gemini-1.5-flash";

    const response = await getClient().models.generateContent({
      model: selectedModel,
      contents: buildContents(description),
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: "application/json",
        responseJsonSchema: reviewJsonSchema,
      },
    });

    const text = response.text;
    if (!text) {
      throw new AiReplyError("Gemini sent back no text");
    }

    let data: unknown;
    try {
      data = JSON.parse(text);
    } catch {
      throw new AiReplyError("Gemini's reply was not JSON");
    }

    const result = reviewSchema.safeParse(data);
    if (!result.success) {
      throw new AiReplyError("Gemini's reply did not match the schema");
    }

    return result.data;
  } catch (error: any) {
    // Log complete error to terminal for debugging
    console.error("Gemini API Invocation Error:", error);
    if (error instanceof AiReplyError) {
      throw error;
    }
    throw new AiReplyError(error.message || "Failed to communicate with Gemini API");
  }
}