import { createClient } from "redis";

const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
  throw new Error("REDIS_URL não configurada.");
}

export const redis = createClient({
  url: redisUrl,
});

redis.on("error", (error) => {
  console.error("[REDIS] Erro:", error);
});

export async function connectRedis() {
  if (!redis.isOpen) {
    await redis.connect();

    console.log("[REDIS] Conectado");
  }
}