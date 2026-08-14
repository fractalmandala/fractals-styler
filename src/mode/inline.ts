/** Generates the blocking `<head>` script that stamps the mode marker before first paint.
 *
 * This is the single most important piece of a mode system. The server cannot know the
 * visitor's preference — `localStorage` and `matchMedia` are browser-only — so without a
 * synchronous script running ahead of paint, every visitor sees a flash of the wrong
 * palette. It must be inline (not `src=`) and in `<head>`, ahead of any stylesheet link.
 *
 * Pure string generation: no DOM, no imports. Safe to call from the Vite plugin in Node.
 */

import { resolveConfig, type ModeConfig } from './types.js';

/** The script body only, without a `<script>` wrapper. */
export function buildInlineScript(config: ModeConfig = {}): string {
	const c = resolveConfig(config);
	const s = JSON.stringify;

	// Wrapped in try/catch because `localStorage` *throws* (not returns null) in Safari
	// private browsing and when cookies are blocked. A throw here would abort the script
	// and leave the page unmarked — which is survivable, since the palette falls back to
	// the `:root` + `prefers-color-scheme` layers, but the theme axis would be lost.
	return (
		`try{` +
		`var d=document.documentElement,` +
		`m=localStorage.getItem(${s(c.storageKey)})||${s(c.defaultMode)},` +
		`t=localStorage.getItem(${s(c.themeStorageKey)})||${s(c.defaultTheme)},` +
		`r=m==="light"||m==="dark"?m:` +
		`(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");` +
		`d.setAttribute(${s(c.attribute)},r);` +
		`d.style.colorScheme=r;` +
		`if(t)d.setAttribute(${s(c.themeAttribute)},t);` +
		`}catch(e){}`
	);
}

/** The complete `<script>` tag, for consumers injecting into an HTML template by hand
 * (SvelteKit's `src/app.html`, an Astro layout, a Rails view...). */
export function buildInlineScriptTag(config: ModeConfig = {}): string {
	const c = resolveConfig(config);
	const nonce = c.nonce ? ` nonce="${c.nonce}"` : '';
	return `<script data-fractals-styler-mode${nonce}>${buildInlineScript(config)}</script>`;
}
