import { describe, expect, it, mock } from "bun:test";
import { Session } from "../../domain/entities/Session";
import type { SessionRepository } from "../../domain/repositories/SessionRepository";
import type { PlaywrightAdapter } from "../../infrastructure/playwright/PlaywrightAdapter";
import { SessionNotFoundError } from "../../shared/errors";
import { FetchHttpUseCase } from "./FetchHttpUseCase";

describe("FetchHttpUseCase", () => {
	it("should fetch HTTP content successfully", async () => {
		const session = new Session(
			"session-123",
			{ cookie: "value" },
			{ "User-Agent": "test" },
			"page-123",
		);

		const mockRepository: SessionRepository = {
			findById: mock(async () => session),
			save: mock(async () => {}),
			delete: mock(async () => {}),
			exists: mock(async () => true),
		};

		const mockResponse = {
			statusCode: 200,
			headers: { "content-type": "application/json" },
			body: new Uint8Array([123, 125]), // "{}"
		};

		const mockAdapter: PlaywrightAdapter = {
			fetchHttp: mock(async () => mockResponse),
		} as unknown as PlaywrightAdapter;

		const useCase = new FetchHttpUseCase(mockRepository, mockAdapter);

		const result = await useCase.execute(
			"session-123",
			"https://api.example.com/data",
			{ Accept: "application/json" },
		);

		expect(result).toEqual(mockResponse);
		expect(mockRepository.findById).toHaveBeenCalledWith("session-123");
		expect(mockAdapter.fetchHttp).toHaveBeenCalledWith(
			"session-123",
			"https://api.example.com/data",
			{ Accept: "application/json" },
		);
	});

	it("should throw SessionNotFoundError if session does not exist", async () => {
		const mockRepository: SessionRepository = {
			findById: mock(async () => null),
			save: mock(async () => {}),
			delete: mock(async () => {}),
			exists: mock(async () => false),
		};

		const mockAdapter: PlaywrightAdapter = {
			fetchHttp: mock(async () => ({
				statusCode: 200,
				headers: {},
				body: new Uint8Array(),
			})),
		} as unknown as PlaywrightAdapter;

		const useCase = new FetchHttpUseCase(mockRepository, mockAdapter);

		await expect(
			useCase.execute("non-existent", "https://example.com", {}),
		).rejects.toThrow(SessionNotFoundError);
	});

	it("should throw error if page is not initialized", async () => {
		const session = new Session(
			"session-123",
			{ cookie: "value" },
			{ "User-Agent": "test" },
		);

		const mockRepository: SessionRepository = {
			findById: mock(async () => session),
			save: mock(async () => {}),
			delete: mock(async () => {}),
			exists: mock(async () => true),
		};

		const mockAdapter: PlaywrightAdapter = {
			fetchHttp: mock(async () => ({
				statusCode: 200,
				headers: {},
				body: new Uint8Array(),
			})),
		} as unknown as PlaywrightAdapter;

		const useCase = new FetchHttpUseCase(mockRepository, mockAdapter);

		await expect(
			useCase.execute("session-123", "https://example.com", {}),
		).rejects.toThrow("Page not initialized");
	});
});
