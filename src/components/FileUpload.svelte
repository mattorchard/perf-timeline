<script lang="ts">
	export let onFile: (file: File) => void;

	let fileInput: HTMLInputElement;

	const isDraggingFiles = (event: DragEvent) =>
		event.dataTransfer?.types?.some((type) => type.toLowerCase() === 'files');

	const preventFileDefault = (event: DragEvent) => {
		if (isDraggingFiles(event)) event.preventDefault();
	};

	const getFirstFile = (fileList: FileList | null | undefined) => {
		if (!fileList) return null;
		if (!fileList.length) return null;
		return fileList[0];
	};

	const onDrop = (event: DragEvent) => {
		if (!isDraggingFiles(event)) return;
		event.preventDefault();
		const file = getFirstFile(event.dataTransfer?.files);
		if (file) onFile(file);
	};

	const onFileInputChange = () => {
		const file = getFirstFile(fileInput?.files);
		if (file) onFile(file);
	};
</script>

<form on:submit|preventDefault>
	<button type="button" class="button" on:click={() => fileInput.click()}>Choose a file</button>
	<p>Or drop a file</p>
	<input hidden type="file" bind:this={fileInput} on:change={onFileInputChange} accept="video/*" />
</form>

<svelte:window
	on:drop={onDrop}
	on:dragover={preventFileDefault}
	on:dragenter={preventFileDefault}
/>
