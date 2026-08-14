/** Framework-agnostic mode + theme runtime.
 *
 * Deliberately free of any framework import — `subscribe()` is the seam adapters plug
 * into. The moment this file imports Svelte, the vanilla/React/Astro story dies.
 *
 * Pairs with `buildInlineScript()`: that stamps the initial marker before paint, this
 * takes over afterwards for toggling, persistence, OS changes and cross-tab sync.
 */

import {
	GLOBAL_CONFIG_KEY,
	resolveConfig,
	type Mode,
	type ModeConfig,
	type ModeController,
	type ModeState,
	type ResolvedMode,
	type ResolvedModeConfig
} from './types.js';

const DARK_QUERY = '(prefers-color-scheme: dark)';

const hasDom = (): boolean => typeof document !== 'undefined';

function readStorage(key: string): string | null {
	// Throws in Safari private browsing and with cookies blocked — never let that
	// propagate, the caller always has a usable fallback.
	try {
		return localStorage.getItem(key);
	} catch {
		return null;
	}
}

function writeStorage(key: string, value: string): void {
	try {
		localStorage.setItem(key, value);
	} catch {
		/* preference simply will not persist */
	}
}

function isMode(value: unknown): value is Mode {
	return value === 'light' || value === 'dark' || value === 'system';
}

/** Config the inline script left on `window`. Absent when the script was blocked by CSP
 * or never installed, in which case the built-in defaults apply. */
function readPublishedConfig(): ModeConfig {
	const published = (globalThis as Record<string, unknown>)[GLOBAL_CONFIG_KEY];
	return published && typeof published === 'object' ? (published as ModeConfig) : {};
}

/** Suppress transitions across a mode switch. Without this, every element with a
 * `transition` on colour or background animates simultaneously — a visible smear that
 * reads as jank rather than polish. */
function withoutTransitions(apply: () => void): void {
	const style = document.createElement('style');
	style.appendChild(
		document.createTextNode(
			'*,*::before,*::after{transition:none!important;animation:none!important}'
		)
	);
	document.head.appendChild(style);

	apply();

	// Force a synchronous style recalculation so the browser commits the new values
	// while transitions are still suppressed. Reading a computed value is what flushes
	// it; the result is intentionally discarded.
	void getComputedStyle(document.body).opacity;

	requestAnimationFrame(() => style.remove());
}

class Controller implements ModeController {
	#config: ResolvedModeConfig;
	#preference: Mode;
	#system: ResolvedMode;
	#theme: string;
	#listeners = new Set<(state: ModeState) => void>();
	#media: MediaQueryList | null = null;
	#onMediaChange: (() => void) | null = null;
	#onStorage: ((event: StorageEvent) => void) | null = null;
	#destroyed = false;

	constructor(config: ModeConfig = {}) {
		// Config published by the inline script sits between the built-in defaults and any
		// explicit argument, so plugin options reach the runtime automatically and the two
		// cannot disagree about which storage key holds the preference.
		this.#config = resolveConfig({ ...readPublishedConfig(), ...config });

		const stored = readStorage(this.#config.storageKey);
		this.#preference = isMode(stored) ? stored : this.#config.defaultMode;
		this.#theme = readStorage(this.#config.themeStorageKey) ?? this.#config.defaultTheme;
		this.#system = 'light';

		if (!hasDom()) return;

		this.#media = window.matchMedia(DARK_QUERY);
		this.#system = this.#media.matches ? 'dark' : 'light';

		// The OS can change under a live page — sunset, or the user flipping it in
		// system settings. Only repaint when the preference actually defers to it.
		this.#onMediaChange = () => {
			this.#system = this.#media!.matches ? 'dark' : 'light';
			if (this.#preference === 'system') this.#apply();
			this.#emit();
		};
		this.#media.addEventListener('change', this.#onMediaChange);

		// Cross-tab sync. Toggling in one tab should move every open tab; most mode
		// libraries skip this and the tabs silently diverge.
		this.#onStorage = (event: StorageEvent) => {
			if (event.key === this.#config.storageKey) {
				this.#preference = isMode(event.newValue)
					? event.newValue
					: this.#config.defaultMode;
			} else if (event.key === this.#config.themeStorageKey) {
				this.#theme = event.newValue ?? this.#config.defaultTheme;
			} else {
				return;
			}
			this.#apply();
			this.#emit();
		};
		window.addEventListener('storage', this.#onStorage);

		// The inline script has normally already stamped the correct marker. Re-applying
		// is cheap and covers the case where it was blocked by CSP or never installed.
		this.#apply({ animate: false });
	}

	get mode(): ResolvedMode {
		return this.#preference === 'system' ? this.#system : this.#preference;
	}

	get preference(): Mode {
		return this.#preference;
	}

	get system(): ResolvedMode {
		return this.#system;
	}

	get theme(): string {
		return this.#theme;
	}

	setMode(mode: Mode): void {
		if (!isMode(mode) || mode === this.#preference) return;
		this.#preference = mode;
		writeStorage(this.#config.storageKey, mode);
		this.#apply();
		this.#emit();
	}

	toggleMode(): void {
		// Toggling from `system` commits to the opposite of what is currently showing,
		// which is what a user pressing the button expects. `resetMode()` goes back.
		this.setMode(this.mode === 'dark' ? 'light' : 'dark');
	}

	resetMode(): void {
		this.setMode('system');
	}

	setTheme(theme: string): void {
		if (theme === this.#theme) return;
		this.#theme = theme;
		writeStorage(this.#config.themeStorageKey, theme);
		this.#apply();
		this.#emit();
	}

	subscribe(fn: (state: ModeState) => void): () => void {
		this.#listeners.add(fn);
		fn(this.#snapshot());
		return () => this.#listeners.delete(fn);
	}

	destroy(): void {
		if (this.#destroyed) return;
		this.#destroyed = true;
		if (this.#media && this.#onMediaChange) {
			this.#media.removeEventListener('change', this.#onMediaChange);
		}
		if (this.#onStorage) window.removeEventListener('storage', this.#onStorage);
		this.#listeners.clear();
	}

	#snapshot(): ModeState {
		return {
			mode: this.mode,
			preference: this.#preference,
			system: this.#system,
			theme: this.#theme
		};
	}

	#emit(): void {
		const state = this.#snapshot();
		for (const fn of this.#listeners) fn(state);
	}

	#apply({ animate = true }: { animate?: boolean } = {}): void {
		if (!hasDom()) return;
		const { attribute, themeAttribute, disableTransitions } = this.#config;
		const resolved = this.mode;

		const write = () => {
			const el = document.documentElement;
			el.setAttribute(attribute, resolved);
			// Set in the same write as the attribute so the two can never disagree.
			// This is what makes scrollbars and form controls match the palette.
			el.style.colorScheme = resolved;
			if (this.#theme) el.setAttribute(themeAttribute, this.#theme);
			else el.removeAttribute(themeAttribute);
		};

		if (animate && disableTransitions) withoutTransitions(write);
		else write();
	}
}

let singleton: Controller | null = null;

/** Create (or return) the shared controller. Safe to call during SSR — it degrades to
 * a stateless object reporting the configured defaults and never touches the DOM. */
export function initMode(config: ModeConfig = {}): ModeController {
	if (!singleton) singleton = new Controller(config);
	return singleton;
}

/** The shared controller, initialised with defaults if it does not exist yet. */
export function getModeController(): ModeController {
	return initMode();
}

/** Tear down the shared controller. Primarily for tests and HMR. */
export function destroyMode(): void {
	singleton?.destroy();
	singleton = null;
}

export function setMode(mode: Mode): void {
	getModeController().setMode(mode);
}

export function toggleMode(): void {
	getModeController().toggleMode();
}

export function resetMode(): void {
	getModeController().resetMode();
}

export function setTheme(theme: string): void {
	getModeController().setTheme(theme);
}
