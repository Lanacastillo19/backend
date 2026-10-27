import express from "express";
import cors from "cors";
import { connectDB } from "../src/config/db";
import submissionsRouter from "../src/routes/submissions";
import coursesRouter from "../src/routes/courses";

const app = express();

// Connect to MongoDB Atlas
connectDB();

// Enable CORS for your Vercel frontend
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// Mount API Routes
app.use("/api/submissions", submissionsRouter);
app.use("/api/courses", coursesRouter);

export default app;