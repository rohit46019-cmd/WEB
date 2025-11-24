import { Request, Response, NextFunction } from "express";
import { AuditLogModel } from "../models/AuditLog.js";

export async function auditMiddleware(req: Request, _res: Response, next: NextFunction) {
  const userId = req.user?._id || null;
  const entry = new AuditLogModel({
    user: userId,
    action: `${req.method} ${req.path}`,
    ip: req.ip,
    ua: req.headers["user-agent"],
    createdAt: new Date()
  });
  // fire-and-forget
  entry.save().catch(() => {});
  next();
}
