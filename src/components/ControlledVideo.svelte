<script lang="ts">
	export let videoUrl: string;
	export let paused: boolean;
	export let onCurrentTimeChange: (time: number) => void;

	let video: HTMLVideoElement;
	let currentTime = 0;

	$: onCurrentTimeChange(currentTime);

	$: paused ? video?.pause() : video?.play();

	function togglePause() {
		paused = !paused;
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
	bind:this={video}
	on:click={togglePause}
	on:keydown={({ key }) => {
		switch (key) {
			case ' ':
			case 'Enter':
				togglePause();
				break;
		}
	}}
	tabindex="0"
/>

<style>
	video {
		margin: 0 auto;
		width: 100%;
		height: auto;
		cursor: pointer;
	}
</style>
