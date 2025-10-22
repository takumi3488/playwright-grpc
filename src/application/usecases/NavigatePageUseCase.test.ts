import { describe, expect, it, mock } from "bun:test";
import { Session } from "../../domain/entities/Session";
import type { SessionRepository } from "../../domain/repositories/SessionRepository";
import type { PlaywrightAdapter } from "../../infrastructure/playwright/PlaywrightAdapter";
import { SessionNotFoundError } from "../../shared/errors";
import { NavigatePageUseCase } from "./NavigatePageUseCase";

describe("NavigatePageUseCase", () => {
	it("should navigate to URL and update session", async () => {
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
			navigatePage: mock(async () => ({
				pageId: "page-123",
				statusCode: 200,
			})),
		} as unknown as PlaywrightAdapter;

		const useCase = new NavigatePageUseCase(mockRepository, mockAdapter);

		const result = await useCase.execute("session-123", "https://example.com");

		expect(result.pageId).toBe("page-123");
		expect(result.statusCode).toBe(200);
		expect(mockRepository.findById).toHaveBeenCalledWith("session-123");
		expect(mockAdapter.navigatePage).toHaveBeenCalledWith(
			"session-123",
			"https://example.com",
		);
		expect(mockRepository.save).toHaveBeenCalledTimes(1);
	});

	it("should throw SessionNotFoundError if session does not exist", async () => {
		const mockRepository: SessionRepository = {
			findById: mock(async () => null),
			save: mock(async () => {}),
			delete: mock(async () => {}),
			exists: mock(async () => false),
		};

		const mockAdapter: PlaywrightAdapter = {
			navigatePage: mock(async () => ({
				pageId: "page-123",
				statusCode: 200,
			})),
		} as unknown as PlaywrightAdapter;

		const useCase = new NavigatePageUseCase(mockRepository, mockAdapter);

		await expect(
			useCase.execute("non-existent", "https://example.com"),
		).rejects.toThrow(SessionNotFoundError);
	});
});
