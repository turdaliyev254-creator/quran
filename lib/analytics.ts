import { getRedis } from "@/lib/redis";

const DAY_TTL = 60 * 60 * 24 * 40; // 40 kun
const MONTH_TTL = 60 * 60 * 24 * 400; // ~13 oy

function todayKey() {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

function monthKey() {
  return new Date().toISOString().slice(0, 7); // YYYY-MM
}

export async function trackVisit(userId: number | string) {
  const redis = getRedis();
  if (!redis) return;

  const id = String(userId);
  const dailyKey = `analytics:users:daily:${todayKey()}`;
  const monthlyKey = `analytics:users:monthly:${monthKey()}`;

  await Promise.all([
    redis.sadd("analytics:users:all", id),
    redis.sadd(dailyKey, id).then(() => redis.expire(dailyKey, DAY_TTL)),
    redis.sadd(monthlyKey, id).then(() => redis.expire(monthlyKey, MONTH_TTL)),
  ]);
}

export interface AnalyticsStats {
  connected: boolean;
  totalUsers: number;
  dailyActive: number;
  monthlyActive: number;
}

export async function getStats(): Promise<AnalyticsStats> {
  const redis = getRedis();
  if (!redis) {
    return { connected: false, totalUsers: 0, dailyActive: 0, monthlyActive: 0 };
  }

  const [totalUsers, dailyActive, monthlyActive] = await Promise.all([
    redis.scard("analytics:users:all"),
    redis.scard(`analytics:users:daily:${todayKey()}`),
    redis.scard(`analytics:users:monthly:${monthKey()}`),
  ]);

  return { connected: true, totalUsers, dailyActive, monthlyActive };
}
