# Repository instructions

This repository develops the `fractals-styler` package. Consumer projects receive editable Sass partials from `templates/` and may copy `SNIPPET_AGENTS.md` into their own agent instructions.

## Start here

1. Read `package.json` for the supported commands and publish boundary.
2. Read `templates/index.sass` before changing the Sass cascade.
3. Use `fractal-styler-guide/` for the intended token, utility, composition and CUBE contracts.
4. Keep `dev/prototype.html` and `src/builder/`. They are retained private experiments and intentionally excluded from the npm `files` list.

## Contract boundaries

- All global custom properties belong in `templates/_tokens.sass`.
- Keep `templates/`, `src/registry.ts`, `src/lib/styler-preview.ts`, documentation and examples synchronized when public names change.
- Use indented `.sass`: tabs for nesting, property colons, no braces or semicolons.
- Keep the finite token-driven system primary. Arbitrary numeric JIT utilities are an advanced escape hatch.
- Use data or ARIA attributes for exceptions and state; do not introduce BEM modifier chains.
- Do not add the experimental builder to package exports or npm-published files without an explicit release decision.

## Verification

Run before committing:

```sh
pnpm check
pnpm build
pnpm format:check
pnpm exec sass templates/index.sass /tmp/fractals-styler.css --no-source-map
pnpm exec vite build --config preview/vite.config.ts --outDir /tmp/fractals-styler-preview --emptyOutDir
npm pack --dry-run --ignore-scripts
```
