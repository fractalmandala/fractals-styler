#!/usr/bin/env node
import {
	existsSync,
	mkdirSync,
	readdirSync,
	copyFileSync,
	readFileSync,
	writeFileSync
} from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildInlineScriptTag } from './mode/inline.js';
import { INLINE_SCRIPT_MARKER } from './mode/types.js';

const HERE = dirname(fileURLToPath(import.meta.url));
const TEMPLATES_DIR = join(HERE, '..', 'templates');

/** SvelteKit renders `src/app.html` through its own pipeline, which does not run Vite's
 * `transformIndexHtml` on a production build — so the plugin's injection covers dev but
 * silently vanishes in prod, which is exactly when the flash matters. Patch the file
 * directly instead. Idempotent via the marker attribute, which the plugin also checks. */
function patchAppHtml(): void {
	const target = 'src/app.html';
	if (!existsSync(target)) return;

	const html = readFileSync(target, 'utf-8');
	if (html.includes(INLINE_SCRIPT_MARKER)) {
		console.log(`skip   ${target} (mode script already present)`);
		return;
	}

	// Must land before %sveltekit.head% so it runs ahead of the stylesheet links Kit
	// injects there. Anything later and the browser paints once with the wrong palette.
	const anchor = '%sveltekit.head%';
	if (!html.includes(anchor)) {
		console.log(`skip   ${target} (no ${anchor} found — add the script manually)`);
		return;
	}

	const snippet = `\t\t${buildInlineScriptTag()}\n\t\t${anchor}`;
	writeFileSync(target, html.replace(anchor, snippet), 'utf-8');
	console.log(`patch  ${target} (mode script injected before ${anchor})`);
}

function printUsage(): void {
	console.log(`fractals-styler init [dest]

Copies the static SASS partials into [dest] so you can edit and theme the
finite design system directly in your project.

  dest      Destination directory (default: src/lib/styles)
  --force   Overwrite files that already exist at the destination
`);
}

function init(destArg: string | undefined, force: boolean): void {
	const dest = destArg ?? 'src/lib/styles';
	mkdirSync(dest, { recursive: true });

	const files = readdirSync(TEMPLATES_DIR);
	let copied = 0;
	let skipped = 0;

	for (const file of files) {
		const target = join(dest, file);
		if (existsSync(target) && !force) {
			console.log(`skip   ${target} (already exists, use --force to overwrite)`);
			skipped++;
			continue;
		}
		copyFileSync(join(TEMPLATES_DIR, file), target);
		console.log(`create ${target}`);
		copied++;
	}

	patchAppHtml();

	console.log(`\n${copied} file(s) written, ${skipped} skipped.`);
	console.log(`
Next steps:
  1. Import the static design system once in your root layout:
       import '$lib/styles/index.sass';

  2. Optional advanced JIT escape hatch — in your Vite config:
       import fractalsStyler from 'fractals-styler';
       export default { plugins: [sveltekit(), fractalsStyler()] };

     Then import its generated CSS after the static system:
       import 'virtual:fractals-styler.css';

  3. Light/dark mode works with no further setup — the blocking script is either
     patched into src/app.html (above) or injected by the Vite plugin. Add a toggle:
       import { ModeToggle } from 'fractals-styler/lib';
     See docs/09-mode-and-theme.md for the mode/theme contract.
`);
}

const [command, ...rest] = process.argv.slice(2);
const force = rest.includes('--force');
const positional = rest.filter((a) => !a.startsWith('--'));

if (command === 'init') {
	init(positional[0], force);
} else {
	printUsage();
	process.exit(command ? 1 : 0);
}
