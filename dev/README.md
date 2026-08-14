# Development prototypes

These files are retained experiments and are intentionally excluded from the published npm package.

## Design system control room

`preview/App.svelte` is the local admin workspace for maintaining the design system. It provides:

- an overview of token, library and documentation health;
- token category filtering, live local overrides, reset/save state and Sass value copying;
- component, primitive and composition contract tables;
- a draggable documentation maintenance queue and guide coverage map.

Run it with:

```sh
pnpm preview
```

Token edits are intentionally browser-local and persisted in `localStorage`. Use the copy action on a token to move a value back into `templates/_tokens.sass`; the preview does not write source files from the browser.

## Visual layout builder

`prototype.html` is the runnable, self-contained visual layout builder:

```sh
pnpm preview:builder
```

Its generated class/token vocabulary predates the current Fractals Styler contract and must be aligned before it can become a supported package feature. Its state is in-memory and is lost on reload.

## Archived Svelte port

`archive/prototype-port.svelte.txt` preserves an incomplete attempt to extract the builder JavaScript into Svelte. It is intentionally stored as text because it is not a valid standalone Svelte component yet. Do not delete it; use the working HTML prototype as the behavioral reference if the port is resumed.
