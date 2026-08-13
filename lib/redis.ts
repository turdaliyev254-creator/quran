import { Redis } from "@upstash/redis";

let client: Redis | null | undefined;

/** Returns null when Upstash env vars aren't configured (e.g. local dev without KV set up). */
export function getRedis(): Redis | null {
  if (client !== undefined) return client;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  client = url && token ? new Redis({ url, token }) : null;
  return client;
}
