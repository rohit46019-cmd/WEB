import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { authRouter } from "./routes/auth.routes.js";
import { filesRouter } from "./routes/files.routes.js";
import { foldersRouter } from "./routes/folders.routes.js";
import { notesRouter } from "./routes/notes.routes.js";
import { adminRouter } from "./routes/admin.routes.js";
import { shareRouter } from "./routes/share.routes.js";
import { errorHandler } from "./middleware/error.js";
import { auditMiddleware } from "./middleware/audit.js";

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(helmet());
app.use(compression());
app.use(morgan("dev"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(auditMiddleware);

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/api/auth", authRouter);
app.use("/api/files", filesRouter);
app.use("/api/folders", foldersRouter);
app.use("/api/notes", notesRouter);
app.use("/api/admin", adminRouter);
app.use("/api/share", shareRouter);

app.use(errorHandler);

export default app;
