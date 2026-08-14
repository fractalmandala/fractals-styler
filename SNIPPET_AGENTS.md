## Fractals Styler

This project uses `fractals-styler`: a BEM-free, CUBE CSS-inspired styling system built from editable indented Sass partials, with JIT-generated values available as an advanced escape hatch.

The installed style directory is `$lib/styles` (normally `src/lib/styles`). If this project installed the scaffold elsewhere, replace that path throughout these instructions with the actual location.

### Start here

For every styling task:

1. Read `$lib/styles/index.sass` first. It is the source of truth for which partials are active and their cascade order.
2. Search `$lib/styles` for an existing token, utility, composition or block before adding anything.
3. Read only the partial that owns the requested kind of change, using the index below.
4. Make the change at the highest reusable layer that correctly owns it.
5. Verify the consuming markup and run the project's normal check/build command.

The files under `$lib/styles` are project-owned copies created by `fractals-styler init`. Edit those copies. Never edit the corresponding files under `node_modules/fractals-styler/templates`.

### Progressive discovery index

| Styling task                                                                                   | Read first                                                                                | Responsibility                                                                                                                                                                        |
| ---------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Determine active files or cascade order                                                        | `$lib/styles/index.sass`                                                                  | Loads the partials. Add every new style partial here in the correct order.                                                                                                            |
| Change colors, themes, type sizes, spacing scales, radii, shadows, z-index or layout constants | `$lib/styles/_tokens.sass`                                                                | All global custom properties and theme overrides. Fluid behavior lives directly in `--text-*` and `--space-*`; do not add a parallel step vocabulary.                                 |
| Add or change bundled/local font faces and font-family utilities                               | `$lib/styles/_fonts.sass`, then `$lib/styles/index.sass`                                  | `@font-face` declarations and font-family helpers. This partial is opt-in; follow the font activation note below before loading it. Keep public font-family tokens in `_tokens.sass`. |
| Change line heights, weights, text alignment, text utilities or semantic type roles            | `$lib/styles/_typography.sass`                                                            | One-job text utilities and thin roles such as `.body-std` or `.page-title`. Token values stay in `_tokens.sass`.                                                                      |
| Change resets or defaults for `html`, `body`, headings, form elements or box sizing            | `$lib/styles/_globals.sass`                                                               | Low-specificity global defaults and normalization only.                                                                                                                               |
| Change `.box`, `.row`, `.grid`, alignment, width/height, border or surface helpers             | `$lib/styles/_primitives.sass`                                                            | Small reusable layout and visual primitives. Check the container context before changing axis helpers such as `.xcenter` or `.ycenter`.                                               |
| Change page shells, flow, rhythm, rails, stacks, clusters, reels or intrinsic layouts          | `$lib/styles/_compositions.sass`                                                          | Flexible macro layout and element relationships. Composition must not provide color, typography, shadows or decorative treatment.                                                     |
| Change buttons, links or shared form controls                                                  | `$lib/styles/_buttonslinks.sass`                                                          | Skeletal interactive blocks, focus-visible behavior and attribute-driven variants/states.                                                                                             |
| Add a custom responsive rule to a project-owned class                                          | `$lib/styles/_mixins.sass`                                                                | Mobile-first `+bp-sm`, `+bp-md`, `+bp-lg` and `+bp-xl` mixins.                                                                                                                        |
| Change advanced numeric JIT classes such as `gap18`, `pad22` or breakpoint suffix behavior     | The project's `vite.config.*`, then the installed `fractals-styler` package documentation | These escape-hatch rules come from `virtual:fractals-styler.css`, not the Sass partials. Promote recurring values into the token system.                                              |
| Style one genuine component context                                                            | Search for an existing block partial loaded by `$lib/styles/index.sass`                   | Add a small, focused block partial only when globals, composition and utilities cannot express the component.                                                                         |

### Deeper reference

The installed package contains a progressive guide under `docs`. Read only the file required for the current task:

| Question                                                                   | Read                   |
| -------------------------------------------------------------------------- | ---------------------- |
| How is the package installed, loaded or configured?                        | `01-setup.md`          |
| What are the naming, layering and CUBE rules?                              | `02-principles.md`     |
| Which token families exist and how do modes/themes work?                   | `03-tokens.md`         |
| Which utility classes and responsive forms are available?                  | `04-utilities.md`      |
| Which macro and intrinsic layouts are available?                           | `05-compositions.md`   |
| What belongs in globals, controls, blocks and attribute states?            | `06-globals-others.md` |
| Why does the project use CUBE instead of BEM?                              | `07-cube-system.md`    |
| How is fluid type and spacing integrated into the public token vocabulary? | `08-utopia.md`         |
| How do light/dark mode, the toggle and named themes work?                  | `09-mode-and-theme.md` |

Do not read the entire guide for a small styling change. Start with the installed Sass owner, then open the matching guide file only when the local implementation does not answer the question.

#### Font activation

`_fonts.sass` is installed but not loaded by the default `index.sass`. Its bundled font URLs resolve to `../fonts` relative to the installed style directory. Before adding `@use 'fonts'` to `index.sass`, either copy the required files from `node_modules/fractals-styler/fonts` into that resolved directory or update the URLs to the project's actual font location. Do not activate the partial while its referenced files are missing.

### Architecture rules

Use the layers in this order of responsibility:

1. **Tokens** hold recurring design decisions.
2. **Globals** establish inherited defaults.
3. **Composition** controls macro layout and rhythm.
4. **Utilities and primitives** do one reusable job.
5. **Blocks** add only the small amount of context-specific styling still required.
6. **Exceptions** use `data-*` or semantic `aria-*` attributes.

Do not use BEM element/modifier chains. Class names are short, lowercase and flat: no underscores, no `--modifier` classes and no `is-state` classes.

```svelte
<!-- Preferred -->
<button class="button row ycenter gap8" data-variant="primary" aria-busy={saving}> Save </button>

<!-- Avoid -->
<button class="button__label button--primary is-loading">Save</button>
```

### Token and utility rules

- Reuse an existing token or class before creating another one.
- A recurring design decision belongs in `_tokens.sass`, then in a one-job utility if markup needs direct access to it.
- Public utilities consume tokens; they do not repeat token values.
- Components consume the project's public tokens, not private implementation variables.
- Keep semantic typography roles thin. A role such as `.page-title` may set related typography properties, but must not grow into a page component.
- Do not create a new component class merely to repeat a combination already clear in markup.
- Avoid arbitrary hardcoded colors, spacing, type sizes, radii and shadows. When a value is genuinely exceptional and used once, leave a short reason beside it.
- Do not define the same selector in multiple partials. If ownership is unclear, resolve it before adding the rule.
- Prefer logical properties such as `margin-inline`, `padding-block` and `inset-inline-start` where direction matters.

```sass
.text-lg
	font-size: var(--text-lg)
```

### Composition, blocks and specificity

- Composition provides arrangement, not skin. Move backgrounds, borders, shadows and decorative effects to utilities or a block.
- Blocks should be skeletal and solve one component context.
- Keep selectors shallow and low-specificity so utilities can still tune an element.
- Prefer a semantic child class, a `data-slot` attribute or `:where(...)` over a deeply nested element selector.
- Express variants through attributes such as `data-variant`, `data-size` and `data-state`. Use ARIA attributes when they represent real accessibility state.

### Indented Sass format

All project styles use classic `.sass` syntax:

- one tab per nesting level
- property colons retained
- no braces
- no semicolons
- no column-alignment spacing between a property/token name and its value
- one blank line between unrelated selectors; no blank line inside a continuous nested selector tree

```sass
.card
	background: var(--bg-surface)
	color: var(--text-primary)
	:where(.card-title)
		font-size: var(--text-lg)
```

### Before finishing

- Confirm every referenced custom property is defined for every supported theme.
- Confirm new or changed colors meet the project's contrast requirements.
- Confirm keyboard focus remains visible for interactive elements.
- Confirm utilities still override block defaults without `!important`.
- Confirm responsive behavior at the breakpoints actually used by the project.
- Confirm `$lib/styles/index.sass` loads every required partial exactly once.
- Run the project's normal typecheck/build and inspect the rendered result when layout or theming changed.
