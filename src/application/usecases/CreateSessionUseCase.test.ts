import { describe, expect, it, mock } from "bun:test";
import type { SessionRepository } from "../../domain/repositories/SessionRepository";
import type { PlaywrightAdapter } from "../../infrastructure/playwright/PlaywrightAdapter";
import { CreateSessionUseCase } from "./CreateSessionUseCase";

describe("CreateSessionUseCase", () => {
	it("should create a session and return sessionId", async () => {
		const mockRepository: SessionRepository = {
			save: mock(async () => {}),
			findById: mock(async () => null),
			delete: mock(async () => {}),
			exists: mock(async () => false),
		};

		const mockAdapter: PlaywrightAdapter = {
			createContext: mock(async () => {}),
		} as unknown as PlaywrightAdapter;

		const useCase = new CreateSessionUseCase(mockRepository, mockAdapter);
		const cookies = { sessionCookie: "abc123" };
		const headers = { "User-Agent": "test-agent" };

		const sessionId = await useCase.execute(cookies, headers);

		expect(sessionId).toBeString();
		expect(sessionId.length).toBeGreaterThan(0);
		expect(mockAdapter.createContext).toHaveBeenCalledTimes(1);
		expect(mockAdapter.createContext).toHaveBeenCalledWith(
			sessionId,
			cookies,
			headers,
		);
		expect(mockRepository.save).toHaveBeenCalledTimes(1);
	});

	it("should create context with empty cookies and headers", async () => {
		const mockRepository: SessionRepository = {
			save: mock(async () => {}),
			findById: mock(async () => null),
			delete: mock(async () => {}),
			exists: mock(async () => false),
		};

		const mockAdapter: PlaywrightAdapter = {
			createContext: mock(async () => {}),
		} as unknown as PlaywrightAdapter;

		const useCase = new CreateSessionUseCase(mockRepository, mockAdapter);

		const sessionId = await useCase.execute({}, {});

		expect(mockAdapter.createContext).toHaveBeenCalledWith(sessionId, {}, {});
	});
});
