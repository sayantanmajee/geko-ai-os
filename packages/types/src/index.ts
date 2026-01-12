import { z } from "zod";

// --- ENUMS ---
export const UserRoleEnum = z.enum(["USER", "ADMIN"]);
export const WorkspaceRoleEnum = z.enum(["OWNER", "ADMIN", "MEMBER", "VIEWER"]);
export const WorkspaceTypeEnum = z.enum(["PERSONAL", "TEAM"]);
export const PlanTypeEnum = z.enum(["FREE", "PRO", "ENTERPRISE"]);

// --- USER ---
/**
 * 2. User Entity Schema
 * Represents the shape of a user in our database and frontend.
 */
export const UserSchema = z.object({
  id: z.string().uuid(),         // UUID v4
  email: z.string().email(),     // Must be valid email
  fullName: z.string().min(1),   // Cannot be empty
  avatarUrl: z.string().optional(),
  role: UserRoleEnum.default("USER"),
  createdAt: z.date(),
  updatedAt: z.date()
});

export type User = z.infer<typeof UserSchema>;

// --- WORKSPACE ---
export const WorkspaceSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  type: WorkspaceTypeEnum,
  ownerId: z.string().uuid(),
  plan: PlanTypeEnum,
  creditBalance: z.number().default(0), // For Billing
  createdAt: z.date(),
});

export type Workspace = z.infer<typeof WorkspaceSchema>;


// --- API CONTRACTS ---

/**
 * 3. Login Request Schema
 * Validates incoming login data at the API Gateway.
 */
export const LoginRequestSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 chars")
});

export type LoginRequest = z.infer<typeof LoginRequestSchema>;

/**
 * 4. Register Request Schema
 */
export const RegisterRequestSchema = LoginRequestSchema.extend({
  fullName: z.string().min(2, "Name too short")
});

export type RegisterRequest = z.infer<typeof RegisterRequestSchema>;

// --- API RESPONSES ---
/**
 * 5. Generic API Response Wrapper
 * Ensures every API endpoint returns the exact same JSON structure.
 * { success: true, data: { ... }, error: null }
 */
export const ApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    data: dataSchema.optional(),
    error: z.string().optional(),
  });