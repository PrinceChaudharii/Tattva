import { z } from "zod";

const envSchema = z.object({
  /** PostgreSQL connection string */
  DATABASE_URL: z.string().url(),

  /** NextAuth.js secret for signing/encryption */
  NEXTAUTH_SECRET: z.string().min(1),

  /** NextAuth.js canonical URL */
  NEXTAUTH_URL: z.string().url(),

  /** Node environment */
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
});

export type Env = z.infer<typeof envSchema>;

/**
 * Parse and validate environment variables at startup.
 * Throws at import-time if any required variable is missing or malformed.
 */
function validateEnv(): Env {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    const formatted = result.error.flatten().fieldErrors;
    const messages = Object.entries(formatted)
      .map(([key, errors]) => `  ${key}: ${errors?.join(", ")}`)
      .join("\n");

    throw new Error(
      `❌ Invalid environment variables:\n${messages}\n\nPlease check your .env.local file.`,
    );
  }

  return result.data;
}

export const env = validateEnv();
