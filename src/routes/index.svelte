<script lang="ts">
	import FileUpload from '../components/FileUpload.svelte';
	import Editor from '../components/Editor.svelte';
	import { getVideoDetails, type VideoDetails } from '../helpers/mediaHelpers';

	let videoUrl: string | null = null;
	let videoDetailsPromise: Promise<VideoDetails> | null = null;

	const handleNewVideo = (videoFile: File) => {
		if (videoUrl) URL.revokeObjectURL(videoUrl);

		videoUrl = URL.createObjectURL(videoFile);
		videoDetailsPromise = getVideoDetails(videoUrl);
	};

	const discardVideo = () => {
		if (videoUrl) {
			URL.revokeObjectURL(videoUrl);
			videoUrl = null;
		}
	};
</script>

{#if videoUrl && videoDetailsPromise}
	{#await videoDetailsPromise}
		<p>Loading video details</p>
	{:then videoDetails}
		<Editor {videoUrl} {videoDetails} />
	{:catch error}
		<p>Something went wrong {error.message}</p>
		<button type="button" class="button" on:click={discardVideo}>Retry upload?</button>
	{/await}
{:else}
	<section class="upload-section">
		<FileUpload onFile={handleNewVideo} />
	</section>
{/if}

<style>
	.upload-section {
		min-height: 80vh;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
