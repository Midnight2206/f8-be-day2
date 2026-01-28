import { redis } from "./redis.js";
import crypto from "crypto";

const QUEUE_KEY = "jobs:queue";

export async function enqueue(type, payload, options = {}) {
  const job = {
    id: crypto.randomUUID(),
    type,
    payload,
    attempts: 0,
    maxAttempts: options.maxAttempts ?? 3,
    createdAt: Date.now(),
  };

  await redis.rpush(QUEUE_KEY, JSON.stringify(job));
}

export async function dequeue() {
  const result = await redis.brpop(QUEUE_KEY, 0);
  if (!result) return null;

  const [, data] = result;
  return JSON.parse(data);
}
