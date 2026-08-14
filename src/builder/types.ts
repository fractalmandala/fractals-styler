export type DisplayMode = 'flex' | 'grid' | 'block' | 'inline-flex';
export type FlexDirection = 'column' | 'row';
export type AlignItems = 'stretch' | 'flex-start' | 'center' | 'flex-end';
export type JustifyContent =
	'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around';
export type WidthMode = 'auto' | '100%' | '100vw' | 'fill' | 'custom' | 'minmax';
export type HeightMode = 'auto' | '100%' | '100vh' | 'fill' | 'custom' | 'minmax';
/** Background surfaces. Values are the `_tokens.sass` background tokens and the matching
 * `_primitives.sass` classes — `panel` and `subtle` used to be listed here but resolved
 * to `--bg-panel` / `--bg-subtle`, which have never existed, so the generator emitted
 * `background-color: var(--bg-panel)` and the declaration was simply dropped. */
export type SurfaceToken = 'bg' | 'bg-surface' | 'bg-raised' | 'none' | 'custom';

/** Radius scale. Hyphenated to match the `.radius-*` classes in `_primitives.sass`; the
 * previous unhyphenated spelling was emitted verbatim into `class=""` and matched nothing. */
export type RadiusToken =
	| 'radius-0'
	| 'radius-2'
	| 'radius-4'
	| 'radius-6'
	| 'radius-8'
	| 'radius-12'
	| 'radius-16'
	| 'radius-24'
	| 'radius-full';

/** Shadow scale from `_tokens.sass`, as the `.shadow-*` classes. */
export type ShadowToken = 'none' | 'shadow-sm' | 'shadow-md' | 'shadow-lg';

/** Font-size utilities from `_typography.sass`. */
export type FontSizeToken =
	| 'text-xs'
	| 'text-sm'
	| 'text-md'
	| 'text-lg'
	| 'text-xl'
	| 'text-2xl'
	| 'text-3xl'
	| 'text-4xl';

export type ButtonVariant = 'default' | 'primary' | 'quiet' | 'icon';
export type PrimitiveType = 'box' | 'row' | 'grid' | 'surface' | 'button';

export interface BuilderNode {
	id: string;
	name: string;
	display: DisplayMode;
	direction: FlexDirection;
	alignItems: AlignItems;
	justifyContent: JustifyContent;
	width: WidthMode;
	widthVal?: string;
	minWVal?: string;
	maxWVal?: string;
	height: HeightMode;
	heightVal?: string;
	minHVal?: string;
	maxHVal?: string;
	marginBot: number;
	primitive: PrimitiveType;
	buttonVariant?: ButtonVariant;
	padding: number;
	gap: number;
	gridCols?: number;
	colSpan?: number;
	rowSpan?: number;
	radius: RadiusToken;
	surface: SurfaceToken;
	customBg?: string;
	borderColor?: string;
	textColor?: string;
	fontSize?: FontSizeToken;
	textAlign?: string;
	borderWidth?: string;
	shadow?: ShadowToken;
	/** Flex direction at the `sm` breakpoint. Emitted as the package's `-sm` suffix
	 * (`row-sm` / `box-sm`), not a `sm:` prefix — the JIT only recognises the suffix. */
	smDirection?: 'default' | 'row' | 'column';
	children: BuilderNode[];
	content?: string | null;
}

export interface SavedComponent {
	name: string;
	node: BuilderNode;
}

export interface SaveComponentPayload {
	targetPath: string; // e.g. "sites/fractalmandala/src/lib/components"
	componentName: string; // e.g. "HeroBanner"
	node: BuilderNode;
}
