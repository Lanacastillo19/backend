import { Router, type Request, type Response } from "express";
import jwt from "jsonwebtoken";
import type { TokenPayload } from "../middleware/auth.js";
import { User } from "../models/User.js";

export const authRouter = Router();

interface LoginBody {
  email?: string;
  name?: string;
  password?: string;
}

// POST /api/auth/login
authRouter.post(
  "/login",
  async (
    req: Request<unknown, unknown, LoginBody>,
    res: Response
  ) => {
    const input = req.body.email || req.body.name || "student@dlsl.edu.ph";
    const email = input.includes("@") ? input : `${input}@dlsl.edu.ph`;
    const name = input.includes("@") ? input.split("@")[0] : input;

    // Find existing user or create a new one automatically
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name,
        email,
        password: "devpassword123", // default fallback password
      });
    }

    const payload: TokenPayload = { userId: String(user._id) };
    const token = jwt.sign(payload, process.env.JWT_SECRET || "development-secret", {
      expiresIn: "2h",
    });

    res.json({ token, user: user.toJSON() });
  }
);