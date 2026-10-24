import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import mongoose from "mongoose";

export const app = express();

// Enable CORS for frontend requests
app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options("*", cors());
app.use(express.json());

// Serverless DB Connection Helper
let isConnected = false;
const connectDB = async () => {
  if (isConnected && mongoose.connection.readyState === 1) return;
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI environment variable is missing");
  }
  await mongoose.connect(uri);
  isConnected = true;
};

// Database Connection Middleware
app.use(async (_req: Request, _res: Response, next: NextFunction) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("Database connection error:", err);
    next(err);
  }
});

// Health check endpoint
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ ok: true, db: mongoose.connection.readyState === 1 });
});

// Minimal dummy Auth route fallback if external route imports fail
app.post("/api/auth/login", (_req: Request, res: Response) => {
  res.json({ token: "dummy-token", user: { email: "lana_lee_castillio@dlsl.edu.ph" } });
});

// Global Error Handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ message: "Internal server error", error: err.message });
});