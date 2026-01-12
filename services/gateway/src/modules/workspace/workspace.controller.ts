import type { Request, Response } from 'express';
import { WorkspaceService } from './workspace.service';
import { CreateWorkspaceSchema } from '@geko/types';
import { logger } from '../../shared/logger';

export class WorkspaceController {
  
  static async create(req: Request, res: Response) {
    try {
      const userId = req.headers['x-user-id'] as string; // TODO: JWT
      const body = CreateWorkspaceSchema.parse(req.body);

      const workspace = await WorkspaceService.create(userId, body);
      res.status(201).json({ success: true, data: workspace });
    } catch (error: any) {
      logger.error({ err: error }, "Create Workspace Error");
      res.status(400).json({ success: false, error: error.message });
    }
  }

  static async list(req: Request, res: Response) {
    try {
      const userId = req.headers['x-user-id'] as string; // TODO: JWT
      const workspaces = await WorkspaceService.getUserWorkspaces(userId);
      res.json({ success: true, data: workspaces });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}