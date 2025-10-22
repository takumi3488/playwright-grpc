import { BaseError } from "./BaseError";

/**
 * Error thrown when file download fails
 */
export class DownloadError extends BaseError {
	constructor(url: string, cause?: string) {
		const message = cause
			? `Failed to download ${url}: ${cause}`
			: `Failed to download ${url}`;
		super(message, "DOWNLOAD_ERROR", 500);
	}
}
