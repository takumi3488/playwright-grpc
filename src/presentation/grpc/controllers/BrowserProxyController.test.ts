import { describe, expect, it, mock } from "bun:test";
import type * as grpc from "@grpc/grpc-js";
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
import type { FetchHttpRequest__Output } from "../../../infrastructure/grpc/generated/browser_proxy/v1/FetchHttpRequest";
import type { FetchHttpResponse } from "../../../infrastructure/grpc/generated/browser_proxy/v1/FetchHttpResponse";
import type { NavigatePageRequest__Output } from "../../../infrastructure/grpc/generated/browser_proxy/v1/NavigatePageRequest";
import type { NavigatePageResponse } from "../../../infrastructure/grpc/generated/browser_proxy/v1/NavigatePageResponse";
import { BrowserProxyController } from "./BrowserProxyController";

describe("BrowserProxyController", () => {
	describe("CreateSession", () => {
		it("should create a session and return sessionId", async () => {
			const mockCreateSessionUseCase = {
				execute: mock(async () => "session-123"),
			} as unknown as CreateSessionUseCase;

			const controller = new BrowserProxyController(
				mockCreateSessionUseCase,
				{} as NavigatePageUseCase,
				{} as FetchHttpUseCase,
				{} as DownloadFileUseCase,
				{} as CloseSessionUseCase,
			);

			const mockCall = {
				request: {
					cookies: { cookie1: "value1" },
					defaultHeaders: { "User-Agent": "test" },
				},
			} as unknown as grpc.ServerUnaryCall<
				CreateSessionRequest__Output,
				CreateSessionResponse
			>;

			const mockCallback =
				mock() as unknown as grpc.sendUnaryData<CreateSessionResponse>;

			await controller.CreateSession(mockCall, mockCallback);

			expect(mockCallback).toHaveBeenCalledWith(null, {
				sessionId: "session-123",
			});
			expect(mockCreateSessionUseCase.execute).toHaveBeenCalledWith(
				{ cookie1: "value1" },
				{ "User-Agent": "test" },
			);
		});
	});

	describe("NavigatePage", () => {
		it("should navigate to URL and return result", async () => {
			const mockNavigatePageUseCase = {
				execute: mock(async () => ({
					pageId: "page-123",
					statusCode: 200,
				})),
			} as unknown as NavigatePageUseCase;

			const controller = new BrowserProxyController(
				{} as CreateSessionUseCase,
				mockNavigatePageUseCase,
				{} as FetchHttpUseCase,
				{} as DownloadFileUseCase,
				{} as CloseSessionUseCase,
			);

			const mockCall = {
				request: {
					sessionId: "session-123",
					url: "https://example.com",
				},
			} as unknown as grpc.ServerUnaryCall<
				NavigatePageRequest__Output,
				NavigatePageResponse
			>;

			const mockCallback =
				mock() as unknown as grpc.sendUnaryData<NavigatePageResponse>;

			await controller.NavigatePage(mockCall, mockCallback);

			expect(mockCallback).toHaveBeenCalledWith(null, {
				pageId: "page-123",
				statusCode: 200,
			});
		});

		it("should call callback with error if sessionId or url is missing", async () => {
			const controller = new BrowserProxyController(
				{} as CreateSessionUseCase,
				{} as NavigatePageUseCase,
				{} as FetchHttpUseCase,
				{} as DownloadFileUseCase,
				{} as CloseSessionUseCase,
			);

			const mockCall = {
				request: {
					sessionId: "",
					url: "https://example.com",
				},
			} as unknown as grpc.ServerUnaryCall<
				NavigatePageRequest__Output,
				NavigatePageResponse
			>;

			const mockCallback = mock();

			await controller.NavigatePage(
				mockCall,
				mockCallback as unknown as grpc.sendUnaryData<NavigatePageResponse>,
			);

			expect(mockCallback).toHaveBeenCalled();
			const errorArg = mockCallback.mock.calls[0]?.[0];
			expect(errorArg).toBeDefined();
			expect(errorArg?.message).toContain("sessionId and url are required");
		});
	});

	describe("FetchHttp", () => {
		it("should fetch HTTP content and return response", async () => {
			const mockFetchHttpUseCase = {
				execute: mock(async () => ({
					statusCode: 200,
					headers: { "content-type": "application/json" },
					body: new Uint8Array([123, 125]),
				})),
			} as unknown as FetchHttpUseCase;

			const controller = new BrowserProxyController(
				{} as CreateSessionUseCase,
				{} as NavigatePageUseCase,
				mockFetchHttpUseCase,
				{} as DownloadFileUseCase,
				{} as CloseSessionUseCase,
			);

			const mockCall = {
				request: {
					sessionId: "session-123",
					url: "https://api.example.com/data",
					headers: { Accept: "application/json" },
				},
			} as unknown as grpc.ServerUnaryCall<
				FetchHttpRequest__Output,
				FetchHttpResponse
			>;

			const mockCallback =
				mock() as unknown as grpc.sendUnaryData<FetchHttpResponse>;

			await controller.FetchHttp(mockCall, mockCallback);

			expect(mockCallback).toHaveBeenCalledWith(null, {
				statusCode: 200,
				headers: { "content-type": "application/json" },
				body: new Uint8Array([123, 125]),
			});
		});
	});

	describe("CloseSession", () => {
		it("should close session and return success", async () => {
			const mockCloseSessionUseCase = {
				execute: mock(async () => true),
			} as unknown as CloseSessionUseCase;

			const controller = new BrowserProxyController(
				{} as CreateSessionUseCase,
				{} as NavigatePageUseCase,
				{} as FetchHttpUseCase,
				{} as DownloadFileUseCase,
				mockCloseSessionUseCase,
			);

			const mockCall = {
				request: {
					sessionId: "session-123",
				},
			} as unknown as grpc.ServerUnaryCall<
				CloseSessionRequest__Output,
				CloseSessionResponse
			>;

			const mockCallback =
				mock() as unknown as grpc.sendUnaryData<CloseSessionResponse>;

			await controller.CloseSession(mockCall, mockCallback);

			expect(mockCallback).toHaveBeenCalledWith(null, { success: true });
		});
	});
});
