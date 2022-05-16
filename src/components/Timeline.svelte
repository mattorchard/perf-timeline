<script lang="ts">
	import {
		markers,
		deltas,
		addMarker,
		addMarkerDelta,
		deleteMarker,
		editMarker,
		deleteDelta,
		type ActionMarker
	} from '../stores/TimelineStore';

	import { formatTime } from '../helpers/timeHelpers';
	import EventMarker from './EventMarker.svelte';
	import MarkerDeltaBounds from './MarkerDeltaBounds.svelte';

	export let duration: number;
	export let currentTime: number;
	export let onSeek: (time: number) => void;

	let zoomExponent = 2;
	$: zoom = 10 ** zoomExponent;

	let scrollX = 0;
	let pointerClientX = 0;

	$: pointerTime = (scrollX + pointerClientX) / zoom;

	let depressedMarker: ActionMarker | null = null;
	let depressedMarkerIndex: number | null;

	const getDeltaIndicator = (markerTime: number, pointerTime: number) => {
		const start = Math.min(pointerTime, markerTime);
		const end = Math.max(pointerTime, markerTime);
		return { start, end, duration: end - start };
	};

	$: deltaIndicator = depressedMarker && getDeltaIndicator(depressedMarker.time, pointerTime);

	const getBarSpacing = (zoom: number, desiredPixelSpacing = 150) => {
		const possibleSpacings = [0.1, 0.25, 0.5, 1, 5, 10, 15, 30, 60, 120, 300];
		let bestSpacing = possibleSpacings[0];

		possibleSpacings.forEach((spacing) => {
			const bestDelta = Math.abs(bestSpacing * zoom - desiredPixelSpacing);
			const currentDelta = Math.abs(spacing * zoom - desiredPixelSpacing);
			if (currentDelta < bestDelta) {
				bestSpacing = spacing;
			}
		});
		return bestSpacing;
	};

	$: barSpacing = getBarSpacing(zoom);
</script>

<div class="timeline" style="--zoom:{zoom}; --duration:{duration}; --bar-spacing:{barSpacing}">
	<dl class="toolbar">
		<dt>Zoom</dt>
		<dd>
			<input type="range" min={0.1} step={0.1} max={4} bind:value={zoomExponent} />
		</dd>
		<dt>Actions</dt>
		<dd>
			<button
				type="button"
				class="button"
				on:click={() => {
					const name = window.prompt('Event Name');
					if (name) addMarker(name, currentTime);
				}}>Add Event</button
			>
		</dd>
		<dt>Time at Cursor</dt>
		<dd>{formatTime(pointerTime)}</dd>
	</dl>
	<div
		class="ticker-scroll"
		style="--pointer-time: {pointerTime}"
		on:scroll={(e) => (scrollX = e.currentTarget.scrollLeft)}
		on:pointermove={(e) => (pointerClientX = e.clientX)}
		on:pointerup={() => onSeek(pointerTime)}
	>
		<div class="ticker-tape" style="--marker-count: {$markers.length}">
			<div class="playhead" style="--time: {currentTime}" />

			{#each $markers as marker, index}
				<div class="event-marker-container" style="--time:{marker.time}; --index: {index}">
					<EventMarker
						name={marker.name}
						time={marker.time}
						on:click={() => onSeek(marker.time)}
						on:dblclick={() => {
							const name = window.prompt('New name');
							if (name) editMarker({ id: marker.id, name });
						}}
						on:move={(event) => {
							const { direction } = event.detail;
							const polarity = direction === 'later' ? 1 : -1;
							const delta = (polarity * 10) / zoom;
							const newTime = marker.time + delta;
							editMarker({ id: marker.id, time: newTime });
							onSeek(newTime);
						}}
						on:delete={() => deleteMarker(marker.id)}
						on:pointerdown={() => {
							depressedMarker = marker;
							depressedMarkerIndex = index;
						}}
						on:pointerup={() => {
							if (depressedMarker === null) return;
							if (marker.id === depressedMarker.id) return;
							addMarkerDelta(depressedMarker.id, marker.id);
						}}
					/>
				</div>
			{/each}

			{#each $deltas as { id, source, target, sourceIndex, targetIndex }}
				<MarkerDeltaBounds
					{sourceIndex}
					{targetIndex}
					sourceTime={source.time}
					targetTime={target.time}
					on:delete={() => deleteDelta(id)}
				/>
			{/each}

			{#if deltaIndicator}
				<div
					class="marker-delta-indicator"
					style="
						--start: {deltaIndicator.start};
						--duration: {deltaIndicator.duration};
						--index: {depressedMarkerIndex}
					"
				/>
			{/if}

			<div class="end-indicator">End</div>
		</div>
	</div>
</div>

<svelte:window
	on:pointerup={() => {
		depressedMarker = null;
		depressedMarkerIndex = null;
	}}
/>

<style>
	.timeline {
		display: flex;
		flex-direction: column;
	}
	.toolbar {
		background-color: var(--color-dark);
		display: grid;
		grid-auto-flow: column;
		grid-template:
			'zoomLabel actionsLabel infoLabel'
			'zoom actions info';
		padding: 0.5rem;
		align-items: center;
	}
	.ticker-scroll {
		overflow-x: scroll;
		max-width: 100%;
	}
	.ticker-tape * {
		user-select: none;
	}
	.ticker-tape {
		position: relative;
		width: calc(1px * var(--zoom) * var(--duration));
		height: calc(var(--marker-count) * 2.5rem + 1rem);
		min-height: 7rem;
		transition: height 0.2s ease-in-out;
	}
	.playhead {
		position: absolute;
		top: 0;
		bottom: 0;
		left: calc(1px * var(--zoom) * var(--time));
		width: 0.25rem;
		background-color: var(--color-highlight);
	}
	.ticker-tape:active .playhead {
		left: calc(1px * var(--zoom) * var(--pointer-time));
	}
	.end-indicator {
		position: absolute;
		left: calc(1px * var(--zoom) * var(--duration));
		writing-mode: vertical-lr;
		top: 0;
		bottom: 0;
		background-color: var(--color-light);
		padding: 0.5rem;
		text-align: center;
		transform: rotate(0.5turn);
	}
	.ticker-tape {
		--bar-width: 0.25rem;
		--bar-pattern-width: calc(1px * var(--zoom) * var(--bar-spacing));
		--bar-color: var(--lighten);
		background-image: repeating-linear-gradient(
			to right,
			transparent 0,
			transparent calc(var(--bar-pattern-width) - var(--bar-width)),
			var(--bar-color) calc(var(--bar-pattern-width) - var(--bar-width)),
			var(--bar-color) var(--bar-pattern-width)
		);
	}
	.event-marker-container {
		position: absolute;
		top: calc(0.5rem + 2.5rem * var(--index));
		left: calc(1px * var(--zoom) * var(--time));
	}
	.marker-delta-indicator {
		pointer-events: none;
		position: absolute;
		top: 0;
		left: calc(1px * var(--zoom) * var(--start));
		width: calc(1px * var(--zoom) * var(--duration));
		border: 0.125rem dashed var(--color-highlight);
		top: calc(1.5rem + 2.5rem * var(--index));
	}
</style>
