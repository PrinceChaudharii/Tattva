import { z } from "zod";
import type { AnalyticsEvent, AnalyticsProvider } from "../providers/index.js";
import {
  getAllProviders,
  NoOpAnalyticsProvider,
  registerProvider,
} from "../providers/index.js";

// ─── Predefined Event Names ──────────────────────────────────────────────────

export const EventName = {
  // Page & Navigation
  PAGE_VIEW: "page_view",
  PAGE_LEAVE: "page_leave",

  // Content
  LESSON_VIEW: "lesson_view",
  LESSON_COMPLETE: "lesson_complete",
  CHAPTER_START: "chapter_start",
  CHAPTER_COMPLETE: "chapter_complete",

  // Exercises
  EXERCISE_ATTEMPT: "exercise_attempt",
  EXERCISE_CORRECT: "exercise_correct",
  EXERCISE_INCORRECT: "exercise_incorrect",
  EXERCISE_HINT_USED: "exercise_hint_used",

  // Search
  SEARCH_QUERY: "search_query",
  SEARCH_RESULT_CLICK: "search_result_click",

  // User
  USER_SIGNUP: "user_signup",
  USER_SIGNIN: "user_signin",
  USER_SIGNOUT: "user_signout",
  USER_PROFILE_UPDATE: "user_profile_update",

  // Contribution
  CONTRIBUTION_CREATE: "contribution_create",
  CONTRIBUTION_SUBMIT: "contribution_submit",
  CONTRIBUTION_REVIEW: "contribution_review",

  // Errors
  ERROR_RUNTIME: "error_runtime",
  ERROR_API: "error_api",
} as const;

export type EventNameType = (typeof EventName)[keyof typeof EventName];

// ─── Tracker Options ─────────────────────────────────────────────────────────

export interface TrackerOptions {
  /** Whether tracking is enabled (default: true in production) */
  enabled?: boolean;
  /** Batch size for buffered events */
  batchSize?: number;
  /** Flush interval in ms */
  flushInterval?: number;
  /** Default user ID */
  defaultUserId?: string;
  /** Default anonymous ID */
  defaultAnonymousId?: string;
  /** Default context */
  defaultContext?: AnalyticsEvent["context"];
}

// ─── Event Tracker ───────────────────────────────────────────────────────────

/**
 * Central event tracking class.
 * Routes events to all registered analytics providers.
 */
export class EventTracker {
  private readonly options: Required<TrackerOptions>;
  private readonly buffer: AnalyticsEvent[] = [];
  private flushTimer: ReturnType<typeof setInterval> | null = null;

  constructor(options?: TrackerOptions) {
    this.options = {
      enabled: options?.enabled ?? (process.env["NODE_ENV"] === "production"),
      batchSize: options?.batchSize ?? 20,
      flushInterval: options?.flushInterval ?? 5000,
      defaultUserId: options?.defaultUserId ?? "",
      defaultAnonymousId: options?.defaultAnonymousId ?? "",
      defaultContext: options?.defaultContext,
    };

    // Register no-op provider as default
    if (getAllProviders().length === 0) {
      registerProvider(new NoOpAnalyticsProvider());
    }

    // Start flush timer
    if (this.options.enabled) {
      this.flushTimer = setInterval(
        () => void this.flush(),
        this.options.flushInterval
      );
    }
  }

  /**
   * Track a single event.
   */
  async track(
    name: string,
    properties?: Record<string, unknown>,
    options?: { userId?: string; anonymousId?: string }
  ): Promise<void> {
    if (!this.options.enabled) return;

    const event: AnalyticsEvent = {
      name,
      timestamp: new Date(),
      userId: options?.userId ?? this.options.defaultUserId || undefined,
      anonymousId: options?.anonymousId ?? this.options.defaultAnonymousId || undefined,
      properties: properties ?? {},
      context: this.options.defaultContext,
    };

    this.buffer.push(event);

    if (this.buffer.length >= this.options.batchSize) {
      await this.flush();
    }
  }

  /**
   * Track a page view event.
   */
  async trackPageView(page: string, properties?: Record<string, unknown>): Promise<void> {
    await this.track(EventName.PAGE_VIEW, { page, ...properties });
  }

  /**
   * Track a lesson view event.
   */
  async trackLessonView(
    lessonId: string,
    properties?: { subjectId?: string; chapterId?: string; duration?: number }
  ): Promise<void> {
    await this.track(EventName.LESSON_VIEW, { lessonId, ...properties });
  }

  /**
   * Track an exercise attempt event.
   */
  async trackExerciseAttempt(
    exerciseId: string,
    correct: boolean,
    properties?: { timeSpent?: number; attempts?: number }
  ): Promise<void> {
    await this.track(
      correct ? EventName.EXERCISE_CORRECT : EventName.EXERCISE_INCORRECT,
      { exerciseId, ...properties }
    );
  }

  /**
   * Flush buffered events to all providers.
   */
  async flush(): Promise<void> {
    if (this.buffer.length === 0) return;

    const events = [...this.buffer];
    this.buffer.length = 0;

    const providers = getAllProviders();
    await Promise.all(
      providers.map((provider) => provider.trackBatch(events))
    );
  }

  /**
   * Shut down the tracker and flush remaining events.
   */
  async shutdown(): Promise<void> {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = null;
    }

    await this.flush();

    const providers = getAllProviders();
    await Promise.all(providers.map((provider) => provider.shutdown()));
  }
}

// ─── Singleton Instance ──────────────────────────────────────────────────────

let _tracker: EventTracker | null = null;

/**
 * Get the global event tracker instance.
 */
export function getTracker(options?: TrackerOptions): EventTracker {
  if (!_tracker) {
    _tracker = new EventTracker(options);
  }
  return _tracker;
}

/**
 * Reset the global tracker (useful for testing).
 */
export function resetTracker(): void {
  if (_tracker) {
    void _tracker.shutdown();
    _tracker = null;
  }
}
