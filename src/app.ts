import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import { authRouter } from "./routes/auth.js";
import { itemRouter } from "./routes/items.js";
import { aiRouter } from "./routes/ai.js";

export const app = express();

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

// Serverless DB Middleware
app.use(async (_req, _res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    next(err);
  }
});

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({ ok: true, db: true });
});

app.use("/api/auth", authRouter);
app.use("/api/items", itemRouter);
app.use("/api/ai", aiRouter);