---
title: Globals and Other Rules
---

Global definitions for body, html, :root, box-sizing, input, textarea, etc. are set in `_globals.sass`.
Buttons and links are styled in `_buttonslinks.sass`. Here too the principle applies: set rules and standards higher up.
ex - a standard button, a button that holds an icon (and is blank otherwise), a button that holds and icon and presents its own shape on hover, etc.

Remember

- **Max 50–80 lines** per block SASS file. If it exceeds 80, you're over-specifying styles that should belong to global typography or utilities.
- **No deep BEM chains.** Prefer a semantic child class, `data-slot` or `:where(...)` over structural selectors such as `.card header h3`.
- **Cascade friendly.** Allow typography and color inheritance to flow down from parent containers.
- **Variants via `data-variant`**, sizes via `data-size`, states via `data-state` / `aria-*`

**The single rule for the entire codebase: **no `--modifier` or `is-state` classes, ever.** Use HTML attributes.** - **Platform native** — bridges HTML, CSS, and JS/Svelte 5 runes (`$state`) seamlessly. - **Accessible** — works directly with ARIA states. - **No class thrashing** — toggling state in Svelte is `data-state={active}` instead of class string concatenation. - **Single source of truth** — one attribute drives CSS, JS, and a11y.

```svelte
✅
<button class="button" data-variant="primary" data-state="loading" aria-busy="true">Save</button>

❌
<button class="button button-primary is-loading">Save</button>
```
