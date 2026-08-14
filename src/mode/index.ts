/** `fractals-styler/mode` — framework-agnostic mode + theme runtime.
 *
 * Svelte projects should import from `fractals-styler/lib` instead, which wraps this in
 * runes. Everything here works in any browser context with no framework at all.
 *
 * See docs/09-mode-and-theme.md.
 */

export {
	initMode,
	getModeController,
	destroyMode,
	setMode,
	toggleMode,
	resetMode,
	setTheme
} from './core.js';

export { buildInlineScript, buildInlineScriptTag } from './inline.js';

export {
	MODE_DEFAULTS,
	INLINE_SCRIPT_MARKER,
	resolveConfig,
	type Mode,
	type ResolvedMode,
	type ModeConfig,
	type ResolvedModeConfig,
	type ModeState,
	type ModeController
} from './types.js';
