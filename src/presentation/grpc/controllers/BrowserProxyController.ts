import * as grpc from "@grpc/grpc-js";
import { trace } from "@opentelemetry/api";
import type {
	CaptureScreenshotUseCase,
	CloseSessionUseCase,
	CreateSessionUseCase,
	DownloadFileUseCase,
	FetchHttpUseCase,
	GetCookiesUseCase,
	NavigatePageUseCase,
} from "../../../application/usecases";
import type { CaptureScreenshotRequest__Output } from "../../../infrastructure/grpc/generated/browser_proxy/v1/CaptureScreenshotRequest";
import type { CaptureScreenshotResponse } from "../../../infrastructure/grpc/generated/browser_proxy/v1/CaptureScreenshotResponse";
import type { CloseSessionRequest__Output } from "../../../infrastructure/grpc/generated/browser_proxy/v1/CloseSessionRequest";
import type { CloseSessionResponse } from "../../../infrastructure/grpc/generated/browser_proxy/v1/CloseSessionResponse";
import type { Cookie__Output } from "../../../infrastructure/grpc/generated/browser_proxy/v1/Cookie";
import type { CreateSessionRequest__Output } from "../../../infrastructure/grpc/generated/browser_proxy/v1/CreateSessionRequest";
import type { CreateSessionResponse } from "../../../infrastructure/grpc/generated/browser_proxy/v1/CreateSessionResponse";
import type { DownloadFileRequest__Output } from "../../../infrastructure/grpc/generated/browser_proxy/v1/DownloadFileRequest";
import type { DownloadFileResponse } from "../../../infrastructure/grpc/generated/browser_proxy/v1/DownloadFileResponse";
import type { FetchHttpRequest__Output } from "../../../infrastructure/grpc/generated/browser_proxy/v1/FetchHttpRequest";
import type { FetchHttpResponse } from "../../../infrastructure/grpc/generated/browser_proxy/v1/FetchHttpResponse";
import type { GetCookiesRequest__Output } from "../../../infrastructure/grpc/generated/browser_proxy/v1/GetCookiesRequest";
import type { GetCookiesResponse } from "../../../infrastructure/grpc/generated/browser_proxy/v1/GetCookiesResponse";
import type { NavigatePageRequest__Output } from "../../../infrastructure/grpc/generated/browser_proxy/v1/NavigatePageRequest";
import type { NavigatePageResponse } from "../../../infrastructure/grpc/generated/browser_proxy/v1/NavigatePageResponse";
import { BaseError } from "../../../shared/errors";
import {
	recordSpanError,
	setSpanSuccess,
} from "../../../shared/telemetry/spanUtils";
import type { Cookie } from "../../../shared/types";

const tracer = trace.getTracer("browser-proxy-controller");

function _convertGrpcCookie(grpcCookie: Cookie__Output): Cookie {
	return {
		name: grpcCookie.name,
		value: grpcCookie.value,
		domain: grpcCookie.domain,
		path: grpcCookie.path,
		expires: grpcCookie.expires,
		httpOnly: grpcCookie.httpOnly,
		secure: grpcCookie.secure,
		sameSite: grpcCookie.sameSite as "Strict" | "Lax" | "None",
	};
}

/**
 * gRPC controller for BrowserProxyService
 * Implements the gRPC handlers and delegates to use cases
 */
export class BrowserProxyController {
	constructor(
		private createSessionUseCase: CreateSessionUseCase,
		private navigatePageUseCase: NavigatePageUseCase,
		private fetchHttpUseCase: FetchHttpUseCase,
		private downloadFileUseCase: DownloadFileUseCase,
		private getCookiesUseCase: GetCookiesUseCase,
		private captureScreenshotUseCase: CaptureScreenshotUseCase,
		private closeSessionUseCase: CloseSessionUseCase,
	) {}

	/**
	 * Creates a new browser session
	 */
	CreateSession: grpc.handleUnaryCall<
		CreateSessionRequest__Output,
		CreateSessionResponse
	> = async (call, callback) => {
		const span = tracer.startSpan("BrowserProxy.CreateSession");
		try {
			const { cookies, defaultHeaders } = call.request;

			// Record input attributes
			span.setAttribute("session.cookie_count", cookies?.length ?? 0);
			span.setAttribute(
				"session.default_header_count",
				Object.keys(defaultHeaders ?? {}).length,
			);

			const sessionId = await this.createSessionUseCase.execute(
				(cookies ?? []).map(_convertGrpcCookie),
				defaultHeaders ?? {},
			);

			// Record output attributes
			span.setAttribute("session.id", sessionId);
			setSpanSuccess(span);
			callback(null, { sessionId });
		} catch (error) {
			recordSpanError(span, error);
			callback(this.handleError(error), null);
		} finally {
			span.end();
		}
	};

	/**
	 * Navigates to a URL
	 */
	NavigatePage: grpc.handleUnaryCall<
		NavigatePageRequest__Output,
		NavigatePageResponse
	> = async (call, callback) => {
		const span = tracer.startSpan("BrowserProxy.NavigatePage");
		try {
			const { sessionId, url } = call.request;

			if (!sessionId || !url) {
				throw new Error("sessionId and url are required");
			}

			// Record input attributes
			span.setAttribute("session.id", sessionId);
			span.setAttribute("http.url", url);

			const result = await this.navigatePageUseCase.execute(sessionId, url);

			// Record output attributes
			span.setAttribute("page.id", result.pageId);
			span.setAttribute("http.status_code", result.statusCode);
			span.setAttribute("page.csrf_token_found", !!result.csrfToken);

			setSpanSuccess(span);
			callback(null, {
				pageId: result.pageId,
				statusCode: result.statusCode,
				csrfToken: result.csrfToken ?? "",
			});
		} catch (error) {
			recordSpanError(span, error);
			callback(this.handleError(error), null);
		} finally {
			span.end();
		}
	};

	/**
	 * Fetches HTTP content
	 */
	FetchHttp: grpc.handleUnaryCall<FetchHttpRequest__Output, FetchHttpResponse> =
		async (call, callback) => {
			const span = tracer.startSpan("BrowserProxy.FetchHttp");
			try {
				const { sessionId, url, headers, credential } = call.request;

				if (!sessionId || !url) {
					throw new Error("sessionId and url are required");
				}

				// Record input attributes (excluding sensitive data)
				span.setAttribute("session.id", sessionId);
				span.setAttribute("http.url", url);
				span.setAttribute(
					"http.request.header_count",
					Object.keys(headers ?? {}).length,
				);
				span.setAttribute("http.request.has_credential", !!credential);

				const result = await this.fetchHttpUseCase.execute(
					sessionId,
					url,
					headers ?? {},
					credential,
				);

				// Record output attributes (excluding body content)
				span.setAttribute("http.status_code", result.statusCode);
				span.setAttribute(
					"http.response.header_count",
					Object.keys(result.headers).length,
				);
				span.setAttribute(
					"http.response.body_size",
					Buffer.byteLength(result.body),
				);

				setSpanSuccess(span);
				callback(null, {
					statusCode: result.statusCode,
					headers: result.headers,
					body: result.body,
				});
			} catch (error) {
				recordSpanError(span, error);
				callback(this.handleError(error), null);
			} finally {
				span.end();
			}
		};

	/**
	 * Downloads a file with streaming
	 */
	DownloadFile: grpc.handleServerStreamingCall<
		DownloadFileRequest__Output,
		DownloadFileResponse
	> = async (call) => {
		const span = tracer.startSpan("BrowserProxy.DownloadFile");
		try {
			const { sessionId, url, headers } = call.request;

			if (!sessionId || !url) {
				const error = new Error("sessionId and url are required");
				recordSpanError(span, error);
				span.end();
				call.destroy(error);
				return;
			}

			// Record input attributes
			span.setAttribute("session.id", sessionId);
			span.setAttribute("http.url", url);
			span.setAttribute(
				"http.request.header_count",
				Object.keys(headers ?? {}).length,
			);

			const generator = this.downloadFileUseCase.execute(
				sessionId,
				url,
				headers ?? {},
			);

			let chunkCount = 0;
			let transferredBytes = 0;
			let totalSize: number | undefined;

			for await (const chunk of generator) {
				chunkCount++;
				transferredBytes += chunk.data.length;
				if (chunk.totalSize) {
					totalSize = Number(chunk.totalSize);
				}

				const response: DownloadFileResponse = {
					data: chunk.data,
					totalSize: chunk.totalSize?.toString() ?? "0",
				};
				call.write(response);
			}

			// Record output attributes
			span.setAttribute("download.chunk_count", chunkCount);
			span.setAttribute("download.transferred_bytes", transferredBytes);
			if (totalSize !== undefined) {
				span.setAttribute("download.total_size", totalSize);
			}

			setSpanSuccess(span);
			call.end();
		} catch (error) {
			recordSpanError(span, error);
			call.destroy(this.handleError(error));
		} finally {
			span.end();
		}
	};

	/**
	 * Retrieves cookies from a session
	 */
	GetCookies: grpc.handleUnaryCall<
		GetCookiesRequest__Output,
		GetCookiesResponse
	> = async (call, callback) => {
		const span = tracer.startSpan("BrowserProxy.GetCookies");
		try {
			const { sessionId, url } = call.request;

			if (!sessionId) {
				throw new Error("sessionId is required");
			}

			// Record input attributes
			span.setAttribute("session.id", sessionId);
			span.setAttribute("filter.has_url", !!url);
			if (url) {
				span.setAttribute("filter.url", url);
			}

			const cookies = await this.getCookiesUseCase.execute(
				sessionId,
				url || undefined,
			);

			// Record output attributes (excluding cookie values)
			span.setAttribute("cookie.count", cookies.length);

			setSpanSuccess(span);
			callback(null, {
				cookies: cookies.map((cookie) => ({
					name: cookie.name,
					value: cookie.value,
					domain: cookie.domain,
					path: cookie.path,
					expires: cookie.expires,
					httpOnly: cookie.httpOnly,
					secure: cookie.secure,
					sameSite: cookie.sameSite,
				})),
			});
		} catch (error) {
			recordSpanError(span, error);
			callback(this.handleError(error), null);
		} finally {
			span.end();
		}
	};

	/**
	 * Captures a screenshot
	 */
	CaptureScreenshot: grpc.handleUnaryCall<
		CaptureScreenshotRequest__Output,
		CaptureScreenshotResponse
	> = async (call, callback) => {
		const span = tracer.startSpan("BrowserProxy.CaptureScreenshot");
		try {
			const { sessionId, selector, fullPage } = call.request;

			if (!sessionId) {
				throw new Error("sessionId is required");
			}

			// Record input attributes
			span.setAttribute("session.id", sessionId);
			span.setAttribute("screenshot.full_page", fullPage ?? false);
			if (selector) {
				span.setAttribute("screenshot.selector", selector);
			}

			const result = await this.captureScreenshotUseCase.execute(
				sessionId,
				selector || undefined,
				fullPage ?? false,
			);

			// Record output attributes (excluding binary data)
			span.setAttribute("screenshot.width", result.width);
			span.setAttribute("screenshot.height", result.height);
			span.setAttribute("screenshot.data_size", result.data.length);

			setSpanSuccess(span);
			callback(null, {
				data: result.data,
				width: result.width,
				height: result.height,
			});
		} catch (error) {
			recordSpanError(span, error);
			callback(this.handleError(error), null);
		} finally {
			span.end();
		}
	};

	/**
	 * Closes a session
	 */
	CloseSession: grpc.handleUnaryCall<
		CloseSessionRequest__Output,
		CloseSessionResponse
	> = async (call, callback) => {
		const span = tracer.startSpan("BrowserProxy.CloseSession");
		try {
			const { sessionId } = call.request;

			if (!sessionId) {
				throw new Error("sessionId is required");
			}

			// Record input attributes
			span.setAttribute("session.id", sessionId);

			const success = await this.closeSessionUseCase.execute(sessionId);

			// Record output attributes
			span.setAttribute("session.close_success", success);

			setSpanSuccess(span);
			callback(null, { success });
		} catch (error) {
			recordSpanError(span, error);
			callback(this.handleError(error), null);
		} finally {
			span.end();
		}
	};

	/**
	 * Handles errors and converts them to gRPC errors
	 */
	private handleError(error: unknown): grpc.ServiceError {
		if (error instanceof BaseError) {
			return Object.assign(new Error(error.message), {
				code:
					error.statusCode === 404
						? grpc.status.NOT_FOUND
						: grpc.status.INTERNAL,
				details: error.message,
				metadata: new grpc.Metadata(),
			});
		}

		return Object.assign(
			new Error(error instanceof Error ? error.message : "Unknown error"),
			{
				code: grpc.status.INTERNAL,
				details: error instanceof Error ? error.message : "Unknown error",
				metadata: new grpc.Metadata(),
			},
		);
	}
}
