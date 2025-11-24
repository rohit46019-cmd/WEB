import { Schema, model } from "mongoose";

const FolderSchema = new Schema({
  name: String,
  user: { type: Schema.Types.ObjectId, ref: "User", index: true },
  parent: { type: Schema.Types.ObjectId, ref: "Folder", default: null },
  createdAt: { type: Date, default: Date.now }
});

export const FolderModel = model("Folder", FolderSchema);
