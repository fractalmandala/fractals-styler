import { existsSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import type { Plugin, ViteDevServer } from 'vite';
import { scanFiles } from './scanner.js';
import { generateCss } from './generate.js';
import { buildInlineScript } from './mode/inline.js';
import { INLINE_SCRIPT_MARKER, type ModeConfig } from './mode/types.js';

/** True when `@sveltejs/kit` resolves from the project — i.e. SvelteKit owns the HTML.
 *
 * Detection happens at plugin-construction time because a Vite plugin's hooks are read
 * off the object as soon as it is registered; `transformIndexHtml` cannot be removed
 * later from `configResolved`. SvelteKit scans registered plugins for that hook and warns
 * about every plugin declaring it, so merely *having* it is what produces the noise. */
function isSvelteKitProject(cwd: string): boolean {
	try {
		createRequire(join(cwd, 'noop.js')).resolve('@sveltejs/kit/package.json');
		return true;
	} catch {
		return false;
	}
}

export interface FractalsStylerOptions {
	/** Glob patterns (relative to the Vite project root) to scan for utility classes
	 * and `--pxN` variable usage. Defaults cover the common SvelteKit source tree. */
	content?: string[];
	/** Unit format for dynamic numeric utilities ('px' | 'rem'). Defaults to 'px'. */
	unit?: 'px' | 'rem';
	/** Inject the blocking mode script into the HTML entry, preventing a flash of the
	 * wrong palette before hydration. Pass `false` to opt out, or a config object to
	 * override attribute/storage names. Defaults to on.
	 *
	 * Applies to Vite's HTML entry (`index.html`). SvelteKit renders `src/app.html`
	 * through its own pipeline, which does not run `transformIndexHtml` on a production
	 * build — `fractals-styler init` patches `src/app.html` directly for that case, and
	 * the marker attribute keeps the two mechanisms from double-injecting.
	 *
	 * In a SvelteKit project the hook is not registered at all, so SvelteKit does not warn
	 * about an unsupported hook. If `src/app.html` has not been patched, the plugin says so
	 * once at startup rather than silently shipping no mode script. */
	mode?: ModeConfig | false;
}

const VIRTUAL_ID = 'virtual:fractals-styler.css';
const RESOLVED_ID = '\0' + VIRTUAL_ID;

const DEFAULT_CONTENT = ['src/**/*.{svelte,html,js,ts,jsx,tsx,mjs}'];

const WATCHED_EXT_RE = /\.(svelte|html|js|ts|jsx|tsx|mjs)$/;

/** Vite plugin that JIT-generates `virtual:fractals-styler.css` — the numeric spacing/size
 * utilities (`gap24`, `padtop16`, ...), their breakpoint-suffixed variants, and breakpoint
 * variants of the package's own static utility classes (`box-sm`, `text-lg-xl`, ...).
 *
 * Import the virtual module once, anywhere in the app (typically the root layout):
 *   import 'virtual:fractals-styler.css'
 */
export default function fractalsStyler(options: FractalsStylerOptions = {}): Plugin {
	const content = options.content ?? DEFAULT_CONTENT;
	const unit = options.unit ?? 'px';
	const modeOptions = options.mode === false ? null : (options.mode ?? {});
	let root = process.cwd();

	// SvelteKit serves `src/app.html` through its own renderer, so the CLI patches that
	// file and this hook is both unnecessary and unsupported there.
	const underSvelteKit = isSvelteKitProject(root);

	async function build(): Promise<string> {
		const result = await scanFiles(content, root);
		return generateCss(result, { unit });
	}

	/** Warn when SvelteKit is in play but nothing has patched `app.html` — otherwise the
	 * absence of a mode script is invisible until someone notices the palette flashing. */
	function warnIfUnpatched(): void {
		if (!modeOptions || !underSvelteKit) return;
		const appHtml = join(root, 'src', 'app.html');
		if (!existsSync(appHtml)) return;
		try {
			if (readFileSync(appHtml, 'utf-8').includes(INLINE_SCRIPT_MARKER)) return;
		} catch {
			return;
		}
		console.warn(
			`[fractals-styler] src/app.html has no mode script, so light/dark mode will flash ` +
				`on load. Run \`fractals-styler init\` to patch it, or add the tag from ` +
				`\`buildInlineScriptTag()\` before %sveltekit.head%. Pass \`mode: false\` to silence this.`
		);
	}

	const plugin: Plugin = {
		name: 'fractals-styler',
		// Our virtual id ends in `.css`, so Vite's own built-in `vite:css`/`vite:css-post`
		// plugins also match it via their `cssLangRE` check. Without `enforce: 'pre'` they
		// run before us in the default plugin order and try to read the id straight off
		// disk (not recognizing our `\0` virtual-module marker), which crashes during SSR.
		enforce: 'pre',

		configResolved(config) {
			root = config.root;
			warnIfUnpatched();
		},

		resolveId(id) {
			// Vite's own CSS pipeline appends query suffixes (e.g. `?inline` when inlining
			// CSS for SSR) before re-resolving — match those too, preserving the suffix, or
			// the id falls through to Vite's default file-path resolution and chokes on the
			// `\0` virtual-module marker (not a real path).
			if (id === VIRTUAL_ID) return RESOLVED_ID;
			if (id.startsWith(VIRTUAL_ID + '?')) return '\0' + id;
			if (id === RESOLVED_ID || id.startsWith(RESOLVED_ID + '?')) return id;
		},

		async load(id) {
			if (id === RESOLVED_ID || id.startsWith(RESOLVED_ID + '?')) return build();
		},

		configureServer(server: ViteDevServer) {
			server.watcher.on('all', (_event, file) => {
				if (!WATCHED_EXT_RE.test(file)) return;
				const mod = server.moduleGraph.getModuleById(RESOLVED_ID);
				if (!mod) return;
				server.moduleGraph.invalidateModule(mod);
				server.ws.send({ type: 'full-reload' });
			});
		}
	};

	// Attached conditionally, never declared inline: SvelteKit inspects every registered
	// plugin for `transformIndexHtml` and warns that the hook is unsupported, so a plugin
	// that merely declares it produces that warning on every build even when the hook is
	// a no-op. Under SvelteKit the CLI's `src/app.html` patch does this job instead.
	if (modeOptions && !underSvelteKit) {
		plugin.transformIndexHtml = {
			// `pre` so the script lands ahead of anything later plugins add. Within the
			// document it still needs `head-prepend` — running before the stylesheet
			// links is the entire point, otherwise the browser paints once first.
			order: 'pre',
			handler(html: string) {
				// Idempotency guard, for a hand-patched `index.html`.
				if (html.includes(INLINE_SCRIPT_MARKER)) return;
				return [
					{
						tag: 'script',
						attrs: modeOptions.nonce
							? { [INLINE_SCRIPT_MARKER]: '', nonce: modeOptions.nonce }
							: { [INLINE_SCRIPT_MARKER]: '' },
						children: buildInlineScript(modeOptions),
						injectTo: 'head-prepend' as const
					}
				];
			}
		};
	}

	return plugin;
}

export { fractalsStyler };
export { buildInlineScript, buildInlineScriptTag } from './mode/inline.js';
export { MODE_DEFAULTS, INLINE_SCRIPT_MARKER, resolveConfig } from './mode/types.js';
export type { Mode, ResolvedMode, ModeConfig, ModeState, ModeController } from './mode/types.js';
export { generateCss } from './generate.js';
export { scanFiles } from './scanner.js';
export {
	resolveDeclarations,
	BREAKPOINTS,
	DYNAMIC_PREFIXES,
	STATIC_UTILITIES
} from './registry.js';
