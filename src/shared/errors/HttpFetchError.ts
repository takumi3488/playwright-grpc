import { BaseError } from "./BaseError";

/**
 * Error thrown when HTTP fetch operation fails
 */
export class HttpFetchError extends BaseError {
	constructor(url: string, cause?: string) {
		const message = cause
			? `Failed to fetch ${url}: ${cause}`
			: `Failed to fetch ${url}`;
		super(message, "HTTP_FETCH_ERROR", 500);
	}
}
