---
title: Mode and Theme
---

Fractals Styler ships light/dark mode as part of the system. There is no provider to wrap, no component to mount, and no flash of the wrong palette on load.

Two axes, deliberately separate:

|                        | mode                         | theme                            |
| ---------------------- | ---------------------------- | -------------------------------- |
| values                 | exactly two: `light`, `dark` | any number: `ocean`, `forest`, … |
| origin                 | the visitor's **OS setting** | your own invention               |
| written to `<html>` as | `data-mode`                  | `data-theme`                     |

They compose: "ocean theme, dark mode" is a valid state. Mode is the one the operating system has an opinion about, which is why it gets its own attribute and its own runtime.

## Setup

Nothing, if you ran `init`. The CLI patches `src/app.html` with the script that applies the mode before first paint:

```sh
pnpm exec fractals-styler init
```

For non-SvelteKit Vite projects, the plugin injects the same script into `index.html`:

```ts
import fractalsStyler from 'fractals-styler';

export default { plugins: [sveltekit(), fractalsStyler()] };
```

Both paths are idempotent — a project that has been patched once is never double-injected. To opt out entirely:

```ts
fractalsStyler({ mode: false });
```

Out of the box you get: OS preference followed by default, explicit choices persisted, tabs kept in sync, and `color-scheme` set so scrollbars and form controls match the palette.

## A toggle

```svelte
<script>
	import { ModeToggle } from 'fractals-styler/lib';
</script>

<ModeToggle />
```

`ModeToggle` renders `.button[data-variant='icon']` and swaps a sun/moon glyph. Supply your own icons with snippets, and pick any button variant:

```svelte
<ModeToggle variant="quiet" label="Switch colour mode">
	{#snippet light()}<MoonIcon />{/snippet}
	{#snippet dark()}<SunIcon />{/snippet}
</ModeToggle>
```

The `light` snippet shows while light mode is active — it is the control that switches _to_ dark.

## Reading and setting mode

```svelte
<script>
	import {
		mode,
		preference,
		systemMode,
		setMode,
		toggleMode,
		resetMode
	} from 'fractals-styler/lib';
</script>

<p>Painting: {mode.current}</p>
<button onclick={toggleMode}>Toggle</button>
<button onclick={() => setMode('dark')}>Force dark</button>

{#if preference.current !== 'system'}
	<button onclick={resetMode}>Follow system</button>
{/if}
```

| export               | type                            | what it is                                  |
| -------------------- | ------------------------------- | ------------------------------------------- |
| `mode.current`       | `'light' \| 'dark'`             | the **resolved** mode — the value on screen |
| `preference.current` | `'light' \| 'dark' \| 'system'` | what the visitor chose                      |
| `systemMode.current` | `'light' \| 'dark'`             | what the OS reports right now               |
| `theme.current`      | `string`                        | active named theme, `''` for none           |
| `setMode(m)`         |                                 | set the preference; accepts `'system'`      |
| `toggleMode()`       |                                 | flip between light and dark                 |
| `resetMode()`        |                                 | go back to following the OS                 |
| `setTheme(name)`     |                                 | set the named theme axis                    |

The distinction between `mode` and `preference` is what makes a "follow system" option possible: `preference` can be `system` while `mode` is `dark`. Paint with `mode`, build settings UI from `preference`.

`toggleMode()` from `system` commits to the opposite of what is currently showing, which is what a visitor pressing the button expects. `resetMode()` undoes that.

## Named themes

Themes are orthogonal to mode. `setTheme('ocean')` writes `data-theme="ocean"` and persists it; each theme provides its own light and dark palettes:

```sass
[data-theme='ocean']
	--theme: #0b7285
	--theme-hover: #0c8599

[data-theme='ocean'][data-mode='dark']
	--theme: #22b8cf
	--theme-hover: #3bc9db
```

`setTheme('')` clears the attribute and returns to the default palette.

## Toggle icons and SSR

Never render a toggle icon from the mode value:

```svelte
<!-- wrong: the server cannot know the visitor's preference -->
{#if mode.current === 'dark'}<Sun />{:else}<Moon />{/if}
```

The server picks one, the client may disagree, and you get a hydration mismatch plus a visible icon flip on every load. Use the visibility utilities instead — CSS cannot desynchronise:

```svelte
<span class="mode-light-only"><Moon /></span>
<span class="mode-dark-only"><Sun /></span>
```

This is what `ModeToggle` does internally.

## Customising the contract

Pass a config to the plugin. The same values are used by the injected script and the runtime, so they cannot drift:

```ts
fractalsStyler({
	mode: {
		defaultMode: 'light', // when nothing is stored — default 'system'
		defaultTheme: 'ocean',
		attribute: 'data-mode',
		themeAttribute: 'data-theme',
		storageKey: 'fractals-styler:mode',
		themeStorageKey: 'fractals-styler:theme',
		disableTransitions: true, // suppress transitions during a switch
		nonce: '…' // required under a strict CSP script-src
	}
});
```

`disableTransitions` is on for a reason: without it, every element with a transition on `color` or `background` animates at once during a switch, which reads as jank rather than polish.

## Outside Svelte

The runtime has no framework dependency:

```ts
import { initMode } from 'fractals-styler/mode';

const controller = initMode();
controller.subscribe((state) => {
	console.log(state.mode, state.preference, state.system, state.theme);
});
controller.toggleMode();
```

`initMode()` returns a singleton. `buildInlineScriptTag()` from the same entry gives you the `<head>` script as a string, for templates the plugin and CLI do not reach.

## How the CSS resolves

Three layers in `_tokens.sass`, in cascade order:

```sass
:root                                  // 1. complete light palette, always applies
	color-scheme: light
	--bg: #fdfefe

@media (prefers-color-scheme: dark)    // 2. OS preference, for visitors with no explicit choice
	:root:not(:where([data-mode='light'], [data-theme='light'], .light))
		color-scheme: dark
		--bg: #131313

[data-mode='dark'], [data-theme='dark'], .dark    // 3. explicit choice wins
	color-scheme: dark
	--bg: #131313
```

Three things make this work, and all three matter if you edit the palette:

1. **The `:root` block is load-bearing.** It applies with no marker at all, so every token stays defined with JS disabled, during SSR, and for crawlers. Do not replace it with an explicit `[data-mode='light']` block — that leaves every colour undefined until a marker lands, and if nothing ever writes one, permanently. The page renders with no colours and the CSS looks correct, which makes it a hard failure to diagnose.
2. **The `:not()` guard is required.** Without it, a visitor on a dark OS who explicitly picks light has the media query fighting their choice at equal specificity. `:where()` keeps the guard at specificity (0,1,0) so the explicit blocks below win on source order.
3. **`color-scheme` is set in every block.** Without it you get a dark page with bright white scrollbars.

## Migrating from `[data-theme]`

Earlier versions keyed mode off `[data-theme='light'|'dark']`. That attribute now means _named theme_; mode moved to `data-mode`.

`[data-theme='light'|'dark']` and the `.light`/`.dark` classes are still accepted as aliases on every mode block, so nothing breaks today. They are deprecated and will be removed in 3.0 — move markup and any hand-rolled toggles to `data-mode`.

If you are using a third-party class-based mode library and want to keep it, the `.dark` alias already covers it. If you are pairing one with CSS written against `[data-theme='dark']`, be aware that most such libraries write mode as a **class** and only write `data-theme` when you call their `setTheme()` — which is why that combination silently matches nothing.
