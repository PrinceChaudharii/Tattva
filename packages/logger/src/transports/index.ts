import type { LogEntry } from "../formatters/index.js";
import type { LogFormatter } from "../formatters/index.js";

// ─── Transport Interface ─────────────────────────────────────────────────────

/**
 * Log transport — sends formatted log entries to a destination.
 */
export interface LogTransport {
  /** Transport name */
  readonly name: string;
  /** Write a formatted log entry to the destination */
  write(formatted: string, entry: LogEntry): void | Promise<void>;
  /** Flush any buffered entries */
  flush?(): void | Promise<void>;
  /** Shut down the transport */
  close?(): void | Promise<void>;
}

// ─── Console Transport ───────────────────────────────────────────────────────

/**
 * Transport that writes log entries to stdout/stderr.
 */
export class ConsoleTransport implements LogTransport {
  readonly name = "console";

  write(formatted: string, entry: LogEntry): void {
    const level = entry.level;

    if (level === "error" || level === "fatal") {
      process.stderr.write(`${formatted}\n`);
    } else {
      process.stdout.write(`${formatted}\n`);
    }
  }
}

// ─── File Transport (Stub) ───────────────────────────────────────────────────

/**
 * Transport that writes log entries to a file.
 * Stub implementation — extend with a proper file rotation library in production.
 */
export class FileTransport implements LogTransport {
  readonly name = "file";
  private readonly filePath: string;
  private buffer: string[] = [];
  private readonly maxBufferSize: number;

  constructor(filePath: string, options?: { maxBufferSize?: number }) {
    this.filePath = filePath;
    this.maxBufferSize = options?.maxBufferSize ?? 100;
  }

  write(formatted: string, _entry: LogEntry): void {
    this.buffer.push(formatted);

    if (this.buffer.length >= this.maxBufferSize) {
      void this.flush();
    }
  }

  async flush(): Promise<void> {
    if (this.buffer.length === 0) return;

    const content = this.buffer.join("\n") + "\n";
    this.buffer = [];

    // Stub: In production, use proper file writing with rotation
    // e.g., using pino/file, winston-daily-rotate-file, etc.
    try {
      const { appendFile } = await import("node:fs/promises");
      await appendFile(this.filePath, content, "utf-8");
    } catch {
      // Fallback to console if file write fails
      process.stderr.write(`[logger] Failed to write to ${this.filePath}\n`);
    }
  }

  async close(): Promise<void> {
    await this.flush();
  }
}

// ─── Transport Factory ───────────────────────────────────────────────────────

export interface TransportConfig {
  type: "console" | "file";
  options?: Record<string, unknown>;
}

/**
 * Create a transport from configuration.
 */
export function createTransport(config: TransportConfig): LogTransport {
  switch (config.type) {
    case "console":
      return new ConsoleTransport();
    case "file":
      return new FileTransport(
        (config.options?.["path"] as string) ?? "logs/app.log",
        { maxBufferSize: config.options?.["maxBufferSize"] as number }
      );
  }
}
