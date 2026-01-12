import { db } from '../../config/db';
import { workspaces, workspaceMembers, librechatIdentities } from '../../config/schema';
import { eq, and } from 'drizzle-orm';
import type { CreateWorkspaceRequest } from '@geko/types';
import { logger } from '../../shared/logger';

export class WorkspaceService {

  /**
   * Create a Workspace (Transactional)
   * 1. Create Workspace
   * 2. Add Creator as OWNER
   * 3. Generate LibreChat Identity (Virtual User)
   */
  static async create(userId: string, data: CreateWorkspaceRequest) {
    logger.info({ userId, name: data.name }, "Creating new workspace");

    return await db.transaction(async (tx) => {
      // 1. Insert Workspace
      const [newWs] = await tx.insert(workspaces).values({
        name: data.name,
        type: data.type,
      }).returning();

      // 2. Add Member (Owner)
      await tx.insert(workspaceMembers).values({
        workspaceId: newWs.id,
        userId: userId,
        role: 'OWNER'
      });

      // 3. Create LibreChat Identity Map
      // Format: ws_<uuid> -> This is the ID LibreChat sees
      const virtualId = `ws_${newWs.id}`;
      await tx.insert(librechatIdentities).values({
        workspaceId: newWs.id,
        virtualUserId: virtualId
      });

      logger.info({ workspaceId: newWs.id }, "Workspace created successfully");
      return newWs;
    });
  }

  /**
   * Get all workspaces for a user
   */
  static async getUserWorkspaces(userId: string) {
    // Join workspaces table with members table
    const result = await db.select({
      id: workspaces.id,
      name: workspaces.name,
      type: workspaces.type,
      role: workspaceMembers.role, // We want to know MY role in the workspace
      creditBalance: workspaces.creditBalance
    })
    .from(workspaceMembers)
    .innerJoin(workspaces, eq(workspaceMembers.workspaceId, workspaces.id))
    .where(eq(workspaceMembers.userId, userId));

    return result;
  }

  /**
   * Verify Permission (RBAC Check)
   * Used by Middleware
   */
  static async checkPermission(userId: string, workspaceId: string) {
    const member = await db.select()
      .from(workspaceMembers)
      .where(and(
        eq(workspaceMembers.userId, userId),
        eq(workspaceMembers.workspaceId, workspaceId)
      ));
    
    return member[0] || null; // Returns { role: 'OWNER' } or null
  }
}