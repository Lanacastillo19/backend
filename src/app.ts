import express, { type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import mongoose from "mongoose";

// Import route modules
import { authRouter } from "./routes/auth";
import { itemRouter } from "./routes/items";
import * as UserModule from "./routes/User";
import { aiRouter } from "./routes/ai";
import submissionRouter from "./routes/submissions";
import courseRouter from "./routes/courses";

const userRouter = ((UserModule as any).default || (UserModule as any).userRouter || UserModule) as express.Router;

const app = express();

// Configure CORS options
const corsOptions: cors.CorsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization",
    "X-CSRF-Token",
    "X-Api-Version"
  ],
  credentials: true,
  optionsSuccessStatus: 200,
};

// Enable CORS for all routes
app.use(cors(corsOptions));

// Explicit preflight middleware for serverless routing
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, X-CSRF-Token, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    res.sendStatus(200);
    return;
  }
  next();
});

app.use(express.json());

// Serverless-Friendly Database Connection
const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.warn("MONGODB_URI missing from environment variables.");
    return;
  }

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection failed:", err);
  }
};

// Async middleware ensuring DB connection attempt for routes
app.use(async (_req: Request, _res: Response, next: NextFunction) => {
  try {
    await connectDB();
  } catch (err) {
    console.error("DB Middleware warning:", err);
  }
  next();
});

// Root / Health Check
app.get(["/", "/api", "/api/health", "/health"], (_req: Request, res: Response) => {
  res.status(200).json({ ok: true, message: "Backend is running live" });
});

// Mount modular routers
app.use("/api/auth", authRouter);
app.use("/auth", authRouter);

app.use("/api/items", itemRouter);
app.use("/items", itemRouter);

app.use("/api/users", userRouter);
app.use("/users", userRouter);

// Task Coach AI Router
app.use("/api/ai", aiRouter);
app.use("/ai", aiRouter);

app.use("/api/submissions", submissionRouter);
app.use("/submissions", submissionRouter);

app.use("/api/courses", courseRouter);
app.use("/courses", courseRouter);

// Global Catch-All for unknown routes
app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: "Route not found" });
});

// Global Error Handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Unhandled Error:", err);
  res.status(500).json({ message: "Internal server error", error: err.message });
});

export default app;