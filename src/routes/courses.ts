import { Router, type Request, type Response } from "express";
import { Course } from "../models/Course";

export const courseRouter = Router();

// GET /api/courses - Retrieve all persisted courses/subjects
courseRouter.get("/", async (_req: Request, res: Response) => {
  try {
    const courses = await Course.find().sort({ code: 1 });
    return res.json(courses);
  } catch (err) {
    console.error("Fetch courses error:", err);
    return res.status(500).json({ message: "Failed to fetch courses." });
  }
});

// POST /api/courses - Save a new subject to MongoDB
courseRouter.post("/", async (req: Request, res: Response) => {
  try {
    const { code, title, description } = req.body;
    if (!code || !title) {
      return res.status(400).json({ message: "Course code and title are required." });
    }

    const uppercaseCode = code.trim().toUpperCase();
    const existing = await Course.findOne({ code: uppercaseCode });

    if (existing) {
      return res.status(200).json(existing);
    }

    const newCourse = await Course.create({
      code: uppercaseCode,
      title: title.trim(),
      description: description ? description.trim() : "",
    });

    return res.status(201).json(newCourse);
  } catch (err) {
    console.error("Save course error:", err);
    return res.status(500).json({ message: "Failed to save course." });
  }
});