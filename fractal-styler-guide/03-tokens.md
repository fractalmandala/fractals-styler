---
title: Tokens in Fractal Styler
---

All global custom properties live in `_tokens.sass`. From these values we build the primitive elements of the design system. `_tokens.sass` is the source of truth; utilities consume tokens but do not redefine them.

## Fluid type

Fluid behavior lives directly in the public `--text-*` values. There is no parallel `--step-*` or `--fluid-step-*` vocabulary to translate mentally.

```sass
:root
	--text-xs: 10px
	--text-sm: 12px
	--text-md: 14px
	--text-bs: clamp(0.884rem, 0.9065rem + -0.0291vw, 0.9rem)
	--text-lg: clamp(1.125rem, 1.0739rem + 0.2273vw, 1.25rem)
	--text-xl: clamp(1.4063rem, 1.3159rem + 0.4014vw, 1.7675rem)
	--text-2xl: clamp(1.7578rem, 1.5725rem + 0.8238vw, 2.4992rem)
	--text-3xl: clamp(2.1973rem, 1.8631rem + 1.4852vw, 3.5339rem)
	--text-4xl: clamp(2.7466rem, 2.184rem + 2.5004vw, 4.997rem)
	--text-5xl: clamp(3.4332rem, 2.5251rem + 4.0361vw, 7.0657rem)
```

## Fluid rhythm

The finite spacing scale is the normal design vocabulary. Values grow fluidly while their public names stay stable. Recurring spacing belongs here; arbitrary JIT values are for exploration and genuine one-offs.

```sass
:root
	--space-1: 4px
	--space-2: clamp(0.5rem, 0.4489rem + 0.2273vw, 0.625rem)
	--space-3: clamp(0.75rem, 0.6733rem + 0.3409vw, 0.9375rem)
	--space-4: clamp(1rem, 0.8977rem + 0.4545vw, 1.25rem)
	--space-6: clamp(1.5rem, 1.3466rem + 0.6818vw, 1.875rem)
	--space-8: clamp(2rem, 1.7955rem + 0.9091vw, 2.5rem)
	--space-12: clamp(3rem, 2.6932rem + 1.3636vw, 3.75rem)
	--space-16: clamp(4rem, 3.5909rem + 1.8182vw, 5rem)
	--space-20: clamp(5rem, 4.4886rem + 2.2727vw, 6.25rem)
	--space-24: clamp(6rem, 5.3864rem + 2.7273vw, 7.5rem)
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

## Theme switching

Three modes share the same token names:

1. Auto: `prefers-color-scheme` applies dark values when the user has not selected light.
2. Explicit dark: `[data-theme='dark']` applies dark values.
3. Explicit light: `[data-theme='light']` applies light values.

Every theme overrides values, never the public vocabulary. See `_tokens.sass` for the complete current palettes.
