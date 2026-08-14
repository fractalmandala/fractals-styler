/** Types for `mode.svelte.js`. Hand-written because the implementation must ship as
 * plain JavaScript — see the header comment in `mode.svelte.js`. */

import type { Mode, ModeConfig, ModeState, ResolvedMode } from '../mode/types.js';

/** Start the runtime. Called automatically on first access; call it explicitly from your
 * root layout only if you need to pass a config. */
export declare function configureMode(config?: ModeConfig): void;

/** The resolved mode — the value you paint with. */
export declare const mode: { readonly current: ResolvedMode };

/** The user's raw three-state preference. */
export declare const preference: { readonly current: Mode };

/** What the OS reports right now, regardless of preference. */
export declare const systemMode: { readonly current: ResolvedMode };

/** The active named theme, or `''` for none. Orthogonal to mode. */
export declare const theme: { readonly current: string };

export declare function setMode(next: Mode): void;
export declare function toggleMode(): void;
/** Return to following the OS preference. */
export declare function resetMode(): void;
export declare function setTheme(next: string): void;
export declare function destroyMode(): void;

export type { Mode, ModeConfig, ModeState, ResolvedMode };
