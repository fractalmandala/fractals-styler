<script lang="ts">
	/**
	 * fractals-styler — light/dark toggle.
	 *
	 * The icon swap is done in CSS (`.mode-light-only` / `.mode-dark-only` from
	 * _primitives.sass), never with `{#if mode.current === 'dark'}`. The server cannot
	 * know the visitor's preference, so rendering from the mode value during SSR produces
	 * a hydration mismatch and a visible icon flip on every page load. See
	 * docs/09-mode-and-theme.md §3.
	 *
	 *   <ModeToggle />
	 *   <ModeToggle variant="quiet">
	 *     {#snippet light()}<SunIcon />{/snippet}
	 *     {#snippet dark()}<MoonIcon />{/snippet}
	 *   </ModeToggle>
	 */
	import type { Snippet } from 'svelte';
	import { toggleMode } from './mode.svelte.js';

	let {
		variant = 'icon',
		label = 'Toggle colour mode',
		light,
		dark
	}: {
		/** Maps to `.button[data-variant]` in _buttonslinks.sass. */
		variant?: 'default' | 'primary' | 'quiet' | 'icon';
		/** Accessible name. The button has no text content by default. */
		label?: string;
		/** Shown while light mode is active (i.e. the control switches *to* dark). */
		light?: Snippet;
		/** Shown while dark mode is active. */
		dark?: Snippet;
	} = $props();
</script>

<button class="button" data-variant={variant} aria-label={label} onclick={toggleMode}>
	<span class="mode-light-only">
		{#if light}{@render light()}{:else}☾{/if}
	</span>
	<span class="mode-dark-only">
		{#if dark}{@render dark()}{:else}☀{/if}
	</span>
</button>
