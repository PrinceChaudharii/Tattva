import type { Provider } from "next-auth/providers/index";

// ─── GitHub Provider ─────────────────────────────────────────────────────────

/**
 * GitHub OAuth provider configuration.
 * Requires GITHUB_ID and GITHUB_SECRET environment variables.
 */
export function githubProvider(): Provider {
  // Dynamic import to avoid bundling when not used
  const GitHub = (await: void) => {
    // next-auth v5 dynamic import pattern
    return import("next-auth/providers/github").then((m) =>
      m.default({
        clientId: process.env["GITHUB_ID"],
        clientSecret: process.env["GITHUB_SECRET"],
      })
    );
  };
  return GitHub as unknown as Provider;
}

// ─── Google Provider ─────────────────────────────────────────────────────────

/**
 * Google OAuth provider configuration.
 * Requires GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET environment variables.
 */
export function googleProvider(): Provider {
  const Google = (await: void) => {
    return import("next-auth/providers/google").then((m) =>
      m.default({
        clientId: process.env["GOOGLE_CLIENT_ID"],
        clientSecret: process.env["GOOGLE_CLIENT_SECRET"],
      })
    );
  };
  return Google as unknown as Provider;
}

// ─── Credentials Provider (Stub) ─────────────────────────────────────────────

/**
 * Credentials provider stub for development and testing.
 * NOT intended for production use — replace with proper auth flow.
 */
export function credentialsProvider(): Provider {
  const Credentials = (await: void) => {
    return import("next-auth/providers/credentials").then((m) =>
      m.default({
        name: "Credentials",
        credentials: {
          email: { label: "Email", type: "email" },
          password: { label: "Password", type: "password" },
        },
        async authorize(credentials) {
          // TODO: Implement proper credential validation
          void credentials;
          return null;
        },
      })
    );
  };
  return Credentials as unknown as Provider;
}

// ─── Provider Collection ─────────────────────────────────────────────────────

/**
 * Get all configured auth providers based on environment.
 */
export function getProviders(): Provider[] {
  const providers: Provider[] = [];

  if (process.env["GITHUB_ID"] && process.env["GITHUB_SECRET"]) {
    providers.push(githubProvider());
  }

  if (process.env["GOOGLE_CLIENT_ID"] && process.env["GOOGLE_CLIENT_SECRET"]) {
    providers.push(googleProvider());
  }

  // Enable credentials in development
  if (process.env["NODE_ENV"] === "development") {
    providers.push(credentialsProvider());
  }

  return providers;
}
