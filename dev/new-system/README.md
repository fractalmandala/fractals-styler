# fractals-styler — the fractal model

> A reconceptualization of the styling system where **a fractal is a mixin**, and
> components and layouts are just fractals composed from smaller fractals.
> All files here are a self-contained prototype in `dev/new-system/`. The shipped
> package is untouched.

## Does this work? Yes — and it's a better fit for your taste than the class model.

A SASS mixin (`=name` / `+name` in indented syntax) is the natural "small unit."
It can take arguments, hold `@content`, and compose other mixins. That is exactly
your definition of a fractal: a tiny reusable decision that combines with others
to build anything.

The one real idea that makes it click:

> **A utility class and a semantic component are the same fractal, consumed two ways.**

- `.gap-m { +gap(m) }` — the fractal bound to a class, used from markup.
- `.hero { +cover; +stack(m) }` — the same fractals composed into a component.

So you are not choosing between "utility CSS" and "component CSS" anymore. You
have **one vocabulary of fractals** and you pick where each one is consumed.

### What you gain

- **Composition in SASS, not in markup.** `class="card stack gap16 pad24 bg-surface radius-12 border"` becomes `class="card"`, and `.card` is `+surface(...)  +stack(...)`. Markup stays semantic; the recipe lives in one place.
- **Self-similarity.** Atoms compose into molecules, molecules into components, components into layouts — the *same move* at every scale. That is the "fractal" made literal.
- **Parameterized, not proliferated.** `+gap(m)`, `+gap(16)`, `+gap(2rem)` all work from one mixin. No `gap16`, `gap18`, `gap22`… JIT explosion. The token scale is the default; raw values are the escape hatch, inside the same call.
- **CUBE survives intact.** Composition/Utility/Block/Exception still map cleanly — you've just moved Utility and Composition from *classes in HTML* to *fractals in SASS*. Exceptions stay on `data-*`/`aria-*`.

### The one honest tradeoff

Mixins **inline** their output. If 50 components each `+box`, that
`display:flex; flex-direction:column` is emitted 50 times, whereas a single
`.box` utility class ships once. Two things make this a non-issue in practice:

1. gzip/brotli collapse repeated declarations extremely well.
2. You keep `_utilities.sass` — for the truly ubiquitous atoms (`box`, `gap-*`,
   `pad-*`) you emit **one** class and reuse it, exactly like before. Reserve
   mixin-composition for components, where the duplication is bounded and the
   readability win is large.

You choose per fractal. That control is the whole point.

## Layout of this prototype

```
dev/new-system/
├─ fractals/            the vocabulary (emits nothing until called)
│  ├─ _config.sass      scales as data + resolvers: space(), radius(), align()…
│  ├─ _tokens.sass      the CSS custom properties (the only literal values)
│  ├─ _responsive.sass  +at(md), +until, +cq — responsiveness as a fractal
│  ├─ _atoms.sass       indivisible fractals: +box +row +gap +pad +surface-skin…
│  ├─ _molecules.sass   composed fractals: +stack +cluster +cover +surface +cols…
│  ├─ _utilities.sass   projection of atoms → markup classes (optional)
│  └─ index.sass        pure API barrel:  @use '../fractals' as *
├─ components/
│  ├─ _blocks.sass      card, button, badge, input… as fractal recipes
│  └─ _layouts.sass     grid-3, hero, holy-grail, docs, app-shell
├─ examples/
│  └─ app.sass          a real project stylesheet, both consumption modes
├─ index.sass           the entry a project imports (tokens+utilities+components)
├─ README.md            (this file)
└─ MODEL.md             the fractal taxonomy + full old→new mapping table
```

## Try it

```bash
cd dev/new-system
npx sass examples/app.sass:/tmp/app.css --load-path .
```

Compiles to ~850 lines of plain CSS with zero warnings. Every layout you named —
a responsive 3-column grid (`.grid-3`), a hero (`.hero`), a holy-grail
(`.holy-grail`), a docs template (`.docs`) — is in
[`components/_layouts.sass`](components/_layouts.sass), each just a few fractal
calls. Read [MODEL.md](MODEL.md) for the full walkthrough.
