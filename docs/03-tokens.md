---
title: Tokens in Fractal Styler
---

All global custom properties live in `_tokens.sass`. From these values we build the primitive elements of the design system. `_tokens.sass` is the source of truth; utilities consume tokens but do not redefine them.

## Fluid type

Utopia fluid scale, 360px→1240px viewport, base 18px→20px, Minor Third (1.2)→Major Third (1.25). Fluid behavior lives directly in the public `--text-*` values — no parallel `--step-*` vocabulary.

```sass
:root
	--text-xs: 10px
	--text-sm: clamp(0.9375rem, 0.9119rem + 0.1136vw, 1rem)
	--text-md: clamp(1.125rem, 1.0739rem + 0.2273vw, 1.25rem)
	--text-lg: clamp(1.35rem, 1.2631rem + 0.3864vw, 1.5625rem)
	--text-xl: clamp(1.62rem, 1.4837rem + 0.6057vw, 1.9531rem)
	--text-2xl: clamp(1.944rem, 1.7405rem + 0.9044vw, 2.4414rem)
	--text-3xl: clamp(2.3328rem, 2.0387rem + 1.3072vw, 3.0518rem)
	--text-4xl: clamp(2.7994rem, 2.384rem + 1.8461vw, 3.8147rem)
```

## Fluid rhythm

T-shirt named space scale, 360px→1240px viewport. The finite spacing scale is the normal design vocabulary; arbitrary JIT values are for exploration and genuine one-offs.

```sass
:root
	--space-3xs: clamp(0.3125rem, 0.3125rem + 0vw, 0.3125rem)
	--space-2xs: clamp(0.5625rem, 0.5369rem + 0.1136vw, 0.625rem)
	--space-xs: clamp(0.875rem, 0.8494rem + 0.1136vw, 0.9375rem)
	--space-s: clamp(1.125rem, 1.0739rem + 0.2273vw, 1.25rem)
	--space-m: clamp(1.6875rem, 1.6108rem + 0.3409vw, 1.875rem)
	--space-l: clamp(2.25rem, 2.1477rem + 0.4545vw, 2.5rem)
	--space-xl: clamp(3.375rem, 3.2216rem + 0.6818vw, 3.75rem)
	--space-2xl: clamp(4.5rem, 4.2955rem + 0.9091vw, 5rem)
	--space-3xl: clamp(6.75rem, 6.4432rem + 1.3636vw, 7.5rem)
	--space-s-l: clamp(1.125rem, 0.5625rem + 2.5vw, 2.5rem)
```

## Layout

```sass
:root
	--header-height: 64px
	--footer-height: 56px
	--shell-pad: var(--space-s-l)
	--layout-max: 1440px
	--sidebar-min: 200px
	--sidebar-max: 360px
	--body-min: 600px
	--body-max: 800px
	--measure: 60ch
	--grid-max-width: 77.5rem
	--grid-gutter: var(--space-s-l)
	--grid-columns: 12
```

## Radius, shadow and layering

Radius utilities use the same hyphenated suffixes as their tokens: `.radius-12` consumes `--radius-12`.

```sass
:root
	--radius-0: 0
	--radius-2: 2px
	--radius-4: 4px
	--radius-6: 6px
	--radius-8: 8px
	--radius-12: 12px
	--radius-16: 16px
	--radius-24: 24px
	--radius-full: 9999px

	--shadow-sm: 0 1px 2px rgba(15, 23, 42, 0.06)
	--shadow-md: 0 4px 12px rgba(15, 23, 42, 0.08)
	--shadow-lg: 0 12px 32px rgba(15, 23, 42, 0.12)
	--shadow-focus: 0 0 0 3px var(--ring)

	--z-base: 0
	--z-raised: 10
	--z-sticky: 100
	--z-modal: 200
	--z-toast: 300
```

## Color tokens

The page palette stays small and readable in place:

- 3 backgrounds
- 3 text shades
- 3 border shades
- 3 theme colors
- a small feedback palette and derived focus/inverse values

```sass
:root
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

## Mode switching

Mode (light/dark) and theme (named palettes) are two different axes. Mode is keyed off `data-mode`; `data-theme` is reserved for named themes. See [09-mode-and-theme.md](09-mode-and-theme.md) for the full explanation.

Three layers share the same token names, in cascade order:

1. **Default**: the `:root` block carries the complete light palette. It applies with no marker at all, so every token stays defined with JS disabled, during SSR, and for crawlers. This block is load-bearing — never replace it with an explicit `[data-mode='light']` block.
2. **Auto**: `prefers-color-scheme` applies dark values, guarded by `:not(:where([data-mode='light'], …))` so it cannot fight an explicit light choice on a dark-preferring OS.
3. **Explicit**: `[data-mode='dark']` / `[data-mode='light']` win on source order.

Each layer also sets `color-scheme`, so the browser's own UI — scrollbars, form controls, the default canvas — matches the palette.

Every mode overrides values, never the public vocabulary. See `_tokens.sass` for the complete current palettes.

### Deprecated aliases

`[data-theme='light'|'dark']` and the `.light`/`.dark` classes are retained as aliases on the mode blocks so existing projects and class-based third-party mode libraries keep working. They are deprecated and will be removed in 3.0 — migrate markup to `data-mode`.

### Token ownership

`_tokens.sass` is the source of truth for `--border`, `--ring` and the rest of the flat palette. `_colors.sass` provides the additional shadcn-style semantic layer (`--background`, `--card`, `--primary`, …) and deliberately does not redeclare tokens `_tokens.sass` owns — it is `@use`d after tokens, so redeclaring them silently overwrote the token values. `--input` is a live `var(--border)` alias for that reason.
