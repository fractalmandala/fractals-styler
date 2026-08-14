---
title: Compositions
---

Macro arrangements only. Zero visuals (no colors, no shadows). Lives in `_compositions.sass`.

## App shell

```sass
.appshell
	position: relative
	isolation: isolate
	display: flex
	flex-direction: column
	min-height: 100vh

.appheader
	position: sticky
	top: 0
	z-index: var(--z-sticky)
	display: flex
	align-items: center
	height: var(--header-height)
	padding-inline: var(--shell-pad, 20px)

.appbody
	position: relative
	display: grid
	grid-template-columns: 1fr
	min-height: calc(100vh - var(--header-height))

.appfooter
	display: flex
	align-items: center
	min-height: var(--footer-height)
	padding-inline: var(--shell-pad, 20px)
```

## Body & sidebars

```sass
// Middle reading column. Content constrained to --measure and stays centred.
.body-main
	min-width: 0
	display: flex
	flex-direction: column
	padding-block: var(--space-m)
	padding-inline: var(--shell-pad, 20px)
	:where(*)
		width: 100%
		max-width: var(--measure, 60ch)
		margin-inline: auto

// Sidebars. Mobile-first: both hidden.
.sidebar-left, .sidebar-right
	min-width: 0
	display: none

@media (min-width: 1025px)
	.appbody[data-left='true']
		grid-template-columns: clamp(var(--sidebar-min, 200px), 20vw, var(--sidebar-max, 360px)) minmax(0, 1fr)

	.sidebar-left
		display: flex
		flex-direction: column
		position: sticky
		top: var(--header-height)
		height: calc(100vh - var(--header-height))
		overflow-y: auto
		padding: var(--space-m) var(--space-xs)

	.sidebar-right
		display: none

@media (min-width: 1201px)
	.appbody[data-left='true'][data-right='true']
		grid-template-columns: clamp(var(--sidebar-min, 200px), 20vw, var(--sidebar-max, 360px)) minmax(0, 1fr) clamp(var(--sidebar-min, 200px), 20vw, var(--sidebar-max, 360px))

	.appbody[data-left='false'][data-right='true']
		grid-template-columns: minmax(0, 1fr) clamp(var(--sidebar-min, 200px), 20vw, var(--sidebar-max, 360px))

	.sidebar-right
		display: flex
		flex-direction: column
		position: sticky
		top: var(--header-height)
		height: calc(100vh - var(--header-height))
		overflow-y: auto
		padding: var(--space-m) var(--space-xs)
```

## Layout primitives

```sass
// Vertical rhythm with gap via --stack-gap
.stack
	display: flex
	flex-direction: column
	justify-content: flex-start
	gap: var(--stack-gap, var(--space-xs))

// Wrapping row of items
.cluster
	display: flex
	flex-wrap: wrap
	gap: var(--cluster-gap, var(--space-xs))
	align-items: var(--cluster-align, center)
	justify-content: var(--cluster-justify, flex-start)

// Intrinsic sidebar: a fixed-ish rail beside a fluid main, wraps when tight
.with-sidebar
	display: flex
	flex-wrap: wrap
	gap: var(--sidebar-gap, var(--space-s))
	.rail
		flex-basis: var(--rail-width, 240px)
		flex-grow: 1
	.flow
		flex-basis: 0
		flex-grow: 999
		min-width: var(--flow-min, 60%)

// Horizontal overflow scroller
.reel
	display: flex
	gap: var(--reel-gap, var(--space-xs))
	overflow-x: auto
	overscroll-behavior-inline: contain
	scroll-snap-type: inline mandatory
	:where(*)
		scroll-snap-align: start
		flex: 0 0 auto
```

## Cover

Vertically centered content filling a minimum height.

```sass
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

## Center

Horizontally centered block with max-width measure.

```sass
.center
	max-width: var(--center-max, var(--measure, 60ch))
	margin-inline: auto
	padding-inline: var(--center-pad, var(--space-s))
```

## Frame

Aspect-ratio container for media. Use `data-ratio` to switch ratios.

```sass
.frame
	--frame-ratio: 16 / 9
	aspect-ratio: var(--frame-ratio)
	overflow: hidden
	:is(img, video, iframe)
		width: 100%
		height: 100%
		object-fit: cover
	// Variants: data-ratio='1/1' | '4/3' | '16/9' | '21/9' | '3/4' | '2/3'
```

## Auto-grid

Intrinsic auto-fit grid — columns size themselves.

```sass
.auto-grid
	display: grid
	grid-template-columns: repeat(auto-fit, minmax(min(var(--auto-grid-min, 15rem), 100%), 1fr))
	gap: var(--auto-grid-gap, var(--space-s))
```

## Switcher

Container-based layout switching — items sit side-by-side when space allows, stack when tight.

```sass
.switcher
	display: flex
	flex-wrap: wrap
	gap: var(--switcher-gap, var(--space-s))
	:where(*)
		flex-grow: 1
		flex-basis: calc((var(--switcher-threshold, 30rem) - 100%) * 999)
	:is(:nth-last-child(n+5), :nth-last-child(n+5) ~ *)
		flex-basis: 100%
```
