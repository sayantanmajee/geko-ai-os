import express from "express";
import type { Express, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import pinoHttp from "pino-http"; // ✅ Replaces Morgan
import dotenv from "dotenv";

import { AuthController } from "./modules/auth/auth.controller";
import { httpClient } from "./shared/http";
import { logger } from "./shared/logger";

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3002;

// --- 1. Security & Parsing Middlewares ---
app.use(helmet()); 
app.use(cors());
app.use(express.json());

// --- 2. Logging Middleware (Pino) ---
// Automatically logs every request: method, url, status, time
app.use(pinoHttp({ logger }));

// --- 3. Routes: Auth ---
const authRouter = express.Router();
authRouter.post("/register", AuthController.register);
// authRouter.post("/google", AuthController.googleLogin); // 🔮 Future
app.use("/auth", authRouter);

// --- 4. Health Check (Axios Test) ---
app.get("/health", async (req: Request, res: Response) => {
  let internetStatus = "unknown";
  try {
    // Use Shared Axios to ping Google (proof of life for OAuth later)
    await httpClient.head("https://www.google.com");
    internetStatus = "connected";
  } catch (e) {
    internetStatus = "disconnected";
    logger.error("Health check failed to reach internet");
  }

  res.json({ 
    success: true, 
    service: "geko-gateway", 
    status: "healthy",
    internet: internetStatus
  });
});

// --- 5. Global Error Handler ---
app.use((err: any, req: Request, res: Response, next: express.NextFunction) => {
  logger.error({ err }, "Unhandled Exception");
  res.status(500).json({ success: false, error: "Internal Server Error" });
});

// --- Start ---
app.listen(PORT, () => {
  logger.info(`🛡️ GEKO-Gateway running on http://localhost:${PORT}`);
});