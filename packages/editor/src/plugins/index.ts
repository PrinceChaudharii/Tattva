import type { Difficulty, Locale } from "@tattva/shared-types";

// ─── Editor Plugin ───────────────────────────────────────────────────────────

/**
 * Describes a rich text editor plugin.
 * Plugins are higher-level than extensions and can orchestrate multiple extensions.
 */
export interface EditorPlugin {
  /** Unique plugin identifier */
  readonly id: string;
  /** Human-readable name */
  readonly name: string;
  /** Plugin description */
  readonly description?: string;
  /** Required extension IDs */
  readonly requires?: readonly string[];
  /** Whether the plugin is enabled by default */
  readonly enabledByDefault: boolean;
  /** Plugin configuration */
  readonly config?: Record<string, unknown>;
}

// ─── Built-in Plugins ────────────────────────────────────────────────────────

export const BUILTIN_PLUGINS: readonly EditorPlugin[] = [
  {
    id: "content-authoring",
    name: "Content Authoring",
    description: "Full content authoring experience with NCERT alignment",
    requires: ["markdown-shortcuts", "math-latex", "code-highlight", "image-upload", "ncert-template"],
    enabledByDefault: true,
    config: {
      defaultDifficulty: "intermediate" as Difficulty,
      defaultLocale: "en" as Locale,
      autoSave: true,
      autoSaveInterval: 30000,
    },
  },
  {
    id: "exercise-builder",
    name: "Exercise Builder",
    description: "Create and edit exercises with answer validation",
    requires: ["markdown-shortcuts", "math-latex"],
    enabledByDefault: true,
    config: {
      exerciseTypes: [
        "multiple_choice",
        "true_false",
        "fill_in_blank",
        "short_answer",
        "long_answer",
        "numerical",
      ],
    },
  },
  {
    id: "review-mode",
    name: "Review Mode",
    description: "Suggest edits and leave comments on content",
    requires: ["version-history"],
    enabledByDefault: false,
    config: {
      trackChanges: true,
      commentThreads: true,
    },
  },
  {
    id: "translation-helper",
    name: "Translation Helper",
    description: "Side-by-side translation editing with reference content",
    requires: ["markdown-shortcuts"],
    enabledByDefault: false,
    config: {
      supportedLocales: ["en", "hi", "bn", "te", "ta", "mr"] as Locale[],
      showOriginal: true,
    },
  },
] as const;

// ─── Plugin Registry ─────────────────────────────────────────────────────────

const pluginRegistry = new Map<string, EditorPlugin>();

// Register built-in plugins
for (const plugin of BUILTIN_PLUGINS) {
  pluginRegistry.set(plugin.id, plugin);
}

/**
 * Register a custom editor plugin.
 */
export function registerPlugin(plugin: EditorPlugin): void {
  pluginRegistry.set(plugin.id, plugin);
}

/**
 * Unregister an editor plugin by ID.
 */
export function unregisterPlugin(id: string): boolean {
  return pluginRegistry.delete(id);
}

/**
 * Get all registered plugins.
 */
export function getPlugins(): readonly EditorPlugin[] {
  return Array.from(pluginRegistry.values());
}

/**
 * Get enabled plugins based on user preferences.
 */
export function getEnabledPlugins(
  disabledIds?: readonly string[]
): readonly EditorPlugin[] {
  const disabled = new Set(disabledIds);
  return Array.from(pluginRegistry.values()).filter(
    (plugin) => plugin.enabledByDefault && !disabled.has(plugin.id)
  );
}

/**
 * Get a plugin by ID.
 */
export function getPlugin(id: string): EditorPlugin | undefined {
  return pluginRegistry.get(id);
}

// ─── Editor Configuration ────────────────────────────────────────────────────

export interface EditorConfig {
  /** Enabled extension IDs (overrides defaults) */
  enabledExtensions?: readonly string[];
  /** Disabled extension IDs */
  disabledExtensions?: readonly string[];
  /** Enabled plugin IDs (overrides defaults) */
  enabledPlugins?: readonly string[];
  /** Disabled plugin IDs */
  disabledPlugins?: readonly string[];
  /** Default content locale */
  locale?: Locale;
  /** Default difficulty level */
  difficulty?: Difficulty;
  /** Auto-save interval in ms (0 = disabled) */
  autoSaveInterval?: number;
  /** Maximum content length */
  maxContentLength?: number;
}

/**
 * Resolve the final editor configuration.
 * Merges defaults with user preferences.
 */
export function resolveEditorConfig(config?: EditorConfig): {
  extensions: readonly string[];
  plugins: readonly string[];
  options: Required<Omit<EditorConfig, "enabledExtensions" | "disabledExtensions" | "enabledPlugins" | "disabledPlugins">>;
} {
  const enabledExtensions = getEnabledExtensions(config?.disabledExtensions);
  const enabledPlugins = getEnabledPlugins(config?.disabledPlugins);

  // Apply explicit enables/disables
  const extensionIds = new Set(enabledExtensions.map((e) => e.id));
  if (config?.enabledExtensions) {
    for (const id of config.enabledExtensions) {
      extensionIds.add(id);
    }
  }

  const pluginIds = new Set(enabledPlugins.map((p) => p.id));
  if (config?.enabledPlugins) {
    for (const id of config.enabledPlugins) {
      pluginIds.add(id);
    }
  }

  return {
    extensions: Array.from(extensionIds),
    plugins: Array.from(pluginIds),
    options: {
      locale: config?.locale ?? "en",
      difficulty: config?.difficulty ?? "intermediate",
      autoSaveInterval: config?.autoSaveInterval ?? 30000,
      maxContentLength: config?.maxContentLength ?? 500_000,
    },
  };
}
