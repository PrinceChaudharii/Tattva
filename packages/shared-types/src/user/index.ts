import { z } from "zod";
import { idSchema, timestampSchema } from "../common/index.js";

// ─── Auth Provider ───────────────────────────────────────────────────────────

export const authProviderSchema = z.enum(["github", "google", "credentials"]);
export type AuthProvider = z.infer<typeof authProviderSchema>;

// ─── User Role ───────────────────────────────────────────────────────────────

export const userRoleSchema = z.enum([
  "admin",
  "moderator",
  "contributor",
  "reviewer",
  "learner",
]);
export type UserRole = z.infer<typeof userRoleSchema>;

// ─── User ────────────────────────────────────────────────────────────────────

export const userSchema = z.object({
  id: idSchema,
  email: z.string().email(),
  name: z.string().min(1).max(255),
  role: userRoleSchema,
  avatarUrl: z.string().url().optional(),
  bio: z.string().max(1000).optional(),
  locale: z.string().default("en"),
  authProvider: authProviderSchema.optional(),
  authProviderId: z.string().optional(),
  emailVerified: z.boolean().default(false),
  isActive: z.boolean().default(true),
  lastLoginAt: z.date().optional(),
  ...timestampSchema.shape,
});

export type User = z.infer<typeof userSchema>;

// ─── User Profile (public) ───────────────────────────────────────────────────

export const userProfileSchema = z.object({
  id: idSchema,
  name: z.string(),
  avatarUrl: z.string().url().optional(),
  bio: z.string().optional(),
  role: userRoleSchema,
  createdAt: z.date(),
});

export type UserProfile = z.infer<typeof userProfileSchema>;

// ─── Create User ─────────────────────────────────────────────────────────────

export const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(255),
  role: userRoleSchema.default("learner"),
  avatarUrl: z.string().url().optional(),
  authProvider: authProviderSchema.optional(),
  authProviderId: z.string().optional(),
});

export type CreateUser = z.infer<typeof createUserSchema>;

// ─── Update User ─────────────────────────────────────────────────────────────

export const updateUserSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  avatarUrl: z.string().url().optional(),
  bio: z.string().max(1000).optional(),
  locale: z.string().optional(),
  role: userRoleSchema.optional(),
});

export type UpdateUser = z.infer<typeof updateUserSchema>;

// ─── Session ─────────────────────────────────────────────────────────────────

export const sessionSchema = z.object({
  id: idSchema,
  userId: idSchema,
  expiresAt: z.date(),
  ...timestampSchema.shape,
});

export type Session = z.infer<typeof sessionSchema>;

// ─── Account ─────────────────────────────────────────────────────────────────

export const accountSchema = z.object({
  id: idSchema,
  userId: idSchema,
  provider: authProviderSchema,
  providerAccountId: z.string(),
  accessToken: z.string().optional(),
  refreshToken: z.string().optional(),
  ...timestampSchema.shape,
});

export type Account = z.infer<typeof accountSchema>;

// ─── Role Permissions ────────────────────────────────────────────────────────

export const ROLE_PERMISSIONS: Record<UserRole, readonly string[]> = {
  admin: [
    "content:create",
    "content:edit",
    "content:delete",
    "content:publish",
    "content:review",
    "user:manage",
    "contribution:manage",
    "analytics:view",
    "system:config",
  ] as const,
  moderator: [
    "content:edit",
    "content:review",
    "contribution:manage",
    "analytics:view",
  ] as const,
  contributor: [
    "content:create",
    "content:edit",
    "contribution:create",
  ] as const,
  reviewer: [
    "content:review",
    "contribution:review",
  ] as const,
  learner: [
    "content:view",
    "progress:track",
  ] as const,
} as const;

export function hasPermission(role: UserRole, permission: string): boolean {
  return ROLE_PERMISSIONS[role].includes(permission as never);
}
