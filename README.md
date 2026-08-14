# About Fractals Styler

A CUBE, Utopia, and Every Layout inspired SASS design-system. Its finite token scale, typography utilities, layout primitives and compositions are the default vocabulary. The Vite plugin retains arbitrary numeric utilities as an advanced escape hatch for exploratory design. Color tokens are set to for compatibility with general themeing systems and the W3C design token standard.

The system is opinionated about a few things -

1. Styling syntax should be human legible and avoid `__`, `&__`, `> *` kind of usage patterns.
2. To know the "value" of something, one should not have to chase upwards a series of variables like `--thisvar` is set to `(--this-other-var)` which is defined by `$this-token`. Reduce cognitive load always.
3. A styling system like this should ensure responsiveness, standards for size, padding, typography etc. and leave the rest- the actual front-end - to the user. Colors, fonts, fixed-configs vs. fully dynamic, these should not be set by the sytem.

Read the complete documentation to understand the Fractals Styler beginning from [here](docs/01-setup.md).

## Setup Instructions

- A Vite-based project (SvelteKit is the primary target, but the plugin itself is framework-agnostic).
- `sass` installed for `.sass` support:

    ```sh
    pnpm add -D sass
    ```

This package is published on npm [![npm version](https://img.shields.io/npm/v/fractals-styler.svg)](https://www.npmjs.com/package/fractals-styler)
`pnpm add fractals-styler` / `pnpm dlx fractals-styler` will work. Pick the option that matches where you're installing it:

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
├── _buttonslinks.sass
├── _colors.sass
├──  _compositions.sass
├── _fonts.sass
├── _globals.sass
├── _mixins.sass
├── _primitives.sass
├── _tokens.sass
├── _typography.sass
└── index.sass
```

`_fonts.sass` is installed but not loaded by default. Before adding `@use 'fonts'`, either copy the packaged font files into the path expected by that partial or update its URLs to the project's actual font location. The bundled fonts retain their third-party SIL OFL-1.1 terms; see `fonts/LICENSES.md`.

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
	<p class="body-std">The same public classes work across projects.</p>
</article>
```

## Light and Dark Mode

Mode works out of the box — there is no component to mount and no provider to wrap.

`init` writes the flash-preventing script into `src/app.html`, and the Vite plugin injects it into `index.html` for non-SvelteKit projects. Either way it runs before first paint, so the correct palette is on screen immediately, with no flash and no hydration mismatch.

Add a toggle wherever you want one:

```svelte
<script>
	import { ModeToggle } from 'fractals-styler/lib';
</script>

<ModeToggle />
```

Or drive it yourself:

```svelte
<script>
	import { mode, preference, toggleMode, resetMode } from 'fractals-styler/lib';
</script>

<button onclick={toggleMode}>Currently {mode.current}</button>
{#if preference.current !== 'system'}
	<button onclick={resetMode}>Follow system</button>
{/if}
```

Outside Svelte, `import { initMode } from 'fractals-styler/mode'` gives the same runtime with a `subscribe()` callback.

The system follows the OS by default, persists an explicit choice, syncs across open tabs, and suppresses transitions during the switch so the page does not animate every colour at once. Mode is written to `data-mode`; `data-theme` is reserved for named palettes via `setTheme()`. Opt out of the injected script with `fractalsStyler({ mode: false })`.

See [docs/09-mode-and-theme.md](docs/09-mode-and-theme.md) for the model behind it.

## Advanced Setup

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

Then import the generated stylesheet after `index.sass`:

```svelte
<script>
	import '$lib/styles/index.sass';
	import 'virtual:fractals-styler.css';
</script>

<slot />
```

Use numeric JIT classes only for exploratory work and genuine one-offs:

```svelte
<div class="row gap18 pad22 pad12-sm width320">…</div>
```

The plugin supports non-negative numeric padding, margin, gap, width and height families, plus `-sm`, `-md`, `-lg` and `-xl` breakpoint suffixes. When a value recurs, promote it into `_tokens.sass` and a named static class instead of letting an accidental scale spread.

## Development previews

Run the supported token and theme preview:

```sh
pnpm preview
```

The repository also retains an experimental visual layout builder:

```sh
pnpm preview:builder
```

The builder is private development material, is not included in the npm package, and still emits parts of the older class/token vocabulary. See `dev/README.md` before changing it.

## Troubleshooting

**`virtual:fractals-styler.css` 404s / "Failed to resolve import"**
Make sure `fractalsStyler()` is in your `vite.config.ts` plugins array — the virtual module only resolves while the plugin is active.

**New classes I just typed aren't showing up in dev**
The plugin reloads on file save; if you're seeing stale CSS, check that the file you're editing matches the `content` globs passed to `fractalsStyler()` (default: `src/**/*.{svelte,html,js,ts,jsx,tsx,mjs}`).

**A class like `card-sm` does nothing**
Breakpoint suffixes only resolve against classes the package itself defines (numeric utilities and registered static classes such as `.box`, `.row`, `.grid`, `.border`, `.radius-12` and the typography utilities). For your own classes, use the `_mixins.sass` `+bp-*` mixins instead.

**Sass build errors after `init`**
Confirm `sass` is installed (`pnpm add -D sass`) and that your `@import`/`@use` path in the layout points at wherever you ran `init` (default `$lib/styles/index.sass`).

## License

The software is available under the [MIT License](LICENSE). Bundled fonts are
licensed separately under the terms documented in [fonts/LICENSES.md](fonts/LICENSES.md).

See [CHANGELOG.md](CHANGELOG.md) for release history.
