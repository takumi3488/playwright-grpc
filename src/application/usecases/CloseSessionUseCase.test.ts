import { describe, expect, it, mock } from "bun:test";
import { Session } from "../../domain/entities/Session";
import type { SessionRepository } from "../../domain/repositories/SessionRepository";
import type { PlaywrightAdapter } from "../../infrastructure/playwright/PlaywrightAdapter";
import { SessionNotFoundError } from "../../shared/errors";
import { CloseSessionUseCase } from "./CloseSessionUseCase";

describe("CloseSessionUseCase", () => {
	it("should close session successfully", async () => {
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
			closeContext: mock(async () => true),
		} as unknown as PlaywrightAdapter;

		const useCase = new CloseSessionUseCase(mockRepository, mockAdapter);

		const result = await useCase.execute("session-123");

		expect(result).toBe(true);
		expect(mockRepository.findById).toHaveBeenCalledWith("session-123");
		expect(mockAdapter.closeContext).toHaveBeenCalledWith("session-123");
		expect(mockRepository.delete).toHaveBeenCalledWith("session-123");
	});

	it("should return false if context close fails", async () => {
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
			closeContext: mock(async () => false),
		} as unknown as PlaywrightAdapter;

		const useCase = new CloseSessionUseCase(mockRepository, mockAdapter);

		const result = await useCase.execute("session-123");

		expect(result).toBe(false);
		expect(mockAdapter.closeContext).toHaveBeenCalledWith("session-123");
		expect(mockRepository.delete).not.toHaveBeenCalled();
	});

	it("should throw SessionNotFoundError if session does not exist", async () => {
		const mockRepository: SessionRepository = {
			findById: mock(async () => null),
			save: mock(async () => {}),
			delete: mock(async () => {}),
			exists: mock(async () => false),
		};

		const mockAdapter: PlaywrightAdapter = {
			closeContext: mock(async () => true),
		} as unknown as PlaywrightAdapter;

		const useCase = new CloseSessionUseCase(mockRepository, mockAdapter);

		await expect(useCase.execute("non-existent")).rejects.toThrow(
			SessionNotFoundError,
		);
	});
});
