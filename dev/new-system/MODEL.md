# The fractal model

## 1. Definition

A **fractal** is a SASS mixin that encodes one reusable styling decision and can
compose other fractals. Fractals form four self-similar tiers — each tier is
"a recipe of the tier below":

| Tier | What it is | Emits? | Examples |
| --- | --- | --- | --- |
| **Config** | scales-as-data + resolver functions | no | `space()`, `radius()`, `align()`, `$breakpoints` |
| **Atoms** | one declaration / one decision | on call | `+box` `+row` `+gap` `+pad` `+border` `+radius` `+bg` `+ink` `+type` `+sticky` |
| **Molecules** | a graph of atoms | on call | `+stack` `+cluster` `+cover` `+frame` `+reel` `+surface` `+cols` `+auto-grid` |
| **Components / Layouts** | a graph of molecules | as classes | `.card` `.button` · `.grid-3` `.hero` `.holy-grail` `.docs` `.app-shell` |

The tiers are not enforced by tooling — they're just the natural gradient from
"single property" to "whole page." Self-similarity is the design: you read a
`.docs` layout the same way you read a `.card` — as a short list of fractal calls.

## 2. The two ways to consume a fractal

Every fractal is defined once, in `fractals/`. There are exactly two ways to use it:

**A — as a semantic composition** (inside your own selector):

```sass
.hero
	+cover(80vh, xl)
	> .center
		+stack(m, center)
		text-align: center
```

**B — as a utility class** (bound to a name in `_utilities.sass`, used in markup):

```sass
@each $s in $space-steps
	.gap-#{$s}
		+gap($s)
```
```html
<div class="box gap-m pad-l">…</div>
```

Utility classes are a *generated projection* of the fractal library, not a
parallel system. This is the resolution of the utility-vs-component debate: same
source, author picks the consumer.

## 3. Resolvers: one call, token-or-raw

Fractals never hardcode values. They route every value through a resolver that
prefers the finite token scale and falls back to a raw value:

```
space(m)    → var(--space-m)     // the design vocabulary (default)
space(18)   → 18px               // escape hatch, same call
space(2rem) → 2rem               // passthrough
```

This kills the old JIT class explosion (`gap16`, `gap18`, `gap22`, `pad24-sm`…).
There is one `+gap()` fractal; the number just becomes an argument.

## 4. Worked example — the responsive 3-column grid you asked for

The molecule:

```sass
=cols($map, $gap: s)
	display: grid
	+gap($gap)
	@each $bp, $n in $map
		@if $bp == base
			grid-template-columns: repeat($n, minmax(0, 1fr))
		@else
			+at($bp)
				grid-template-columns: repeat($n, minmax(0, 1fr))
```

The component (one line):

```sass
.grid-3
	+cols((base: 1, sm: 2, lg: 3), m)
```

Compiles to:

```css
.grid-3 { display: grid; gap: var(--space-m); grid-template-columns: repeat(1, minmax(0,1fr)); }
@media (min-width: 640px)  { .grid-3 { grid-template-columns: repeat(2, minmax(0,1fr)); } }
@media (min-width: 1024px) { .grid-3 { grid-template-columns: repeat(3, minmax(0,1fr)); } }
```

Responsiveness itself is a fractal (`+at`), so a "responsive component" is just a
component that re-states some fractals inside `+at(...)`.

## 5. CUBE mapping

| CUBE layer | Old model | Fractal model |
| --- | --- | --- |
| **Composition** | `.stack .cluster` classes in markup | `+stack +cluster +cols` fractals, composed in SASS (or still projected to classes) |
| **Utility** | `.gap16 .pad24 .text-lg` classes | `+gap +pad +type` fractals; projected to classes only where wanted |
| **Block** | `.card { … 20 lines … }` | `.card { +surface(...) +stack(...) }` — recipe, not wall of CSS |
| **Exception** | `data-*` / `aria-*` | unchanged — `&[data-variant='primary']` |

## 6. Old class → new fractal mapping

| Old (class in markup) | New (fractal call) |
| --- | --- |
| `.box` | `+box` |
| `.box.xcenter.ycenter` | `+box(center, center)` |
| `.row.wrap.xbetween.ycenter` | `+row(between, center)` + `+wrap` |
| `.grid.grid-cols-3` | `+grid(3)` |
| `.auto-grid` | `+auto-grid($min, $gap)` |
| `.gap16` / `gap22` (JIT) | `+gap(16)` / `+gap(m)` |
| `.pad24` / `pad12-sm` (JIT) | `+pad(24)` / `+at(sm) { +pad(s) }` |
| `.bg-surface` | `+bg(surface)` |
| `.radius-12` | `+radius(12)` |
| `.shadow-md` | `+shadow(md)` |
| `.border` / `.border-bottom` | `+border` / `+border(bottom)` |
| `.text-lg` | `+type(lg)` |
| `.truncate` / `.line-clamp-2` | `+truncate` / `+clamp-lines(2)` |
| `.stack` | `+stack($gap)` |
| `.cluster` | `+cluster($gap)` |
| `.center` (measure) | `+center-column($max)` |
| `.cover` / `.frame` / `.reel` | `+cover` / `+frame($ratio)` / `+reel` |
| `.with-sidebar` | `+with-sidebar($rail, $gap)` |
| `.card` (hand-written) | `.card { +surface(...) +stack(...) }` |
| breakpoint clone `-sm/-md/-lg` | `+at(sm/md/lg) { … }` |
| `=bp-sm` mixin | `+at(sm)` (unified name) |

## 7. Migration path (non-breaking)

You do **not** have to rewrite markup on day one:

1. Drop in `fractals/` and `_utilities.sass`. The projected classes reproduce the
   current public class vocabulary, so existing templates keep working.
2. Author *new* components as fractal recipes (`.card { +surface … }`).
3. Opportunistically collapse `class="card stack gap16 pad24 …"` call-sites into
   single semantic classes as you touch them.
4. Trim `_utilities.sass` to only the atoms you still use in markup. Whatever you
   deleted still exists as a fractal for composition.

Nothing about the token layer, mode/theme system, or `data-*` exceptions changes.
