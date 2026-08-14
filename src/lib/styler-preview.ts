/** Styler Preview — registry + persistence + undo.
 *
 * Framework-agnostic core for the `StylerPreview` showcase. It holds no token
 * *values* of its own — only the *names* and *shape* of the tokens to render —
 * and resolves them live off the mounted page, so it always reflects whatever
 * the consuming app compiled from fractals-styler's templates.
 *
 * Ships as raw source; the consumer's Svelte/Vite compiles it. No Svelte or
 * other runtime imports here — runs anywhere a browser is present.
 */

import { setMode } from '../mode/core.js';

export const STORAGE_KEY = 'fractals-styler:overrides';

export interface TokenLevel {
	/** CSS custom property, e.g. `--text-xl`. */
	var: string;
	/** Class used to render a live sample (`text-xl`). */
	class: string;
	/** Human label shown in the UI. */
	label: string;
}

export interface ColorGroup {
	title: string;
	tokens: string[];
}

export type Overrides = Record<string, string>;

/* ------------------------------------------------------------------ */
/* Registries — ground truth for what the showcase renders             */
/* ------------------------------------------------------------------ */

/** Typography scale declared in `_tokens.sass` and consumed by `_typography.sass`.
 * Keys must match the template exactly — `bs` and `5xl` were listed here but have never
 * existed in `_tokens.sass`, so the showcase rendered two swatches with no value behind
 * them and offered overrides for tokens nothing consumed. */
export const TYPE_LEVELS: TokenLevel[] = (() => {
	const levels: TokenLevel[] = [];
	for (const k of ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl']) {
		const cls = 'text-' + k;
		levels.push({ var: '--' + cls, class: cls, label: '--' + cls });
	}
	return levels;
})();

/** Editable semantic color groups from `_tokens.sass`. Alpha-bearing tokens such as
 * `--ring` are intentionally excluded from native color inputs. */
export const SEMANTIC_GROUPS: ColorGroup[] = [
	{ title: 'Backgrounds', tokens: ['--bg', '--bg-surface', '--bg-raised'] },
	{
		title: 'Text',
		tokens: ['--text-primary', '--text-secondary', '--text-muted', '--text-inverse']
	},
	{ title: 'Borders', tokens: ['--border', '--border-subtle', '--border-strong'] },
	{ title: 'Theme', tokens: ['--theme', '--theme-hover', '--theme-active'] },
	{
		title: 'Feedback',
		tokens: ['--feedback-danger', '--feedback-warning', '--feedback-success', '--feedback-info']
	},
	// The `_colors.sass` semantic layer. It is part of the compiled cascade (index.sass
	// `@use`s it after tokens), so the showcase would otherwise claim to mirror the
	// system while omitting half of its colour vocabulary. `--border`, `--ring` and
	// `--input` are owned by `_tokens.sass` and appear under Borders/Theme above.
	{
		title: 'Surfaces (colors layer)',
		tokens: ['--background', '--foreground', '--card', '--popover', '--muted', '--accent']
	},
	{
		title: 'Actions (colors layer)',
		tokens: ['--primary', '--secondary', '--destructive']
	},
	{
		title: 'Charts (colors layer)',
		tokens: ['--chart-1', '--chart-2', '--chart-3', '--chart-4', '--chart-5']
	}
];

/** Base text-colour samples, keyed by the `_typography.sass` utility class. */
export const TEXT_SAMPLES: { var: string; class: string; label: string; inverse?: boolean }[] = [
	{ var: '--text-primary', class: 'text-primary', label: 'Primary' },
	{ var: '--text-secondary', class: 'text-secondary', label: 'Secondary' },
	{ var: '--text-muted', class: 'text-muted', label: 'Muted' },
	{ var: '--text-inverse', class: 'text-inverse', label: 'Inverse', inverse: true },
	// The remaining colour utilities in `_typography.sass`, previously unrepresented.
	{ var: '--theme', class: 'text-theme', label: 'Theme' },
	{ var: '--feedback-danger', class: 'text-danger', label: 'Danger' },
	{ var: '--feedback-warning', class: 'text-warning', label: 'Warning' },
	{ var: '--feedback-success', class: 'text-success', label: 'Success' },
	{ var: '--feedback-info', class: 'text-info', label: 'Info' }
];

/* ------------------------------------------------------------------ */
/* Reading resolved values off the live document                       */
/* ------------------------------------------------------------------ */

const root = (): HTMLElement | null =>
	typeof document !== 'undefined' ? document.documentElement : null;

/** Raw custom-property string on the root — may be a `var()` chain. */
export function readVar(name: string): string {
	const el = root();
	return (el && getComputedStyle(el).getPropertyValue(name).trim()) || '';
}

/** True when the already-serialised value is a hex literal. */
export function isHex(raw: string): boolean {
	return /^#[0-9a-f]{3,8}$/i.test(raw.trim());
}

/** Normalise a raw var() expression to a hex literal when possible; else return nul1. */
export function rawOrHex(name: string): string | null {
	const raw = readVar(name);
	if (!raw) return null;
	if (isHex(raw)) return raw.trim();
	return null;
}

/** Resolve a var() chain to a concrete colour by rendering a probe element
 * whose `color` is set to `var(...)` and reading its computed value. */
export function resolveVar(name: string): string {
	if (typeof document === 'undefined') return '#000000';
	const probe = document.createElement('span');
	probe.style.display = 'inline';
	probe.style.color = `var(${name})`;
	document.body.appendChild(probe);
	const c = getComputedStyle(probe).color;
	probe.remove();
	return c && c !== 'transparent' && !c.includes('var(') ? toHex(c) : '#000000';
}

/** Convert any CSS color value to `#rrggbb` (or `#rrggbbaa`). */
export function toHex(color: string): string {
	const m = color.match(/\d+(\.\d+)?/g);
	if (!m) return '#000000';
	const [r, g, b] = m.slice(0, 3).map(Number);
	if (m.length >= 4) {
		const a = Math.round(Number(m[3]) * 255);
		return '#' + [r, g, b, a].map((n) => n.toString(16).padStart(2, '0')).join('');
	}
	return '#' + [r, g, b].map((n) => n.toString(16).padStart(2, '0')).join('');
}

/* ------------------------------------------------------------------ */
/* Persistence                                                         */
/* ------------------------------------------------------------------ */

export function loadOverrides(): Overrides {
	if (typeof localStorage === 'undefined') return {};
	try {
		const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') as Overrides;
		if (typeof raw !== 'object' || !raw) return {};
		const known = new Set(allTokens());
		return Object.fromEntries(Object.entries(raw).filter(([token]) => known.has(token)));
	} catch {
		return {};
	}
}

export function persistOverrides(o: Overrides): void {
	if (typeof localStorage === 'undefined') return;
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(o));
	} catch {
		/* noop */
	}
}

export function clearOverrides(): void {
	if (typeof localStorage === 'undefined') return;
	try {
		localStorage.removeItem(STORAGE_KEY);
	} catch {
		/* noop */
	}
}

/* ------------------------------------------------------------------ */
/* Live application                                                     */
/* ------------------------------------------------------------------ */

/** Apply a full overrides map to the root inline style. */
export function applyOverrides(o: Overrides): void {
	const el = root();
	if (!el) return;
	for (const token of allTokens()) {
		if (!Object.prototype.hasOwnProperty.call(o, token)) el.style.removeProperty(token);
	}
	for (const [k, v] of Object.entries(o)) el.style.setProperty(k, v);
}

/** Gather every CSS custom property token the showcase reads/writes. */
export function allTokens(): string[] {
	const set = new Set<string>();
	for (const lvl of TYPE_LEVELS) set.add(lvl.var);
	for (const g of SEMANTIC_GROUPS) for (const t of g.tokens) set.add(t);
	for (const s of TEXT_SAMPLES) set.add(s.var);
	return [...set];
}

/** Remove every known token override from the root inline style. */
export function removeAllOverrides(): void {
	const el = root();
	if (!el) return;
	for (const token of allTokens()) el.style.removeProperty(token);
}

/* ------------------------------------------------------------------ */
/* Undo history (commit-per-gesture, capped)                           */
/* ------------------------------------------------------------------ */

export interface HistoryEntry {
	token: string;
	before: string | null; // value to restore (null => remove override)
	after: string; // value that was set
}

export class OverrideHistory {
	private stack: HistoryEntry[] = [];
	private limit: number;
	constructor(limit = 50) {
		this.limit = limit;
	}

	canUndo(): boolean {
		return this.stack.length > 0;
	}

	size(): number {
		return this.stack.length;
	}

	pushOverride(token: string, before: string | null, after: string): void {
		if (before === after) return;
		this.stack.push({ token, before, after });
		if (this.stack.length > this.limit) this.stack.shift();
	}

	popEntry(): HistoryEntry | undefined {
		return this.stack.pop();
	}

	clearHistory(): void {
		this.stack = [];
	}
}

/* ------------------------------------------------------------------ */
/* Mode                                                                */
/* ------------------------------------------------------------------ */

/** @deprecated Naming holdover — this is the *mode* axis (light/dark), not a named
 * theme. Use `ResolvedMode` from `fractals-styler/mode`. Kept as an alias so the
 * showcase components keep compiling through the 2.x line. */
export type Theme = 'light' | 'dark';

/** The mode the page is currently painting.
 *
 * Reads `data-mode` and falls back to the OS query. `data-theme` is still consulted as a
 * deprecated alias, matching the selector aliases in `_tokens.sass`, so a project that
 * has not migrated its markup yet still previews correctly. */
export function currentTheme(): Theme {
	if (typeof document === 'undefined') return 'light';
	const el = document.documentElement;
	const explicit = el.getAttribute('data-mode') ?? el.getAttribute('data-theme');
	if (explicit === 'light' || explicit === 'dark') return explicit;
	if (el.classList.contains('dark')) return 'dark';
	return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/** Switch the mode. Delegates to the shared runtime so the showcase toggle persists,
 * suppresses transitions and syncs across tabs exactly like the app's own toggle,
 * instead of writing a one-off attribute that the runtime would later overwrite. */
export function setTheme(t: Theme): void {
	if (typeof document === 'undefined') return;
	setMode(t);
}
