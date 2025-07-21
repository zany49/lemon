import { createClient } from "redis";

let client;
export async function createRedisClient() {
  if (client && client.isOpen) return client;

  if (!client) {
    client = createClient({
      username: "default",
      password: process.env.REDISCLOUDPASS,
      socket: {
        host: process.env.REDISCLOUDCLIENTHOST,
        port: Number(process.env.REDISCLOUDCLIENTPORT),
      },
    });

    client.on("error", (err) => console.error("Redis error", err));
  }
  return client;
}

