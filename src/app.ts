import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import mongoose from "mongoose";

// Import route modules
import { authRouter } from "./routes/auth";
import { itemRouter } from "./routes/items";
import * as UserModule from "./routes/User";
import { aiRouter } from "./routes/ai";

// Resolve router dynamically without strict module check errors
const userRouter = ((UserModule as any).default || (UserModule as any).userRouter || (UserModule as any).router || UserModule) as express.Router;

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

// Serverless DB Connection Helper
let isConnected = false;
const connectDB = async () => {
  if (isConnected && mongoose.connection.readyState === 1) return;

  let uri =
    process.env.MONGODB_URI ||
    "mongodb+srv://lanaleecastillo_db_user:gzXEMWbtaJ9vz4QW@cluster0.xtg4ada.mongodb.net/?retryWrites=true&w=majority";

  if (uri.includes("cluster0.xtg4ada") && !uri.includes("cluster0.xtg4ada.mongodb.net")) {
    uri = uri.replace("cluster0.xtg4ada", "cluster0.xtg4ada.mongodb.net");
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

// Health Check
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ ok: true, db: mongoose.connection.readyState === 1 });
});
app.get("/health", (_req: Request, res: Response) => {
  res.json({ ok: true, db: mongoose.connection.readyState === 1 });
});

// Route Mounts (Supports both /api/* and /* endpoints)
app.use("/api/auth", authRouter);
app.use("/auth", authRouter);
app.use("/api", authRouter);
app.use("/", authRouter);

app.use("/api/items", itemRouter);
app.use("/items", itemRouter);

app.use("/api/users", userRouter);
app.use("/users", userRouter);

app.use("/api/ai", aiRouter);
app.use("/ai", aiRouter);

// Global Error Handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ message: "Internal server error", error: err.message });
});

export default app;