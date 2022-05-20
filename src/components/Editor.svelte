<script lang="ts">
	import { getBestSize, type VideoDetails } from '../helpers/mediaHelpers';
	import ControlledVideo from './ControlledVideo.svelte';
	import Timeline from './Timeline.svelte';

	export let videoUrl: string;
	export let videoDetails: VideoDetails;

	let video: ControlledVideo;
	let paused = true;

	let currentTime = 0;

	let videoContainerSize = { width: 0, height: 0 };
	$: videoShrinkerSize = getBestSize(videoContainerSize, videoDetails, {
		paddingX: 32,
		paddingY: 32
	});
</script>

<main>
	<div
		class="video-container"
		bind:clientWidth={videoContainerSize.width}
		bind:clientHeight={videoContainerSize.height}
	>
		<div
			class="video-shrinker"
			class:paused
			style="width:{videoShrinkerSize.width}px; height:{videoShrinkerSize.height}px"
		>
			<ControlledVideo
				bind:this={video}
				bind:paused
				{videoUrl}
				onCurrentTimeChange={(t) => (currentTime = t)}
			/>
		</div>
	</div>

	<div class="timeline-container">
		<Timeline
			{currentTime}
			{paused}
			duration={videoDetails.duration}
			onSeek={(time) => video.seekTo(time)}
			onPausedChanged={(p) => (paused = p)}
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
		border: 0.5rem solid var(--color-light);
		border-radius: 0.5rem;
		transition: border-color var(--trans);
	}

	.video-shrinker.paused {
		border: 0.5rem solid var(--color-dark);
	}

	.timeline-container {
		max-width: 100vw;
	}
</style>
