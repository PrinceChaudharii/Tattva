// ─── @tattva/auth ────────────────────────────────────────────────────────────
// Barrel export for authentication configuration, session helpers, and providers

// Configuration
export { createAuthConfig, authHandler } from "./config.js";
export type { AuthConfig } from "./config.js";

// Session helpers
export {
  getServerSession,
  getCurrentUser,
  requireAuth,
  requireRole,
} from "./session.js";
export type { SessionUser, AuthSession } from "./session.js";

// Providers
export {
  githubProvider,
  googleProvider,
  credentialsProvider,
  getProviders,
} from "./providers/index.js";
