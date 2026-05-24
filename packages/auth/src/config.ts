import NextAuth from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { getDb } from "@tattva/database";
import * as schema from "@tattva/database/schema";
import { getProviders } from "./providers/index.js";

/**
 * NextAuth v5 configuration options.
 */
export interface AuthConfig {
  /** Custom base URL for auth endpoints */
  baseUrl?: string;
  /** Custom secret for signing tokens (defaults to NEXTAUTH_SECRET env var) */
  secret?: string;
  /** Whether to enable debug logging */
  debug?: boolean;
}

/**
 * Create the NextAuth configuration.
 *
 * Uses DrizzleAdapter for database-backed sessions and accounts.
 * Configures available OAuth providers based on environment variables.
 */
export function createAuthConfig(config?: AuthConfig) {
  const db = getDb();

  return {
    adapter: DrizzleAdapter(db, {
      usersTable: schema.users,
      accountsTable: schema.accounts,
      sessionsTable: schema.sessions,
      verificationTokensTable: schema.verificationTokens,
    }),
    providers: getProviders(),
    secret: config?.secret ?? process.env["NEXTAUTH_SECRET"],
    debug: config?.debug ?? (process.env["NODE_ENV"] === "development"),
    pages: {
      signIn: "/auth/signin",
      signOut: "/auth/signout",
      error: "/auth/error",
      verifyRequest: "/auth/verify",
      newUser: "/auth/onboarding",
    },
    session: {
      strategy: "jwt" as const,
      maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    callbacks: {
      async session({ session, token }) {
        if (session.user && token.sub) {
          session.user.id = token.sub;
          session.user.role = token.role as string;
        }
        return session;
      },
      async jwt({ token, user }) {
        if (user) {
          token.role = (user as Record<string, unknown>)["role"] as string;
        }
        return token;
      },
    },
  } as const;
}

/**
 * The main NextAuth handler — export this from your app's auth route.
 *
 * @example
 * ```ts
 * // app/api/auth/[...nextauth]/route.ts
 * import { authHandler } from "@tattva/auth";
 * export { authHandler as GET, authHandler as POST };
 * ```
 */
export const authHandler = NextAuth(createAuthConfig());
