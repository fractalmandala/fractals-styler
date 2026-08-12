---
title: Principles of Fractal CSS System
---

A complete, opinionated, BEM-free styling system built on top of `fractals-styler` and the CUBE CSS methodology (Composition · Utility · Block · Exception).
The system author endorses a personal preference for SASS, not SCSS or CSS - single-tab indented.

**Core Principles:**

1. Tokens cascade. Primitives compose tokens. Utilities micro-tune. Blocks consume tokens. Exceptions are state attributes.
2. Every recurring visual decision becomes a token + a 1-line utility that consumes it. No 6-deep BEM chain will ever be needed.
3. Class grammar is short, lowercase, no underscores, no double dashes. Readable in markup.

## Methodology — CUBE CSS

CUBE CSS works _with_ the cascade instead of against it. Four layers, each with a single job:

- Composition: Macro arrangement only — rails, gaps, max-widths, skeletons. Zero visuals. ❌ color/shadow inside layout classes ❌
- Utility: One job per class. Tokens drive them. ❌ monolithic component classes ❌
- Block: Genuine components (button, card, panel). Lean, ≤80 lines of SASS. ❌`.card__header__title--big` chains ❌
- Exception: State/variant via `data-*` / `aria-*` attributes, never modifier classes. ❌`.btn--primary`, `.is-active` ❌

**Why CUBE over BEM:**

- BEM (`block__element--modifier`) fights the cascade and produces verbose, unreadable class strings.
- CUBE lets global tokens and high-level composition do 80% of the work upfront, so components stay tiny.
- State variants use platform-native HTML attributes (`data-*`, `aria-*`) — bridging HTML, CSS, and JS/Svelte runes seamlessly. No class thrashing.
- Because I hate the sight of BEM.

## How fractals-styler implements it

- **Static SASS** lives in `templates/` — `tokens → typography → globals → primitives → compositions → buttonslinks`, all imported via `index.sass` in cascade order.
- **Flat tokens**: 12 direct-value tokens (3 backgrounds, 3 text shades, 3 border shades, 3 brand colors) plus a small derived set via `color-mix`. No primitive scale indirection. Theme switch via `[data-theme="light|dark"]` + `prefers-color-scheme` auto.
- **Type scale** matches your taste exactly: `--text-xs/sm/md/bs/lg/xl/2xl/3xl/4xl/5xl` → `.text-*` classes that just `font-size: var(--text-*)`.
- **Layout primitives**: `.box` (flex column), `.row` (flex row), `.grid`, with `xcenter/xleft/xright/ycenter/ytop/ybot/xbetween/xevenly/wrap` modifiers — plus `.stack`, `.cluster`, `.with-sidebar`, `.reel` compositions.
- **Optional JIT escape hatch** generates ad-hoc numeric utilities such as `pad18` or `gap22`, including mobile-first `-sm/-md/-lg/-xl` suffixes. The documented token scale and static utilities remain the default vocabulary.

**Gaps this system fills:**

1. Adds semantic text primitives (`.body-std`, `.page-title`, `.eyebrow`) so you stop retyping `.text-bs .lh15 .prim` everywhere.
2. Adds a finite fluid spacing scale (`--space-*`) for shared rhythm.
3. Splits color utilities into a dedicated layer and completes the semantic palette.
4. Adds a small block library (`.card`, `.badge`, `.avatar`, `.input`, `.divider`, `.kbd`).
5. Converts button variants from modifier classes (`button-primary`) to `data-variant` attributes.
6. Adds radius, shadow, and z-index token scales.
7. Wires bundled fonts into semantic font tokens (`--font-body`, `--font-display`, `--font-mono`).
8. Keeps arbitrary JIT values available for exploratory work without making them the public design vocabulary.
9. **Flattens the color token system** — removes the `--slate-*` primitive scale, drops `--bg-subtle`/`--bg-overlay`/`--border-focus`, and renames `--bg-app`→`--bg`. The canonical primary text token is `--text-primary`.

## Class grammar

```
layer role variant breakpoint
```

| Segment    | Examples                                                                                                          |
| ---------- | ----------------------------------------------------------------------------------------------------------------- |
| layer      | `text`, `pad`, `gap`, `bg`, `radius`, `box`, `row`, `grid`, `card`, `button`                                      |
| role       | `xs`, `sm`, `md`, `bs`, `lg`, `xl`, `2xl`, `3xl`, `4xl`, `5xl`, `surface`, `raised`, `subtle`, `primary`, `brand` |
| variant    | `top`, `bot`, `left`, `right`, `center`, `between`, `evenly`, `wrap`, `cols-2`                                    |
| breakpoint | `sm` (640+), `md` (768+), `lg` (1024+), `xl` (1280+)                                                              |

One class = one job. Composition happens in markup via grouped class strings:

```svelte
<article class="card stack gap16 pad24 bg-surface radius-12 border" data-variant="featured">
	<h3 class="page-title">…</h3>
	<p class="body-std muted">…</p>
</article>
```

Order: `Block Composition / Layout Utilities & Design Tokens`

```svelte
<button class="button row ycenter gap8 pad12 radius-6" data-variant="primary">
	<span>Save</span>
</button>
```

**SASS cascades, but do not line-break for cascaded sets. Add line break for next class not in cascade**:

❌

```sass
.app-wrapper
	display: flex

	.child-wrapper
		height: 100%

.appheader
	display: grid
```

✅

```sass
.app-wrapper
	display: flex
	.child-wrapper
		height: 100%

.appheader
	display: grid
```
