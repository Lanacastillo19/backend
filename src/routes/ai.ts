// src/routes/ai.ts
import { Router, type Request, type Response } from "express";
import { rateLimit } from "express-rate-limit";
import { requireAuth } from "../middleware/auth";
import { aiRequestSchema } from "../schemas/review";
import { reviewProject, AiReplyError } from "../ai/gemini";

// Named export matching import { aiRouter } in src/app.ts
export const aiRouter = Router();

// Private route guard
aiRouter.use(requireAuth);

// Rate limiter: 5 requests per minute per account
const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 5,
  keyGenerator: (req: Request) => req.userId!,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    message: "Five reviews a minute is the limit. Try again shortly.",
  },
});

aiRouter.use(aiLimiter);

// POST /api/ai
aiRouter.post("/", async (req: Request, res: Response) => {
  const parsed = aiRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      message: "Validation failed",
      errors: parsed.error.issues.map((issue) => issue.message),
    });
    return;
  }

  try {
    const review = await reviewProject(parsed.data.prompt);
    res.json(review);
  } catch (err: any) {
    console.error("Gemini API Error Detail:", err);

    // Rate limits / Quota exceeded
    if (err?.status === 429 || err?.statusCode === 429) {
      res.status(429).json({
        message: "The AI quota is used up for now. Try again later.",
      });
      return;
    }

    // Handle generic Google AI API or JSON parse errors gracefully
    if (err instanceof AiReplyError || err?.status || err?.message) {
      res.status(502).json({
        message: err.message || "The AI service did not answer properly. Try again.",
      });
      return;
    }

    res.status(500).json({
      message: "Internal server error while generating AI review.",
    });
  }
});