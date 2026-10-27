import { Router, Request, Response } from "express";
import { Submission } from "../models/Submission";

const router = Router();

// GET /api/submissions - Fetch all submissions
router.get("/", async (req: Request, res: Response) => {
  try {
    const submissions = await Submission.find().sort({ createdAt: -1 });
    res.json(submissions);
  } catch (error) {
    console.error("Error fetching submissions:", error);
    res.status(500).json({ error: "Failed to fetch submissions" });
  }
});

// POST /api/submissions - Create a new submission
router.post("/", async (req: Request, res: Response) => {
  try {
    const { courseId, title, repoUrl } = req.body;

    if (!courseId || !title || !repoUrl) {
      return res.status(400).json({ error: "courseId, title, and repoUrl are required" });
    }

    const newSubmission = await Submission.create({
      courseId,
      title,
      repoUrl,
      status: "Submitted",
      createdAt: new Date(),
    });

    res.status(201).json(newSubmission);
  } catch (error) {
    console.error("Error creating submission:", error);
    res.status(500).json({ error: "Failed to save submission to database" });
  }
});

export default router;