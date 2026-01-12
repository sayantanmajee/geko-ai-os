import { relations } from 'drizzle-orm';
import { pgTable, uuid, varchar, text, boolean, timestamp, pgEnum, decimal, primaryKey } from 'drizzle-orm/pg-core';

// Match the ENUM in init.sql
export const authProviderEnum = pgEnum('auth_provider_enum', ['EMAIL', 'GOOGLE', 'GITHUB']);
export const workspaceRoleEnum = pgEnum('workspace_role_enum', ['OWNER', 'ADMIN', 'MEMBER', 'VIEWER']);

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  
  // Nullable because OAuth users might not have a password
  passwordHash: varchar('password_hash', { length: 255 }), 
  
  fullName: varchar('full_name', { length: 100 }).notNull(),
  avatarUrl: text('avatar_url'),
  
  // 🔮 OAUTH PREP: Tracks which provider created this user
  authProvider: authProviderEnum('auth_provider').default('EMAIL').notNull(),
  providerId: varchar('provider_id', { length: 255 }),

  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

// Tables
export const workspaces = pgTable('workspaces', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  type: varchar('type', { length: 50 }).default('PERSONAL'),
  creditBalance: decimal('credit_balance', { precision: 10, scale: 4 }).default('0'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const workspaceMembers = pgTable('workspace_members', {
  workspaceId: uuid('workspace_id').references(() => workspaces.id, { onDelete: 'cascade' }).notNull(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  role: workspaceRoleEnum('role').default('MEMBER').notNull(),
  joinedAt: timestamp('joined_at', { withTimezone: true }).defaultNow(),
}, (t) => ({
  pk: primaryKey({ columns: [t.workspaceId, t.userId] }), // Composite Primary Key
}));

export const librechatIdentities = pgTable('librechat_identities', {
  workspaceId: uuid('workspace_id').references(() => workspaces.id, { onDelete: 'cascade' }).primaryKey(),
  virtualUserId: varchar('virtual_user_id', { length: 255 }).notNull().unique(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// Relationships (Optional, but helps Drizzle query builder)
export const workspaceRelations = relations(workspaces, ({ many }) => ({
  members: many(workspaceMembers),
}));

export const memberRelations = relations(workspaceMembers, ({ one }) => ({
  workspace: one(workspaces, {
    fields: [workspaceMembers.workspaceId],
    references: [workspaces.id],
  }),
  user: one(users, {
    fields: [workspaceMembers.userId],
    references: [users.id],
  }),
}));