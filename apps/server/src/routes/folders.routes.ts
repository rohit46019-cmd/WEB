import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { FolderModel } from "../models/Folder.js";

export const foldersRouter = Router();
foldersRouter.use(requireAuth);

foldersRouter.get("/", async (req, res) => {
  const folders = await FolderModel.find({ user: req.user!._id }).sort({ createdAt: -1 });
  res.json(folders);
});

foldersRouter.post("/", async (req, res) => {
  const folder = await FolderModel.create({ name: req.body.name, parent: req.body.parent || null, user: req.user!._id });
  res.json(folder);
});

foldersRouter.patch("/:id", async (req, res) => {
  const folder = await FolderModel.findOneAndUpdate({ _id: req.params.id, user: req.user!._id }, { $set: { name: req.body.name } }, { new: true });
  res.json(folder);
});

foldersRouter.delete("/:id", async (req, res) => {
  await FolderModel.deleteOne({ _id: req.params.id, user: req.user!._id });
  res.json({ ok: true });
});
