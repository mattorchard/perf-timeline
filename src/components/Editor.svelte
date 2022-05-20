<script lang="ts">
	import { getBestSize, type VideoDetails } from '../helpers/mediaHelpers';
	import ControlledVideo from './ControlledVideo.svelte';
	import Timeline from './Timeline.svelte';

	export let videoUrl: string;
	export let videoDetails: VideoDetails;

	let video: ControlledVideo;

	let currentTime = 0;

	let videoContainerSize = { width: 0, height: 0 };
	$: videoShrinkerSize = getBestSize(videoContainerSize, videoDetails, 32);
</script>

<main>
	<div
		class="video-container"
		bind:clientWidth={videoContainerSize.width}
		bind:clientHeight={videoContainerSize.height}
	>
		<div
			class="video-shrinker"
			style="width:{videoShrinkerSize.width}px; height:{videoShrinkerSize.height}px"
		>
			<ControlledVideo
				bind:this={video}
				{videoUrl}
				onCurrentTimeChange={(t) => (currentTime = t)}
			/>
		</div>
	</div>

	<div class="timeline-container">
		<Timeline
			duration={videoDetails.duration}
			{currentTime}
			onSeek={(time) => video.seekTo(time)}
		/>
	</div>
</main>

<style>
	main {
		height: 100vh;
		max-height: 100vh;
		overflow: hidden;
		display: grid;
		grid-template-rows: 1fr auto;
	}
	.video-container {
		overflow: hidden;
		display: flex;
	}
	.video-shrinker {
		margin: auto;
		box-sizing: content-box;
		border: 0.5rem solid var(--color-dark);
		border-radius: 0.5rem;
	}

	.timeline-container {
		max-width: 100vw;
	}
</style>
