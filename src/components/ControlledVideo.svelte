<script lang="ts">
	export let videoUrl: string;
	export let onCurrentTimeChange: (time: number) => void;

	let currentTime = 0;

	$: {
		onCurrentTimeChange(currentTime);
	}

	export function seekTo(time: number) {
		currentTime = time;
	}
</script>

<video
	src={videoUrl}
	muted
	playsinline
	bind:currentTime
	on:click={({ currentTarget }) =>
		currentTarget.paused ? currentTarget.play() : currentTarget.pause()}
/>

<style>
	video {
		margin: 0 auto;
		width: 100%;
		height: auto;
	}
</style>
