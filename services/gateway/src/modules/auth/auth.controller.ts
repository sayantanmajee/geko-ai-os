import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterRequestSchema } from '@geko/types';
import { logger } from '../../shared/logger';

export class AuthController {
  
  static async register(req: Request, res: Response) {
    try {
      // 1. Runtime Validation (Zod)
      // If this fails, it throws a nice error automatically
      const body = RegisterRequestSchema.parse(req.body);

      // 2. Business Logic
      const user = await AuthService.register(body);

      // 3. Response
      // We exclude passwordHash from the response for security
      const { passwordHash, ...safeUser } = user;
      
      res.status(201).json({ 
        success: true, 
        data: safeUser 
      });

    } catch (error: any) {
      // Log the full error stack for developers, but send clean msg to user
      logger.error({ err: error }, "Registration Controller Error");
      
      // Send clean error to client
      const message = error instanceof Error ? error.message : "Unknown error";
      const status = message === "User already exists" ? 409 : 400;

      res.status(status).json({ 
        success: false, 
        error: error
      });
    }
  }
}