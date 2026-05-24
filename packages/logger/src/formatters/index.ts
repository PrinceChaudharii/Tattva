// ─── Log Entry ───────────────────────────────────────────────────────────────

export interface LogEntry {
  /** ISO 8601 timestamp */
  readonly timestamp: string;
  /** Log level */
  readonly level: LogLevel;
  /** Log message */
  readonly message: string;
  /** Structured data attached to the log */
  readonly data?: Record<string, unknown>;
  /** Error object if applicable */
  readonly error?: Error;
  /** Source context (module, function, etc.) */
  readonly context?: string;
  /** Trace/request ID for correlation */
  readonly traceId?: string;
  /** Span ID for distributed tracing */
  readonly spanId?: string;
}

// ─── Log Level ───────────────────────────────────────────────────────────────

export type LogLevel = "trace" | "debug" | "info" | "warn" | "error" | "fatal";

export const LOG_LEVELS: Record<LogLevel, number> = {
  trace: 0,
  debug: 1,
  info: 2,
  warn: 3,
  error: 4,
  fatal: 5,
} as const;

export function logLevelValue(level: LogLevel): number {
  return LOG_LEVELS[level];
}

// ─── Formatter Interface ─────────────────────────────────────────────────────

/**
 * Log formatter — transforms a LogEntry into a string for output.
 */
export interface LogFormatter {
  /** Format a log entry for output */
  format(entry: LogEntry): string;
}

// ─── JSON Formatter ──────────────────────────────────────────────────────────

/**
 * Format log entries as structured JSON.
 * Ideal for production log aggregation (CloudWatch, Datadog, etc.)
 */
export class JsonFormatter implements LogFormatter {
  format(entry: LogEntry): string {
    const output: Record<string, unknown> = {
      timestamp: entry.timestamp,
      level: entry.level,
      message: entry.message,
    };

    if (entry.context) {
      output["context"] = entry.context;
    }

    if (entry.data) {
      output["data"] = entry.data;
    }

    if (entry.error) {
      output["error"] = {
        name: entry.error.name,
        message: entry.error.message,
        stack: entry.error.stack,
      };
    }

    if (entry.traceId) {
      output["traceId"] = entry.traceId;
    }

    if (entry.spanId) {
      output["spanId"] = entry.spanId;
    }

    return JSON.stringify(output);
  }
}

// ─── Pretty Formatter ────────────────────────────────────────────────────────

const LEVEL_COLORS: Record<LogLevel, string> = {
  trace: "\x1b[90m",   // gray
  debug: "\x1b[36m",   // cyan
  info: "\x1b[32m",    // green
  warn: "\x1b[33m",    // yellow
  error: "\x1b[31m",   // red
  fatal: "\x1b[35m",   // magenta
} as const;

const RESET = "\x1b[0m";

/**
 * Format log entries as human-readable colored output.
 * Ideal for local development.
 */
export class PrettyFormatter implements LogFormatter {
  format(entry: LogEntry): string {
    const color = LEVEL_COLORS[entry.level];
    const levelStr = `${color}${entry.level.toUpperCase().padEnd(5)}${RESET}`;
    const timeStr = entry.timestamp.replace("T", " ").replace(/\.\d+Z$/, "");
    const contextStr = entry.context ? ` [${entry.context}]` : "";

    let line = `${timeStr} ${levelStr}${contextStr} ${entry.message}`;

    if (entry.data && Object.keys(entry.data).length > 0) {
      line += ` ${JSON.stringify(entry.data)}`;
    }

    if (entry.error) {
      line += `\n  ${entry.error.name}: ${entry.error.message}`;
      if (entry.error.stack) {
        const stackLines = entry.error.stack.split("\n").slice(1, 4);
        line += `\n${stackLines.map((l) => `  ${l.trim()}`).join("\n")}`;
      }
    }

    if (entry.traceId) {
      line += ` trace=${entry.traceId}`;
    }

    return line;
  }
}

// ─── Formatter Factory ───────────────────────────────────────────────────────

/**
 * Create a log formatter based on the environment or configuration.
 *
 * @param format - "json" or "pretty"
 * @returns LogFormatter instance
 */
export function createFormatter(format: "json" | "pretty" = "json"): LogFormatter {
  switch (format) {
    case "json":
      return new JsonFormatter();
    case "pretty":
      return new PrettyFormatter();
  }
}
