# AGENTS.md — fractals-styler

This repository develops and publishes the `fractals-styler` npm package: a BEM-free,
CUBE-inspired SASS design-system scaffold. `templates/` holds the finite token/utility/
composition vocabulary that consumers receive as editable partials; `src/` holds the
Vite plugin (JIT escape hatch), the `init` CLI, and the published Svelte showcase.

This file is for agents working **on this package**. Consumer projects copy the packaged
`SNIPPET_AGENTS.md` into their own agent instructions — do not confuse the two roles.

## Start here

1. Read `package.json` first: scripts, `bin`, `exports`, and the `files` whitelist define
   the publish boundary and the supported commands.
2. Read `templates/index.sass` before changing the Sass cascade — it is the source of
   truth for which partials load and in what order.
3. Read `docs/02-principles.md` before changing any styling contract (CUBE layers, class
   grammar, attribute-driven state).
4. Read `dev/CHECKLIST.md` before touching `templates/*.sass` or `src/registry.ts` — it lists
   the mandatory synchronization points.

## Repository map

| Path                | Role                                                                                                                                                      | Ships on npm?           |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- |
| `templates/*.sass`  | The editable Sass scaffold copied into consumer projects by `init`                                                                                        | ✅ (as `templates/`)    |
| `src/cli.ts`        | `fractals-styler init [dest]` CLI; copies `templates/` (resolved as `../templates` relative to `dist/cli.js`)                                             | ✅ (as `dist/cli.js`)   |
| `src/index.ts`      | Vite plugin: JIT-generates `virtual:fractals-styler.css`                                                                                                  | ✅ (as `dist/index.js`) |
| `src/registry.ts`   | `STATIC_UTILITIES`, `DYNAMIC_PREFIXES`, `BREAKPOINTS`, `resolveDeclarations`                                                                              | ✅ (compiled into dist) |
| `src/scanner.ts`    | fast-glob scan of content files for class tokens + `--pxN` vars                                                                                           | ✅                      |
| `src/generate.ts`   | Renders CSS from a scan result                                                                                                                            | ✅                      |
| `src/lib/`          | Published Svelte showcase (`StylerPreview`, `AppShell`, `styler-preview.ts`) + mode runes adapter and `ModeToggle` — exported via `fractals-styler/lib`   | ✅                      |
| `src/mode/`         | Framework-agnostic mode/theme runtime (`types`, `inline`, `core`) — exported via `fractals-styler/mode`; `inline.ts` is also bundled into the Vite plugin | ✅                      |
| `src/builder/`      | Experimental visual layout builder. **Not** in the `files` whitelist                                                                                      | ❌                      |
| `docs/*.md`         | The progressive guide (`01-setup` … `09-mode-and-theme`)                                                                                                  | ✅ (as `docs/`)         |
| `SNIPPET_AGENTS.md` | Packaged agent instructions for consumers                                                                                                                 | ✅                      |
| `fonts/`            | Bundled OFL-1.1 fonts (`fonts/LICENSES.md`)                                                                                                               | ✅ (as `fonts/`)        |
| `preview/`          | Local "design system control room" admin workspace (`pnpm preview`)                                                                                       | ❌                      |
| `dev/`              | Retained experiments, incl. the `prototype.html` layout builder (`pnpm preview:builder`)                                                                  | ❌                      |

## Known inconsistencies (fix before relying on packaging)

- **Guide rename landed (2.3.0).** `fractal-styler-guide/` is gone; the guide lives in
  `docs/`. `package.json` `"files"` now lists `docs`, `.npmignore` no longer excludes it,
  and `SNIPPET_AGENTS.md` points consumers at `docs`. Note that `"files"` is a _whitelist_
  and takes precedence — removing an entry from `.npmignore` alone never ships a directory.
- **Working docs live in `dev/`.** `CHECKLIST.md`, `audit.md`, `gchecks.md`, `FORK_REPORT.md`,
  `SANITIZATION_REPORT.md`, `v2-2-3-prep.md` and the design-system audit report moved out of
  the repo root and out of `docs/`, so none of them reach consumers. Only the numbered guide
  (`docs/01-setup` … `docs/09-mode-and-theme`) ships.
- The worktree has uncommitted changes across most of the package. Never stage or commit
  these without asking; they are the user's in-progress work.

## Architecture rules

- Keep the finite token-driven system primary. Arbitrary numeric JIT utilities are an
  advanced escape hatch, not the public vocabulary.
- Tokens cascade: tokens → globals → composition → utilities/primitives → blocks.
  Composition provides arrangement only — no color, shadow, or decoration.
- Exceptions and state use `data-*` / `aria-*` attributes. Never introduce
  `--modifier` or `is-state` classes, and never BEM chains.
- Class grammar: short, lowercase, flat, no underscores, no double dashes
  (`layer role variant breakpoint`, e.g. `text-lg`, `pad12-sm`).
- **Never ship a `.svelte.ts` file.** Rune modules under `src/lib` must be `.svelte.js`
  (plain JS + JSDoc) with a hand-written `.d.ts` sibling. A published `.svelte.*` module is
  compiled by the consumer's vite-plugin-svelte, which runs Svelte's module compiler
  without applying their `vitePreprocess` — preprocessors do not reach dependency files —
  so TypeScript syntax fails to parse and takes the consumer's whole dependency
  optimization down. `tsc` and `svelte-check` cannot catch this; only a real consumer
  build can. Plain `.ts` (no `.svelte.` infix) is fine — it goes through esbuild/rolldown.
- Mode and theme are two axes and must stay two attributes: `data-mode` for light/dark,
  `data-theme` for named palettes. `[data-theme='light'|'dark']` and `.light`/`.dark` are
  deprecated aliases kept through 2.x; do not add new code that depends on them.
- `STATIC_UTILITIES` covers the CUBE **Utility** layer only. Never register Blocks
  (`.card`, `.input`), Compositions (`.stack`, `.reel`), marker-dependent classes
  (`.mode-*-only`), or classes from opt-in partials (`_fonts.sass`): the JIT emits its CSS
  _after_ the static system, so registering them silently overrides consumer edits.
- All Sass is indented `.sass`: one tab per nesting level, property colons, no braces,
  no semicolons, no column-aligned values. No blank line inside a nested tree; one blank
  line between unrelated selectors.
- Blocks stay lean (≤50–80 lines). Prefer semantic child classes, `data-slot`, or
  `:where(...)` over structural selectors like `.card header h3`.
- Prefer logical properties (`margin-inline`, `padding-block`, `inset-inline-start`).

## Contract boundaries

- All global custom properties belong in `templates/_tokens.sass`. Mode switching is
  `[data-mode="light|dark"]` + `prefers-color-scheme` auto (see `docs/09-mode-and-theme.md`);
  modes and themes override values, never the public vocabulary. `_colors.sass` must not
  redeclare tokens `_tokens.sass` owns — it is `@use`d later and would silently win.
  Fluid type/spacing live directly in `--text-*` / `--space-*` — there is no parallel
  `--step-*` vocabulary.
- Keep `templates/`, `src/registry.ts`, `src/lib/styler-preview.ts`, `docs/`, and examples
  synchronized when public names change. `dev/CHECKLIST.md` documents every sync point:
    - new/removed partial → update `templates/index.sass`;
    - static utility added/renamed/removed → update `STATIC_UTILITIES` in `src/registry.ts`
      (breakpoint suffixes only clone registered classes);
    - new token/type/color class → update `SEMANTIC_GROUPS` / `TYPE_LEVELS` / `TEXT_SAMPLES`
      in `src/lib/styler-preview.ts`;
    - primitive/button renames → update `src/builder/generator.ts` + `src/builder/types.ts`,
      and the inlined copy in `dev/prototype.html`;
    - mode/theme marker or storage-key change → update `MODE_DEFAULTS` in `src/mode/types.ts`
      _and_ the selectors in `_tokens.sass` + `_colors.sass`; the inline script, the runtime
      and the Sass must agree.
- Do not add the experimental builder to package exports or the npm `files` list without an
  explicit release decision.
- `_fonts.sass` is opt-in (not loaded by `index.sass`); its URLs resolve to `../fonts`.
  Never activate it with missing font files.
- JIT breakpoint suffixes (`-sm/-md/-lg/-xl`) resolve only against registered classes.
  Project-owned classes must use the `+bp-*` mixins in `templates/_mixins.sass`.

## Commands

```sh
pnpm install          # package manager is pnpm (see packageManager field)
pnpm check            # tsc --noEmit && svelte-check — the gate before committing
pnpm build            # tsup → dist/ (index.js, cli.js, index.d.ts)
pnpm format           # prettier --write .
pnpm format:check     # prettier --check .
pnpm preview          # vite dev, design-system control room (port 5174, preview/vite.config.ts)
pnpm preview:builder  # experimental layout builder (dev/prototype.html)
```

## Verification (before committing)

```sh
pnpm check
pnpm build
pnpm format:check
pnpm exec sass templates/index.sass /tmp/fractals-styler.css --no-source-map
pnpm exec vite build --config preview/vite.config.ts --outDir /tmp/fractals-styler-preview --emptyOutDir
npm pack --dry-run --ignore-scripts   # confirm dist/, templates/, fonts/, src/lib present; dev/, preview/ absent
```

This mirrors the CI workflow in `.github/workflows/`. When a change affects the Sass
vocabulary, also verify the consumer story: `node dist/cli.js init <tmpdir> --force` and
confirm the scaffolded `index.sass` compiles.

## Conventions

- Use focused conventional commits, e.g. `fix(preview): restore token reset` or
  `docs: clarify JIT escape hatch`. Include the checks you ran; attach screenshots for
  visual changes.
- When editing the `files` whitelist or `.npmignore`, re-run `npm pack --dry-run` and
  verify the tarball gains/loses exactly what you intended.
- `dev/` and `preview/` are retained private experiments. Read `dev/README.md` before
  changing them; do not delete `dev/archive/prototype-port.svelte.txt`.
