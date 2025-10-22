import type { BrowserContext, Page } from "playwright";
import { chromium } from "playwright";
import {
	DownloadError,
	HttpFetchError,
	NavigationError,
} from "../../shared/errors";
import type {
	Cookies,
	Headers,
	HttpResponse,
	NavigationResult,
} from "../../shared/types";

/**
 * Context data stored for each session
 */
interface ContextData {
	context: BrowserContext;
	page?: Page;
}

/**
 * Adapter for Playwright operations
 * Manages browser contexts and pages
 */
export class PlaywrightAdapter {
	private contexts: Map<string, ContextData> = new Map();

	/**
	 * Creates a new browser context with cookies and headers
	 */
	async createContext(
		sessionId: string,
		cookies: Cookies,
		defaultHeaders: Headers,
	): Promise<void> {
		const browser = await chromium.launch({
			headless: true,
		});

		const context = await browser.newContext({
			extraHTTPHeaders: defaultHeaders,
		});

		// Set cookies
		const cookieArray = Object.entries(cookies).map(([name, value]) => ({
			name,
			value,
			domain: ".pixiv.net", // Default domain - should be configurable in production
			path: "/",
		}));

		if (cookieArray.length > 0) {
			await context.addCookies(cookieArray);
		}

		this.contexts.set(sessionId, { context });
	}

	/**
	 * Navigates to a URL, creating a page if it doesn't exist
	 */
	async navigatePage(
		sessionId: string,
		url: string,
	): Promise<NavigationResult> {
		const contextData = this.contexts.get(sessionId);
		if (!contextData) {
			throw new Error(`Context not found for session: ${sessionId}`);
		}

		// Create page if it doesn't exist
		if (!contextData.page) {
			contextData.page = await contextData.context.newPage();
		}

		try {
			const response = await contextData.page.goto(url, {
				waitUntil: "networkidle",
			});

			const statusCode = response?.status() ?? 0;
			const pageId = `${sessionId}-page`;

			return {
				pageId,
				statusCode,
			};
		} catch (error) {
			throw new NavigationError(
				url,
				error instanceof Error ? error.message : String(error),
			);
		}
	}

	/**
	 * Fetches HTTP content using the page's context
	 */
	async fetchHttp(
		sessionId: string,
		url: string,
		headers: Headers,
	): Promise<HttpResponse> {
		const contextData = this.contexts.get(sessionId);
		if (!contextData?.page) {
			throw new Error(`Page not found for session: ${sessionId}`);
		}

		try {
			const response = await contextData.page.request.get(url, {
				headers,
			});

			const body = await response.body();
			const responseHeaders: Headers = {};

			for (const [key, value] of Object.entries(response.headers())) {
				responseHeaders[key] = value;
			}

			return {
				statusCode: response.status(),
				headers: responseHeaders,
				body,
			};
		} catch (error) {
			throw new HttpFetchError(
				url,
				error instanceof Error ? error.message : String(error),
			);
		}
	}

	/**
	 * Downloads a file and returns an async generator for streaming
	 */
	async *downloadFile(
		sessionId: string,
		url: string,
		headers: Headers,
	): AsyncGenerator<{ data: Uint8Array; totalSize?: number }> {
		const contextData = this.contexts.get(sessionId);
		if (!contextData?.page) {
			throw new Error(`Page not found for session: ${sessionId}`);
		}

		try {
			const response = await contextData.page.request.get(url, {
				headers,
			});

			const body = await response.body();
			const totalSize = body.length;

			// Stream in chunks
			const CHUNK_SIZE = 64 * 1024; // 64KB chunks
			for (let offset = 0; offset < body.length; offset += CHUNK_SIZE) {
				const chunk = body.slice(
					offset,
					Math.min(offset + CHUNK_SIZE, body.length),
				);
				yield {
					data: chunk,
					totalSize: offset === 0 ? totalSize : undefined,
				};
			}
		} catch (error) {
			throw new DownloadError(
				url,
				error instanceof Error ? error.message : String(error),
			);
		}
	}

	/**
	 * Closes and destroys a context
	 */
	async closeContext(sessionId: string): Promise<boolean> {
		const contextData = this.contexts.get(sessionId);
		if (!contextData) {
			return false;
		}

		try {
			await contextData.context.close();
			await contextData.context.browser()?.close();
			this.contexts.delete(sessionId);
			return true;
		} catch {
			return false;
		}
	}

	/**
	 * Checks if a context exists
	 */
	hasContext(sessionId: string): boolean {
		return this.contexts.has(sessionId);
	}

	/**
	 * Closes all contexts (cleanup)
	 */
	async closeAll(): Promise<void> {
		const closePromises = Array.from(this.contexts.keys()).map((sessionId) =>
			this.closeContext(sessionId),
		);
		await Promise.all(closePromises);
	}
}
