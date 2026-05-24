import { z } from "zod";

// ─── Analytics Event ─────────────────────────────────────────────────────────

export const analyticsEventSchema = z.object({
  /** Event name (e.g., "page_view", "lesson_complete") */
  name: z.string().min(1),
  /** Event timestamp */
  timestamp: z.date().default(() => new Date()),
  /** User ID (if authenticated) */
  userId: z.string().optional(),
  /** Anonymous session identifier */
  anonymousId: z.string().optional(),
  /** Event properties */
  properties: z.record(z.unknown()).default({}),
  /** User traits at time of event */
  traits: z.record(z.unknown()).optional(),
  /** Client context */
  context: z.object({
    /** Page URL */
    page: z.string().optional(),
    /** Referrer URL */
    referrer: z.string().optional(),
    /** User agent */
    userAgent: z.string().optional(),
    /** IP address */
    ip: z.string().optional(),
    /** Locale */
    locale: z.string().optional(),
  }).optional(),
});

export type AnalyticsEvent = z.infer<typeof analyticsEventSchema>;

// ─── Analytics Provider Interface ────────────────────────────────────────────

/**
 * Abstract analytics provider interface.
 * Implementations can target different backends (PostHog, Mixpanel, Plausible, etc.)
 */
export interface AnalyticsProvider {
  /** Provider name */
  readonly name: string;

  /** Track a single event */
  track(event: AnalyticsEvent): Promise<void>;

  /** Track multiple events in batch */
  trackBatch(events: readonly AnalyticsEvent[]): Promise<void>;

  /** Identify a user with traits */
  identify(userId: string, traits: Record<string, unknown>): Promise<void>;

  /** Associate an anonymous ID with a known user */
  alias(userId: string, anonymousId: string): Promise<void>;

  /** Update user traits */
  setUserTraits(userId: string, traits: Record<string, unknown>): Promise<void>;

  /** Flush buffered events */
  flush(): Promise<void>;

  /** Shut down the provider */
  shutdown(): Promise<void>;
}

// ─── Provider Configuration ──────────────────────────────────────────────────

export interface AnalyticsProviderConfig {
  /** Provider type identifier */
  type: string;
  /** Whether the provider is enabled */
  enabled: boolean;
  /** Provider-specific configuration */
  options: Record<string, unknown>;
}

// ─── No-Op Provider (Default) ────────────────────────────────────────────────

/**
 * A no-op analytics provider that discards all events.
 * Useful for development or as a fallback.
 */
export class NoOpAnalyticsProvider implements AnalyticsProvider {
  readonly name = "noop";

  async track(_event: AnalyticsEvent): Promise<void> {
    // Discard event
  }

  async trackBatch(_events: readonly AnalyticsEvent[]): Promise<void> {
    // Discard events
  }

  async identify(_userId: string, _traits: Record<string, unknown>): Promise<void> {
    // No-op
  }

  async alias(_userId: string, _anonymousId: string): Promise<void> {
    // No-op
  }

  async setUserTraits(_userId: string, _traits: Record<string, unknown>): Promise<void> {
    // No-op
  }

  async flush(): Promise<void> {
    // No-op
  }

  async shutdown(): Promise<void> {
    // No-op
  }
}

// ─── Provider Registry ───────────────────────────────────────────────────────

const providerRegistry = new Map<string, AnalyticsProvider>();

/**
 * Register an analytics provider.
 */
export function registerProvider(provider: AnalyticsProvider): void {
  providerRegistry.set(provider.name, provider);
}

/**
 * Get a registered analytics provider by name.
 */
export function getProvider(name: string): AnalyticsProvider | undefined {
  return providerRegistry.get(name);
}

/**
 * Get all registered providers.
 */
export function getAllProviders(): readonly AnalyticsProvider[] {
  return Array.from(providerRegistry.values());
}
