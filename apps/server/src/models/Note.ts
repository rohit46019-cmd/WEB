import { Schema, model } from "mongoose";

const NoteSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", index: true },
  title: String,
  content: String, // store HTML/Markdown
  tags: [String],
  updatedAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

export const NoteModel = model("Note", NoteSchema);
