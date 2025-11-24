import { Schema, model } from "mongoose";

const FileSchema = new Schema({
  filename: String,
  originalName: String,
  size: Number,
  type: String,
  user: { type: Schema.Types.ObjectId, ref: "User", index: true },
  folder: { type: Schema.Types.ObjectId, ref: "Folder", index: true },
  versions: [{
    size: Number,
    uploadedAt: Date,
    gridId: String
  }],
  gridId: { type: String, index: true },
  starred: { type: Boolean, default: false },
  deletedAt: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now },
  thumbGridId: { type: String }
});

export const FileModel = model("File", FileSchema);
