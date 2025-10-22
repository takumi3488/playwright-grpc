import type { Cookies, Headers } from "../../shared/types";

/**
 * Session entity representing a browser context
 * One session maps to one BrowserContext in Playwright
 */
export class Session {
	constructor(
		public readonly id: string,
		public readonly cookies: Cookies,
		public readonly defaultHeaders: Headers,
		public pageId?: string,
	) {}

	/**
	 * Updates the page ID for this session
	 */
	withPage(pageId: string): Session {
		return new Session(this.id, this.cookies, this.defaultHeaders, pageId);
	}

	/**
	 * Checks if the session has an active page
	 */
	hasPage(): boolean {
		return this.pageId !== undefined;
	}
}
