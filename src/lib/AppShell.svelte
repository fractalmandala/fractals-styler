<script lang="ts">
	/**
	 * fractals-styler — canonical docs app shell (CUBE Composition layer).
	 *
	 * Renders the fixed skeleton:
	 *   section.appshell > header.appheader + main.appbody + footer.appfooter
	 *   main.appbody > aside.sidebarleft + article.bodymain + aside.sidebarright
	 *
	 * All visual arrangement lives in _compositions.sass; this component only
	 * wires the snippets. Sidebar visibility is
	 * handled by CSS media queries (both hidden <1025 px, left-only at
	 * 1025–1200 px, both visible at 1201 px+).
	 *
	 *   <AppShell>
	 *     {#snippet header()} … {/snippet}
	 *     {#snippet sidebarleft()} … {/snippet}
	 *     {#snippet sidebarright()} … {/snippet}
	 *     {#snippet footer()} … {/snippet}
	 *     … page content (bodymain) …
	 *   </AppShell>
	 */
	import type { Snippet } from 'svelte';

	/** Controls for the mobile nav drawer, surfaced to the header snippet. */
	interface NavCtl {
		open: boolean;
		toggle: () => void;
	}

	let {
		header,
		sidebarleft,
		sidebarright,
		footer,
		children,
		showLeft = sidebarleft != null,
		showRight = sidebarright != null,
		mobileOpen = $bindable(false)
	}: {
		header?: Snippet<[NavCtl]>;
		sidebarleft?: Snippet;
		sidebarright?: Snippet;
		footer?: Snippet;
		children?: Snippet;
		showLeft?: boolean;
		showRight?: boolean;
		mobileOpen?: boolean;
	} = $props();

	const navctl: NavCtl = {
		get open() {
			return mobileOpen;
		},
		toggle() {
			mobileOpen = !mobileOpen;
		}
	};
</script>

<section class="appshell">
	<header class="appheader">
		{@render header?.(navctl)}
	</header>

	<main
		class="appbody"
		data-left={showLeft ? 'true' : 'false'}
		data-right={showRight ? 'true' : 'false'}
		data-mobile-open={mobileOpen ? 'true' : 'false'}
	>
		{#if showLeft}
			<aside class="sidebarleft">
				{@render sidebarleft?.()}
			</aside>
		{/if}

		<article class="bodymain">
			{@render children?.()}
		</article>

		{#if showRight}
			<aside class="sidebarright">
				{@render sidebarright?.()}
			</aside>
		{/if}

		{#if mobileOpen}
			<button
				type="button"
				class="appbody-backdrop"
				aria-label="Close navigation"
				onclick={() => (mobileOpen = false)}
			></button>
		{/if}
	</main>

	{#if footer}
		<footer class="appfooter">
			{@render footer()}
		</footer>
	{/if}
</section>

<style lang="sass">

// CUBE · Composition layer
// ----------------------------------------------------------------------
// Named, token-driven layout skeletons. These describe *arrangement* only
// (the C in CUBE) — no colours, no component detail. Utilities and blocks
// layer on top. Exceptions are expressed with data-* / aria-* attributes,
// never with BEM modifiers.
//
//   1. App shell — the canonical docs layout
// ----------------------------------------------------------------------

// 1. App shell ---------------------------------------------------------
// section.appshell > header.appheader + main.appbody + footer.appfooter
// main.appbody > aside.sidebarleft + article.bodymain + aside.sidebarright

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

// Middle reading column. In the canonical markup <article class="bodymain">
// IS the middle cell; its content is constrained to a comfortable measure
// that grows from --body-min to --body-max and stays centred.
.bodymain
	min-width: 0
	display: flex
	flex-direction: column
	padding-block: var(--space-8)
	padding-inline: var(--shell-pad, 20px)
	> :global(*)
		width: 100%
		max-width: clamp(var(--body-min, 600px), 58vw, var(--body-max, 800px))
		margin-inline: auto

// Sidebars. Mobile-first: both hidden.
.sidebarleft, .sidebarright
	min-width: 0
	display: none

@media (min-width: 1025px)
	// Two-column when the left rail exists; otherwise the body stays fluid.
	.appbody[data-left='true']
		grid-template-columns: clamp(var(--sidebar-min, 200px), 20vw, var(--sidebar-max, 360px)) minmax(0, 1fr)

	.sidebarleft
		display: flex
		flex-direction: column
		position: sticky
		top: var(--header-height)
		height: calc(100vh - var(--header-height))
		overflow-y: auto
		padding: var(--space-8) var(--space-4)

	.sidebarright
		display: none

@media (min-width: 1201px)
	// Three-column when both rails exist.
	.appbody[data-left='true'][data-right='true']
		grid-template-columns: clamp(var(--sidebar-min, 200px), 20vw, var(--sidebar-max, 360px)) minmax(0, 1fr) clamp(var(--sidebar-min, 200px), 20vw, var(--sidebar-max, 360px))

	// Body + right rail when the left rail is absent.
	.appbody[data-left='false'][data-right='true']
		grid-template-columns: minmax(0, 1fr) clamp(var(--sidebar-min, 200px), 20vw, var(--sidebar-max, 360px))

	.sidebarright
		display: flex
		flex-direction: column
		position: sticky
		top: var(--header-height)
		height: calc(100vh - var(--header-height))
		overflow-y: auto
		padding: var(--space-8) var(--space-4)
</style>
