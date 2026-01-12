import { pgTable, uuid, varchar, text, boolean, timestamp, pgEnum } from 'drizzle-orm/pg-core';

// Match the ENUM in init.sql
export const authProviderEnum = pgEnum('auth_provider_enum', ['EMAIL', 'GOOGLE', 'GITHUB']);

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