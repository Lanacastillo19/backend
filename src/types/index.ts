// ===== Types used by the models and routes =====

export type ItemDoc = {
  userId: import("mongoose").Types.ObjectId;
  name: string;
  category: "work" | "personal" | "urgent";
  priority: number;
};

export type UserDoc = {
  name: string;
  email: string;
  role: "student" | "admin" | "instructor";
  isActive: boolean;
  password: string;
};

// What a client sends when creating an item
export interface NewItemBody {
  name: string;
  category?: "work" | "personal" | "urgent";
  priority: number;
}