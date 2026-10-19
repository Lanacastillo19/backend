import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import cors from "cors";
import mongoose from "mongoose";
import { authRouter } from "./routes/auth.js";
import { itemRouter } from "./routes/items.js";

export const app = express();

app.use(cors());
app.use(express.json());

// Health Check Endpoint
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ ok: true, db: mongoose.connection.readyState === 1 });
});

// Route Mounts
app.use("/api/auth", authRouter);
app.use("/api/items", itemRouter);

// Submission Portal Endpoints
app.get("/api/courses", (_req: Request, res: Response) => {
  res.json([
    {
      _id: "1",
      name: "ITELECT4",
      title: "IT Elective 4 (ITELECT4)",
      code: "IT4B",
      description: "IT Elective 4"
    },
    {
      _id: "2",
      name: "IT Elective 3",
      title: "IT Elective 3 (ITELECT3)",
      code: "ITELECT3",
      description: "IT Elective 3"
    },
    {
      _id: "3",
      name: "Web Systems and Technologies",
      title: "Web Systems and Technologies (WEB101)",
      code: "WEB101",
      description: "Full-Stack Web Development"
    },
    {
      _id: "4",
      name: "Database Management Systems",
      title: "Database Management Systems (DBMS101)",
      code: "DBMS101",
      description: "Relational Databases & SQL"
    },
    {
      _id: "5",
      name: "Networking and Communications",
      title: "Networking and Communications (NET101)",
      code: "NET101",
      description: "Computer Networks & Protocols"
    }
  ]);
});

app.get("/api/submissions", (_req: Request, res: Response) => {
  res.json([]);
});

app.post("/api/submissions", (_req: Request, res: Response) => {
  res.status(201).json({ message: "Submission received successfully" });
});

// 404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    message: `No route for ${req.method} ${req.originalUrl}`,
  });
});

// Global Error Handler
app.use(
  (err: Error, _req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof mongoose.Error.ValidationError) {
      res.status(400).json({
        message: "Validation failed",
        errors: Object.values(err.errors).map((e) => e.message),
      });
      return;
    }

    if (err instanceof mongoose.Error.CastError) {
      res.status(400).json({
        message: `"${err.value}" is not a valid id`,
      });
      return;
    }

    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
);