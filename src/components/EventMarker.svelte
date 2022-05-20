<script lang="ts">
	import { formatTime } from '../helpers/timeHelpers';

	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher<{
		move: { direction: 'earlier' | 'later' };
		delete: void;
	}>();

	export let name: string;
	export let time: number;
	export let showTime: boolean;
</script>

<button
	type="button"
	class="event-marker"
	on:click
	on:dblclick
	on:pointerdown
	on:pointerup
	on:keydown={(event) => {
		switch (event.key) {
			case 'ArrowLeft':
				event.preventDefault();
				dispatch('move', { direction: 'earlier' });
				break;
			case 'ArrowRight':
				event.preventDefault();
				dispatch('move', { direction: 'later' });
				break;
			case 'Delete':
			case 'Backspace':
				dispatch('delete');
				break;
		}
	}}
>
	<em aria-label="Name" class="marker-name">{name}</em>
	{#if showTime}
		<span aria-label="Time">{formatTime(time)}</span>
	{/if}
</button>

<style>
	.event-marker {
		display: flex;
		position: relative;
		--bg-color: var(--color-light);
		background-color: var(--bg-color);
		transform: translateX(1rem);
		height: 2rem;
		display: flex;
		align-items: center;
		min-width: 4rem;
		padding: 0.5rem;
		gap: 1rem;
		transition: filter var(--trans);
	}
	.event-marker::before {
		content: '';
		border: 1rem solid transparent;
		border-right-color: var(--bg-color);
		position: absolute;
		top: 0;
		bottom: 0;
		right: 100%;
	}
	.event-marker:focus-within {
		--bg-color: var(--color-highlight);
		color: black;
	}

	.event-marker:hover {
		filter: brightness(1.15);
	}
	.marker-name {
		white-space: nowrap;
	}
	.event-marker:active {
		filter: brightness(0.85);
	}
</style>
