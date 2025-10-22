import express from "express";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import formRoutes from "./modules/forms/routes";
import userRoutes from "./modules/users/user.routes";
import { errorHandler } from "./middleware/errorHandler";

dotenv.config();

const app = express();
app.use(express.json());
app.use("/forms", formRoutes);
app.use("/users", userRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI as string;

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "clinical-health-intake" });
});

async function start() {
  try {
    if (!MONGO_URI) throw new Error("MONGO_URI not set");
    await mongoose.connect(MONGO_URI);
    console.log(" Mongo connected");
    app.listen(PORT, () => {
      console.log(` API http://localhost:${PORT}`);
      console.log(` Health: http://localhost:${PORT}/health`);
      console.log("Mongo Express: http://localhost:8081");
    });
  } catch (err) {
    console.error("Startup error:", err);
    process.exit(1);
  }
}
start();
