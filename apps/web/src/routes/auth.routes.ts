import { Router } from "express";
import { z } from "zod";
import jwt from "jsonwebtoken";
import argon2 from "argon2";
import { UserModel } from "../models/User.js";

export const authRouter = Router();

authRouter.post("/signup", async (req, res) => {
  const schema = z.object({ email: z.string().email(), password: z.string().min(8), name: z.string().min(1) });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error);

  const existing = await UserModel.findOne({ email: parsed.data.email });
  if (existing) return res.status(409).json({ error: "Email already used" });

  const hash = await argon2.hash(parsed.data.password);
  const user = await UserModel.create({ email: parsed.data.email, passwordHash: hash, name: parsed.data.name });
  const token = jwt.sign({ _id: user._id.toString(), role: user.role }, process.env.JWT_SECRET!, { expiresIn: "7d" });
  res.json({ token, user: { _id: user._id, email: user.email, name: user.name, role: user.role } });
});

authRouter.post("/login", async (req, res) => {
  const schema = z.object({ email: z.string().email(), password: z.string().min(8) });
  const { success, data } = schema.safeParse(req.body);
  if (!success) return res.status(400).json({ error: "Invalid credentials" });

  const user = await UserModel.findOne({ email: data.email, active: true });
  if (!user) return res.status(404).json({ error: "User not found" });

  const ok = await argon2.verify(user.passwordHash, data.password);
  if (!ok) return res.status(401).json({ error: "Wrong password" });

  const token = jwt.sign({ _id: user._id.toString(), role: user.role }, process.env.JWT_SECRET!, { expiresIn: "7d" });
  res.json({ token, user: { _id: user._id, email: user.email, name: user.name, role: user.role } });
});

authRouter.post("/forgot", async (req, res) => {
  const { email } = req.body;
  // For demo: respond ok. In prod, send email with token.
  res.json({ ok: true, message: "Reset link sent if account exists." });
});
