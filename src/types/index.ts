import type { Types } from "mongoose";

// --- USER TYPES ---
export interface User {
  id: string;
  name: string;
  email: string;
  role: "student" | "admin" | "instructor";
  isActive: boolean;
}

export type UserDoc = Omit<User, "id"> & {
  password: string;
};

// --- COURSE TYPES ---
export interface Course {
  id: string;
  code: string;
  title: string;
  description: string;
  instructorId: string;
  createdAt: Date;
}

export type CourseDoc = Omit<Course, "id" | "instructorId"> & {
  instructorId: Types.ObjectId;
};

export type NewCourseBody = Pick<Course, "code" | "title" | "description">;

// --- SUBMISSION & AI REVIEW TYPES ---
export interface ReviewFeedback {
  summary: string;
  strengths: string[];
  improvements: string[];
  readiness: "ready" | "almost" | "not-yet";
}

export interface Submission {
  id: string;
  userId: string;
  courseId?: string;
  description: string;
  review?: ReviewFeedback;
  createdAt: Date;
}

export type SubmissionDoc = Omit<Submission, "id" | "userId" | "courseId"> & {
  userId: Types.ObjectId;
  courseId?: Types.ObjectId;
};

export type NewSubmissionBody = {
  courseId?: string;
  description: string;
};