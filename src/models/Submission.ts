import { Router } from "express";
import Submission from "../models/Submission";

const router = Router();

// GET all submissions
router.get("/", async (_req, res) => {
  try {
    const submissions = await Submission.find().sort({ createdAt: -1 });
    return res.status(200).json(submissions);
  } catch (error: any) {
    return res.status(500).json({ message: "Failed to fetch submissions", error: error.message });
  }
});

// POST new submission
router.post("/", async (req, res) => {
  try {
    const { courseId, title, repoUrl, studentId } = req.body;

    if (!courseId || !title || !repoUrl) {
      return res.status(400).json({ message: "Please provide courseId, title, and repoUrl." });
    }

    const newSubmission = new Submission({
      courseId,
      title,
      repoUrl,
      studentId: studentId || undefined,
      status: "PENDING",
    });

    const saved = await newSubmission.save();
    return res.status(201).json(saved);
  } catch (error: any) {
    console.error("Error creating submission:", error);
    return res.status(500).json({ message: "Failed to create submission", error: error.message });
  }
});

export default router;