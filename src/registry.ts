export type Declaration = { prop: string; value: string };

export type Breakpoint = 'sm' | 'md' | 'lg' | 'xl';

/** Media query body for each mobile-first breakpoint suffix:
 *  sm ≥640px, md ≥768px, lg ≥1024px, xl ≥1280px */
export const BREAKPOINTS: Record<Breakpoint, string> = {
	sm: '(min-width: 640px)',
	md: '(min-width: 768px)',
	lg: '(min-width: 1024px)',
	xl: '(min-width: 1280px)'
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
 * (e.g. `.box.xcenter`) are intentionally excluded — see README for the escape-hatch mixin. */
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
	'text-bs': [{ prop: 'font-size', value: 'var(--text-bs)' }],
	'text-lg': [{ prop: 'font-size', value: 'var(--text-lg)' }],
	'text-xl': [{ prop: 'font-size', value: 'var(--text-xl)' }],
	'text-2xl': [{ prop: 'font-size', value: 'var(--text-2xl)' }],
	'text-3xl': [{ prop: 'font-size', value: 'var(--text-3xl)' }],
	'text-4xl': [{ prop: 'font-size', value: 'var(--text-4xl)' }],
	'text-5xl': [{ prop: 'font-size', value: 'var(--text-5xl)' }],
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
