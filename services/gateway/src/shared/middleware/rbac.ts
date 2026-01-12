import type { Request, Response, NextFunction } from 'express';
import { WorkspaceService } from '../../modules/workspace/workspace.service';
import { logger } from '../logger';

// Extend Express Request to include User Info (populated by Auth middleware later)
// For now, we assume req.headers['x-user-id'] is populated (Mock Auth)
// In Phase 4, we replace this with real JWT decoding.

export const rbacMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  // 1. Identify User (TODO: Replace with JWT)
  const userId = req.headers['x-user-id'] as string;

  // 2. Identify Target Workspace
  // Could be in Body (POST) or Params (GET /workspaces/:id) or Header
  const workspaceId = req.params.workspaceId || req.body.workspaceId || req.headers['x-workspace-id'];

  if (!userId) {
    return res.status(401).json({ success: false, error: "Unauthorized: No User ID" });
  }

  if (!workspaceId) {
    // If no specific workspace is requested, proceed (e.g., "List My Workspaces")
    return next();
  }

  try {
    // 3. Check DB
    const membership = await WorkspaceService.checkPermission(userId, workspaceId as string);

    if (!membership) {
      logger.warn({ userId, workspaceId }, "RBAC Denied: Not a member");
      return res.status(403).json({ success: false, error: "Access Denied" });
    }

    // 4. Attach Context for Controllers
    // This allows the Controller to know "User is ADMIN in this workspace"
    (req as any).workspaceRole = membership.role;
    next();

  } catch (error) {
    logger.error({ err: error }, "RBAC Check Failed");
    res.status(500).json({ success: false, error: "Internal RBAC Error" });
  }
};