import { describe, it, expect, vi } from "vitest";
import mongoose from "mongoose";

// Set environment variables
process.env.MONGODB_URI = "mongodb://localhost:27017/test-db";
process.env.JWT_SECRET = "test-secret";
process.env.GEMINI_API_KEY = "dummy-gemini-key";

// Mock database connection
vi.mock("../src/config/db", () => ({
  connectDB: async () => {},
}));

vi.spyOn(mongoose, "connect").mockResolvedValue(mongoose);

// Mock external fetch so it doesn't make real Gemini API calls
global.fetch = vi.fn().mockResolvedValue({
  ok: true,
  json: async () => ({
    candidates: [
      {
        content: {
          parts: [{ text: "Mocked AI response for testing." }],
        },
      },
    ],
  }),
});

import request from "supertest";
import expressApp from "../src/app";

const app = (expressApp as any).app || expressApp;

describe("POST /api/ai", () => {
  it("returns 200 and AI response when prompt is provided", async () => {
    const res = await request(app)
      .post("/api/ai")
      .send({ prompt: "A course submission tracker in React." });

    expect(res.status).toBe(200);
  });

  it("handles incoming POST request to /api/ai successfully", async () => {
    const res = await request(app)
      .post("/api/ai")
      .send({ prompt: "Generate task suggestions for student projects." });

    expect(res.status).toBe(200);
  });
});