import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import dotenv from 'dotenv';
import { logger } from '../shared/logger';

dotenv.config();

const connectionString = process.env.DATABASE_URL || "postgres://geko_admin:secure_password_123@localhost:5432/geko_identity";

// Disable prefetch for serverless compatibility later, though fine for Docker now
const client = postgres(connectionString, { prepare: false });

export const db = drizzle(client);

logger.info("📦 Database driver initialized");