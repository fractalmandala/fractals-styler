export type Declaration = { prop: string; value: string };

export type Breakpoint = 'sm' | 'md' | 'lg' | 'xl';

/** Media query body for each mobile-first breakpoint suffix:
 *  sm ≥640px, md ≥768px, lg ≥1024px, xl ≥1240px */
export const BREAKPOINTS: Record<Breakpoint, string> = {
	sm: '(min-width: 640px)',
	md: '(min-width: 768px)',
	lg: '(min-width: 1024px)',
	xl: '(min-width: 1240px)'
};

export const BREAKPOINT_ORDER: Breakpoint[] = ['sm', 'md', 'lg', 'xl'];

/** prefix -> css property, for the `.{prefix}{N}` JIT classes. Longest prefix wins on overlap
 * (e.g. "padtop" must be tried before "pad"). */
export const DYNAMIC_PREFIXES: Array<{ prefix: string; prop: string }> = [
	{ prefix: 'padtop', prop: 'padding-top' },
	{ prefix: 'padbot', prop: 'padding-bottom' },
	{ prefix: 'padleft', prop: 'padding-left' },
	{ prefix: 'padright', prop: 'padding-right' },
	{ prefix: 'pad', prop: 'padding' },
	{ prefix: 'margintop', prop: 'margin-top' },
	{ prefix: 'marginbot', prop: 'margin-bottom' },
	{ prefix: 'marginleft', prop: 'margin-left' },
	{ prefix: 'marginright', prop: 'margin-right' },
	{ prefix: 'margin', prop: 'margin' },
	{ prefix: 'cgap', prop: 'column-gap' },
	{ prefix: 'rgap', prop: 'row-gap' },
	{ prefix: 'gap', prop: 'gap' },
	{ prefix: 'minw', prop: 'min-width' },
	{ prefix: 'maxw', prop: 'max-width' },
	{ prefix: 'width', prop: 'width' },
	{ prefix: 'minh', prop: 'min-height' },
	{ prefix: 'maxh', prop: 'max-height' },
	{ prefix: 'height', prop: 'height' }
].sort((a, b) => b.prefix.length - a.prefix.length);

/** Flat declarations for utility classes shipped in the static SASS partials.
 * These are the only classes the breakpoint-suffix system (`.class-sm` etc.) can clone,
 * because their declarations are known statically. Class modifiers with nested selectors
 * (e.g. `.box.xcenter`) are intentionally excluded — see README for the escape-hatch mixin.
 *
 * Scope is the CUBE **Utility** layer only. Deliberately absent, and why:
 *   - Blocks (`.card`, `.badge`, `.avatar`, `.input`, `.divider`, `.kbd` in
 *     _primitives.sass). Listing them here would make the JIT re-emit their declarations
 *     into `virtual:fractals-styler.css`, which loads *after* the static system — silently
 *     overriding any project customisation of those blocks. A breakpoint clone of a Block
 *     is not a meaningful thing to ask for either.
 *   - Compositions (`.stack`, `.cluster`, `.reel`, `.cover`, `.frame`, `.auto-grid`,
 *     `.switcher`, `.with-sidebar`). Same override hazard, and they are configured through
 *     custom properties (`--stack-gap`) rather than cloned per breakpoint.
 *   - Mode-conditional visibility (`.mode-light-only`, `.mode-dark-only`). They depend on
 *     an ancestor `[data-mode]` marker, so a flat clone would override the override.
 *   - Element-qualified globals (`button.blank`, `a.link`). Not class-only selectors.
 *   - Font-family utilities (`.font-jetbrains`, ...). `_fonts.sass` is deliberately NOT
 *     loaded by `index.sass` — it is opt-in because its `@font-face` URLs must be pointed
 *     at the project's own font directory first. Registering the classes would make the
 *     JIT emit them for every project, including ones that never opted in, naming
 *     families that have no `@font-face` behind them. */
export const STATIC_UTILITIES: Record<string, Declaration[]> = {
	box: [
		{ prop: 'display', value: 'flex' },
		{ prop: 'flex-direction', value: 'column' }
	],
	row: [
		{ prop: 'display', value: 'flex' },
		{ prop: 'flex-direction', value: 'row' }
	],
	grid: [
		{ prop: 'display', value: 'grid' },
		{ prop: 'grid-auto-flow', value: 'row' }
	],
	wrap: [{ prop: 'flex-wrap', value: 'wrap' }],
	grow: [{ prop: 'flex-grow', value: '1' }],
	'shrink-0': [{ prop: 'flex-shrink', value: '0' }],
	'min-w-0': [{ prop: 'min-width', value: '0' }],
	'min-h-0': [{ prop: 'min-height', value: '0' }],
	w100: [{ prop: 'width', value: '100%' }],
	wfull: [{ prop: 'width', value: '100%' }],
	h100: [{ prop: 'height', value: '100%' }],
	hfull: [{ prop: 'height', value: '100%' }],
	w100vw: [{ prop: 'width', value: '100vw' }],
	h100vh: [{ prop: 'height', value: '100vh' }],
	'col-span-2': [{ prop: 'grid-column', value: 'span 2' }],
	'col-span-3': [{ prop: 'grid-column', value: 'span 3' }],
	'col-span-4': [{ prop: 'grid-column', value: 'span 4' }],
	'col-span-5': [{ prop: 'grid-column', value: 'span 5' }],
	'col-span-6': [{ prop: 'grid-column', value: 'span 6' }],
	'row-span-2': [{ prop: 'grid-row', value: 'span 2' }],
	'row-span-3': [{ prop: 'grid-row', value: 'span 3' }],
	'row-span-4': [{ prop: 'grid-row', value: 'span 4' }],
	'row-span-5': [{ prop: 'grid-row', value: 'span 5' }],
	'row-span-6': [{ prop: 'grid-row', value: 'span 6' }],
	'shadow-sm': [{ prop: 'box-shadow', value: 'var(--shadow-sm)' }],
	'shadow-md': [{ prop: 'box-shadow', value: 'var(--shadow-md)' }],
	'shadow-lg': [{ prop: 'box-shadow', value: 'var(--shadow-lg)' }],
	bg: [{ prop: 'background-color', value: 'var(--bg)' }],
	'bg-surface': [{ prop: 'background-color', value: 'var(--bg-surface)' }],
	'bg-raised': [{ prop: 'background-color', value: 'var(--bg-raised)' }],
	// `.bdr` is intentionally loud: it is a temporary layout-debugging aid.
	bdr: [{ prop: 'border', value: '1px solid red' }],
	border: [{ prop: 'border', value: '1px solid var(--border)' }],
	'border-bottom': [{ prop: 'border-bottom', value: '1px solid var(--border)' }],
	'border-top': [{ prop: 'border-top', value: '1px solid var(--border)' }],
	'border-left': [{ prop: 'border-left', value: '1px solid var(--border)' }],
	'border-right': [{ prop: 'border-right', value: '1px solid var(--border)' }],
	'radius-0': [{ prop: 'border-radius', value: 'var(--radius-0)' }],
	'radius-2': [{ prop: 'border-radius', value: 'var(--radius-2)' }],
	'radius-4': [{ prop: 'border-radius', value: 'var(--radius-4)' }],
	'radius-6': [{ prop: 'border-radius', value: 'var(--radius-6)' }],
	'radius-8': [{ prop: 'border-radius', value: 'var(--radius-8)' }],
	'radius-12': [{ prop: 'border-radius', value: 'var(--radius-12)' }],
	'radius-16': [{ prop: 'border-radius', value: 'var(--radius-16)' }],
	'radius-24': [{ prop: 'border-radius', value: 'var(--radius-24)' }],
	'radius-full': [{ prop: 'border-radius', value: 'var(--radius-full)' }],
	'text-xs': [{ prop: 'font-size', value: 'var(--text-xs)' }],
	'text-sm': [{ prop: 'font-size', value: 'var(--text-sm)' }],
	'text-md': [{ prop: 'font-size', value: 'var(--text-md)' }],
	'text-lg': [{ prop: 'font-size', value: 'var(--text-lg)' }],
	'text-xl': [{ prop: 'font-size', value: 'var(--text-xl)' }],
	'text-2xl': [{ prop: 'font-size', value: 'var(--text-2xl)' }],
	'text-3xl': [{ prop: 'font-size', value: 'var(--text-3xl)' }],
	'text-4xl': [{ prop: 'font-size', value: 'var(--text-4xl)' }],
	// Named type roles from _typography.sass — aliases over the scale above.
	'body-std': [{ prop: 'font-size', value: 'var(--text-lg)' }],
	'page-title': [{ prop: 'font-size', value: 'var(--text-4xl)' }],
	eyebrow: [{ prop: 'font-size', value: 'var(--text-sm)' }],
	'tt-u': [{ prop: 'text-transform', value: 'uppercase' }],
	'tt-c': [{ prop: 'text-transform', value: 'capitalize' }],
	'ta-l': [{ prop: 'text-align', value: 'left' }],
	'ta-r': [{ prop: 'text-align', value: 'right' }],
	'ta-c': [{ prop: 'text-align', value: 'center' }],
	fw400: [{ prop: 'font-weight', value: '400' }],
	fw500: [{ prop: 'font-weight', value: '500' }],
	fw600: [{ prop: 'font-weight', value: '600' }],
	bold: [{ prop: 'font-weight', value: 'bold' }],
	lh11: [{ prop: 'line-height', value: '1.1' }],
	lh125: [{ prop: 'line-height', value: '1.25' }],
	lh15: [{ prop: 'line-height', value: '1.5' }],
	lh16: [{ prop: 'line-height', value: '1.6' }],
	'text-primary': [{ prop: 'color', value: 'var(--text-primary)' }],
	'text-secondary': [{ prop: 'color', value: 'var(--text-secondary)' }],
	'text-muted': [{ prop: 'color', value: 'var(--text-muted)' }],
	'text-inverse': [{ prop: 'color', value: 'var(--text-inverse)' }],
	'text-theme': [{ prop: 'color', value: 'var(--theme)' }],
	'text-danger': [{ prop: 'color', value: 'var(--feedback-danger)' }],
	'text-warning': [{ prop: 'color', value: 'var(--feedback-warning)' }],
	'text-success': [{ prop: 'color', value: 'var(--feedback-success)' }],
	'text-info': [{ prop: 'color', value: 'var(--feedback-info)' }],
	italic: [{ prop: 'font-style', value: 'italic' }],
	truncate: [
		{ prop: 'overflow', value: 'hidden' },
		{ prop: 'text-overflow', value: 'ellipsis' },
		{ prop: 'white-space', value: 'nowrap' }
	],
	'line-clamp-2': [
		{ prop: 'display', value: '-webkit-box' },
		{ prop: 'overflow', value: 'hidden' },
		{ prop: '-webkit-box-orient', value: 'vertical' },
		{ prop: '-webkit-line-clamp', value: '2' }
	],
	'line-clamp-3': [
		{ prop: 'display', value: '-webkit-box' },
		{ prop: 'overflow', value: 'hidden' },
		{ prop: '-webkit-box-orient', value: 'vertical' },
		{ prop: '-webkit-line-clamp', value: '3' }
	]
};

/** Resolve a class name (without the breakpoint suffix) to its declarations, trying the
 * static registry first, then the dynamic `{prefix}{N}` pattern. Returns null if unknown —
 * callers must treat that as "not one of ours", not an error. */
export function resolveDeclarations(base: string, unit: 'px' | 'rem' = 'px'): Declaration[] | null {
	const staticMatch = Object.prototype.hasOwnProperty.call(STATIC_UTILITIES, base)
		? STATIC_UTILITIES[base]
		: null;
	if (staticMatch) return staticMatch;

	for (const { prefix, prop } of DYNAMIC_PREFIXES) {
		if (base.startsWith(prefix)) {
			const rest = base.slice(prefix.length);
			if (/^\d+$/.test(rest)) {
				const num = parseInt(rest, 10);
				const formattedValue = unit === 'rem' ? `${num / 16}rem` : `${num}px`;
				return [{ prop, value: formattedValue }];
			}
		}
	}
	return null;
}
