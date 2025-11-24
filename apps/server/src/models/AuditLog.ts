import { Schema, model } from "mongoose";

const AuditLogSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", default: null },
  action: String,
  ip: String,
  ua: String,
  createdAt: { type: Date, default: Date.now }
});
export const AuditLogModel = model("AuditLog", AuditLogSchema);
