import { describe, expect, it, mock } from "bun:test";
import { Session } from "../../domain/entities/Session";
import type { SessionRepository } from "../../domain/repositories/SessionRepository";
import type { PlaywrightAdapter } from "../../infrastructure/playwright/PlaywrightAdapter";
import { SessionNotFoundError } from "../../shared/errors";
import { DownloadFileUseCase } from "./DownloadFileUseCase";

describe("DownloadFileUseCase", () => {
	it("should download file and stream chunks", async () => {
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

		async function* mockGenerator() {
			yield { data: new Uint8Array([1, 2, 3]), totalSize: 6 };
			yield { data: new Uint8Array([4, 5, 6]) };
		}

		const mockAdapter: PlaywrightAdapter = {
			downloadFile: mock(mockGenerator),
		} as unknown as PlaywrightAdapter;

		const useCase = new DownloadFileUseCase(mockRepository, mockAdapter);

		const chunks: Array<{ data: Uint8Array; totalSize?: number }> = [];
		for await (const chunk of useCase.execute(
			"session-123",
			"https://example.com/file.pdf",
			{ Accept: "*/*" },
		)) {
			chunks.push(chunk);
		}

		expect(chunks).toHaveLength(2);
		expect(chunks[0]?.data).toEqual(new Uint8Array([1, 2, 3]));
		expect(chunks[0]?.totalSize).toBe(6);
		expect(chunks[1]?.data).toEqual(new Uint8Array([4, 5, 6]));
		expect(mockRepository.findById).toHaveBeenCalledWith("session-123");
		expect(mockAdapter.downloadFile).toHaveBeenCalledWith(
			"session-123",
			"https://example.com/file.pdf",
			{ Accept: "*/*" },
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
			downloadFile: mock(async function* () {
				yield { data: new Uint8Array([1, 2, 3]) };
			}),
		} as unknown as PlaywrightAdapter;

		const useCase = new DownloadFileUseCase(mockRepository, mockAdapter);

		const generator = useCase.execute(
			"non-existent",
			"https://example.com",
			{},
		);

		await expect(generator.next()).rejects.toThrow(SessionNotFoundError);
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
			downloadFile: mock(async function* () {
				yield { data: new Uint8Array([1, 2, 3]) };
			}),
		} as unknown as PlaywrightAdapter;

		const useCase = new DownloadFileUseCase(mockRepository, mockAdapter);

		const generator = useCase.execute("session-123", "https://example.com", {});

		await expect(generator.next()).rejects.toThrow("Page not initialized");
	});
});
