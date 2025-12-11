import { describe, expect, it, mock } from "bun:test";
import { Session } from "../../domain/entities/Session";
import type { SessionRepository } from "../../domain/repositories/SessionRepository";
import type { PlaywrightAdapter } from "../../infrastructure/playwright/PlaywrightAdapter";
import { SessionNotFoundError } from "../../shared/errors";
import { CaptureScreenshotUseCase } from "./CaptureScreenshotUseCase";

describe("CaptureScreenshotUseCase", () => {
	it("should capture screenshot successfully", async () => {
		const session = new Session("session-123", [], { "User-Agent": "test" });

		const mockRepository: SessionRepository = {
			findById: mock(async () => session),
			save: mock(async () => {}),
			delete: mock(async () => {}),
			exists: mock(async () => true),
		};

		const mockScreenshot = new Uint8Array([1, 2, 3, 4]);
		const mockAdapter: PlaywrightAdapter = {
			captureScreenshot: mock(async () => ({
				data: mockScreenshot,
				width: 1920,
				height: 1080,
			})),
		} as unknown as PlaywrightAdapter;

		const useCase = new CaptureScreenshotUseCase(mockRepository, mockAdapter);

		const result = await useCase.execute("session-123");

		expect(result.data).toBe(mockScreenshot);
		expect(result.width).toBe(1920);
		expect(result.height).toBe(1080);
		expect(mockRepository.findById).toHaveBeenCalledWith("session-123");
		expect(mockAdapter.captureScreenshot).toHaveBeenCalledWith(
			"session-123",
			undefined,
			undefined,
		);
	});

	it("should capture screenshot with selector", async () => {
		const session = new Session("session-123", [], { "User-Agent": "test" });

		const mockRepository: SessionRepository = {
			findById: mock(async () => session),
			save: mock(async () => {}),
			delete: mock(async () => {}),
			exists: mock(async () => true),
		};

		const mockScreenshot = new Uint8Array([1, 2, 3, 4]);
		const mockAdapter: PlaywrightAdapter = {
			captureScreenshot: mock(async () => ({
				data: mockScreenshot,
				width: 800,
				height: 600,
			})),
		} as unknown as PlaywrightAdapter;

		const useCase = new CaptureScreenshotUseCase(mockRepository, mockAdapter);

		const result = await useCase.execute("session-123", ".my-element", false);

		expect(result.data).toBe(mockScreenshot);
		expect(result.width).toBe(800);
		expect(result.height).toBe(600);
		expect(mockAdapter.captureScreenshot).toHaveBeenCalledWith(
			"session-123",
			".my-element",
			false,
		);
	});

	it("should capture full page screenshot", async () => {
		const session = new Session("session-123", [], { "User-Agent": "test" });

		const mockRepository: SessionRepository = {
			findById: mock(async () => session),
			save: mock(async () => {}),
			delete: mock(async () => {}),
			exists: mock(async () => true),
		};

		const mockScreenshot = new Uint8Array([1, 2, 3, 4]);
		const mockAdapter: PlaywrightAdapter = {
			captureScreenshot: mock(async () => ({
				data: mockScreenshot,
				width: 1920,
				height: 5000,
			})),
		} as unknown as PlaywrightAdapter;

		const useCase = new CaptureScreenshotUseCase(mockRepository, mockAdapter);

		const result = await useCase.execute("session-123", undefined, true);

		expect(result.data).toBe(mockScreenshot);
		expect(result.width).toBe(1920);
		expect(result.height).toBe(5000);
		expect(mockAdapter.captureScreenshot).toHaveBeenCalledWith(
			"session-123",
			undefined,
			true,
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
			captureScreenshot: mock(async () => ({
				data: new Uint8Array([1, 2, 3, 4]),
				width: 1920,
				height: 1080,
			})),
		} as unknown as PlaywrightAdapter;

		const useCase = new CaptureScreenshotUseCase(mockRepository, mockAdapter);

		await expect(useCase.execute("non-existent")).rejects.toThrow(
			SessionNotFoundError,
		);
	});
});
