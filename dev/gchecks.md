---
title: google chat
---

1. **Created CHECKLIST.md**: A complete checklist covering
   every file in src/ and templates/ that requires
   synchronization whenever .sass templates or utility
   classes change.
2. **Created .npmignore**: Formally excludes dev/,
   preview/, testing-results/, and .github/ from being
   packaged.
   ──────

### 1. Exclusion of dev/ and preview/ Folders

dev/ and preview/ are local development/testing workspaces and will not end up in published tarballs because of two complementary mechanisms:

1. Primary Whitelist (package.json "files"):
   package.json contains an explicit whitelist array:
   "files": [
   "CHANGELOG.md",
   "dist",
   "templates",
   "fractal-styler-guide",
   "fonts",
   "src/lib",
   "SNIPPET_AGENTS.md"
   ]
   NPM and PNPM only package files in this array (plus root
   package.json, README, LICENSE). Anything not listed (dev/,
   preview/) is ignored automatically.
2. Secondary Guard (.npmignore):
   We added .npmignore to double-ensure safety across all
   package managers:
   dev/
   preview/
   docs/
   testing-results/
   .github/

──────

### 2. Synchronization Checklist for Template Changes

Whenever .sass files or utility classes are added, deleted, or renamed in templates:

[ ] Partial Barrel Import (templates/index.sass)
If a new .sass partial file was added (e.g. _card.sass),
add @use 'card' to index.sass.
[ ] JIT Compiler Registry (src/registry.ts)
If static utility classes were added, renamed, or removed,
update STATIC_UTILITIES in registry.ts so responsive
suffixes (.box-md, .text-lg-xl) continue to work.
[ ] Live Token Preview (src/lib/styler-preview.ts)
If new color tokens, font scales, or text samples were
added to _tokens.sass, update SEMANTIC_GROUPS, TYPE_LEVELS,
or TEXT_SAMPLES in styler-preview.ts.
[ ] Builder Primitive Generator (src/builder/generator.ts
& src/builder/types.ts)
If fundamental primitive classes (.box, .row, .grid) or
button variants (.button, .button-primary, etc.) were
renamed, update generator.ts.
──────

### 3. Step-by-Step NPM Publishing Guide

When ready to publish an updated package to NPM:

1. Run Typecheck:
   pnpm check

2. Build TS Outputs (dist/cli.js & dist/index.js): pnpm build

3. Verify Published Tarball (Dry Run):
   pnpm pack --dry-run
   (Confirm that dist/, templates/, fonts/ are included, and
   dev/ / preview/ are absent).
4. Bump Version & Update Changelog:
   npm version patch # or minor / major

5. Publish to NPM:
   npm publish --access public

6. Sync Downstream Consuming Apps:
   In projects consuming fractals-styler (e.g., fractalsvelte,
   mandala-docs, newripple), sync the newly published
   templates:
   npx fractals-styler init <path-to-
     project>/src/lib/styles --force
