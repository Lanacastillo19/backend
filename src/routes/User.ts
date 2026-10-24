import { Router, type Request, type Response } from "express";
import mongoose from "mongoose";
import "../models/User"; // loads the existing model so it is registered once
import { requireAuth } from "../middleware/auth";

// Get the model that models/User.ts already registered.
// Do NOT define the schema or call mongoose.model("User", schema) here.
const User = mongoose.model("User");

export const userRouter = Router();
export default userRouter;

// Private: every route below needs a valid token
userRouter.use(requireAuth);

// GET /api/users
userRouter.get("/", async (_req: Request, res: Response) => {
  const users = await User.find();
  res.json(users);
});

// GET /api/users/:id
userRouter.get("/:id", async (req: Request, res: Response) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(400).json({ message: "Invalid user id" });
    return;
  }
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }
  res.json(user);
});