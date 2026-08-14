# Changelog

## 2.3.2

### Fixed

- The plugin no longer registers `transformIndexHtml` in a SvelteKit project. SvelteKit inspects every registered plugin for that hook and warns that it is unsupported, so simply declaring it printed `The following plugins may not work correctly because they use the transformIndexHtml hook which is not supported: fractals-styler` on every build — three times per build, for the package's primary target. The hook was already redundant there, since `init` patches `src/app.html`. Detection happens at plugin construction (a hook cannot be removed later from `configResolved`), by resolving `@sveltejs/kit` from the Vite root.
- Plain Vite projects are unaffected and still get the injected script.

### Added

- When SvelteKit is detected and `src/app.html` carries no mode script, the plugin says so once at startup instead of silently shipping nothing. Previously an unpatched project got dev-only injection and no production script, with no signal. Silence it with `mode: false`.

## 2.3.1

### Fixed

- `_globals.sass` now sets `background: var(--bg)` on `body, html`. It set `color` but never the background, and nothing else in the cascade painted it — so on 2.3.0 the mode system worked correctly while the page stayed white in dark mode. A palette that resolves but is never applied is indistinguishable from one that never resolved, which makes this a slow bug to find. Existing projects can add the one line to their own `_globals.sass` rather than re-running `init --force`.

## 2.3.0

### Added — mode and theme

- **Mode/theme runtime** (`fractals-styler/mode`, `fractals-styler/lib`). Framework-agnostic core with a `subscribe()` seam, plus a Svelte 5 runes adapter (`mode.current`, `preference`, `systemMode`, `theme`, `setMode`/`toggleMode`/`resetMode`/`setTheme`) and a prebuilt `ModeToggle`. Handles OS-preference changes, cross-tab sync via the `storage` event, and transition suppression during a switch.
- **Flash prevention with no consumer setup.** The Vite plugin injects the blocking `<head>` script via `transformIndexHtml`, and `fractals-styler init` patches `src/app.html` for SvelteKit (whose production build does not run that hook). Both are idempotent via the `data-fractals-styler-mode` marker. Opt out with `fractalsStyler({ mode: false })`.
- `color-scheme` is now set alongside the palette in every mode block, so scrollbars and form controls match.
- `.mode-light-only` / `.mode-dark-only` visibility utilities, for toggle icons that cannot desynchronise during SSR.
- New utilities in `_primitives.sass`: `.w100vw`, `.h100vh`, `.col-span-2…6`, `.row-span-2…6`, `.shadow-sm|md|lg`, `.bg`, `.bg-surface`, `.bg-raised`.
- `docs/09-mode-and-theme.md` — the mode/theme model from first principles.

### Changed

- **Mode is keyed off `data-mode`.** `data-theme` is now reserved for named themes, which is what it always meant elsewhere in the ecosystem. `[data-theme='light'|'dark']` and `.light`/`.dark` are retained as **deprecated aliases** on every mode block and will be removed in 3.0.
- The `prefers-color-scheme` guard is now `:root:not(:where([data-mode='light'], …))`. Wrapping the guard in `:where()` keeps it at (0,1,0) so explicit overrides win on source order rather than needing inflated selectors.
- `_colors.sass` no longer redeclares `--border` and `--ring`. It is `@use`d after `_tokens.sass`, so it had been silently overwriting them — `.border` resolved to `$oc-gray-3` while `_tokens.sass` claimed `#e2e8f0`. **Light-mode borders shift from `#dee2e6` to `#e2e8f0`.** `--input` is now a live `var(--border)` alias.
- `_colors.sass` dark overrides moved from `.dark` to the shared mode selector, so its semantic layer follows the same axis as the tokens.
- `STATIC_UTILITIES` gains `body-std`, `page-title`, `eyebrow` and the new primitives above, and documents why Blocks, Compositions, marker-dependent and opt-in classes stay out.
- `AppShell.svelte` markup now uses the `_compositions.sass` vocabulary (`.body-main`, `.sidebar-left`, `.sidebar-right`) instead of its own `.bodymain`/`.sidebarleft` names, and its scoped styles no longer reference `--space-8`/`--space-4`, which have not existed since the scale became t-shirt named. Snippet prop names (`sidebarleft`, `sidebarright`) are unchanged.

### Packaging

- The guide now ships. `package.json` `"files"` lists `docs` in place of the deleted `fractal-styler-guide`, and `.npmignore` no longer excludes it — `"files"` is a whitelist and takes precedence, so removing the `.npmignore` entry alone was not enough. `src/mode` is whitelisted too.
- New subpath export `fractals-styler/mode`.

### Fixed

- `TYPE_LEVELS` in the showcase listed `--text-bs` and `--text-5xl`, which have never existed in `_tokens.sass` — two swatches rendered with nothing behind them.
- The showcase mode toggle now delegates to the shared runtime, so it persists and syncs like the app's own toggle instead of writing a one-off attribute the runtime would overwrite.
- Builder: `RadiusToken` values were unhyphenated (`radius12`) and emitted verbatim into `class=""`, matching nothing — now `radius-12`, and `radius-24` is no longer missing.
- Builder: `SurfaceToken` included `panel` and `subtle`, generating `var(--bg-panel)` / `var(--bg-subtle)`, which do not exist. Values are now the three real background tokens.
- Builder: emitted `sm:row` for breakpoint variants, but the JIT only recognises the `-sm` suffix — now `row-sm` / `box-sm`.
- Builder: `w100vw`, `h100vh`, `col-span-*`, `row-span-*` and `shadow-*` were emitted as classes that existed nowhere; they now exist. Default `fontSize` was `font14`, also not a class — now `text-md`.
- `dev/prototype.html` re-synced to the same vocabulary.

## 2.2.1 — 2026-08-12

- Publish the standalone `fractalmandala/fractals-styler` package.
- Add MIT licensing, CI verification, and release metadata.
- Retain the development preview/builder outside the npm package while shipping the static templates, guide, fonts, and `SNIPPET_AGENTS.md`.

## 2.2.0

- Initial package release.
