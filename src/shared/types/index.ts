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

/**
 * Cookie information
 */
export interface Cookie {
	name: string;
	value: string;
	domain: string;
	path: string;
	expires: number; // Unix timestamp, -1 for session cookies
	httpOnly: boolean;
	secure: boolean;
	sameSite: "Strict" | "Lax" | "None";
}
