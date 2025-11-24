import { Router } from "express";
import { requireAuth, requireAdmin } from "../middleware/auth.js";
import { UserModel } from "../models/User.js";
import { FileModel } from "../models/File.js";

export const adminRouter = Router();

adminRouter.use(requireAuth, requireAdmin);

adminRouter.get("/users", async (_req, res) => {
  const users = await UserModel.find().select("_id email name role active quotaMB createdAt");
  res.json(users);
});

adminRouter.patch("/users/:id/toggle", async (req, res) => {
  const user = await UserModel.findById(req.params.id);
  if (!user) return res.status(404).json({ error: "User not found" });
  user.active = !user.active;
  await user.save();
  res.json(user);
});

adminRouter.get("/stats", async (_req, res) => {
  const totalSize = await FileModel.aggregate([{ $group: { _id: null, total: { $sum: "$size" } } }]);
  res.json({ totalBytes: totalSize[0]?.total || 0 });
});

adminRouter.delete("/files/:id", async (req, res) => {
  await FileModel.deleteOne({ _id: req.params.id });
  res.json({ ok: true });
});
