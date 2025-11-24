import mongoose from "mongoose";

export async function connectDB() {
  mongoose.set("strictQuery", true);
  await mongoose.connect(process.env.MONGO_URI!);
  mongoose.connection.on("connected", () => console.log("MongoDB connected"));
  mongoose.connection.on("error", (err) => console.error("MongoDB error", err));
}
