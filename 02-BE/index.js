import express from "express"
import dotenv from"dotenv";
import  {readdirSync} from "fs";
import cors from 'cors';
import mongoose from 'mongoose';
import { createRedisClient } from "./redisClient/redisClient.js"
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from 'cookie-parser';

const app = express();
app.use(express.json());
dotenv.config();

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:3000", 
    credentials: true,                 
  })
)

mongoose
  .connect(
    process.env.MONGO_URL
  )
  .then(() => console.log("Connected to db"))
  .catch((err) => console.log("DB connection error", err));

app.get("/", async (req, res) => {
  return res.send("Hello");
});
// readdirSync("./routes").map((r) => app.use("/api", import(`./routes/${r}`)));
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

for (const file of readdirSync("./routes")) {
  const routeModule = await import(`./routes/${file}`);
  app.use("/api", routeModule.default);
}

const PORT = process.env.PORT || 4000;


(async () => {
  const redisClient = await createRedisClient();
  redisClient
    .connect()
    .then(() => {
      app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch((e) => {
      console.log("ERROR IN REDIS SERVER", e);
    });
})();
