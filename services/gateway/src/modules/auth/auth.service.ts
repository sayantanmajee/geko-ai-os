import { db } from '../../config/db';
import { users } from '../../config/schema';
import { eq } from 'drizzle-orm';
import type { RegisterRequest } from '@geko/types';
import { logger } from '../../shared/logger';

export class AuthService {
  /**
   * Register a Standard Email/Password User
   */
  static async register(data: RegisterRequest) {
    logger.info({ email: data.email }, "Attempting user registration");

    // 1. Check Duplicates
    const existing = await db.select().from(users).where(eq(users.email, data.email));
    
    if (existing.length > 0) {
        // 🔮 FUTURE: If existing user is 'GOOGLE', prompt them to login via Google instead
      if (existing[0].authProvider !== 'EMAIL') {
        throw new Error(`This email is linked to ${existing[0].authProvider}. Please login with that provider.`);
      }
      logger.warn({ email: data.email }, "Registration failed: User already exists");
      throw new Error('User already exists');
    }

    // 2. Hash Password (Placeholder - add bcrypt later)
    const passwordHash = `hashed_${data.password}`; 

    // 3. Create User
    const [newUser] = await db.insert(users).values({
      email: data.email,
      fullName: data.fullName,
      passwordHash: passwordHash,
      authProvider: 'EMAIL',  // Explicitly set provider
    }).returning();

    logger.info({ userId: newUser.id }, "User registered successfully");
    return newUser;
  }

  /**
   * 🔮 PLACEHOLDER: OAuth Login Flow
   * When we implement this in Phase 4, we will:
   * 1. Verify token with Google (using Axios)
   * 2. Find or Create user in DB with authProvider='GOOGLE'
   */
  static async loginWithGoogle(idToken: string) {
    // const googleProfile = await httpClient.get(...)
    // const user = await db.insert(...).values({ authProvider: 'GOOGLE' })
    throw new Error("Social Login coming in Phase 4");
  }
}