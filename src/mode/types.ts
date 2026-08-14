/** Mode + theme contract. See docs/09-mode-and-theme.md for the concepts.
 *
 * Two orthogonal axes:
 *   mode  — the OS-backed binary axis (light | dark), written to `data-mode`
 *   theme — named palettes of your own invention, written to `data-theme`
 */

/** What the user has *chosen*. `system` defers to the OS. */
export type Mode = 'light' | 'dark' | 'system';

/** What actually gets painted, after resolving `system` against the OS. */
export type ResolvedMode = 'light' | 'dark';

export interface ModeConfig {
	/** Attribute carrying the mode axis on `<html>`. Default `data-mode`. */
	attribute?: string;
	/** Attribute carrying the named-theme axis on `<html>`. Default `data-theme`. */
	themeAttribute?: string;
	/** localStorage key for the user's mode preference. Default `fractals-styler:mode`. */
	storageKey?: string;
	/** localStorage key for the named theme. Default `fractals-styler:theme`. */
	themeStorageKey?: string;
	/** Preference to assume when nothing is stored. Default `system`. */
	defaultMode?: Mode;
	/** Named theme to assume when nothing is stored. Default `''` (no theme attribute). */
	defaultTheme?: string;
	/** Suppress CSS transitions during a mode switch, so the page does not animate every
	 * transitioned property at once. Default `true`. */
	disableTransitions?: boolean;
	/** CSP nonce for the injected inline script. Required under a strict script-src. */
	nonce?: string;
}

/** Config with every default filled in. */
export type ResolvedModeConfig = Required<Omit<ModeConfig, 'nonce'>> & { nonce?: string };

export interface ModeState {
	/** The resolved value you paint with. */
	mode: ResolvedMode;
	/** The user's raw three-state preference. */
	preference: Mode;
	/** What the OS reports right now. */
	system: ResolvedMode;
	/** The active named theme, or `''` for none. */
	theme: string;
}

export interface ModeController extends ModeState {
	setMode(mode: Mode): void;
	toggleMode(): void;
	/** Return to following the OS. */
	resetMode(): void;
	setTheme(theme: string): void;
	/** Returns an unsubscribe function. */
	subscribe(fn: (state: ModeState) => void): () => void;
	destroy(): void;
}

export const MODE_DEFAULTS: ResolvedModeConfig = {
	attribute: 'data-mode',
	themeAttribute: 'data-theme',
	storageKey: 'fractals-styler:mode',
	themeStorageKey: 'fractals-styler:theme',
	defaultMode: 'system',
	defaultTheme: '',
	disableTransitions: true
};

export function resolveConfig(config: ModeConfig = {}): ResolvedModeConfig {
	return { ...MODE_DEFAULTS, ...config };
}

/** Marker attribute on the injected script tag. Both the Vite plugin and the CLI check
 * for it so a project that has been patched once is never double-injected. */
export const INLINE_SCRIPT_MARKER = 'data-fractals-styler-mode';

/** Global the inline script writes its resolved config to, so the browser runtime uses
 * the same attribute and storage-key names without the consumer configuring them twice. */
export const GLOBAL_CONFIG_KEY = '__fractalsStylerMode';
