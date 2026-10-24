import { Router, type Request, type Response, type NextFunction } from "express";
import { rateLimit } from "express-rate-limit";
import { ApiError } from "@google/genai";
import { requireAuth } from "../middleware/auth";
import { aiRequestSchema } from "../schemas/review";
import { reviewProject, AiReplyError } from "../ai/gemini";

export const aiRouter = Router();

// Private: every call spends YOUR Gemini quota, so you must be logged in.
aiRouter.use(requireAuth);

// Five requests a minute per account.
// It sits below requireAuth, so req.userId already exists here.
const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 5,
  keyGenerator: (req: Request) => req.userId!,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { message: "Five reviews a minute is the limit. Try again shortly." },
});
aiRouter.use(aiLimiter);

// POST /api/ai
aiRouter.post("/", async (req: Request, res: Response, next: NextFunction) => {
  // 400: the body is checked BEFORE Gemini is called, so a bad request costs nothing.
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
  } catch (err) {
    // 429: Gemini's own quota is used up.
    if (err instanceof ApiError && err.status === 429) {
      res.status(429).json({
        message: "The AI quota is used up for now. Try again later.",
      });
      return;
    }

    // 502: Gemini failed, or its reply was unusable.
    if (err instanceof ApiError || err instanceof AiReplyError) {
      console.error(err); // the real reason goes to the log, not the browser
      res.status(502).json({
        message: "The AI service did not answer properly. Try again.",
      });
      return;
    }

    // Anything else is a bug: pass it to app.ts's error handler.
    next(err);
  }
});