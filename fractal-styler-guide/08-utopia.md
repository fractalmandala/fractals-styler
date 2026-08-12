---
title: Fluid Design
---

Fractal Styler uses Utopia's fluid-design idea without exposing a second naming system. The public tokens are the fluid values.

There is no translation from `--step-2` to `--text-xl`, and no `--fluid-step` layer. Instead:

```sass
:root
	--text-bs: clamp(0.884rem, 0.9065rem + -0.0291vw, 0.9rem)
	--text-lg: clamp(1.125rem, 1.0739rem + 0.2273vw, 1.25rem)
	--text-xl: clamp(1.4063rem, 1.3159rem + 0.4014vw, 1.7675rem)

	--space-4: clamp(1rem, 0.8977rem + 0.4545vw, 1.25rem)
	--space-6: clamp(1.5rem, 1.3466rem + 0.6818vw, 1.875rem)
	--space-8: clamp(2rem, 1.7955rem + 0.9091vw, 2.5rem)
```

Consumers keep using the stable system vocabulary:

```sass
.text-xl
	font-size: var(--text-xl)

.stack
	gap: var(--stack-gap, var(--space-4))
```

This preserves the important Utopia behavior—smooth interpolation between viewport bounds—while keeping Fractal Styler's token and class grammar intact. The complete values live in `_tokens.sass`; do not maintain a separate Utopia registry.
