// ─── @tattva/logger ──────────────────────────────────────────────────────────
// Barrel export for structured logging

import type { LogLevel } from "./formatters/index.js";
import {
  LOG_LEVELS,
  logLevelValue,
  createFormatter,
  type LogEntry,
  type LogFormatter,
} from "./formatters/index.js";
import {
  ConsoleTransport,
  FileTransport,
  createTransport,
  type LogTransport,
  type TransportConfig,
} from "./transports/index.js";

// Re-export formatters
export {
  LOG_LEVELS,
  logLevelValue,
  JsonFormatter,
  PrettyFormatter,
  createFormatter,
} from "./formatters/index.js";
export type { LogLevel, LogEntry, LogFormatter } from "./formatters/index.js";

// Re-export transports
export {
  ConsoleTransport,
  FileTransport,
  createTransport,
} from "./transports/index.js";
export type { LogTransport, TransportConfig } from "./transports/index.js";

// ─── Logger Configuration ────────────────────────────────────────────────────

export interface LoggerConfig {
  /** Minimum log level (default: "info") */
  level?: LogLevel;
  /** Log format: "json" or "pretty" (default: "json" in production, "pretty" in dev) */
  format?: "json" | "pretty";
  /** Default context / module name */
  context?: string;
  /** Transport configurations */
  transports?: TransportConfig[];
  /** Default data to include in every log entry */
  defaults?: Record<string, unknown>;
  /** Trace ID for request correlation */
  traceId?: string;
}

// ─── Logger ──────────────────────────────────────────────────────────────────

/**
 * Structured logger with configurable levels, formatters, and transports.
 *
 * @example
 * ```ts
 * import { createLogger } from "@tattva/logger";
 *
 * const log = createLogger({ context: "api/auth" });
 *
 * log.info("User signed in", { userId: "abc123" });
 * log.error("Database connection failed", new Error("ECONNREFUSED"));
 * ```
 */
export class Logger {
  private readonly level: LogLevel;
  private readonly formatter: LogFormatter;
  private readonly transports: LogTransport[];
  private readonly context: string;
  private readonly defaults: Record<string, unknown>;
  private readonly traceId: string | undefined;

  constructor(config?: LoggerConfig) {
    this.level = config?.level ?? (process.env["NODE_ENV"] === "production" ? "info" : "debug");
    this.formatter = createFormatter(
      config?.format ?? (process.env["NODE_ENV"] === "production" ? "json" : "pretty")
    );
    this.context = config?.context ?? "app";
    this.defaults = config?.defaults ?? {};
    this.traceId = config?.traceId;

    if (config?.transports && config.transports.length > 0) {
      this.transports = config.transports.map(createTransport);
    } else {
      this.transports = [new ConsoleTransport()];
    }
  }

  /**
   * Create a child logger with additional context.
   */
  child(context: string, defaults?: Record<string, unknown>): Logger {
    const isPretty = this.formatter.constructor.name === "PrettyFormatter";
    return new Logger({
      level: this.level,
      format: isPretty ? "pretty" : "json",
      context: `${this.context}:${context}`,
      transports: undefined, // Will use default console
      defaults: { ...this.defaults, ...defaults },
      traceId: this.traceId,
    });
  }

  /**
   * Log at trace level.
   */
  trace(message: string, data?: Record<string, unknown>): void {
    this.log("trace", message, data);
  }

  /**
   * Log at debug level.
   */
  debug(message: string, data?: Record<string, unknown>): void {
    this.log("debug", message, data);
  }

  /**
   * Log at info level.
   */
  info(message: string, data?: Record<string, unknown>): void {
    this.log("info", message, data);
  }

  /**
   * Log at warn level.
   */
  warn(message: string, data?: Record<string, unknown>): void {
    this.log("warn", message, data);
  }

  /**
   * Log at error level.
   */
  error(message: string, errorOrData?: Error | Record<string, unknown>, data?: Record<string, unknown>): void {
    const entry: Partial<LogEntry> = {};

    if (errorOrData instanceof Error) {
      entry.error = errorOrData;
      entry.data = data;
    } else {
      entry.data = errorOrData;
    }

    this.log("error", message, entry.data, entry.error);
  }

  /**
   * Log at fatal level.
   */
  fatal(message: string, errorOrData?: Error | Record<string, unknown>, data?: Record<string, unknown>): void {
    const entry: Partial<LogEntry> = {};

    if (errorOrData instanceof Error) {
      entry.error = errorOrData;
      entry.data = data;
    } else {
      entry.data = errorOrData;
    }

    this.log("fatal", message, entry.data, entry.error);
  }

  private log(
    level: LogLevel,
    message: string,
    data?: Record<string, unknown>,
    error?: Error
  ): void {
    if (logLevelValue(level) < logLevelValue(this.level)) {
      return;
    }

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context: this.context,
      data: { ...this.defaults, ...data },
      error,
      traceId: this.traceId,
    };

    const formatted = this.formatter.format(entry);

    for (const transport of this.transports) {
      const result = transport.write(formatted, entry);
      if (result instanceof Promise) {
        result.catch(() => {
          // Transport write failed, swallow to prevent unhandled rejections
        });
      }
    }
  }

  /**
   * Flush all transports.
   */
  async flush(): Promise<void> {
    await Promise.all(
      this.transports.map(async (transport) => {
        if (transport.flush) {
          await transport.flush();
        }
      })
    );
  }

  /**
   * Close all transports.
   */
  async close(): Promise<void> {
    await this.flush();
    await Promise.all(
      this.transports.map(async (transport) => {
        if (transport.close) {
          await transport.close();
        }
      })
    );
  }
}

// ─── Factory ─────────────────────────────────────────────────────────────────

let _logger: Logger | null = null;

/**
 * Create a new logger instance.
 */
export function createLogger(config?: LoggerConfig): Logger {
  return new Logger(config);
}

/**
 * Get the global logger instance.
 * Creates one with defaults if it doesn't exist.
 */
export function getLogger(): Logger {
  if (!_logger) {
    _logger = new Logger();
  }
  return _logger;
}

/**
 * Set the global logger instance.
 */
export function setLogger(logger: Logger): void {
  _logger = logger;
}
