import express from "express";
import dotenv from "dotenv";
import { readdirSync } from "fs";
import cors from "cors";
import mongoose from "mongoose";
import { createRedisClient } from "../redisClient/redisClient.js";
import cookieParser from "cookie-parser";
import serverless from "serverless-http";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);


let isConnected = false;
async function connectToDB() {
  if (!isConnected) {
    await mongoose.connect(process.env.MONGO_URL);
    isConnected = true;
    console.log("Connected to MongoDB");
  }
}
let redisClient;
async function getRedisClient() {
  if (!redisClient) {
    redisClient = await createRedisClient();
    await redisClient.connect();
    console.log("Connected to Redis");
  }
  return redisClient;
}


for (const file of readdirSync(path.join(__dirname, "../routes"))) {
  const routeModule = await import(`../routes/${file}`);
  app.use("/api", routeModule.default);
}

app.get("/", async (req, res) => {
  await connectToDB();
  await getRedisClient();
  return res.send("Hello from Local or Vercel!");
});


if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, async () => {
    await connectToDB();
    await getRedisClient();
    console.log(`Local server running on http://localhost:${PORT}`);
  });
}

export default serverless(app);
