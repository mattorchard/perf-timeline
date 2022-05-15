export const formatTime = (timeInSeconds: number) => {
	const seconds = Math.round(timeInSeconds * 100) / 100;
	if (timeInSeconds < 60) {
		return `${seconds}s`;
	}
	const mins = Math.floor(timeInSeconds / 60);

	return seconds ? `${mins}m${seconds % 60}s` : `${mins}m`;
};
