/** Svelte 5 runes adapter over the framework-agnostic mode runtime.
 *
 * Deliberately thin — all the logic lives in `src/mode/core.ts`, this only mirrors it
 * into `$state` so components re-render. The `.current` getter shape matches what other
 * Svelte mode libraries expose, so migrating to (or from) this is a rename.
 *
 *   import { mode, toggleMode } from 'fractals-styler/lib';
 *   <button onclick={toggleMode}>{mode.current}</button>
 *
 * Plain JavaScript on purpose. A published `.svelte.js`/`.svelte.ts` module is compiled
 * by the *consumer's* vite-plugin-svelte, which runs Svelte's module compiler directly
 * and does not apply their `vitePreprocess` to dependency files. TypeScript syntax
 * therefore fails to parse with "Unexpected token" during dependency optimization, which
 * takes the whole entry down. Types live in the sibling `.d.ts`.
 */

import { initMode, destroyMode } from '../mode/core.js';

/** @typedef {import('../mode/types.js').Mode} Mode */
/** @typedef {import('../mode/types.js').ModeConfig} ModeConfig */
/** @typedef {import('../mode/types.js').ModeState} ModeState */
/** @typedef {import('../mode/types.js').ResolvedMode} ResolvedMode */

/** @type {ModeState} */
const state = $state({
	mode: 'light',
	preference: 'system',
	system: 'light',
	theme: ''
});

let started = false;

/** Start the runtime. Called automatically on first access; call it explicitly from your
 * root layout only if you need to pass a config. Must run before first access to take
 * effect — the controller is a singleton and ignores later config.
 * @param {ModeConfig} [config]
 * @returns {void}
 */
export function configureMode(config = {}) {
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

function ensure() {
	if (!started) configureMode();
}

/** The resolved mode — the value you paint with. During SSR it reports `light`; the
 * inline script has already stamped the real value client-side before this module runs. */
export const mode = {
	get current() {
		ensure();
		return state.mode;
	}
};

/** The user's raw three-state preference: `light`, `dark` or `system`. */
export const preference = {
	get current() {
		ensure();
		return state.preference;
	}
};

/** What the OS reports right now, regardless of preference. */
export const systemMode = {
	get current() {
		ensure();
		return state.system;
	}
};

/** The active named theme, or `''` for none. Orthogonal to mode. */
export const theme = {
	get current() {
		ensure();
		return state.theme;
	}
};

/**
 * @param {Mode} next
 * @returns {void}
 */
export function setMode(next) {
	ensure();
	initMode().setMode(next);
}

/** @returns {void} */
export function toggleMode() {
	ensure();
	initMode().toggleMode();
}

/** Return to following the OS preference.
 * @returns {void} */
export function resetMode() {
	ensure();
	initMode().resetMode();
}

/**
 * @param {string} next
 * @returns {void}
 */
export function setTheme(next) {
	ensure();
	initMode().setTheme(next);
}

export { destroyMode };
