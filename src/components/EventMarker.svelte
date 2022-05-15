<script lang="ts">
	import { formatTime } from '../helpers/timeHelpers';

	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher<{
		move: { direction: 'earlier' | 'later' };
		delete: void;
	}>();

	export let name: string;
	export let time: number;
</script>

<button
	type="button"
	class="event-marker"
	on:click
	on:dblclick
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
	<span aria-label="Name" class="marker-name">{name}</span>
	<span aria-label="Time">{formatTime(time)}</span>
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
		--bg-color: var(--color-accent);
	}
</style>
