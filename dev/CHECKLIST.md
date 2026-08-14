# fractals-styler — Template Change & Release Checklist

This document outlines the mandatory verification and synchronization steps required whenever changes are made to `.sass` template files, utility classes, or design tokens within `fractals-styler`.

---

## 1. Synchronization Checklist for `.sass` Template Edits

Whenever you modify, add, or remove any file or class inside [`templates/`](file:///Users/amrit/fractalmandala/fractals-styler/templates), execute the following checks:

### A. Partial Barrel Sync (`templates/index.sass`)

- [ ] **New File Added:** If you added a new `.sass` partial (e.g., `templates/_grid-layout.sass`), add `@use 'grid-layout'` to [`templates/index.sass`](file:///Users/amrit/fractalmandala/fractals-styler/templates/index.sass).
- [ ] **File Removed:** If a partial was deleted, remove its corresponding `@use` directive from [`templates/index.sass`](file:///Users/amrit/fractalmandala/fractals-styler/templates/index.sass).

### B. JIT Compiler Registry Sync (`src/registry.ts`)

- [ ] **Static Utilities Updated:** If you added, renamed, or deleted static utility classes in `templates/*.sass` (such as `.box`, `.row`, `.w100`, `.radius-*`, `.text-*`, `.border-*`), update `STATIC_UTILITIES` in [`src/registry.ts`](file:///Users/amrit/fractalmandala/fractals-styler/src/registry.ts).
    > **Why?** The Vite JIT compiler reads `STATIC_UTILITIES` to clone classes for responsive breakpoint suffixes (e.g. `.box-md`, `.text-lg-xl`). If a class is missing in `STATIC_UTILITIES`, responsive suffixes won't generate CSS rules.
- [ ] **Dynamic Prefixes Updated:** If you added a new numerical unit prefix (e.g. `gap16`, `pad20`), ensure the property mapping is registered in `DYNAMIC_PREFIXES` in [`src/registry.ts`](file:///Users/amrit/fractalmandala/fractals-styler/src/registry.ts).

### C. Live Token Preview Sync (`src/lib/styler-preview.ts`)

- [ ] **New Color Tokens:** If new CSS custom properties were added to `_tokens.sass` (e.g., `--bg-subtle`), add them to `SEMANTIC_GROUPS` in [`src/lib/styler-preview.ts`](file:///Users/amrit/fractalmandala/fractals-styler/src/lib/styler-preview.ts).
- [ ] **Font Scale Steps:** If new typography font-size tokens were introduced in `_tokens.sass` or `_typography.sass`, update `TYPE_LEVELS` in [`src/lib/styler-preview.ts`](file:///Users/amrit/fractalmandala/fractals-styler/src/lib/styler-preview.ts).
- [ ] **Text Color Samples:** If new text color classes were added, update `TEXT_SAMPLES` in [`src/lib/styler-preview.ts`](file:///Users/amrit/fractalmandala/fractals-styler/src/lib/styler-preview.ts).

> **Do not register everything.** `STATIC_UTILITIES` covers the CUBE **Utility** layer only.
> The JIT's output loads _after_ the static system, so anything listed there silently
> overrides consumer customisation of that class. Keep out: Blocks (`.card`, `.badge`,
> `.input`), Compositions (`.stack`, `.reel`, `.frame`), marker-dependent classes
> (`.mode-light-only`), element-qualified globals (`button.blank`), and classes from
> opt-in partials that `index.sass` does not `@use` (`_fonts.sass`).

### D. Prototype Generator Sync (`src/builder/generator.ts` & `src/builder/types.ts`)

- [ ] **Primitive & Button Class Renames:** If core structural classes (`.box`, `.row`, `.grid`) or button variants (`.button`, `.button-primary`, `.button-quiet`, `.icon-button`) were renamed, update `clsMap` and HTML generation logic in [`src/builder/generator.ts`](file:///Users/amrit/fractalmandala/fractals-styler/src/builder/generator.ts) and types in [`src/builder/types.ts`](file:///Users/amrit/fractalmandala/fractals-styler/src/builder/types.ts).
- [ ] **Token-Valued Unions:** `SurfaceToken`, `RadiusToken`, `ShadowToken` and `FontSizeToken` in `src/builder/types.ts` are literal **class names**. If a `.radius-*`, `.shadow-*`, `.bg-*` or `.text-*` class is added or renamed, update the union — a stale member is emitted verbatim into `class=""` and matches nothing.
- [ ] **Every Class the Builder Emits Must Exist:** `generateHtml` pushes class names directly. After any change, cross-check its output against `STATIC_UTILITIES` and `DYNAMIC_PREFIXES`. Breakpoint variants use the `-sm` **suffix**, never a `sm:` prefix.
- [ ] **Standalone Builder:** `dev/prototype.html` carries its own inlined copy of the node model, generator and control vocabulary. Apply the same changes there or it drifts silently.

### E. Mode & Theme Contract Sync

- [ ] **Marker Selectors:** Mode blocks must use `[data-mode='dark'], [data-theme='dark'], .dark` (and the light equivalent) in **both** `_tokens.sass` and `_colors.sass`. `data-theme`/`.dark` are deprecated aliases retained through 2.x.
- [ ] **The `:root` Default Survives:** `_tokens.sass` must keep a complete palette on bare `:root`. Removing it leaves every colour undefined whenever no marker lands (JS off, SSR, crawler).
- [ ] **Guard Specificity:** The `prefers-color-scheme` block must stay `:root:not(:where(...))`. Dropping `:where()` raises it to (0,3,0) and it starts beating the explicit overrides.
- [ ] **Token Ownership:** `_colors.sass` must not redeclare tokens `_tokens.sass` owns (`--border`, `--ring`). It is `@use`d later, so any redeclaration silently wins.
- [ ] **`color-scheme`:** every mode block sets it, or browser chrome stops matching the palette.
- [ ] **Runtime Defaults:** attribute and storage-key names live in `MODE_DEFAULTS` (`src/mode/types.ts`). The inline script, the runtime and the Sass selectors must agree.

---

## 2. Preventing `dev/` & `preview/` from Entering Published Package

`dev/` and `preview/` are local development/testing workspaces and **must never** be included in published npm tarballs.

### Primary Mechanism: `package.json` `"files"` Array

NPM and PNPM strictly honor the `"files"` array in [`package.json`](file:///Users/amrit/fractalmandala/fractals-styler/package.json) as a white-list. Only items explicitly listed are included in the published `.tgz` tarball.

```json
"files": [
  "CHANGELOG.md",
  "dist",
  "templates",
  "docs",
  "fonts",
  "src/lib",
  "src/mode",
  "SNIPPET_AGENTS.md"
]
```

### Safety Net: `.npmignore`

To provide absolute guarantee across all tooling, an `.npmignore` file is maintained at package root excluding dev workspaces:

> `"files"` is a whitelist and wins over `.npmignore`. A directory absent from `"files"`
> is never published, however permissive `.npmignore` is — and one listed in `"files"` but
> missing from disk (as `fractal-styler-guide` was) is silently skipped, not an error.

```ignore
dev/
preview/
testing-results/
.github/
.vscode/
.DS_Store
*.log
```

---

## 3. Step-by-step NPM Publish Procedure

Follow these steps to publish an updated version of `fractals-styler` to npm:

### Step 1: Run Verification & Type Check

```bash
pnpm check
```

Ensures TypeScript (`tsc --noEmit`) and Svelte (`svelte-check`) pass cleanly.

### Step 2: Build Dist Output

```bash
pnpm build
```

Compiles TypeScript entries (`src/index.ts` & `src/cli.ts`) into `dist/` via `tsup`.

### Step 3: Test Tarball Contents (Dry-Run)

```bash
pnpm pack --dry-run
```

Inspect the output tarball contents to confirm:

- [ ] `dist/index.js`, `dist/cli.js`, and `dist/index.d.ts` are present.
- [ ] `templates/*.sass` files are present.
- [ ] `fonts/`, `src/lib/` and `src/mode/` are present.
- [ ] `docs/*.md` are present (the consumer guide `SNIPPET_AGENTS.md` points at them).
- [ ] `dev/` and `preview/` are **absent**.

### Step 4: Bump Package Version

Update the version in `package.json` and document changes:

```bash
# E.g. for a patch release:
npm version patch --no-git-tag-version
```

Update `CHANGELOG.md` with release notes.

### Step 5: Publish Package

```bash
# If publishing to public npm registry:
npm publish --access public
# Or using pnpm:
pnpm publish --access public
```

### Step 6: Sync Consuming Downstream Projects

In projects that use `fractals-styler` (e.g. `fractalsvelte`, `mandala-docs`, `newripple`), sync the newly updated template SASS files into the project:

```bash
npx fractals-styler init <path-to-project>/src/lib/styles --force
```
