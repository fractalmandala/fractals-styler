# Contributing

## Development

```sh
pnpm install
pnpm check
pnpm build
```

Run the token preview with `pnpm preview`. Run the retained experimental visual builder with `pnpm preview:builder`.

## Styling contract

- Reuse an existing token or utility before adding another.
- Keep global custom properties in `templates/_tokens.sass`.
- Keep Sass templates, the TypeScript registry, preview registries and documentation aligned.
- Use indented Sass with one tab per nesting level, no braces and no semicolons.
- Prefer CUBE layers and data/ARIA exceptions over BEM chains.

## Commits and pull requests

Use focused conventional commits such as `fix(preview): restore token reset` or `docs: clarify JIT escape hatch`. Include the checks you ran and screenshots for visual changes.
