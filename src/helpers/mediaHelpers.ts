export type VideoDetails = {
	width: number;
	height: number;
	duration: number; // In seconds
};

export const getVideoDetails = async (videoUrl: string): Promise<VideoDetails> =>
	new Promise((resolve, reject) => {
		const video = document.createElement('video');
		video.onerror = () => reject(new Error(`Unable to load video`));
		video.onseeked = () => {
			const details = {
				width: video.videoWidth,
				height: video.videoHeight,
				duration: video.duration
			};
			if (details.width && details.height && details.duration) {
				resolve(details);
			} else {
				reject(new Error(`Failed to load video details`));
			}
		};
		video.setAttribute('src', videoUrl);
		video.currentTime = Number.MAX_SAFE_INTEGER;
	});

interface Size {
	width: number;
	height: number;
}

export const getBestSize = (
	containerSize: Size,
	mediaSize: Size,
	{ paddingX, paddingY } = { paddingX: 0, paddingY: 0 }
): Size => {
	const hScale = (containerSize.height - paddingX) / mediaSize.height;
	const wScale = (containerSize.width - paddingY) / mediaSize.width;
	const scale = Math.min(hScale, wScale);
	return {
		width: mediaSize.width * scale,
		height: mediaSize.height * scale
	};
};
