---
title: Design System Audit Report
date: 2026-08-13
scope: templates/*.sass, docs/*.md, every-layout/*.md
analyses:
    - Task 1 — Docs vs SASS inconsistency audit
    - Task 2 — Utopia fluid spacing and grid proposal
    - Task 3 — Every Layout philosophy enhancements
---

# Fractals Styler — Design System Audit Report

Three parallel analyses were conducted on the fractals-styler design system:

1. **Docs vs SASS audit** — cross-referencing every documented claim against the actual template files
2. **Utopia fluid scale proposal** — generating a complete fluid responsive scale from Utopia calculator parameters
3. **Every Layout gap analysis** — comparing the system against Every Layout's algorithmic layout patterns

This report compiles all findings into a prioritized action plan.

---

## Part 1: Documentation vs SASS Inconsistencies

### 1.1 Promised features that do not exist (P0 — Critical)

The documentation explicitly promises features that were never implemented in any SASS file.

#### Missing block library

`02-principles.md` line 44 states:

> "Adds a small block library (`.card`, `.badge`, `.avatar`, `.input`, `.divider`, `.kbd`)."

**None of these six blocks exist in any template file.**

| Block      | Documented                                           | Exists in SASS |
| ---------- | ---------------------------------------------------- | -------------- |
| `.card`    | 02-principles.md:44, used in code example at line 66 | No             |
| `.badge`   | 02-principles.md:44                                  | No             |
| `.avatar`  | 02-principles.md:44                                  | No             |
| `.input`   | 02-principles.md:44                                  | No             |
| `.divider` | 02-principles.md:44                                  | No             |
| `.kbd`     | 02-principles.md:44                                  | No             |

#### Missing semantic text primitives

`02-principles.md` line 40 states:

> "Adds semantic text primitives (`.body-std`, `.page-title`, `.eyebrow`) so you stop retyping `.text-bs .lh15 .prim` everywhere."

**None of these three classes exist.** Additionally, the example references `.prim` which also does not exist — likely a typo for `.text-primary`.

| Primitive     | Documented                                           | Exists in SASS |
| ------------- | ---------------------------------------------------- | -------------- |
| `.body-std`   | 02-principles.md:40                                  | No             |
| `.page-title` | 02-principles.md:40, used in code example at line 67 | No             |
| `.eyebrow`    | 02-principles.md:40                                  | No             |

#### Phantom font tokens

`02-principles.md` line 46 states:

> "Wires bundled fonts into semantic font tokens (`--font-body`, `--font-display`, `--font-mono`)."

The SASS defines `--font-sans` and `--font-mono`, but **`--font-body` and `--font-display` do not exist**.

### 1.2 Undocumented SASS features (P1 — Significant gaps)

These classes and tokens exist in the template files but are never documented.

#### Text color utilities (in `_typography.sass`, not in `04-utilities.md`)

| Class             | Property                         |
| ----------------- | -------------------------------- |
| `.text-primary`   | `color: var(--text-primary)`     |
| `.text-secondary` | `color: var(--text-secondary)`   |
| `.text-muted`     | `color: var(--text-muted)`       |
| `.text-inverse`   | `color: var(--text-inverse)`     |
| `.text-theme`     | `color: var(--theme)`            |
| `.text-danger`    | `color: var(--feedback-danger)`  |
| `.text-warning`   | `color: var(--feedback-warning)` |
| `.text-success`   | `color: var(--feedback-success)` |
| `.text-info`      | `color: var(--feedback-info)`    |

#### Layout primitives (in `_primitives.sass`, not in `04-utilities.md`)

These are briefly listed in `02-principles.md` line 35 but not in `04-utilities.md` which is the canonical utilities reference:

- `.box` and all modifiers (`xcenter`, `xleft`, `xright`, `ycenter`, `ytop`, `ybot`)
- `.row` and all modifiers (`wrap`, `ycenter`, `ytop`, `ybot`, `xbetween`, `xevenly`, `xright`, `xleft`)
- `.grid` and `.grid-cols-1` through `.grid-cols-6`
- `.w100` / `.wfull`, `.h100` / `.hfull`
- `.grow`, `.shrink-0`, `.min-w-0`, `.min-h-0`

#### Radius utilities (only 3 of 9 shown in docs)

`04-utilities.md` shows `.radius-6`, `.radius-12`, `.radius-full`. The following are missing from docs:

`.radius-0`, `.radius-2`, `.radius-4`, `.radius-8`, `.radius-16`, `.radius-24`

#### Border utilities (only 2 of 5 shown in docs)

`04-utilities.md` shows `.border` and `.border-bottom`. Missing:

`.border-top`, `.border-left`, `.border-right`

#### Button, link, and control classes (in `_buttonslinks.sass`, undocumented)

| Class                      | Purpose                                                                      |
| -------------------------- | ---------------------------------------------------------------------------- |
| `.button`                  | Base button with `data-variant="primary"` and `data-variant="quiet"` support |
| `.icon-button`             | Square icon-only button (36px)                                               |
| `.link`                    | Styled anchor link                                                           |
| `.control`                 | Form input styling                                                           |
| `button.blank` / `a.blank` | Reset button/anchor to plain appearance                                      |

#### Tokens not documented in `03-tokens.md`

| Token Group       | Tokens                                                                                                                                       |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Font families     | `--font-sans`, `--font-mono`                                                                                                                 |
| Layout dimensions | `--header-height`, `--footer-height`, `--shell-pad`, `--layout-max`, `--sidebar-min`, `--sidebar-max`, `--body-min`, `--body-max`            |
| Feedback palette  | `--red-500`, `--amber-500`, `--emerald-500`, `--sky-500`, `--feedback-danger`, `--feedback-warning`, `--feedback-success`, `--feedback-info` |

#### Breakpoint mixins (in `_mixins.sass`, barely mentioned)

`+bp-sm` (640px), `+bp-md` (768px), `+bp-lg` (1024px), `+bp-xl` (1280px) — only referenced in setup troubleshooting, never properly documented.

#### Font utilities (in `_fonts.sass`, not loaded by default)

Five font-face definitions and five utility classes (`.font-googleflex`, `.font-monasans`, `.font-funnel`, `.font-jetbrains`, `.font-familjen`) — not documented beyond the setup note about opt-in loading.

### 1.3 Naming convention violations

The documented grammar is `layer role variant breakpoint` — "lowercase, no underscores, no double dashes."

| Class                           | File                 | Issue                                                                               |
| ------------------------------- | -------------------- | ----------------------------------------------------------------------------------- |
| `.icon-button`                  | `_buttonslinks.sass` | Hyphenated two-word name breaks the pattern. Should use `data-variant` on `.button` |
| `.control`                      | `_buttonslinks.sass` | Opaque name not following `layer role` grammar                                      |
| `.bodymain`                     | `_compositions.sass` | Two words concatenated without separator                                            |
| `.sidebarleft`, `.sidebarright` | `_compositions.sass` | Same concatenated pattern, internally consistent but different from system          |

### 1.4 Code quality issues

| Issue                     | Detail                                                                                                                                                                                                                                          |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Duplicate `.blank`        | Defined in both `_globals.sass` (lines 18–22) and `_buttonslinks.sass` (lines 51–57) with different scopes and properties                                                                                                                       |
| `.prim` phantom reference | `02-principles.md:40` references `.prim` which does not exist                                                                                                                                                                                   |
| Semantic abstraction      | `xcenter`/`ycenter` are intentionally scoped under `.box` and `.row` — they map to different CSS properties (`align-items` vs `justify-content`) depending on flex direction, but always mean "center on that axis." This is correct by design. |

### 1.5 Composition accuracy

**`05-compositions.md` is a verbatim copy of `_compositions.sass`** — every class, property, value, comment, media query, and data-attribute selector matches exactly. Zero mismatches in this file.

### 1.6 Token value accuracy

**All token values in `03-tokens.md` match `_tokens.sass` exactly** — no value-level mismatches found.

---

## Part 2: Utopia Fluid Responsive Scale Proposal

### 2.1 Current state assessment

#### Already fluid (clamp-based, viewport 320px to 1240px)

- `--text-bs` through `--text-5xl` — 7 fluid type steps
- `--space-2` through `--space-24` — 8 fluid space steps

#### Consumer-configurable values (defaults, not deficiencies)

The following are intentionally simple defaults that consumers override to suit their project. They are not candidates for forced fluid scaling — the system leaves the choice to the consumer:

- `.button` gap/padding: `gap: 8px`, `padding: 8px 16px`
- `.icon-button`: `width: 36px`, `height: 36px`
- `.control`: `padding: 8px 12px`
- `--header-height: 64px`, `--footer-height: 56px`, `--shell-pad: 20px`

#### Viewport mismatch

Current clamp values assume **320px** min-width, but Utopia calculator parameters specify **360px** min-width. The slope calculation differs slightly.

#### Type scale irregularity

The current scale uses inconsistent multipliers between steps. The Utopia parameters give a disciplined Minor Third (1.2) at min to Major Third (1.25) at max progression.

### 2.2 Proposed fluid spacing scale

Based on Utopia calculator: **360px to 1240px**, base **18px to 20px**, multipliers **0.25, 0.5, 0.75, 1, 1.5, 2, 3, 4, 6**.

| Token         | Multiplier | @min (360px) | @max (1240px) | clamp()                                            |
| ------------- | ---------- | ------------ | ------------- | -------------------------------------------------- |
| `--space-3xs` | 0.25       | 5px          | 5px           | `clamp(0.3125rem, 0.3125rem + 0vw, 0.3125rem)`     |
| `--space-2xs` | 0.5        | 9px          | 10px          | `clamp(0.5625rem, 0.5369rem + 0.1136vw, 0.625rem)` |
| `--space-xs`  | 0.75       | 14px         | 15px          | `clamp(0.875rem, 0.8494rem + 0.1136vw, 0.9375rem)` |
| `--space-s`   | 1          | 18px         | 20px          | `clamp(1.125rem, 1.0739rem + 0.2273vw, 1.25rem)`   |
| `--space-m`   | 1.5        | 27px         | 30px          | `clamp(1.6875rem, 1.6108rem + 0.3409vw, 1.875rem)` |
| `--space-l`   | 2          | 36px         | 40px          | `clamp(2.25rem, 2.1477rem + 0.4545vw, 2.5rem)`     |
| `--space-xl`  | 3          | 54px         | 60px          | `clamp(3.375rem, 3.2216rem + 0.6818vw, 3.75rem)`   |
| `--space-2xl` | 4          | 72px         | 80px          | `clamp(4.5rem, 4.2955rem + 0.9091vw, 5rem)`        |
| `--space-3xl` | 6          | 108px        | 120px         | `clamp(6.75rem, 6.4432rem + 1.3636vw, 7.5rem)`     |

Custom space pair (dramatic gutter scaling):

| Token         | @min | @max | clamp()                                      |
| ------------- | ---- | ---- | -------------------------------------------- |
| `--space-s-l` | 18px | 40px | `clamp(1.125rem, 0.5625rem + 2.5vw, 2.5rem)` |

### 2.3 Migration mapping (old numeric to new t-shirt)

| Old Token    | Approx. Value | New Token                    |
| ------------ | ------------- | ---------------------------- |
| `--space-1`  | 4px           | `--space-3xs` (5px)          |
| `--space-2`  | 8 to 10px     | `--space-2xs` (9 to 10px)    |
| `--space-3`  | 12 to 15px    | `--space-xs` (14 to 15px)    |
| `--space-4`  | 16 to 20px    | `--space-s` (18 to 20px)     |
| `--space-6`  | 24 to 30px    | `--space-m` (27 to 30px)     |
| `--space-8`  | 32 to 40px    | `--space-l` (36 to 40px)     |
| `--space-12` | 48 to 60px    | `--space-xl` (54 to 60px)    |
| `--space-16` | 64 to 80px    | `--space-2xl` (72 to 80px)   |
| `--space-24` | 96 to 120px   | `--space-3xl` (108 to 120px) |

### 2.4 Proposed fluid type scale

Based on Utopia type calculator: **360px to 1240px**, **18px @ 1.2 to 20px @ 1.25**, 5 positive + 2 negative steps.

| Token        | Step | @min   | @max   | clamp()                                             |
| ------------ | ---- | ------ | ------ | --------------------------------------------------- |
| `--text-xs`  | -2   | 12.5px | 12.8px | `clamp(0.7813rem, 0.7736rem + 0.0341vw, 0.8rem)`    |
| `--text-sm`  | -1   | 15px   | 16px   | `clamp(0.9375rem, 0.9119rem + 0.1136vw, 1rem)`      |
| `--text-md`  | 0    | 18px   | 20px   | `clamp(1.125rem, 1.0739rem + 0.2273vw, 1.25rem)`    |
| `--text-lg`  | 1    | 21.6px | 25px   | `clamp(1.35rem, 1.2631rem + 0.3864vw, 1.5625rem)`   |
| `--text-xl`  | 2    | 25.9px | 31.3px | `clamp(1.62rem, 1.4837rem + 0.6057vw, 1.9531rem)`   |
| `--text-2xl` | 3    | 31.1px | 39.1px | `clamp(1.944rem, 1.7405rem + 0.9044vw, 2.4414rem)`  |
| `--text-3xl` | 4    | 37.3px | 48.8px | `clamp(2.3328rem, 2.0387rem + 1.3072vw, 3.0518rem)` |
| `--text-4xl` | 5    | 44.8px | 61px   | `clamp(2.7994rem, 2.384rem + 1.8461vw, 3.8147rem)`  |

**Key changes from current:**

- `--text-xs`, `--text-sm`, `--text-md` become **fluid** (currently static px)
- `--text-bs` is **removed** (awkward half-step between sm and lg)
- `--text-5xl` is **removed** (current value reaches 113px — excessive for new scale)
- 8 tokens instead of 10, covering 12.5px to 61px smoothly
- Clean Minor Third to Major Third progression

### 2.5 Proposed fluid grid system

From Utopia grid calculator parameters:

```sass
// Grid tokens (in _tokens.sass)
--grid-max-width: 77.5rem
--grid-gutter: var(--space-s-l)
--grid-columns: 12
```

**Integration with existing `.grid`** in `_primitives.sass`:

```sass
.grid
	display: grid
	gap: var(--grid-gutter)
	grid-template-columns: repeat(var(--grid-columns), minmax(0, 1fr))

.grid-auto
	display: grid
	gap: var(--grid-gutter)
	grid-template-columns: repeat(auto-fit, minmax(min(100%, 16rem), 1fr))
```

**Column override classes:**

```sass
.grid-cols-1
	--grid-columns: 1
.grid-cols-2
	--grid-columns: 2
.grid-cols-3
	--grid-columns: 3
.grid-cols-4
	--grid-columns: 4
.grid-cols-5
	--grid-columns: 5
.grid-cols-6
	--grid-columns: 6
```

**New container utility:**

```sass
.container
	max-width: var(--grid-max-width)
	padding-inline: var(--grid-gutter)
	margin-inline: auto
```

### 2.6 Other responsive additions

#### Breakpoint alignment

Shift `bp-xl` from 1280px to **1240px** to match the fluid max-width:

```sass
=bp-xl
	@media (min-width: 1240px)
		@content
```

Composition breakpoints (1025px / 1201px) in `_compositions.sass` can stay — they serve structural layout shifts, not scale interpolation.

#### Container query mixins

```sass
=cq($name: '')
	@if $name == ''
		container-type: inline-size
	@else
		container-type: inline-size
		container-name: $name
	@content

=cq-min($width)
	@container (min-width: #{$width})
		@content

=cq-max($width)
	@container (max-width: #{$width})
		@content
```

### 2.7 Deprecation strategy

Keep old numeric names as aliases for one release cycle:

```sass
// Deprecated aliases — remove in next major
--space-1: var(--space-3xs)
--space-2: var(--space-2xs)
--space-3: var(--space-xs)
--space-4: var(--space-s)
--space-6: var(--space-m)
--space-8: var(--space-l)
--space-12: var(--space-xl)
--space-16: var(--space-2xl)
--space-24: var(--space-3xl)
```

### 2.8 Downstream file updates needed

| File                 | What Changes                                                                       |
| -------------------- | ---------------------------------------------------------------------------------- |
| `_typography.sass`   | Remove `.text-bs` class; keep `.text-xs` through `.text-4xl`                       |
| `_primitives.sass`   | `.grid` gains fluid gutter and `--grid-columns`; add `.grid-auto`, `.container`    |
| `_compositions.sass` | `--space-4` to `--space-s`, `--space-8` to `--space-l`, `--space-6` to `--space-m` |
| `_mixins.sass`       | `bp-xl` to 1240px; add container query mixins                                      |
| `docs/08-utopia.md`  | Update code examples to new token names                                            |

### 2.9 Complete proposed `_tokens.sass`

```sass
:root
	// Fonts
	--font-sans: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif
	--font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace

	// Fluid type scale — Minor Third (1.2) at 360px to Major Third (1.25) at 1240px.
	// @link https://utopia.fyi/type/calculator?c=360,18,1.2,1240,20,1.25,5,2,
	--text-xs: clamp(0.7813rem, 0.7736rem + 0.0341vw, 0.8rem)
	--text-sm: clamp(0.9375rem, 0.9119rem + 0.1136vw, 1rem)
	--text-md: clamp(1.125rem, 1.0739rem + 0.2273vw, 1.25rem)
	--text-lg: clamp(1.35rem, 1.2631rem + 0.3864vw, 1.5625rem)
	--text-xl: clamp(1.62rem, 1.4837rem + 0.6057vw, 1.9531rem)
	--text-2xl: clamp(1.944rem, 1.7405rem + 0.9044vw, 2.4414rem)
	--text-3xl: clamp(2.3328rem, 2.0387rem + 1.3072vw, 3.0518rem)
	--text-4xl: clamp(2.7994rem, 2.384rem + 1.8461vw, 3.8147rem)

	// Fluid space scale — base 18px to 20px, multipliers 0.25 through 6.
	// @link https://utopia.fyi/space/calculator?c=360,18,1.2,1240,20,1.25,5,2,
	--space-3xs: clamp(0.3125rem, 0.3125rem + 0vw, 0.3125rem)
	--space-2xs: clamp(0.5625rem, 0.5369rem + 0.1136vw, 0.625rem)
	--space-xs: clamp(0.875rem, 0.8494rem + 0.1136vw, 0.9375rem)
	--space-s: clamp(1.125rem, 1.0739rem + 0.2273vw, 1.25rem)
	--space-m: clamp(1.6875rem, 1.6108rem + 0.3409vw, 1.875rem)
	--space-l: clamp(2.25rem, 2.1477rem + 0.4545vw, 2.5rem)
	--space-xl: clamp(3.375rem, 3.2216rem + 0.6818vw, 3.75rem)
	--space-2xl: clamp(4.5rem, 4.2955rem + 0.9091vw, 5rem)
	--space-3xl: clamp(6.75rem, 6.4432rem + 1.3636vw, 7.5rem)

	// Custom space pair — dramatic gutter scaling
	--space-s-l: clamp(1.125rem, 0.5625rem + 2.5vw, 2.5rem)

	// Grid system
	--grid-max-width: 77.5rem
	--grid-gutter: var(--space-s-l)
	--grid-columns: 12

	// Radius scale (unchanged)
	--radius-0: 0
	--radius-2: 2px
	--radius-4: 4px
	--radius-6: 6px
	--radius-8: 8px
	--radius-12: 12px
	--radius-16: 16px
	--radius-24: 24px
	--radius-full: 9999px

	// Shadow scale (unchanged)
	--shadow-sm: 0 1px 2px rgba(15, 23, 42, 0.06)
	--shadow-md: 0 4px 12px rgba(15, 23, 42, 0.08)
	--shadow-lg: 0 12px 32px rgba(15, 23, 42, 0.12)
	--shadow-focus: 0 0 0 3px var(--ring)

	// Layering scale (unchanged)
	--z-base: 0
	--z-raised: 10
	--z-sticky: 100
	--z-modal: 200
	--z-toast: 300

	// Layout — header/footer/shell now fluid
	--header-height: clamp(3.5rem, 3.25rem + 1.1364vw, 4rem)
	--footer-height: clamp(3rem, 2.875rem + 0.5682vw, 3.5rem)
	--shell-pad: var(--space-s-l)
	--layout-max: 1440px
	--sidebar-min: 200px
	--sidebar-max: 360px
	--body-min: 600px
	--body-max: 800px

	// Feedback palette (unchanged)
	--red-500: #ef4444
	--amber-500: #f59e0b
	--emerald-500: #10b981
	--sky-500: #0ea5e9
	--feedback-danger: var(--red-500)
	--feedback-warning: var(--amber-500)
	--feedback-success: var(--emerald-500)
	--feedback-info: var(--sky-500)

	// Light theme (unchanged)
	--bg: #fdfefe
	--bg-surface: #fcf9f9
	--bg-raised: #f1f5f9
	--text-primary: #0f172a
	--text-secondary: #696969
	--text-muted: #929497
	--border: #e2e8f0
	--border-subtle: #f1f5f9
	--border-strong: #cbd5e1
	--theme: #007f4e
	--theme-hover: #00663f
	--theme-active: #005031
	--ring: rgba(59, 130, 246, 0.35)
	--text-inverse: #ffffff

// System preference auto dark mode (unchanged)
@media (prefers-color-scheme: dark)
	:root:not([data-theme='light'])
		--bg: #131313
		--bg-surface: #222222
		--bg-raised: #363636
		--text-primary: #f9fafb
		--text-secondary: #666767
		--text-muted: #64748b
		--border: #2f3030
		--border-subtle: #2d2d2d
		--border-strong: #575757
		--theme: #007f4e
		--theme-hover: #039f49
		--theme-active: #5e9c2f
		--ring: rgba(59, 130, 246, 0.35)
		--text-inverse: #0b0f17

[data-theme='dark']
	--bg: #131313
	--bg-surface: #222222
	--bg-raised: #363636
	--text-primary: #f9fafb
	--text-secondary: #666767
	--text-muted: #64748b
	--border: #2f3030
	--border-subtle: #2d2d2d
	--border-strong: #575757
	--theme: #007f4e
	--theme-hover: #039f49
	--theme-active: #5e9c2f
	--ring: rgba(59, 130, 246, 0.35)
	--text-inverse: #0b0f17

[data-theme='light']
	--bg: #fdfefe
	--bg-surface: #fcf9f9
	--bg-raised: #f1f5f9
	--text-primary: #0f172a
	--text-secondary: #696969
	--text-muted: #929497
	--border: #e2e8f0
	--border-subtle: #f1f5f9
	--border-strong: #cbd5e1
	--theme: #007f4e
	--theme-hover: #00663f
	--theme-active: #005031
	--ring: rgba(59, 130, 246, 0.35)
	--text-inverse: #ffffff
```

---

## Part 3: Every Layout Philosophy Enhancements

### 3.1 Current coverage assessment

| Pattern           | Status  | Implementation                              | Notes                                                           |
| ----------------- | ------- | ------------------------------------------- | --------------------------------------------------------------- |
| **The Stack**     | Partial | `.stack` uses `gap`                         | Missing: owl selector, recursive mode, splitAfter, margin reset |
| **The Cluster**   | Good    | `.cluster` flex-wrap + gap                  | Missing: alignment flexibility via custom property              |
| **The Sidebar**   | Good    | `.with-sidebar` flex-basis/flex-grow 999    | Matches Every Layout closely                                    |
| **The Switcher**  | Missing | Not implemented                             | Core Every Layout pattern                                       |
| **The Center**    | Partial | Embedded in `.bodymain` only                | No standalone primitive                                         |
| **The Box**       | Partial | `.box` is flex-column, not padded container | Conceptual mismatch                                             |
| **Cover**         | Missing | Not implemented                             | Vertical centering for hero sections                            |
| **Grid**          | Partial | Fixed `repeat(N, 1fr)` columns              | Missing: auto-fit with intrinsic sizing                         |
| **Frame**         | Missing | Not implemented                             | Aspect-ratio container for media                                |
| **Icon**          | Missing | Not implemented                             | Properly sized inline icons                                     |
| **Reel**          | Good    | `.reel` flex + overflow-x + scroll-snap     | Correct implementation                                          |
| **Measure axiom** | Missing | No `--measure` token                        | Only `.bodymain` constrains width with px                       |
| **Modular scale** | Partial | Fluid clamp values exist                    | Not a true ratio-based modular scale                            |

**Summary: 6 of 11 patterns covered (some partially). 5 patterns completely missing.**

### 3.2 Foundation token: `--measure`

The single most important Every Layout addition. Add to `_tokens.sass`:

```sass
	// Measure — maximum line length for readability
	--measure: 60ch
```

This controls line length for readability and serves as the default threshold for Switcher and Center.

### 3.3 Missing patterns — proposed SASS code

All code below uses indented SASS syntax (tabs, no braces, no semicolons) per project conventions.

#### The Switcher (`_compositions.sass`)

The Switcher uses the "Flexbox Holy Albatross" — `flex-basis: calc((threshold - 100%) * 999)` — to switch between horizontal and vertical layout at a container-based breakpoint, with no media queries.

```sass
// The Switcher — container-based layout switching
// Switches between horizontal and vertical at --switcher-threshold
.switcher
	display: flex
	flex-wrap: wrap
	gap: var(--switcher-gap, var(--space-s))
	:where(*)
		flex-grow: 1
		flex-basis: calc((var(--switcher-threshold, 30rem) - 100%) * 999)
	// Quantity query: force vertical when 5+ items
	:is(:nth-last-child(n+5), :nth-last-child(n+5) ~ *)
		flex-basis: 100%
```

**Every Layout principle:** Quantum layout — bypassing intermediary asymmetric states. Container-responsive, not viewport-responsive.

#### Cover (`_compositions.sass`)

Cover vertically centers its content while filling a minimum height.

```sass
// Cover — vertically centered content filling minimum height
.cover
	display: flex
	flex-direction: column
	min-height: var(--cover-min-height, 100vh)
	padding: var(--cover-space, var(--space-s))
	:where(*)
		margin-block: 0
	.cover-center
		margin-block: auto
```

**Every Layout principle:** Using flexbox with `margin: auto` for true vertical centering.

#### The Center (`_compositions.sass`)

A standalone centering primitive extracted from `.bodymain`.

```sass
// Center — horizontally centered with max-width measure
.center
	max-width: var(--center-max, var(--measure, 60ch))
	margin-inline: auto
	padding-inline: var(--center-pad, var(--space-s))
	// Optional: center text content too
	&.center-text
		text-align: center
```

**Every Layout principle:** `margin-inline: auto` with a max-width constraint using `ch` units for measure-based centering.

#### Frame (`_compositions.sass`)

Aspect-ratio container for images and media.

```sass
// Frame — aspect-ratio container for media
.frame
	--frame-ratio: 16 / 9
	aspect-ratio: var(--frame-ratio)
	overflow: hidden
	:is(img, video, iframe)
		width: 100%
		height: 100%
		object-fit: cover
	// Common ratios via data attribute
	&[data-ratio='1/1']
		--frame-ratio: 1 / 1
	&[data-ratio='4/3']
		--frame-ratio: 4 / 3
	&[data-ratio='16/9']
		--frame-ratio: 16 / 9
	&[data-ratio='21/9']
		--frame-ratio: 21 / 9
	&[data-ratio='3/4']
		--frame-ratio: 3 / 4
	&[data-ratio='2/3']
		--frame-ratio: 2 / 3
```

**Every Layout principle:** Intrinsic sizing via `aspect-ratio`. The container shape is determined by content semantics.

#### Icon (`_compositions.sass`)

Properly sized and aligned inline icons using `em` units.

```sass
// Icon — properly sized inline icon (scales with parent font-size)
.icon
	display: inline-flex
	align-items: center
	justify-content: center
	width: 1em
	height: 1em
	vertical-align: middle
	line-height: 1
	svg
		width: 100%
		height: 100%
		fill: currentColor
```

**Every Layout principle:** Using `em` units so icons scale with their parent font-size. `currentColor` inheritance for color.

#### Auto-fit Grid (`_compositions.sass`)

The current `.grid` uses fixed column counts. Every Layout's grid uses `auto-fit` with intrinsic sizing.

```sass
// Auto-grid — intrinsic auto-fit grid (no fixed column counts)
.auto-grid
	display: grid
	grid-template-columns: repeat(auto-fit, minmax(min(var(--auto-grid-min, 15rem), 100%), 1fr))
	gap: var(--auto-grid-gap, var(--space-s))
```

**Every Layout principle:** Intrinsic layout — the browser determines column count from available space and minimum item width. No media queries needed.

#### The Imposter (`_compositions.sass`)

Centered overlay above content for modals.

```sass
// Imposter — centered overlay above content
.imposter
	position: fixed
	inset: 0
	display: flex
	align-items: center
	justify-content: center
	z-index: var(--z-modal)
	padding: var(--space-s)
```

### 3.4 Improvements to existing patterns

#### Stack — add owl selector + splitAfter

The current `.stack` uses `gap`, which is modern and valid, but Every Layout's Stack uses the owl selector `* + *` with `margin-block-start` for better composability:

```sass
// Stack — vertical rhythm via the owl selector
.stack
	display: flex
	flex-direction: column
	justify-content: flex-start
	:where(*)
		margin-block: 0
	:where(*) + *
		margin-block-start: var(--stack-gap, var(--space-s))
	// Split variant: push everything after Nth child to bottom
	&[data-split-after='1'] :nth-child(1)
		margin-block-end: auto
	&[data-split-after='2'] :nth-child(2)
		margin-block-end: auto
	&[data-split-after='3'] :nth-child(3)
		margin-block-end: auto
	// Only-child stretches to fill parent
	&:only-child
		block-size: 100%
```

**Why:** The owl approach allows per-element exceptions via CSS custom properties, supports the `splitAfter` pattern, and resets children's own margins to prevent double-spacing.

#### Box — separate padding concern

The current `.box` is `display: flex; flex-direction: column` — this is actually a Stack without spacing. Every Layout's Box is a padded container. Keep `.box` as-is (well-established) but add a padding primitive:

```sass
// Box-pad — padded container with fluid space tokens
.box-pad
	padding: var(--box-space, var(--space-s))
```

#### Cluster — add alignment flexibility

```sass
.cluster
	display: flex
	flex-wrap: wrap
	gap: var(--cluster-gap, var(--space-xs))
	align-items: var(--cluster-align, center)
	justify-content: var(--cluster-justify, flex-start)
```

#### bodymain — use `ch` units instead of px clamp

Current:

```sass
max-width: clamp(var(--body-min, 600px), 58vw, var(--body-max, 800px))
```

Every Layout recommends `ch`-based measure:

```sass
max-width: var(--measure, 60ch)
```

Or as a transitional hybrid:

```sass
max-width: clamp(var(--body-min, 600px), 58vw, var(--measure, 60ch))
```

#### Measure constraint utility

```sass
// Measure constraint — enforce readable line length
.measure
	max-inline-size: var(--measure, 60ch)
```

### 3.5 Global resets to add (`_globals.sass`)

#### Extend margin reset to flow elements

Every Layout resets flow element margins globally so Stack controls all spacing:

```sass
// Reset margins on flow elements — Stack controls vertical rhythm
p, h1, h2, h3, h4, h5, h6, ul, ol, figure, blockquote
	margin-block: 0
```

(Currently headings + p have `margin: 0`. Extend to `ul`, `ol`, `figure`, `blockquote`.)

#### Responsive media global

```sass
img, video, svg
	max-width: 100%
	height: auto
```

#### Box-sizing on pseudo-elements

```sass
*, *::before, *::after
	box-sizing: border-box
```

### 3.6 Intrinsic sidebar with data attributes

Add an intrinsic variant of `.with-sidebar` where `data-side` determines which child is the sidebar:

```sass
.with-sidebar[data-side='right']
	:first-child
		flex-basis: 0
		flex-grow: 999
		min-width: var(--flow-min, 50%)
	:last-child
		flex-basis: var(--rail-width, 20rem)
		flex-grow: 1
```

### 3.7 Anti-patterns identified

| Anti-pattern                                  | Current State                                      | Recommendation                                   |
| --------------------------------------------- | -------------------------------------------------- | ------------------------------------------------ |
| `.box` is a flex-column, not a padded Box     | Conceptual mismatch with Every Layout              | Keep `.box`, add `.box-pad` separately           |
| `.grid` uses fixed column counts              | Extrinsic — prescribes columns regardless of space | Keep them, add `.auto-grid` as preferred default |
| `.bodymain` uses `px`-based clamp for measure | `px` does not adapt to font-size changes           | Replace with `var(--measure, 60ch)`              |
| No `box-sizing` on pseudo-elements            | Incomplete border-box inheritance                  | Extend to `*::before, *::after`                  |

---

## Part 4: Unified Priority Matrix

### Tier 1 — Critical (docs are misleading, fix immediately)

| #   | Action                                                                                              | Source | Effort  |
| --- | --------------------------------------------------------------------------------------------------- | ------ | ------- |
| 1   | Create or remove the 6 promised blocks (`.card`, `.badge`, `.avatar`, `.input`, `.divider`, `.kbd`) | Task 1 | Medium  |
| 2   | Create or remove the 3 text primitives (`.body-std`, `.page-title`, `.eyebrow`)                     | Task 1 | Low     |
| 3   | Fix or remove phantom font tokens (`--font-body`, `--font-display`)                                 | Task 1 | Trivial |

### Tier 2 — Foundation (enables other improvements)

| #   | Action                                                                          | Source | Effort  |
| --- | ------------------------------------------------------------------------------- | ------ | ------- |
| 4   | Add `--measure: 60ch` token to `_tokens.sass`                                   | Task 3 | Trivial |
| 5   | Adopt Utopia t-shirt space naming with deprecation aliases                      | Task 2 | Medium  |
| 6   | Make remaining static type tokens fluid (`--text-xs`, `--text-sm`, `--text-md`) | Task 2 | Low     |

### Tier 3 — Missing compositions (highest impact new patterns)

| #   | Action                                  | Source     | Effort |
| --- | --------------------------------------- | ---------- | ------ |
| 7   | Add `.switcher` composition             | Task 3     | Low    |
| 8   | Add `.cover` and `.center` compositions | Task 3     | Low    |
| 9   | Add `.auto-grid` with auto-fit          | Task 2 + 3 | Low    |
| 10  | Add `.frame` and `.icon` compositions   | Task 3     | Low    |

### Tier 4 — Documentation (eliminate discovery gaps)

| #   | Action                                                         | Source | Effort  |
| --- | -------------------------------------------------------------- | ------ | ------- |
| 11  | Document all 9 text-color utilities in `04-utilities.md`       | Task 1 | Low     |
| 12  | Document all layout primitives from `_primitives.sass`         | Task 1 | Medium  |
| 13  | Document all 9 radius and 5 border utilities                   | Task 1 | Low     |
| 14  | Document button/link/control classes from `_buttonslinks.sass` | Task 1 | Low     |
| 15  | Document layout tokens and feedback palette in `03-tokens.md`  | Task 1 | Low     |
| 16  | Document `_mixins.sass` breakpoint mixins properly             | Task 1 | Trivial |

### Tier 5 — Improvements (refine existing system)

| #   | Action                                          | Source | Effort  |
| --- | ----------------------------------------------- | ------ | ------- |
| 17  | Improve `.stack` with owl selector + splitAfter | Task 3 | Medium  |
| 18  | Change `.bodymain` to use `ch`-based measure    | Task 3 | Trivial |
| 19  | Add container query mixins to `_mixins.sass`    | Task 2 | Low     |
| 20  | Align `bp-xl` breakpoint to 1240px              | Task 2 | Trivial |

### Tier 6 — Code hygiene

| #   | Action                                                              | Source | Effort  |
| --- | ------------------------------------------------------------------- | ------ | ------- |
| 21  | Resolve duplicate `.blank` definition                               | Task 1 | Trivial |
| 22  | Rename `.icon-button` to follow grammar (use `data-variant`)        | Task 1 | Low     |
| 23  | Extend global margin reset to `ul, ol, figure, blockquote`          | Task 3 | Trivial |
| 24  | Extend `box-sizing` to `*::before, *::after`                        | Task 3 | Trivial |
| 25  | Add responsive media global (`img, video, svg { max-width: 100% }`) | Task 3 | Trivial |
| 26  | Fix `.prim` reference typo in `02-principles.md`                    | Task 1 | Trivial |

---

## Summary Statistics

- **Documentation gaps found:** 28 specific issues across 7 categories
- **Promised but missing features:** 9 (6 blocks + 3 text primitives)
- **Undocumented existing features:** 18+ utilities and token groups
- **Missing Every Layout patterns:** 5 (Switcher, Cover, Center, Frame, Icon)
- **Static values to make fluid:** 3 type tokens (xs/sm/md) — layout tokens and component internals are consumer-configurable
- **New compositions proposed:** 7 with complete SASS code
- **Total action items:** 26 prioritized across 6 tiers
