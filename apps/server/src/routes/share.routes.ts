import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { ShareLinkModel } from "../models/ShareLink.js";
import { FileModel } from "../models/File.js";
import jwt from "jsonwebtoken";
import argon2 from "argon2";
import { decryptBuffer } from "../utils/crypto.js";
import { getGridFS } from "../config/gridfs.js";

export const shareRouter = Router();

shareRouter.use(requireAuth);

// Create share link
shareRouter.post("/:fileId", async (req, res) => {
  const file = await FileModel.findOne({ _id: req.params.fileId, user: req.user!._id });
  if (!file) return res.status(404).json({ error: "Not found" });

  const token = jwt.sign({ fileId: file._id.toString() }, process.env.JWT_SECRET!, { expiresIn: "30d" });
  const expiresAt = req.body.expiresAt ? new Date(req.body.expiresAt) : null;
  const passwordHash = req.body.password ? await argon2.hash(req.body.password) : null;
  const link = await ShareLinkModel.create({ file: file._id, user: req.user!._id, token, passwordHash, expiresAt });
  res.json(link);
});

shareRouter.patch("/:id/disable", async (req, res) => {
  const link = await ShareLinkModel.findOneAndUpdate({ _id: req.params.id, user: req.user!._id }, { $set: { disabled: true } }, { new: true });
  res.json(link);
});

// Public download (token + optional password)
shareRouter.get("/d/:token", async (req, res) => {
  try {
    const payload = jwt.verify(req.params.token, process.env.JWT_SECRET!) as { fileId: string };
    const link = await ShareLinkModel.findOne({ token: req.params.token, disabled: false });
    if (!link) return res.status(404).json({ error: "Link invalid" });
    if (link.expiresAt && link.expiresAt < new Date()) return res.status(410).json({ error: "Link expired" });
    if (link.passwordHash) {
      const pwd = (req.query.p as string) || "";
      const ok = await argon2.verify(link.passwordHash, pwd);
      if (!ok) return res.status(401).json({ error: "Password required/invalid" });
    }

    const file = await FileModel.findById(payload.fileId);
    if (!file) return res.status(404).json({ error: "File missing" });
    const gfs = getGridFS();
    const rs = gfs.createReadStream({ _id: file.gridId });
    const chunks: Buffer[] = [];
    rs.on("data", (d) => chunks.push(d));
    rs.on("end", () => {
      const decrypted = decryptBuffer(Buffer.concat(chunks));
      res.setHeader("Content-Type", file.type);
      res.setHeader("Content-Disposition", `attachment; filename="${file.originalName}"`);
      res.send(decrypted);
    });
    rs.on("error", () => res.status(500).json({ error: "Stream error" }));
  } catch {
    res.status(400).json({ error: "Invalid token" });
  }
});
