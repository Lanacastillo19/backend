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

// POST /api/auth/login or /auth/login
authRouter.post(
  "/login",
  async (
    req: Request<unknown, unknown, LoginBody>,
    res: Response
  ) => {
    try {
      const input = req.body?.email || req.body?.name || "student@dlsl.edu.ph";
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
      const token = jwt.sign(
        payload,
        process.env.JWT_SECRET || "development-secret",
        { expiresIn: "2h" }
      );

      return res.status(200).json({
        token,
        user: typeof user.toJSON === "function" ? user.toJSON() : user,
      });
    } catch (error: any) {
      console.error("Error in POST /auth/login:", error);
      return res.status(500).json({
        message: error?.message || "Failed to authenticate with backend server.",
      });
    }
  }
);