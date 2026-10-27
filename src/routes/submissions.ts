import { Router } from "express";
import Submission from "../models/Submission";

const router = Router();

// GET /api/submissions
router.get("/", async (req, res) => {
  try {
    const submissions = await Submission.find().sort({ createdAt: -1 });
    res.json(submissions);
  } catch (error) {
    console.error("Fetch submissions error:", error);
    res.status(500).json({ message: "Failed to fetch submissions." });
  }
});

// POST /api/submissions
router.post("/", async (req, res) => {
  try {
    const { courseId, title, repoUrl } = req.body;

    if (!courseId || !title || !repoUrl) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const newSubmission = await Submission.create({
      courseId,
      title,
      repoUrl,
    });

    return res.status(201).json(newSubmission);
  } catch (error) {
    console.error("Save submission error:", error);
    return res.status(500).json({ message: "Failed to save to database." });
  }
});

export default router;