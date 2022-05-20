<script lang="ts">
	import { addMarker } from '../stores/TimelineStore';
	import FaArrowsLeftRight from './Icons/FaArrowsLeftRight.svelte';
	import FaMagnifyingGlassMinus from './Icons/FaMagnifyingGlassMinus.svelte';
	import FaMagnifyingGlassPlus from './Icons/FaMagnifyingGlassPlus.svelte';
	import FaPause from './Icons/FaPause.svelte';
	import FaPlay from './Icons/FaPlay.svelte';
	import FaPlus from './Icons/FaPlus.svelte';

	export let currentTime: number;
	export let markerTimesEnabled: boolean;
	export let paused: boolean;
	export let onMarkerTimesEnabledChange: (enabled: boolean) => void;
	export let onZoomExponentChange: (zoomExponent: number) => void;
	export let onScrollToPlayhead: () => void;
	export let onPausedChanged: (paused: boolean) => void;

	let zoomExponent = 2;

	$: onZoomExponentChange(zoomExponent);
</script>

<fieldset class="toolbar">
	<div class="toolbar__content">
		<legend class="sr-only">Toolbar</legend>

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

		<button
			type="button"
			class="play-button button"
			title={paused ? 'Play' : 'Pause'}
			on:click={() => onPausedChanged(!paused)}
		>
			{#if paused}
				<FaPlay />
			{:else}
				<FaPause />
			{/if}
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
		gap: 0.25rem;
	}
	.play-button {
		font-size: 2rem;
		border-radius: var(--pill);
		width: 3.25rem;
	}
</style>
