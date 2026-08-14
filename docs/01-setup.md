---
title: Setting Up Fractals Styler
---

Prerequisites

- A Vite-based project (SvelteKit is the primary target, but the plugin itself is framework-agnostic).
- `sass` installed for `.sass` support:

    ```sh
    pnpm add -D sass
    ```

This package is **published to npm** — `pnpm add fractals-styler` / `pnpm dlx fractals-styler` will work. Pick the option that matches where you're installing it:
Bump `version` in `package.json` per release. Once published, every command in this guide using `pnpm add fractals-styler` / `pnpm dlx fractals-styler` works in any project as written.

```sh
npm login
npm publish
```

## Install in Projects

```sh
pnpm add fractals-styler
pnpm dlx fractals-styler init
```

You can also `pnpm dlx fractals-styler init src/themer` to install in custom location
Once installed (any option above), run the CLI with whichever invocation matches your package manager and install method:

```sh
pnpm dlx fractals-styler init        # works once published (option C)
# or, if installed locally as a dependency already:
pnpm exec fractals-styler init
# or, directly against a local checkout without installing at all:
node /path/to/fractals-styler/dist/cli.js init
```

Defaults to `src/lib/styles`. Pass a different path if you keep styles elsewhere:

```sh
pnpm exec fractals-styler init src/lib/styles/system
```

If a file already exists at the destination, `init` skips it and tells you. Pass `--force` to overwrite (careful — this clobbers any edits you've made to the scaffolded files):

```sh
pnpm exec fractals-styler init --force
```

You should now have:

```
src/lib/styles/
├── _tokens.sass
├── _colors.sass
├── _fonts.sass
├── _typography.sass
├── _globals.sass
├── _primitives.sass
├── _compositions.sass
├── _buttonslinks.sass
├── _mixins.sass
└── index.sass
```

`_fonts.sass` is installed but is not loaded by the default `index.sass`. Its bundled font URLs resolve to `../fonts` relative to the style directory. Before activating it with `@use 'fonts'`, copy the required files from `node_modules/fractals-styler/fonts` into that resolved directory or update the URLs to your project's font location.

## Add the agent instructions

The package includes `SNIPPET_AGENTS.md`, a progressive-discovery index for coding agents. It tells an agent which installed Sass partial owns each kind of styling change, routes deeper questions to one of the eight packaged guide files, and records the system's token, CUBE, naming and indented-Sass rules.

After installing the package, open:

```text
node_modules/fractals-styler/SNIPPET_AGENTS.md
```

Copy its complete `## Fractals Styler` section into the root `AGENTS.md` for your project. Append it to the project's existing instructions; do not replace unrelated project rules. If you installed the Sass scaffold somewhere other than `$lib/styles` (`src/lib/styles`), update the copied paths to match your destination.

Review the packaged snippet when upgrading `fractals-styler` and bring material instruction changes into your project copy. The package does not overwrite your `AGENTS.md` automatically.

Retain this cascade and ranking in the `index.sass`:

```
@forward 'mixins'
@use 'tokens'
@use 'colors'
@use 'typography'
@use 'globals'
@use 'primitives'
@use 'compositions'
@use 'buttonslinks'
```

## Step 2 — Import the static system globally

In your root layout (`src/routes/+layout.svelte`):

```svelte
<script>
	import '$lib/styles/index.sass';
</script>

<slot />
```

Start with the finite, token-driven vocabulary:

```svelte
<article class="box stack border radius-12">
	<h2 class="text-xl fw600">A token-driven panel</h2>
	<p class="text-sm text-secondary">The same public classes work across projects.</p>
</article>
```

## Advanced: arbitrary numeric utilities

Only wire up the Vite plugin when the finite system does not cover exploratory or genuinely one-off values. Edit `vite.config.ts`:

```ts
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import fractalsStyler from 'fractals-styler';

export default defineConfig({
	plugins: [sveltekit(), fractalsStyler()]
});
```

If your source lives somewhere other than `src/`, or you want to limit/extend which files get scanned for class usage, pass `content`:

```ts
fractalsStyler({
	content: ['src/**/*.{svelte,html,js,ts,jsx,tsx}', 'src/lib/**/*.svelte']
});
```

Then import its generated stylesheet after `index.sass`:

```svelte
<script>
	import '$lib/styles/index.sass';
	import 'virtual:fractals-styler.css';
</script>

<slot />
```

Use numeric JIT classes only for exploratory work and genuine one-offs:

```svelte
<div class="box gap16 pad24 text-lg fw600">
	<div class="row gap8 padtop12-sm">
		<button class="blank">Click</button>
	</div>
</div>
```

When a value recurs, promote it into `_tokens.sass` and a named static class instead of letting an accidental scale spread.

## Troubleshooting

**`virtual:fractals-styler.css` 404s / "Failed to resolve import"**
Make sure `fractalsStyler()` is in your `vite.config.ts` plugins array — the virtual module only resolves while the plugin is active.

**New classes I just typed aren't showing up in dev**
The plugin reloads on file save; if you're seeing stale CSS, check that the file you're editing matches the `content` globs passed to `fractalsStyler()` (default: `src/**/*.{svelte,html,js,ts,jsx,tsx,mjs}`).

**A class like `card-sm` does nothing**
Breakpoint suffixes only resolve against classes the package itself defines (numeric utilities and registered static classes such as `.box`, `.row`, `.grid`, `.border`, `.radius-12` and the typography utilities). For your own classes, use the `_mixins.sass` `+bp-*` mixins instead — see above.

**Sass build errors after `init`**
Confirm `sass` is installed (`pnpm add -D sass`) and that your `@import`/`@use` path in the layout points at wherever you ran `init` (default `$lib/styles/index.sass`).
