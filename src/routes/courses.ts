import { Router, Request, Response } from "express";
import mongoose from "mongoose";

const router = Router();

// Simple Schema check if using Mongoose
const courseSchema = new mongoose.Schema({
  title: String,
  code: String,
  description: String,
});

const Course = mongoose.models.Course || mongoose.model("Course", courseSchema);

router.get("/", async (req: Request, res: Response) => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      return res.status(500).json({ message: "MONGODB_URI environment variable is not defined." });
    }

    // Connect if not already connected (vital for serverless functions)
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(mongoUri);
    }

    const courses = await Course.find({});
    return res.status(200).json(courses);
  } catch (error: any) {
    console.error("Database fetch error:", error);
    return res.status(500).json({ message: "Failed to fetch courses.", error: error.message });
  }
});

export default router;