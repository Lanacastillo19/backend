import mongoose, { Schema, Document } from "mongoose";

export interface ISubmission extends Document {
  courseId: string;
  repoUrl: string;
  createdAt: Date;
}

const SubmissionSchema: Schema = new Schema({
  courseId: { type: String, required: true },
  repoUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export const Submission = mongoose.model<ISubmission>("Submission", SubmissionSchema);