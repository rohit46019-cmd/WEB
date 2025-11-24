import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { upload } from "../middleware/multerGrid.js";
import { FileModel } from "../models/File.js";
import { encryptBuffer, decryptBuffer } from "../utils/crypto.js";
import mongoose from "mongoose";
import mime from "mime-types";
import { getGridFS } from "../config/gridfs.js";

export const filesRouter = Router();
filesRouter.use(requireAuth);

// List files with search/filter/sort
filesRouter.get("/", async (req, res) => {
  const { q, type, sort = "createdAt-desc", folder, starred, deleted } = req.query as Record<string, string>;
  const query: any = { user: req.user!._id };
  if (q) query.$or = [{ originalName: new RegExp(q, "i") }, { filename: new RegExp(q, "i") }];
  if (type) query.type = type;
  if (folder) query.folder = folder;
  if (starred) query.starred = starred === "true";
  if (deleted) query.deletedAt = deleted === "true" ? { $ne: null } : null;

  const [field, dir] = sort.split("-");
  const files = await FileModel.find(query).sort({ [field]: dir === "desc" ? -1 : 1 }).limit(200);
  res.json(files);
});

// Upload with versioning, encryption, progress via websocket
filesRouter.post("/upload", upload.array("files"), async (req, res) => {
  const gfs = getGridFS();

  const results = [];
  for (const file of req.files as Express.Multer.File[]) {
    const encrypted = encryptBuffer(file.buffer);
    const gridId = new mongoose.Types.ObjectId().toString();

    await new Promise<void>((resolve, reject) => {
      const writestream = gfs.createWriteStream({ _id: gridId, filename: file.originalname, content_type: file.mimetype });
      writestream.on("close", () => resolve());
      writestream.on("error", reject);
      writestream.write(encrypted);
      writestream.end();
    });

    const doc = await FileModel.create({
      filename: gridId,
      originalName: file.originalname,
      size: file.size,
      type: mime.lookup(file.originalname) || file.mimetype,
      user: req.user!._id,
      gridId,
      versions: [{ size: file.size, uploadedAt: new Date(), gridId }]
    });

    results.push(doc);
  }

  res.json({ uploaded: results.length, files: results });
});

// Download with full preview support
filesRouter.get("/:id/download", async (req, res) => {
  const gfs = getGridFS();
  const file = await FileModel.findOne({ _id: req.params.id, user: req.user!._id });
  if (!file) return res.status(404).json({ error: "File not found" });

  const readstream = gfs.createReadStream({ _id: file.gridId });
  const chunks: Buffer[] = [];
  readstream.on("data", (d) => chunks.push(d));
  readstream.on("end", () => {
    const decrypted = decryptBuffer(Buffer.concat(chunks));
    res.setHeader("Content-Type", file.type);
    res.setHeader("Content-Disposition", `attachment; filename="${file.originalName}"`);
    res.send(decrypted);
  });
  readstream.on("error", () => res.status(500).json({ error: "Stream error" }));
});

// Preview (inline)
filesRouter.get("/:id/preview", async (req, res) => {
  const gfs = getGridFS();
  const file = await FileModel.findOne({ _id: req.params.id, user: req.user!._id });
  if (!file) return res.status(404).json({ error: "File not found" });

  const readstream = gfs.createReadStream({ _id: file.gridId });
  const chunks: Buffer[] = [];
  readstream.on("data", (d) => chunks.push(d));
  readstream.on("end", () => {
    const decrypted = decryptBuffer(Buffer.concat(chunks));
    res.setHeader("Content-Type", file.type);
    res.send(decrypted);
  });
  readstream.on("error", () => res.status(500).json({ error: "Stream error" }));
});

filesRouter.patch("/:id/star", async (req, res) => {
  const file = await FileModel.findOneAndUpdate({ _id: req.params.id, user: req.user!._id }, { $set: { starred: !!req.body.starred } }, { new: true });
  res.json(file);
});

filesRouter.patch("/:id/move", async (req, res) => {
  const file = await FileModel.findOneAndUpdate({ _id: req.params.id, user: req.user!._id }, { $set: { folder: req.body.folder || null } }, { new: true });
  res.json(file);
});

// Soft delete to recycle bin
filesRouter.delete("/:id", async (req, res) => {
  const file = await FileModel.findOneAndUpdate({ _id: req.params.id, user: req.user!._id }, { $set: { deletedAt: new Date() } }, { new: true });
  res.json(file);
});

// Restore from recycle bin
filesRouter.post("/:id/restore", async (req, res) => {
  const file = await FileModel.findOneAndUpdate({ _id: req.params.id, user: req.user!._id }, { $set: { deletedAt: null } }, { new: true });
  res.json(file);
});
