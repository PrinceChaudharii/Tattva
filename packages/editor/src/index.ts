// ─── @tattva/editor ──────────────────────────────────────────────────────────
// Barrel export for editor extensions, plugins, and configuration

// Extensions
export {
  BUILTIN_EXTENSIONS,
  registerExtension,
  unregisterExtension,
  getExtensions,
  getEnabledExtensions,
  getExtension,
} from "./extensions/index.js";
export type { EditorExtension } from "./extensions/index.js";

// Plugins
export {
  BUILTIN_PLUGINS,
  registerPlugin,
  unregisterPlugin,
  getPlugins,
  getEnabledPlugins,
  getPlugin,
  resolveEditorConfig,
} from "./plugins/index.js";
export type { EditorPlugin, EditorConfig } from "./plugins/index.js";
