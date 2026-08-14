---
title: Fluid Design
---

Fractal Styler uses Utopia's fluid-design idea without exposing a second naming system. The public tokens are the fluid values.

There is no translation from `--step-2` to `--text-xl`, and no `--fluid-step` layer. Instead:

```sass
:root
	--text-sm: clamp(0.9375rem, 0.9119rem + 0.1136vw, 1rem)
	--text-lg: clamp(1.35rem, 1.2631rem + 0.3864vw, 1.5625rem)
	--text-xl: clamp(1.62rem, 1.4837rem + 0.6057vw, 1.9531rem)

	--space-xs: clamp(0.875rem, 0.8494rem + 0.1136vw, 0.9375rem)
	--space-s: clamp(1.125rem, 1.0739rem + 0.2273vw, 1.25rem)
	--space-m: clamp(1.6875rem, 1.6108rem + 0.3409vw, 1.875rem)
```

Fluid space uses t-shirt naming (`3xs`, `2xs`, `xs`, `s`, `m`, `l`, `xl`, `2xl`, `3xl`). All values interpolate between a 360 px and 1240 px viewport.

Consumers keep using the stable system vocabulary:

```sass
.text-xl
	font-size: var(--text-xl)

.stack
	gap: var(--stack-gap, var(--space-xs))
```

This preserves the important Utopia behavior—smooth interpolation between viewport bounds—while keeping Fractal Styler's token and class grammar intact. The complete values live in `_tokens.sass`; do not maintain a separate Utopia registry.
