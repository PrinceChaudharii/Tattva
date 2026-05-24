import { auth } from "next-auth";
import type { User, UserRole } from "@tattva/shared-types";

// ─── Extended Session User ───────────────────────────────────────────────────

/**
 * Extended user shape attached to the session by our callbacks.
 */
export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  image?: string | null;
}

/**
 * Extended session with our custom user shape.
 */
export interface AuthSession {
  user: SessionUser;
  expires: string;
}

// ─── Server-Side Session Helpers ─────────────────────────────────────────────

/**
 * Get the current server-side session.
 *
 * @returns The session object or null if unauthenticated.
 *
 * @example
 * ```ts
 * import { getServerSession } from "@tattva/auth";
 *
 * export default async function Page() {
 *   const session = await getServerSession();
 *   if (!session) redirect("/auth/signin");
 *   return <p>Welcome, {session.user.name}</p>;
 * }
 * ```
 */
export async function getServerSession(): Promise<AuthSession | null> {
  const session = await auth();

  if (!session?.user) {
    return null;
  }

  return {
    user: {
      id: session.user.id,
      email: session.user.email ?? "",
      name: session.user.name ?? "",
      role: (session.user as Record<string, unknown>)["role"] as UserRole,
      image: session.user.image,
    },
    expires: session.expires,
  };
}

/**
 * Get the currently authenticated user, or null.
 *
 * @example
 * ```ts
 * import { getCurrentUser } from "@tattva/auth";
 *
 * const user = await getCurrentUser();
 * if (user?.role === "admin") { /* admin logic */ }
 * ```
 */
export async function getCurrentUser(): Promise<SessionUser | null> {
  const session = await getServerSession();
  return session?.user ?? null;
}

/**
 * Require authentication — throws if no session exists.
 *
 * @returns The authenticated user
 * @throws {Error} If no session exists
 *
 * @example
 * ```ts
 * import { requireAuth } from "@tattva/auth";
 *
 * export async function GET() {
 *   const user = await requireAuth();
 *   return Response.json({ userId: user.id });
 * }
 * ```
 */
export async function requireAuth(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Authentication required");
  }
  return user;
}

/**
 * Require a specific role — throws if the user doesn't have it.
 *
 * @param role - The required role
 * @returns The authenticated user with the required role
 * @throws {Error} If no session or insufficient permissions
 */
export async function requireRole(role: UserRole): Promise<SessionUser> {
  const user = await requireAuth();
  if (user.role !== role && user.role !== "admin") {
    throw new Error(`Role "${role}" required`);
  }
  return user;
}
