<script lang="ts">
	import {
		applyOverrides,
		currentTheme,
		loadOverrides,
		persistOverrides,
		removeAllOverrides,
		setTheme,
		type Theme,
		type Overrides
	} from '../src/lib/styler-preview';

	type View = 'overview' | 'tokens' | 'library' | 'docs';
	type LibraryTab = 'components' | 'primitives' | 'compositions';
	type TokenKind = 'color' | 'type' | 'space' | 'shape';

	type Token = {
		name: string;
		label: string;
		group: string;
		kind: TokenKind;
		source: string;
		usage: string;
	};

	type LibraryItem = {
		name: string;
		kind: string;
		description: string;
		contract: string;
		status: 'Stable' | 'Draft' | 'Review';
	};

	type QueueItem = {
		id: string;
		title: string;
		file: string;
		owner: string;
		status: 'Needs review' | 'In progress' | 'Ready';
		priority: 'High' | 'Medium' | 'Low';
	};

	const navItems: { id: View; label: string; short: string; count?: string }[] = [
		{ id: 'overview', label: 'Overview', short: 'OV' },
		{ id: 'tokens', label: 'Tokens', short: 'TK', count: '42' },
		{ id: 'library', label: 'Library', short: 'LB', count: '18' },
		{ id: 'docs', label: 'Docs queue', short: 'DQ', count: '06' }
	];

	const tokenGroups = [
		{ id: 'all', label: 'All tokens' },
		{ id: 'color', label: 'Color' },
		{ id: 'type', label: 'Type' },
		{ id: 'space', label: 'Space' },
		{ id: 'shape', label: 'Shape' }
	];

	const tokens: Token[] = [
		{
			name: '--bg',
			label: 'Canvas',
			group: 'color',
			kind: 'color',
			source: '_tokens.sass',
			usage: 'App canvas and page backgrounds'
		},
		{
			name: '--bg-surface',
			label: 'Surface',
			group: 'color',
			kind: 'color',
			source: '_tokens.sass',
			usage: 'Cards, wells and soft controls'
		},
		{
			name: '--bg-raised',
			label: 'Raised',
			group: 'color',
			kind: 'color',
			source: '_tokens.sass',
			usage: 'Inputs, buttons and elevated rows'
		},
		{
			name: '--text-primary',
			label: 'Primary text',
			group: 'color',
			kind: 'color',
			source: '_tokens.sass',
			usage: 'Headings and important copy'
		},
		{
			name: '--text-secondary',
			label: 'Secondary text',
			group: 'color',
			kind: 'color',
			source: '_tokens.sass',
			usage: 'Descriptions and supporting copy'
		},
		{
			name: '--theme',
			label: 'Theme',
			group: 'color',
			kind: 'color',
			source: '_tokens.sass',
			usage: 'Primary actions and active state'
		},
		{
			name: '--text-xs',
			label: 'Text xs',
			group: 'type',
			kind: 'type',
			source: '_tokens.sass',
			usage: 'Metadata and compact labels'
		},
		{
			name: '--text-md',
			label: 'Text md',
			group: 'type',
			kind: 'type',
			source: '_tokens.sass',
			usage: 'Base UI copy'
		},
		{
			name: '--text-lg',
			label: 'Text lg',
			group: 'type',
			kind: 'type',
			source: '_tokens.sass',
			usage: 'Section titles and card headings'
		},
		{
			name: '--text-2xl',
			label: 'Text 2xl',
			group: 'type',
			kind: 'type',
			source: '_tokens.sass',
			usage: 'Page titles and feature moments'
		},
		{
			name: '--space-2',
			label: 'Space 2',
			group: 'space',
			kind: 'space',
			source: '_tokens.sass',
			usage: 'Tight inline rhythm'
		},
		{
			name: '--space-4',
			label: 'Space 4',
			group: 'space',
			kind: 'space',
			source: '_tokens.sass',
			usage: 'Default component rhythm'
		},
		{
			name: '--space-8',
			label: 'Space 8',
			group: 'space',
			kind: 'space',
			source: '_tokens.sass',
			usage: 'Section and shell rhythm'
		},
		{
			name: '--space-16',
			label: 'Space 16',
			group: 'space',
			kind: 'space',
			source: '_tokens.sass',
			usage: 'Major page separation'
		},
		{
			name: '--radius-4',
			label: 'Radius 4',
			group: 'shape',
			kind: 'shape',
			source: '_tokens.sass',
			usage: 'Small controls and tags'
		},
		{
			name: '--radius-8',
			label: 'Radius 8',
			group: 'shape',
			kind: 'shape',
			source: '_tokens.sass',
			usage: 'Panels and cards'
		},
		{
			name: '--radius-16',
			label: 'Radius 16',
			group: 'shape',
			kind: 'shape',
			source: '_tokens.sass',
			usage: 'Feature surfaces'
		},
		{
			name: '--shadow-md',
			label: 'Shadow md',
			group: 'shape',
			kind: 'shape',
			source: '_tokens.sass',
			usage: 'Raised surfaces and overlays'
		}
	];

	const libraryItems: Record<LibraryTab, LibraryItem[]> = {
		components: [
			{
				name: 'button',
				kind: 'Block',
				description: 'Action control with token-driven primary and quiet states.',
				contract: "data-variant='primary|quiet'",
				status: 'Stable'
			},
			{
				name: 'card',
				kind: 'Block',
				description: 'A lightweight content surface for grouped information.',
				contract: 'card + stack + border',
				status: 'Stable'
			},
			{
				name: 'input',
				kind: 'Block',
				description: 'Form control with a clear focus ring and readable density.',
				contract: 'control',
				status: 'Stable'
			},
			{
				name: 'badge',
				kind: 'Block',
				description: 'Compact status label for state and classification.',
				contract: "data-tone='success|warning'",
				status: 'Review'
			},
			{
				name: 'divider',
				kind: 'Block',
				description: 'A structural rule that stays quiet in the visual hierarchy.',
				contract: 'divider',
				status: 'Stable'
			},
			{
				name: 'kbd',
				kind: 'Block',
				description: 'Keyboard shortcut affordance for command surfaces.',
				contract: 'kbd',
				status: 'Draft'
			}
		],
		primitives: [
			{
				name: 'box',
				kind: 'Primitive',
				description: 'Vertical flex container with alignment utilities.',
				contract: 'box xleft ytop',
				status: 'Stable'
			},
			{
				name: 'row',
				kind: 'Primitive',
				description: 'Horizontal flex container for controls and inline groups.',
				contract: 'row ycenter xbetween',
				status: 'Stable'
			},
			{
				name: 'grid',
				kind: 'Primitive',
				description: 'Finite column grid for responsive layouts.',
				contract: 'grid grid-cols-3',
				status: 'Stable'
			},
			{
				name: 'with-sidebar',
				kind: 'Composition',
				description: 'Intrinsic rail and fluid flow arrangement.',
				contract: 'with-sidebar > rail + flow',
				status: 'Stable'
			},
			{
				name: 'reel',
				kind: 'Composition',
				description: 'Horizontal overflow row with scroll snap.',
				contract: 'reel',
				status: 'Stable'
			}
		],
		compositions: [
			{
				name: 'appshell',
				kind: 'Composition',
				description: 'Canonical header, body, rail and footer skeleton.',
				contract: 'appshell > appheader + appbody',
				status: 'Stable'
			},
			{
				name: 'stack',
				kind: 'Composition',
				description: 'Vertical rhythm governed by a single gap token.',
				contract: 'stack + --stack-gap',
				status: 'Stable'
			},
			{
				name: 'cluster',
				kind: 'Composition',
				description: 'Wrapping row for actions, tags and metadata.',
				contract: 'cluster + --cluster-gap',
				status: 'Stable'
			},
			{
				name: 'bodymain',
				kind: 'Composition',
				description: 'Readable center column with a comfortable measure.',
				contract: 'bodymain',
				status: 'Review'
			}
		]
	};

	let docsQueue: QueueItem[] = $state([
		{
			id: 'cube',
			title: 'Clarify CUBE exception examples',
			file: '02-principles.md',
			owner: 'AM',
			status: 'Needs review',
			priority: 'High'
		},
		{
			id: 'tokens',
			title: 'Document new shape scale guidance',
			file: '03-tokens.md',
			owner: 'SK',
			status: 'In progress',
			priority: 'Medium'
		},
		{
			id: 'utilities',
			title: 'Add breakpoint suffix examples',
			file: '04-utilities.md',
			owner: 'AM',
			status: 'Ready',
			priority: 'Low'
		},
		{
			id: 'components',
			title: 'Add block library usage notes',
			file: '06-globals-others.md',
			owner: 'JR',
			status: 'Needs review',
			priority: 'Medium'
		}
	]);

	let activeView: View = $state('overview');
	let activeTokenGroup = $state('all');
	let activeLibraryTab: LibraryTab = $state('components');
	let searchQuery = $state('');
	let tokenSearch = $state('');
	let theme: Theme = $state(currentTheme());
	let overrides: Overrides = $state(loadOverrides());
	let hasDraftChanges = $state(false);
	let draggedQueueId: string | null = $state(null);
	let toastMessage = $state('');

	const viewHeading: Record<View, { eyebrow: string; title: string; description: string }> = {
		overview: {
			eyebrow: 'Workspace / Overview',
			title: 'Design system control room',
			description: 'Keep the source of truth healthy, visible and ready for the next release.'
		},
		tokens: {
			eyebrow: 'Workspace / Tokens',
			title: 'Token source of truth',
			description:
				'Tune the finite vocabulary that every primitive, block and composition consumes.'
		},
		library: {
			eyebrow: 'Workspace / Library',
			title: 'Component & primitive library',
			description: 'Audit the CUBE layers and keep public contracts discoverable.'
		},
		docs: {
			eyebrow: 'Workspace / Docs queue',
			title: 'Documentation maintenance',
			description: 'Move the guide forward with a small, visible queue of editorial work.'
		}
	};

	function selectView(view: View): void {
		activeView = view;
		searchQuery = '';
	}

	function readToken(name: string): string {
		if (typeof document === 'undefined') return '—';
		return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || '—';
	}

	function tokenValue(token: Token): string {
		return overrides[token.name] ?? readToken(token.name);
	}

	function updateToken(token: Token, value: string): void {
		overrides = { ...overrides, [token.name]: value };
		applyOverrides(overrides);
		hasDraftChanges = true;
	}

	function saveDraft(): void {
		persistOverrides(overrides);
		hasDraftChanges = false;
		showToast('Local token draft saved');
	}

	function resetDraft(): void {
		removeAllOverrides();
		overrides = {};
		persistOverrides(overrides);
		hasDraftChanges = false;
		showToast('Token draft reset to source values');
	}

	function toggleTheme(): void {
		theme = theme === 'light' ? 'dark' : 'light';
		setTheme(theme);
	}

	function showToast(message: string): void {
		toastMessage = message;
		window.setTimeout(() => (toastMessage = ''), 2600);
	}

	function copySass(token: Token): void {
		const value = tokenValue(token);
		const snippet = `${token.name}: ${value}`;
		if (navigator.clipboard) navigator.clipboard.writeText(snippet);
		showToast(`Copied ${token.name}`);
	}

	function filteredTokens(): Token[] {
		return tokens.filter((token) => {
			const matchesGroup = activeTokenGroup === 'all' || token.group === activeTokenGroup;
			const haystack = `${token.name} ${token.label} ${token.usage}`.toLowerCase();
			return matchesGroup && haystack.includes(tokenSearch.toLowerCase());
		});
	}

	function filteredLibrary(): LibraryItem[] {
		const query = searchQuery.toLowerCase();
		return libraryItems[activeLibraryTab].filter((item) =>
			`${item.name} ${item.description} ${item.contract}`.toLowerCase().includes(query)
		);
	}

	function startDrag(event: DragEvent, id: string): void {
		draggedQueueId = id;
		event.dataTransfer?.setData('text/plain', id);
		if (event.dataTransfer) event.dataTransfer.effectAllowed = 'move';
	}

	function dropQueueItem(event: DragEvent, targetId: string): void {
		event.preventDefault();
		const sourceId = draggedQueueId || event.dataTransfer?.getData('text/plain');
		if (!sourceId || sourceId === targetId) return;
		const sourceIndex = docsQueue.findIndex((item) => item.id === sourceId);
		const targetIndex = docsQueue.findIndex((item) => item.id === targetId);
		if (sourceIndex < 0 || targetIndex < 0) return;
		const next = [...docsQueue];
		const [moved] = next.splice(sourceIndex, 1);
		next.splice(targetIndex, 0, moved);
		docsQueue = next;
		draggedQueueId = null;
		showToast('Docs queue reordered');
	}

	function statusTone(status: string): string {
		return status.toLowerCase().replaceAll(' ', '-');
	}
</script>

<svelte:head>
	<title>fractals-styler · control room</title>
	<meta
		name="description"
		content="Local admin workspace for the fractals-styler design system."
	/>
</svelte:head>

<div class="admin-shell" data-theme={theme}>
	<aside class="admin-sidebar">
		<div class="brand-lockup">
			<div class="brand-mark" aria-hidden="true"><span></span><span></span><span></span></div>
			<div>
				<strong>fractals-styler</strong>
				<span>control room</span>
			</div>
		</div>

		<div class="workspace-switcher">
			<span class="workspace-dot"></span>
			<div>
				<strong>Local workspace</strong>
				<span>main · v2.2.1</span>
			</div>
			<span class="chevron">⌄</span>
		</div>

		<nav aria-label="Main navigation">
			<p class="nav-label">Workspace</p>
			{#each navItems as item}
				<button
					class="nav-item"
					data-active={activeView === item.id}
					type="button"
					onclick={() => selectView(item.id)}
				>
					<span class="nav-icon">{item.short}</span>
					<span>{item.label}</span>
					{#if item.count}<span class="nav-count">{item.count}</span>{/if}
				</button>
			{/each}
		</nav>

		<div class="sidebar-spacer"></div>
		<div class="sidebar-note">
			<span class="note-kicker">Source contract</span>
			<p>
				Tokens live in <code>templates/_tokens.sass</code>. Everything else consumes them.
			</p>
			<button type="button" class="text-action" onclick={() => selectView('tokens')}
				>Inspect source <span>↗</span></button
			>
		</div>
		<div class="sidebar-footer">
			<span class="live-dot"></span> Local only <span class="footer-divider"></span> No sync enabled
		</div>
	</aside>

	<main class="admin-main">
		<header class="topbar">
			<div class="breadcrumb">
				<span>FR /</span>
				{viewHeading[activeView].eyebrow.split(' / ')[1]}
			</div>
			<div class="topbar-actions">
				<label class="search-box">
					<span aria-hidden="true">⌕</span>
					<input
						type="search"
						bind:value={searchQuery}
						placeholder="Search workspace"
						aria-label="Search workspace"
					/>
					<kbd>⌘ K</kbd>
				</label>
				<button
					type="button"
					class="icon-button"
					aria-label="Toggle theme"
					onclick={toggleTheme}>{theme === 'light' ? '☾' : '☀'}</button
				>
				<button
					type="button"
					class="button button-primary"
					data-variant="primary"
					onclick={saveDraft}
					disabled={!hasDraftChanges}>Save changes <span>↗</span></button
				>
			</div>
		</header>

		<div class="page-wrap">
			<section class="page-heading">
				<div>
					<p class="eyebrow">{viewHeading[activeView].eyebrow}</p>
					<h1>{viewHeading[activeView].title}</h1>
					<p class="page-description">{viewHeading[activeView].description}</p>
				</div>
				{#if activeView === 'overview'}
					<div class="release-chip">
						<span class="live-dot"></span><span><strong>v2.2.1</strong> · healthy</span>
					</div>
				{:else if activeView === 'tokens'}
					<button
						class="button"
						type="button"
						onclick={resetDraft}
						disabled={Object.keys(overrides).length === 0}>Reset draft</button
					>
				{:else if activeView === 'docs'}
					<button
						class="button button-primary"
						data-variant="primary"
						type="button"
						onclick={() => showToast('New doc task queued')}>+ New task</button
					>
				{/if}
			</section>

			{#if activeView === 'overview'}
				<section class="metric-grid" aria-label="Workspace metrics">
					<div class="metric-card">
						<span class="metric-label">Tokens audited</span><strong
							>42 <small>/ 42</small></strong
						><span class="metric-foot positive">↑ 100% coverage</span>
					</div>
					<div class="metric-card">
						<span class="metric-label">Library entries</span><strong
							>18 <small>public</small></strong
						><span class="metric-foot">6 blocks · 7 primitives · 5 compositions</span>
					</div>
					<div class="metric-card">
						<span class="metric-label">Docs health</span><strong
							>93<small>%</small></strong
						><span class="metric-foot positive">↑ 4% since last review</span>
					</div>
					<div class="metric-card">
						<span class="metric-label">Open queue</span><strong
							>06 <small>tasks</small></strong
						><span class="metric-foot warning">2 need your attention</span>
					</div>
				</section>

				<section class="overview-grid">
					<div class="panel activity-panel">
						<div class="panel-heading">
							<div>
								<p class="section-kicker">Live pulse</p>
								<h2>System health</h2>
							</div>
							<button
								class="text-action"
								type="button"
								onclick={() => selectView('tokens')}
								>View tokens <span>→</span></button
							>
						</div>
						<div class="health-row">
							<div class="health-score">93<span>%</span></div>
							<div>
								<strong>Ready for release</strong>
								<p>
									Every public utility resolves to a known token. Two docs need a
									final pass.
								</p>
							</div>
						</div>
						<div class="health-track"><span></span></div>
						<div class="health-legend">
							<span
								><i class="legend-dot green"></i> Resolved <strong>42</strong></span
							><span><i class="legend-dot amber"></i> Review <strong>2</strong></span
							><span><i class="legend-dot gray"></i> Draft <strong>1</strong></span>
						</div>
						<div class="mini-bars" aria-label="Weekly system health">
							<span style="height: 42%"></span><span style="height: 58%"></span><span
								style="height: 52%"
							></span><span style="height: 68%"></span><span style="height: 64%"
							></span><span style="height: 80%"></span><span style="height: 92%"
							></span>
						</div>
						<div class="chart-labels">
							<span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span
								>Fri</span
							><span>Sat</span><span>Today</span>
						</div>
					</div>
					<div class="panel activity-panel">
						<div class="panel-heading">
							<div>
								<p class="section-kicker">Recent activity</p>
								<h2>What changed</h2>
							</div>
							<button
								class="text-action"
								type="button"
								onclick={() => selectView('docs')}>Open queue <span>→</span></button
							>
						</div>
						<div class="timeline">
							<div class="timeline-item">
								<span class="timeline-marker green"></span>
								<div>
									<strong>Token scale reviewed</strong>
									<p><code>_tokens.sass</code> · 12 min ago</p>
								</div>
								<span class="avatar">AM</span>
							</div>
							<div class="timeline-item">
								<span class="timeline-marker blue"></span>
								<div>
									<strong>Composition contract updated</strong>
									<p><code>05-compositions.md</code> · 48 min ago</p>
								</div>
								<span class="avatar avatar-purple">SK</span>
							</div>
							<div class="timeline-item">
								<span class="timeline-marker amber"></span>
								<div>
									<strong>New review task opened</strong>
									<p>Clarify CUBE exceptions · 2h ago</p>
								</div>
								<span class="avatar avatar-orange">JR</span>
							</div>
							<div class="timeline-item">
								<span class="timeline-marker gray"></span>
								<div>
									<strong>Preview build passed</strong>
									<p><code>vite build</code> · yesterday</p>
								</div>
								<span class="avatar">CI</span>
							</div>
						</div>
					</div>
				</section>

				<section class="section-block">
					<div class="section-header">
						<div>
							<p class="section-kicker">CUBE system</p>
							<h2>Design system layers</h2>
						</div>
						<button
							class="text-action"
							type="button"
							onclick={() => selectView('library')}
							>Manage library <span>→</span></button
						>
					</div>
					<div class="layer-grid">
						<button
							class="layer-card"
							type="button"
							onclick={() => {
								activeLibraryTab = 'compositions';
								selectView('library');
							}}
							><span class="layer-number">01</span><span class="layer-icon">⌁</span
							><strong>Composition</strong>
							<p>Macro arrangement only. Rails, gaps, max-widths and skeletons.</p>
							<span class="layer-link">5 entries <span>↗</span></span></button
						>
						<button
							class="layer-card"
							type="button"
							onclick={() => {
								activeLibraryTab = 'primitives';
								selectView('library');
							}}
							><span class="layer-number">02</span><span class="layer-icon">◫</span
							><strong>Utility & primitive</strong>
							<p>Finite, token-driven classes for layout and alignment.</p>
							<span class="layer-link">7 entries <span>↗</span></span></button
						>
						<button
							class="layer-card"
							type="button"
							onclick={() => {
								activeLibraryTab = 'components';
								selectView('library');
							}}
							><span class="layer-number">03</span><span class="layer-icon">▣</span
							><strong>Block library</strong>
							<p>Genuine components that consume the system vocabulary.</p>
							<span class="layer-link">6 entries <span>↗</span></span></button
						>
					</div>
				</section>
			{:else if activeView === 'tokens'}
				<section class="token-workspace">
					<div class="token-toolbar">
						<div class="segmented-control" aria-label="Token category">
							{#each tokenGroups as group}
								<button
									type="button"
									data-active={activeTokenGroup === group.id}
									onclick={() => (activeTokenGroup = group.id)}
									>{group.label}</button
								>
							{/each}
						</div>
						<label class="search-box token-search"
							><span>⌕</span><input
								type="search"
								bind:value={tokenSearch}
								placeholder="Filter tokens"
								aria-label="Filter tokens"
							/></label
						>
					</div>
					<div class="source-banner">
						<span class="source-icon">⌘</span>
						<div>
							<strong>Canonical source</strong>
							<p>
								Every value here maps directly to <code>templates/_tokens.sass</code
								>. Changes are local browser overrides until you copy them back into
								the source file.
							</p>
						</div>
						<span class="source-status"><span class="live-dot"></span> synced</span>
					</div>
					<div class="token-grid">
						{#each filteredTokens() as token}
							<div class="token-card">
								<div class="token-card-head">
									<div>
										<span class="token-kind">{token.kind}</span>
										<h3>{token.label}</h3>
									</div>
									<button
										type="button"
										class="copy-button"
										aria-label={`Copy ${token.name}`}
										onclick={() => copySass(token)}>⧉</button
									>
								</div>
								<div class="token-control" data-kind={token.kind}>
									<span
										class="token-preview"
										style={`--token-preview: ${tokenValue(token)}`}
									></span><input
										aria-label={`${token.label} value`}
										value={tokenValue(token)}
										oninput={(event) =>
											updateToken(token, event.currentTarget.value)}
									/><span class="token-unit"
										>{token.kind === 'color'
											? 'HEX'
											: token.kind === 'type'
												? 'SIZE'
												: token.kind === 'space'
													? 'SPACE'
													: 'VALUE'}</span
									>
								</div>
								<p>{token.usage}</p>
								<div class="token-card-foot">
									<code>{token.name}</code><span>{token.source}</span>
								</div>
							</div>
						{:else}
							<div class="empty-state">
								<strong>No tokens found</strong>
								<p>Try a different category or search term.</p>
							</div>
						{/each}
					</div>
				</section>
			{:else if activeView === 'library'}
				<section class="library-workspace">
					<div class="library-tabs">
						<div class="segmented-control" aria-label="Library layer">
							<button
								type="button"
								data-active={activeLibraryTab === 'components'}
								onclick={() => (activeLibraryTab = 'components')}
								>Components <span>06</span></button
							><button
								type="button"
								data-active={activeLibraryTab === 'primitives'}
								onclick={() => (activeLibraryTab = 'primitives')}
								>Primitives <span>05</span></button
							><button
								type="button"
								data-active={activeLibraryTab === 'compositions'}
								onclick={() => (activeLibraryTab = 'compositions')}
								>Compositions <span>04</span></button
							>
						</div>
						<span class="library-source">Source: <code>templates/</code></span>
					</div>
					<div class="library-table" role="table" aria-label="Design system library">
						<div class="library-row library-row-head" role="row">
							<span>Entry</span><span>Contract</span><span>Status</span><span> </span>
						</div>
						{#each filteredLibrary() as item}
							<div class="library-row" role="row">
								<div class="library-entry">
									<span class="entry-glyph"
										>{item.kind === 'Block'
											? '▣'
											: item.kind === 'Primitive'
												? '◫'
												: '⌁'}</span
									>
									<div>
										<strong>{item.name}</strong>
										<p>{item.description}</p>
									</div>
								</div>
								<code class="contract-code">{item.contract}</code><span
									class="status-pill"
									data-status={statusTone(item.status)}><i></i>{item.status}</span
								><button
									type="button"
									class="row-action"
									aria-label={`Inspect ${item.name}`}
									onclick={() => showToast(`Inspecting ${item.name}`)}>→</button
								>
							</div>
						{:else}<div class="empty-state">
								<strong>No library entries found</strong>
								<p>Try a different search term.</p>
							</div>{/each}
					</div>
					<div class="library-note">
						<span>◎</span>
						<div>
							<strong>Contract check</strong>
							<p>
								Variants use <code>data-*</code> and <code>aria-*</code> attributes. No
								BEM modifier chains detected in the public layer.
							</p>
						</div>
						<span class="check-label">PASS</span>
					</div>
				</section>
			{:else if activeView === 'docs'}
				<section class="docs-workspace">
					<div class="docs-summary">
						<div class="docs-summary-card">
							<span class="summary-icon green">✓</span>
							<div><strong>12</strong><span>guides current</span></div>
						</div>
						<div class="docs-summary-card">
							<span class="summary-icon amber">!</span>
							<div><strong>04</strong><span>needs review</span></div>
						</div>
						<div class="docs-summary-card">
							<span class="summary-icon blue">↗</span>
							<div><strong>08</strong><span>public examples</span></div>
						</div>
					</div>
					<div class="docs-panel panel">
						<div class="panel-heading">
							<div>
								<p class="section-kicker">Editorial flow</p>
								<h2>Open documentation queue</h2>
							</div>
							<span class="drag-hint">⋮⋮ Drag to prioritize</span>
						</div>
						<div class="queue-list">
							{#each docsQueue as item, index}<div
									class="queue-item"
									role="listitem"
									draggable="true"
									data-dragging={draggedQueueId === item.id}
									ondragstart={(event) => startDrag(event, item.id)}
									ondragover={(event) => event.preventDefault()}
									ondrop={(event) => dropQueueItem(event, item.id)}
								>
									<span class="drag-handle" aria-hidden="true">⠿</span><span
										class="queue-index">0{index + 1}</span
									>
									<div class="queue-title">
										<strong>{item.title}</strong><span
											><code>{item.file}</code> · {item.owner}</span
										>
									</div>
									<span
										class="priority"
										data-priority={item.priority.toLowerCase()}
										>{item.priority}</span
									><span class="status-pill" data-status={statusTone(item.status)}
										><i></i>{item.status}</span
									><button
										class="row-action"
										type="button"
										aria-label={`Open ${item.file}`}
										onclick={() => showToast(`Opening ${item.file}`)}>↗</button
									>
								</div>{/each}
						</div>
					</div>
					<div class="docs-bottom-grid">
						<div class="panel guide-map">
							<div class="panel-heading">
								<div>
									<p class="section-kicker">Guide map</p>
									<h2>Source files</h2>
								</div>
								<span class="file-count">08 files</span>
							</div>
							{#each ['01-setup.md', '02-principles.md', '03-tokens.md', '04-utilities.md', '05-compositions.md', '06-globals-others.md'] as guide, index}<div
									class="guide-row"
								>
									<span class="guide-number">0{index + 1}</span><code
										>{guide}</code
									><span class="guide-bar"
										><i
											style={`width: ${index === 2 ? '100%' : index === 4 ? '88%' : '72%'}`}
										></i></span
									><span
										>{index === 2 ? '100%' : index === 4 ? '88%' : '72%'}</span
									>
								</div>{/each}
						</div>
						<div class="panel docs-callout">
							<span class="callout-mark">✦</span>
							<p class="section-kicker">Maintenance ritual</p>
							<h2>Keep the docs close to the source.</h2>
							<p>
								When a token or public class changes, update its guide example in
								the same pass. The queue is your lightweight release checklist.
							</p>
							<button
								type="button"
								class="button"
								onclick={() => showToast('Maintenance checklist copied')}
								>Copy checklist <span>⧉</span></button
							>
						</div>
					</div>
				</section>
			{/if}
		</div>
	</main>

	{#if toastMessage}<div class="toast" role="status">
			<span class="toast-check">✓</span>{toastMessage}
		</div>{/if}
</div>
