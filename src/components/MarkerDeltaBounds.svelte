<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { formatTime } from '../helpers/timeHelpers';

	export let sourceIndex: number;
	export let targetIndex: number;
	export let sourceTime: number;
	export let targetTime: number;

	const dispatch = createEventDispatcher<{ delete: void }>();

	$: isNorth = sourceIndex < targetIndex === sourceTime < targetTime;

	$: minTime = Math.min(sourceTime, targetTime);
	$: maxTime = Math.max(sourceTime, targetTime);
	$: minIndex = Math.min(sourceIndex, targetIndex);
	$: maxIndex = Math.max(sourceIndex, targetIndex);
</script>

<div
	class="marker-delta"
	class:north={isNorth}
	style="
	--min-time: {minTime};
	--delta-time: {maxTime - minTime};
	--min-index: {minIndex};
	--delta-index: {maxIndex - minIndex};"
>
	<button
		type="button"
		on:click
		on:keydown={(e) => {
			switch (e.key) {
				case 'Backspace':
				case 'Delete':
					dispatch('delete');
					break;
			}
		}}
	>
		{formatTime(maxTime - minTime)}
	</button>
</div>

<style>
	.marker-delta {
		pointer-events: none;
		position: absolute;
		--bg-color: var(--color-accent);
		border: 0.25rem dashed var(--bg-color);
		top: calc(0.125rem + 1.5rem + 2.5rem * var(--min-index));
		height: calc(2.5rem * var(--delta-index));

		left: calc(1px * var(--zoom) * var(--min-time));
		width: calc(1px * var(--zoom) * var(--delta-time));

		display: flex;
		justify-content: center;
		border-right-width: 0px;
	}
	.marker-delta.north {
		border-top-width: 0px;
		align-items: flex-end;
	}
	.marker-delta:not(.north) {
		border-bottom-width: 0px;
		align-items: flex-start;
	}
	button {
		pointer-events: all;
		background-color: var(--bg-color);
		padding: 0.25rem;
	}

	.marker-delta:focus-within {
		z-index: 100;
		--bg-color: var(--color-highlight);
	}
	button:focus {
		color: black;
	}
</style>
