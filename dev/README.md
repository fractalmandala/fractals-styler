# Development prototypes

These files are retained experiments and are intentionally excluded from the published npm package.

## Visual layout builder

`prototype.html` is the runnable, self-contained visual layout builder:

```sh
pnpm preview:builder
```

Its generated class/token vocabulary predates the current Fractals Styler contract and must be aligned before it can become a supported package feature. Its state is in-memory and is lost on reload.

## Archived Svelte port

`archive/prototype-port.svelte.txt` preserves an incomplete attempt to extract the builder JavaScript into Svelte. It is intentionally stored as text because it is not a valid standalone Svelte component yet. Do not delete it; use the working HTML prototype as the behavioral reference if the port is resumed.
