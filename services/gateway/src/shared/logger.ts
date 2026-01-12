import pino from "pino";
import dotenv from "dotenv";

dotenv.config();

const isDev = process.env.NODE_ENV === "development";

/**
 * Centralized Logger Instance
 * * Why Pino?
 * 1. Speed: It is significantly faster than Winston/Morgan.
 * 2. JSON-First: In production, logs are JSON for easy parsing by Datadog/CloudWatch.
 * 3. Thread-Safe: Works well in Node's async environment.
 */
export const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  transport: isDev
    ? {
        target: "pino-pretty", // 🎨 Pretty colors for local dev
        options: {
          colorize: true,
          translateTime: "SYS:standard",
          ignore: "pid,hostname", // Reduce noise locally
        },
      }
    : undefined, // 🏭 Production uses standard JSON (no overhead)
  base: {
    service: "geko-gateway", // Tag all logs with service name
  },
});