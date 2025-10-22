/**
 * Common type definitions used across layers
 */

/**
 * HTTP headers represented as a key-value map
 */
export type Headers = Record<string, string>;

/**
 * Cookies represented as a key-value map
 */
export type Cookies = Record<string, string>;

/**
 * HTTP response structure
 */
export interface HttpResponse {
	statusCode: number;
	headers: Headers;
	body: Uint8Array;
}

/**
 * Page navigation result
 */
export interface NavigationResult {
	pageId: string;
	statusCode: number;
}
