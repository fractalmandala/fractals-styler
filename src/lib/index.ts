/** fractals-styler — Svelte showcase + token utilities.
 *
 * Import the live token editor + showcase anywhere in a SvelteKit app:
 *   import { StylerPreview } from 'fractals-styler/lib';
 *   import { loadOverrides, SEMANTIC_GROUPS, TYPE_LEVELS } from 'fractals-styler/lib';
 */

export { default as StylerPreview } from './StylerPreview.svelte';
export * from './styler-preview.js';

/** Canonical docs app shell (CUBE Composition layer) + shared TOC store. */
export { default as AppShell } from './AppShell.svelte';
export { toc, type TocItem } from './toc.svelte';

/** Mode (light/dark) + theme (named palettes) — see docs/09-mode-and-theme.md.
 *
 *   import { mode, toggleMode, ModeToggle } from 'fractals-styler/lib';
 *
 * The flash-preventing inline script is injected by the Vite plugin (or written into
 * `src/app.html` by `fractals-styler init`); nothing needs mounting for that to work. */
export { default as ModeToggle } from './ModeToggle.svelte';
export {
	mode,
	preference,
	systemMode,
	theme,
	setMode,
	toggleMode,
	resetMode,
	setTheme,
	configureMode,
	destroyMode,
	type Mode,
	type ModeConfig,
	type ModeState,
	type ResolvedMode
} from './mode.svelte.js';
