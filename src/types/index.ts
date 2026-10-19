import type { Types } from "mongoose";

// Base User Interface
export interface User {
  id: string;
  name: string;
  email: string;
  role: "student" | "admin" | "instructor";
  isActive: boolean;
}

// User Document shape stored in MongoDB (includes hashed password)
export type UserDoc = Omit<User, "id"> & {
  password: string;
};

// Base Item Interface (Your custom resource)
export interface Item {
  id: string;
  userId: string;
  name: string;
  category: "work" | "personal" | "urgent";
  priority: number;
  createdAt: Date;
}

// Item Document shape stored in MongoDB (userId is stored as ObjectId)
export type ItemDoc = Omit<Item, "id" | "userId"> & {
  userId: Types.ObjectId;
};

// Request Body expected when creating a new Item
export type NewItemBody = Pick<Item, "name" | "category" | "priority">;