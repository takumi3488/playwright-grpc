import type { BrowserContext, Page } from "playwright";
import { chromium } from "playwright";
import {
	DownloadError,
	HttpFetchError,
	NavigationError,
} from "../../shared/errors";
import type {
	Cookie,
	Cookies,
	Headers,
	HttpResponse,
	NavigationResult,
	ScreenshotResult,
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
		const cookieArray = cookies.map((cookie) => ({
			name: cookie.name,
			value: cookie.value,
			domain: cookie.domain,
			path: cookie.path,
			expires: cookie.expires === -1 ? -1 : cookie.expires,
			httpOnly: cookie.httpOnly,
			secure: cookie.secure,
			sameSite: cookie.sameSite as "Strict" | "Lax" | "None",
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
		credential?: string,
	): Promise<HttpResponse> {
		const contextData = this.contexts.get(sessionId);
		if (!contextData?.page) {
			throw new Error(`Page not found for session: ${sessionId}`);
		}

		try {
			// Execute fetch within the browser context
			const result = await contextData.page.evaluate(
				async ({ url, headers, credential }) => {
					const fetchOptions: RequestInit = {
						headers,
						credentials: (credential || "include") as RequestCredentials,
					};
					const response = await fetch(url, fetchOptions);
					const body = await response.arrayBuffer();
					const responseHeaders: Record<string, string> = {};

					response.headers.forEach((value, key) => {
						responseHeaders[key] = value;
					});

					return {
						statusCode: response.status,
						headers: responseHeaders,
						body: Array.from(new Uint8Array(body)),
					};
				},
				{ url, headers, credential },
			);

			return {
				statusCode: result.statusCode,
				headers: result.headers,
				body: new Uint8Array(result.body),
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
	 * Retrieves cookies from the context
	 */
	async getCookies(sessionId: string, url?: string): Promise<Cookie[]> {
		const contextData = this.contexts.get(sessionId);
		if (!contextData) {
			throw new Error(`Context not found for session: ${sessionId}`);
		}

		const playwrightCookies = url
			? await contextData.context.cookies(url)
			: await contextData.context.cookies();

		return playwrightCookies.map((cookie) => ({
			name: cookie.name,
			value: cookie.value,
			domain: cookie.domain,
			path: cookie.path,
			expires: cookie.expires ?? -1,
			httpOnly: cookie.httpOnly,
			secure: cookie.secure,
			sameSite: (cookie.sameSite as "Strict" | "Lax" | "None") || "None",
		}));
	}

	/**
	 * Captures a screenshot of the current page
	 */
	async captureScreenshot(
		sessionId: string,
		selector?: string,
		fullPage?: boolean,
	): Promise<ScreenshotResult> {
		const contextData = this.contexts.get(sessionId);
		if (!contextData) {
			throw new Error(`Context not found for session: ${sessionId}`);
		}

		if (!contextData.page) {
			throw new Error(
				`No page found in session: ${sessionId}. Navigate to a page first.`,
			);
		}

		try {
			let screenshot: Buffer;
			let width: number;
			let height: number;

			if (selector) {
				// Capture specific element
				const element = await contextData.page.locator(selector).first();
				const box = await element.boundingBox();
				if (!box) {
					throw new Error(`Element not found or not visible: ${selector}`);
				}
				screenshot = await element.screenshot({ type: "png" });
				width = Math.round(box.width);
				height = Math.round(box.height);
			} else {
				// Capture full page or viewport
				screenshot = await contextData.page.screenshot({
					type: "png",
					fullPage: fullPage ?? false,
				});
				const viewportSize = contextData.page.viewportSize();
				if (fullPage) {
					// For full page, get the actual page dimensions
					const dimensions = await contextData.page.evaluate(() => ({
						width: document.documentElement.scrollWidth,
						height: document.documentElement.scrollHeight,
					}));
					width = dimensions.width;
					height = dimensions.height;
				} else {
					width = viewportSize?.width ?? 0;
					height = viewportSize?.height ?? 0;
				}
			}

			return {
				data: new Uint8Array(screenshot),
				width,
				height,
			};
		} catch (error) {
			throw new Error(
				`Failed to capture screenshot: ${error instanceof Error ? error.message : String(error)}`,
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
