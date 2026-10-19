import { Router, type Request, type Response } from "express";
import { Item } from "../models/Item.js";
import { requireAuth } from "../middleware/auth.js";
import type { NewItemBody } from "../types/index.js";

export const itemRouter = Router();

// Protect all routes below with requireAuth
itemRouter.use(requireAuth);

interface IdParam {
  id: string;
}

// 1. GET ALL items for the logged-in user
itemRouter.get("/", async (req: Request, res: Response) => {
  const items = await Item.find({
    userId: req.userId,
  }).sort({ createdAt: -1 });
  res.json(items);
});

// 2. GET ONE item by ID (must belong to logged-in user)
itemRouter.get(
  "/:id",
  async (req: Request<IdParam>, res: Response) => {
    const item = await Item.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!item) {
      res.status(404).json({ message: "No item with that id" });
      return;
    }

    res.json(item);
  }
);

// 3. CREATE a new item
itemRouter.post(
  "/",
  async (
    req: Request<unknown, unknown, NewItemBody>,
    res: Response
  ) => {
    const item = await Item.create({
      ...req.body,
      userId: req.userId,
    });

    res.status(201).json(item);
  }
);

// 4. UPDATE an existing item
itemRouter.patch(
  "/:id",
  async (
    req: Request<IdParam, unknown, Partial<NewItemBody>>,
    res: Response
  ) => {
    const item = await Item.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!item) {
      res.status(404).json({ message: "No item with that id" });
      return;
    }

    res.json(item);
  }
);

// 5. DELETE an item
itemRouter.delete(
  "/:id",
  async (req: Request<IdParam>, res: Response) => {
    const item = await Item.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!item) {
      res.status(404).json({ message: "No item with that id" });
      return;
    }

    res.status(204).send();
  }
);