import { BaseError } from "./BaseError";

/**
 * Error thrown when page navigation fails
 */
export class NavigationError extends BaseError {
	constructor(url: string, cause?: string) {
		const message = cause
			? `Failed to navigate to ${url}: ${cause}`
			: `Failed to navigate to ${url}`;
		super(message, "NAVIGATION_ERROR", 500);
	}
}
