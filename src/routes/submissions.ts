import { Router, Request, Response } from "express";
import Submission from "../models/Submission";
import mongoose from "mongoose";

const router = Router();

// Ensure DB is connected before handling queries
const ensureDbConnected = async () => {
  if (mongoose.connection.readyState !== 1) {
    const uri = process.env.MONGODB_URI;
    if (uri) {
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    }
  }
};

// GET /api/submissions
router.get("/", async (_req: Request, res: Response) => {
  try {
    await ensureDbConnected();
    const submissions = await Submission.find().sort({ createdAt: -1 });
    return res.status(200).json(submissions);
  } catch (error: any) {
    console.error("GET /submissions error:", error);
    return res.status(500).json({ 
      message: "Failed to fetch submissions.", 
      error: error.message 
    });
  }
});

// POST /api/submissions
router.post("/", async (req: Request, res: Response) => {
  try {
    await ensureDbConnected();
    const { courseId, title, repoUrl } = req.body;

    if (!courseId || !title || !repoUrl) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const newSubmission = new Submission({
      courseId,
      title,
      repoUrl,
      status: "PENDING",
      submittedAt: new Date(),
    });

    const savedSubmission = await newSubmission.save();
    return res.status(201).json(savedSubmission);
  } catch (error: any) {
    console.error("POST /submissions error:", error);
    return res.status(500).json({ 
      message: "Failed to create submission.", 
      error: error.message 
    });
  }
});

export default router;