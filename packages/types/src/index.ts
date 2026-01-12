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
  ownerId: z.string().uuid(),
  name: z.string().min(1),
  type: WorkspaceTypeEnum,
  role: WorkspaceRoleEnum.optional(), // The role of the current user in this workspace
  plan: PlanTypeEnum,
  creditBalance: z.number().optional(), // Only visible to Admins/Owners
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

/**
 * Request to create a new workspace
 */
export const CreateWorkspaceSchema = z.object({
  name: z.string().min(3, "Workspace name must be at least 3 chars"),
  type: WorkspaceTypeEnum.default("TEAM")
});

export type CreateWorkspaceRequest = z.infer<typeof CreateWorkspaceSchema>;

/**
 * Request to add a member (Invite)
 */
export const AddMemberSchema = z.object({
  email: z.string().email(),
  role: WorkspaceRoleEnum
});

export type AddMemberRequest = z.infer<typeof AddMemberSchema>;

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

const value = { "level": 30, "time": 1768234048114, "service": "geko-gateway", "req": { "id": 1, "method": "POST", "url": "/auth/register", "query": {}, "params": {}, "headers": { "content-type": "application/json", "user-agent": "PostmanRuntime/7.51.0", "accept": "*/*", "postman-token": "02b562af-4188-4651-a17f-b5ad856e51ff", "host": "localhost:3002", "accept-encoding": "gzip, deflate, br", "connection": "keep-alive", "content-length": "110" }, "remoteAddress": "::1", "remotePort": 58878 }, "res": { "statusCode": 400, "headers": { "content-security-policy": "default-src 'self';base-uri 'self';font-src 'self' https: data:;form-action 'self';frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src 'self';script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests", "cross-origin-opener-policy": "same-origin", "cross-origin-resource-policy": "same-origin", "origin-agent-cluster": "?1", "referrer-policy": "no-referrer", "strict-transport-security": "max-age=31536000; includeSubDomains", "x-content-type-options": "nosniff", "x-dns-prefetch-control": "off", "x-download-options": "noopen", "x-frame-options": "SAMEORIGIN", "x-permitted-cross-domain-policies": "none", "x-xss-protection": "0", "access-control-allow-origin": "*", "content-type": "application/json; charset=utf-8", "content-length": "272", "etag": "W/\"110-tZDYCc2PDC/6dHC+D9ETyCiAX5A\"" } }, "responseTime": 56, "msg": "request completed" }