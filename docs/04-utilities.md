---
title: Utilities
---

Utilities are single-job classes driven by the finite values in `_tokens.sass`. The static classes are the normal project vocabulary; use them consistently before reaching for arbitrary values.

## Typography

The scale values live in `_tokens.sass`. `_typography.sass` only maps public classes to those tokens:

```sass
.text-xs
	font-size: var(--text-xs)
.text-sm
	font-size: var(--text-sm)
.text-md
	font-size: var(--text-md)
.text-lg
	font-size: var(--text-lg)
.text-xl
	font-size: var(--text-xl)
.text-2xl
	font-size: var(--text-2xl)
.text-3xl
	font-size: var(--text-3xl)
.text-4xl
	font-size: var(--text-4xl)
```

Edit scale values in `_tokens.sass`, not in these classes.

```sass
.tt-u
	text-transform: uppercase
.tt-c
	text-transform: capitalize
.ta-l
	text-align: left
.ta-r
	text-align: right
.ta-c
	text-align: center
.fw400
	font-weight: 400
.fw500
	font-weight: 500
.fw600
	font-weight: 600
.bold
	font-weight: bold
.lh11
	line-height: 1.1
.lh125
	line-height: 1.25
.lh15
	line-height: 1.5
.lh16
	line-height: 1.6
.italic
	font-style: italic
```

`.truncate`, `.line-clamp-2` and `.line-clamp-3` are separate utilities. Truncation never silently applies a line clamp.

## Borders and radius

`.border` is the normal token-driven border. `.bdr` is intentionally different: it draws a solid 1px red debugging border for temporary layout work.

```sass
.border
	border: 1px solid var(--border)
.border-bottom
	border-bottom: 1px solid var(--border)
.bdr
	border: 1px solid red
.radius-6
	border-radius: var(--radius-6)
.radius-12
	border-radius: var(--radius-12)
.radius-full
	border-radius: var(--radius-full)
```

Radius class names are always hyphenated: `.radius-2`, `.radius-4`, `.radius-6`, `.radius-8`, `.radius-12`, `.radius-16`, `.radius-24`, `.radius-full`.

## Advanced: arbitrary JIT values

The Vite plugin keeps exploratory work fast by generating numeric utilities on demand:

```svelte
<div class="row gap18 pad22 width320 pad12-sm">…</div>
```

Supported numeric prefixes include padding, margin, gap, width and height families. A non-negative integer may be followed by `-sm`, `-md`, `-lg` or `-xl` for a mobile-first breakpoint variant.

Treat this as an escape hatch. If a value recurs or expresses a design decision, promote it into `_tokens.sass` and a named static utility or primitive.
