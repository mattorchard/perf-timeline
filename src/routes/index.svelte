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
		<p class="loading-message">Loading video details</p>
	{:then videoDetails}
		<Editor {videoUrl} {videoDetails} />
	{:catch error}
		<p>Something went wrong {error.message}</p>
		<button type="button" class="button" on:click={discardVideo}>Retry upload?</button>
	{/await}
{:else}
	<div class="welcome">
		<section class="upload-section">
			<h2>Perf Timeline</h2>
			<FileUpload onFile={handleNewVideo} />
		</section>
		<footer>
			Made with TypeScript, Svelte, and
			<a href="https://fontawesome.com/" target="_blank" rel="noopener noreferrer">FontAwesome </a>
			by
			<a
				href="https://github.com/mattorchard/perf-timeline"
				target="_blank"
				rel="noopener noreferrer">Matthew Orchard</a
			>
		</footer>
	</div>
{/if}

<style>
	.welcome {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	.upload-section {
		margin: auto;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	h2 {
		font-size: 3rem;
		margin-bottom: 1rem;
	}
	a:visited {
		color: inherit;
	}
	footer {
		align-self: flex-end;
		padding: 0.5rem;
	}
	.loading-message {
		min-height: 100vh;
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
