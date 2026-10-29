import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import jwt from "jsonwebtoken";

// Runs before the imports below: a test secret, and no database address,
// so nothing in this file can reach Atlas.
vi.hoisted(() => {
  process.env.JWT_SECRET ||= "test-secret";
  delete process.env.MONGODB_URI;
});

// connectDB replaced, as the task asks.
vi.mock("../src/config/db", () => ({
  connectDB: vi.fn().mockResolvedValue(undefined),
}));

// The Item model replaced, so the valid-token test needs no database.
vi.mock("../src/models/Item", () => ({
  Item: { find: vi.fn() },
}));

import app from "../src/app";
import { Item } from "../src/models/Item";

function tokenFor(userId: string) {
  return jwt.sign({ userId }, process.env.JWT_SECRET as string, {
    expiresIn: "1h",
  });
}

describe("GET /api/items (behind requireAuth)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("answers 401 when there is no token", async () => {
    const res = await request(app).get("/api/items");

    expect(res.status).toBe(401);
    expect(Item.find).not.toHaveBeenCalled();
  });

  it("answers 401 when the token is not a real one", async () => {
    const res = await request(app)
      .get("/api/items")
      .set("Authorization", "Bearer not-a-real-token");

    expect(res.status).toBe(401);
  });

  it("lets a valid token past requireAuth and asks for that user's items", async () => {
    vi.mocked(Item.find).mockReturnValue({
      sort: vi.fn().mockResolvedValue([{ title: "Sample item" }]),
    } as never);

    const res = await request(app)
      .get("/api/items")
      .set("Authorization", `Bearer ${tokenFor("user-123")}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ title: "Sample item" }]);
    expect(Item.find).toHaveBeenCalledWith({ userId: "user-123" });
  });
});