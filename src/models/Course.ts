import { Schema, model } from "mongoose";

const courseSchema = new Schema(
  {
    code: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
  },
  { timestamps: true }
);

export const Course = model("Course", courseSchema);