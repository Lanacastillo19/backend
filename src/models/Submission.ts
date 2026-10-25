import { Schema, model } from "mongoose";

const submissionSchema = new Schema(
  {
    studentId: { type: Schema.Types.ObjectId, ref: "User" },
    courseCode: { type: String, required: true },
    title: { type: String, required: true },
    repoUrl: { type: String, required: true },
    status: {
      type: String,
      enum: ["PENDING", "GRADED", "REJECTED"],
      default: "PENDING",
    },
    score: { type: Number, default: 0 },
    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Submission = model("Submission", submissionSchema);