import { Schema, model } from "mongoose";

const UserSchema = new Schema({
  email: { type: String, unique: true, index: true },
  passwordHash: String,
  name: String,
  role: { type: String, default: "user" },
  quotaMB: { type: Number, default: Number(process.env.STORAGE_QUOTA_MB || 10240) },
  active: { type: Boolean, default: true },
  googleId: { type: String }
}, { timestamps: true });

export const UserModel = model("User", UserSchema);
