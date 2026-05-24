import type { Difficulty, Locale } from "@tattva/shared-types";

// ─── Editor Extension ────────────────────────────────────────────────────────

/**
 * Describes a rich text editor extension.
 * Extensions add functionality like markdown shortcuts, code highlighting, etc.
 */
export interface EditorExtension {
  /** Unique extension identifier */
  readonly id: string;
  /** Human-readable name */
  readonly name: string;
  /** Extension description */
  readonly description?: string;
  /** Whether the extension is enabled by default */
  readonly enabledByDefault: boolean;
  /** Extension configuration */
  readonly config?: Record<string, unknown>;
}

// ─── Built-in Extensions ─────────────────────────────────────────────────────

export const BUILTIN_EXTENSIONS: readonly EditorExtension[] = [
  {
    id: "markdown-shortcuts",
    name: "Markdown Shortcuts",
    description: "Type markdown syntax to apply formatting (e.g., **bold**, *italic*)",
    enabledByDefault: true,
  },
  {
    id: "math-latex",
    name: "Math / LaTeX",
    description: "Render mathematical expressions using KaTeX or MathJax",
    enabledByDefault: true,
    config: { engine: "katex" },
  },
  {
    id: "code-highlight",
    name: "Code Highlighting",
    description: "Syntax highlighting for code blocks",
    enabledByDefault: true,
    config: { theme: "github-dark" },
  },
  {
    id: "image-upload",
    name: "Image Upload",
    description: "Drag & drop or paste image uploads",
    enabledByDefault: true,
    config: { maxWidth: 1200, quality: 0.85 },
  },
  {
    id: "table-editor",
    name: "Table Editor",
    description: "Visual table creation and editing",
    enabledByDefault: true,
  },
  {
    id: "ncert-template",
    name: "NCERT Template",
    description: "Pre-built templates aligned with NCERT content structure",
    enabledByDefault: true,
    config: {
      templates: ["lesson", "exercise", "summary", "diagram"],
    },
  },
  {
    id: "collaboration",
    name: "Real-time Collaboration",
    description: "Multi-user editing with conflict resolution",
    enabledByDefault: false,
  },
  {
    id: "version-history",
    name: "Version History",
    description: "Track content changes over time",
    enabledByDefault: true,
  },
  {
    id: "word-count",
    name: "Word Count",
    description: "Display word count and reading time estimates",
    enabledByDefault: true,
  },
  {
    id: "link-preview",
    name: "Link Preview",
    description: "Show previews for external URLs",
    enabledByDefault: false,
  },
] as const;

// ─── Extension Registry ──────────────────────────────────────────────────────

const extensionRegistry = new Map<string, EditorExtension>();

// Register built-in extensions
for (const ext of BUILTIN_EXTENSIONS) {
  extensionRegistry.set(ext.id, ext);
}

/**
 * Register a custom editor extension.
 */
export function registerExtension(extension: EditorExtension): void {
  extensionRegistry.set(extension.id, extension);
}

/**
 * Unregister an editor extension by ID.
 */
export function unregisterExtension(id: string): boolean {
  return extensionRegistry.delete(id);
}

/**
 * Get all registered extensions.
 */
export function getExtensions(): readonly EditorExtension[] {
  return Array.from(extensionRegistry.values());
}

/**
 * Get enabled extensions based on user preferences.
 */
export function getEnabledExtensions(
  disabledIds?: readonly string[]
): readonly EditorExtension[] {
  const disabled = new Set(disabledIds);
  return Array.from(extensionRegistry.values()).filter(
    (ext) => ext.enabledByDefault && !disabled.has(ext.id)
  );
}

/**
 * Get an extension by ID.
 */
export function getExtension(id: string): EditorExtension | undefined {
  return extensionRegistry.get(id);
}
