import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { NoteModel } from "../models/Note.js";

export const notesRouter = Router();
notesRouter.use(requireAuth);

notesRouter.get("/", async (req, res) => {
  const { q, tag } = req.query as Record<string, string>;
  const query: any = { user: req.user!._id };
  if (q) query.$or = [{ title: new RegExp(q, "i") }, { content: new RegExp(q, "i") }];
  if (tag) query.tags = tag;
  const notes = await NoteModel.find(query).sort({ updatedAt: -1 });
  res.json(notes);
});

notesRouter.post("/", async (req, res) => {
  const note = await NoteModel.create({ user: req.user!._id, title: req.body.title, content: req.body.content, tags: req.body.tags || [] });
  res.json(note);
});

notesRouter.patch("/:id", async (req, res) => {
  const note = await NoteModel.findOneAndUpdate({ _id: req.params.id, user: req.user!._id }, { $set: { title: req.body.title, content: req.body.content, tags: req.body.tags || [] , updatedAt: new Date()} }, { new: true });
  res.json(note);
});

notesRouter.delete("/:id", async (req, res) => {
  await NoteModel.deleteOne({ _id: req.params.id, user: req.user!._id });
  res.json({ ok: true });
});
