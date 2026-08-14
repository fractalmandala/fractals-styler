import type { Plugin, ViteDevServer } from 'vite';
import { scanFiles } from './scanner.js';
import { generateCss } from './generate.js';
import { buildInlineScript } from './mode/inline.js';
import { INLINE_SCRIPT_MARKER, type ModeConfig } from './mode/types.js';

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
	 * the marker attribute keeps the two mechanisms from double-injecting. */
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

	async function build(): Promise<string> {
		const result = await scanFiles(content, root);
		return generateCss(result, { unit });
	}

	return {
		name: 'fractals-styler',
		// Our virtual id ends in `.css`, so Vite's own built-in `vite:css`/`vite:css-post`
		// plugins also match it via their `cssLangRE` check. Without `enforce: 'pre'` they
		// run before us in the default plugin order and try to read the id straight off
		// disk (not recognizing our `\0` virtual-module marker), which crashes during SSR.
		enforce: 'pre',

		configResolved(config) {
			root = config.root;
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

		transformIndexHtml: {
			// `pre` so the script lands ahead of anything later plugins add. Within the
			// document it still needs `head-prepend` — running before the stylesheet
			// links is the entire point, otherwise the browser paints once first.
			order: 'pre',
			handler(html: string) {
				if (!modeOptions) return;
				// Idempotency guard. A SvelteKit project has its `app.html` patched by the
				// CLI, and SvelteKit *does* run this hook in dev — without the check the
				// script would appear twice in development and once in production.
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
