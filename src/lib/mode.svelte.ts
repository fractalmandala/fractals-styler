/** Svelte 5 runes adapter over the framework-agnostic mode runtime.
 *
 * Deliberately thin — all the logic lives in `src/mode/core.ts`, this only mirrors it
 * into `$state` so components re-render. The `.current` getter shape matches what other
 * Svelte mode libraries expose, so migrating to (or from) this is a rename.
 *
 *   import { mode, toggleMode } from 'fractals-styler/lib';
 *   <button onclick={toggleMode}>{mode.current}</button>
 */

import { initMode, destroyMode } from '../mode/core.js';
import type { Mode, ModeConfig, ModeState, ResolvedMode } from '../mode/types.js';

const state = $state<ModeState>({
	mode: 'light',
	preference: 'system',
	system: 'light',
	theme: ''
});

let started = false;

/** Start the runtime. Called automatically on first access; call it explicitly from your
 * root layout only if you need to pass a config. Must run before first access to take
 * effect — the controller is a singleton and ignores later config. */
export function configureMode(config: ModeConfig = {}): void {
	if (started || typeof document === 'undefined') return;
	started = true;
	initMode(config).subscribe((next) => {
		// Per-property assignment, not replacement: `state` is the object components
		// hold a reference to.
		state.mode = next.mode;
		state.preference = next.preference;
		state.system = next.system;
		state.theme = next.theme;
	});
}

function ensure(): void {
	if (!started) configureMode();
}

/** The resolved mode — the value you paint with. `undefined` never occurs; during SSR it
 * reports `light`, and the inline script has already stamped the real value client-side
 * before this module runs. */
export const mode = {
	get current(): ResolvedMode {
		ensure();
		return state.mode;
	}
};

/** The user's raw three-state preference: `light`, `dark` or `system`. */
export const preference = {
	get current(): Mode {
		ensure();
		return state.preference;
	}
};

/** What the OS reports right now, regardless of preference. */
export const systemMode = {
	get current(): ResolvedMode {
		ensure();
		return state.system;
	}
};

/** The active named theme, or `''` for none. Orthogonal to mode. */
export const theme = {
	get current(): string {
		ensure();
		return state.theme;
	}
};

export function setMode(next: Mode): void {
	ensure();
	initMode().setMode(next);
}

export function toggleMode(): void {
	ensure();
	initMode().toggleMode();
}

/** Return to following the OS preference. */
export function resetMode(): void {
	ensure();
	initMode().resetMode();
}

export function setTheme(next: string): void {
	ensure();
	initMode().setTheme(next);
}

export { destroyMode };
export type { Mode, ModeConfig, ModeState, ResolvedMode };
