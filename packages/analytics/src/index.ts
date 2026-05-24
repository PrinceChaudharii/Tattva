// ─── @tattva/analytics ───────────────────────────────────────────────────────
// Barrel export for analytics providers and event tracking

// Providers
export {
  analyticsEventSchema,
  NoOpAnalyticsProvider,
  registerProvider,
  getProvider,
  getAllProviders,
} from "./providers/index.js";
export type {
  AnalyticsEvent,
  AnalyticsProvider,
  AnalyticsProviderConfig,
} from "./providers/index.js";

// Tracking
export {
  EventName,
  EventTracker,
  getTracker,
  resetTracker,
} from "./tracking/index.js";
export type {
  EventNameType,
  TrackerOptions,
} from "./tracking/index.js";
