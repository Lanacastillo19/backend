import { Router, type Request, type Response } from "express";
import { Submission } from "../models/Submission";
import { requireAuth } from "../middleware/auth";

export const submissionRouter = Router();

// Protect all submission routes behind authentication
submissionRouter.use(requireAuth);

// GET /api/submissions - Fetch all submissions
submissionRouter.get("/", async (req: Request, res: Response) => {
  try {
    const submissions = await Submission.find().sort({ createdAt: -1 });
    return res.json(submissions);
  } catch (err) {
    console.error("Failed to fetch submissions:", err);
    return res.status(500).json({ message: "Failed to fetch submissions." });
  }
});

// POST /api/submissions - Create a new submission
submissionRouter.post("/", async (req: Request, res: Response) => {
  try {
    const { courseCode, title, repoUrl } = req.body;

    if (!courseCode || !title || !repoUrl) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const newSubmission = await Submission.create({
      studentId: req.userId,
      courseCode,
      title,
      repoUrl,
      status: "PENDING",
      submittedAt: new Date(),
    });

    return res.status(201).json(newSubmission);
  } catch (err) {
    console.error("Submission creation failed:", err);
    return res.status(500).json({ message: "Failed to create submission." });
  }
});