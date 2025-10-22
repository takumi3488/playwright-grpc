import * as grpc from "@grpc/grpc-js";
import type {
	CloseSessionUseCase,
	CreateSessionUseCase,
	DownloadFileUseCase,
	FetchHttpUseCase,
	NavigatePageUseCase,
} from "../../../application/usecases";
import type { CloseSessionRequest__Output } from "../../../infrastructure/grpc/generated/browser_proxy/v1/CloseSessionRequest";
import type { CloseSessionResponse } from "../../../infrastructure/grpc/generated/browser_proxy/v1/CloseSessionResponse";
import type { CreateSessionRequest__Output } from "../../../infrastructure/grpc/generated/browser_proxy/v1/CreateSessionRequest";
import type { CreateSessionResponse } from "../../../infrastructure/grpc/generated/browser_proxy/v1/CreateSessionResponse";
import type { DownloadFileRequest__Output } from "../../../infrastructure/grpc/generated/browser_proxy/v1/DownloadFileRequest";
import type { DownloadFileResponse } from "../../../infrastructure/grpc/generated/browser_proxy/v1/DownloadFileResponse";
import type { FetchHttpRequest__Output } from "../../../infrastructure/grpc/generated/browser_proxy/v1/FetchHttpRequest";
import type { FetchHttpResponse } from "../../../infrastructure/grpc/generated/browser_proxy/v1/FetchHttpResponse";
import type { NavigatePageRequest__Output } from "../../../infrastructure/grpc/generated/browser_proxy/v1/NavigatePageRequest";
import type { NavigatePageResponse } from "../../../infrastructure/grpc/generated/browser_proxy/v1/NavigatePageResponse";
import { BaseError } from "../../../shared/errors";

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
		private closeSessionUseCase: CloseSessionUseCase,
	) {}

	/**
	 * Creates a new browser session
	 */
	CreateSession: grpc.handleUnaryCall<
		CreateSessionRequest__Output,
		CreateSessionResponse
	> = async (call, callback) => {
		try {
			const { cookies, defaultHeaders } = call.request;

			const sessionId = await this.createSessionUseCase.execute(
				cookies ?? {},
				defaultHeaders ?? {},
			);

			callback(null, { sessionId });
		} catch (error) {
			callback(this.handleError(error), null);
		}
	};

	/**
	 * Navigates to a URL
	 */
	NavigatePage: grpc.handleUnaryCall<
		NavigatePageRequest__Output,
		NavigatePageResponse
	> = async (call, callback) => {
		try {
			const { sessionId, url } = call.request;

			if (!sessionId || !url) {
				throw new Error("sessionId and url are required");
			}

			const result = await this.navigatePageUseCase.execute(sessionId, url);

			callback(null, {
				pageId: result.pageId,
				statusCode: result.statusCode,
			});
		} catch (error) {
			callback(this.handleError(error), null);
		}
	};

	/**
	 * Fetches HTTP content
	 */
	FetchHttp: grpc.handleUnaryCall<FetchHttpRequest__Output, FetchHttpResponse> =
		async (call, callback) => {
			try {
				const { sessionId, url, headers } = call.request;

				if (!sessionId || !url) {
					throw new Error("sessionId and url are required");
				}

				const result = await this.fetchHttpUseCase.execute(
					sessionId,
					url,
					headers ?? {},
				);

				callback(null, {
					statusCode: result.statusCode,
					headers: result.headers,
					body: result.body,
				});
			} catch (error) {
				callback(this.handleError(error), null);
			}
		};

	/**
	 * Downloads a file with streaming
	 */
	DownloadFile: grpc.handleServerStreamingCall<
		DownloadFileRequest__Output,
		DownloadFileResponse
	> = async (call) => {
		try {
			const { sessionId, url, headers } = call.request;

			if (!sessionId || !url) {
				call.destroy(new Error("sessionId and url are required"));
				return;
			}

			const generator = this.downloadFileUseCase.execute(
				sessionId,
				url,
				headers ?? {},
			);

			for await (const chunk of generator) {
				const response: DownloadFileResponse = {
					data: chunk.data,
					totalSize: chunk.totalSize?.toString() ?? "0",
				};
				call.write(response);
			}

			call.end();
		} catch (error) {
			call.destroy(this.handleError(error));
		}
	};

	/**
	 * Closes a session
	 */
	CloseSession: grpc.handleUnaryCall<
		CloseSessionRequest__Output,
		CloseSessionResponse
	> = async (call, callback) => {
		try {
			const { sessionId } = call.request;

			if (!sessionId) {
				throw new Error("sessionId is required");
			}

			const success = await this.closeSessionUseCase.execute(sessionId);

			callback(null, { success });
		} catch (error) {
			callback(this.handleError(error), null);
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
