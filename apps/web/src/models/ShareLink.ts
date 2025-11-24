import { Schema, model } from "mongoose";

const ShareLinkSchema = new Schema({
  file: { type: Schema.Types.ObjectId, ref: "File", index: true },
  user: { type: Schema.Types.ObjectId, ref: "User" },
  token: { type: String, unique: true, index: true },
  passwordHash: String,
  expiresAt: Date,
  disabled: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});
export const ShareLinkModel = model("ShareLink", ShareLinkSchema);
