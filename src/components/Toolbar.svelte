<script lang="ts">
	import { addMarker } from '../stores/TimelineStore';
	import FaArrowsLeftRight from './Icons/FaArrowsLeftRight.svelte';
	import FaMagnifyingGlassMinus from './Icons/FaMagnifyingGlassMinus.svelte';
	import FaMagnifyingGlassPlus from './Icons/FaMagnifyingGlassPlus.svelte';
	import FaPlus from './Icons/FaPlus.svelte';
	export let currentTime: number;
	export let markerTimesEnabled: boolean;
	export let onMarkerTimesEnabledChange: (enabled: boolean) => void;
	export let onZoomExponentChange: (zoomExponent: number) => void;
	export let onScrollToPlayhead: () => void;

	let zoomExponent = 2;

	$: onZoomExponentChange(zoomExponent);
</script>

<fieldset class="toolbar">
	<div class="toolbar__content">
		<legend class="sr-only">Toolbar</legend>

		<div role="group" class="zoom-bar" title="Zoom">
			<button
				type="button"
				class="icon-button"
				aria-label="Zoom out"
				on:click={() => (zoomExponent -= 0.1)}
			>
				<FaMagnifyingGlassMinus />
			</button>
			<input
				type="range"
				min={0.1}
				step={0.1}
				max={4}
				aria-label="Zoom"
				bind:value={zoomExponent}
			/>
			<button
				type="button"
				class="icon-button"
				aria-label="Zoom in"
				on:click={() => (zoomExponent += 0.1)}
			>
				<FaMagnifyingGlassPlus />
			</button>
		</div>

		<button
			type="button"
			class="button"
			on:click={() => {
				const name = window.prompt('Event Name')?.trim();
				if (name) addMarker(name, currentTime);
			}}
		>
			<FaPlus />
			Add Marker</button
		>

		<button type="button" class="button" on:click={onScrollToPlayhead}>
			<FaArrowsLeftRight />
			Scroll to Playhead
		</button>

		<label>
			Marker Times
			<input
				type="checkbox"
				class="switch"
				checked={markerTimesEnabled}
				title={markerTimesEnabled ? 'Show' : 'Hide'}
				on:change={(e) => onMarkerTimesEnabledChange(e.currentTarget.checked)}
			/>
		</label>
	</div>
</fieldset>

<style>
	.toolbar__content {
		background-color: var(--color-dark);
		padding: 1rem;

		display: flex;
		justify-content: space-around;
		align-items: center;
	}

	label {
		display: flex;
		gap: 0.5rem;
		align-items: center;
	}
	.zoom-bar {
		display: flex;
		align-items: center;
	}
</style>
