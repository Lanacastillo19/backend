import { Schema, model } from "mongoose";
import type { ItemDoc } from "../types/index.js";

const itemSchema = new Schema<ItemDoc>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    
    // Rule 1: required
    name: { type: String, required: [true, "Item name is required"], trim: true },
    
    // Rule 2: enum
    category: {
      type: String,
      enum: {
        values: ["work", "personal", "urgent"],
        message: "Category must be work, personal, or urgent",
      },
      default: "personal",
    },
    
    // Rule 3: min / max range
    priority: {
      type: Number,
      required: [true, "Priority is required"],
      min: [1, "Priority must be at least 1"],
      max: [5, "Priority cannot exceed 5"],
    },
  },
  { timestamps: true }
);

itemSchema.set("toJSON", {
  transform(_doc, ret: Record<string, unknown>) {
    ret.id = String(ret._id);
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const Item = model<ItemDoc>("Item", itemSchema);