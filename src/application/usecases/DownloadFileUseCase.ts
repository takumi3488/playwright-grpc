import type { SessionRepository } from "../../domain/repositories/SessionRepository";
import type { PlaywrightAdapter } from "../../infrastructure/playwright/PlaywrightAdapter";
import { SessionNotFoundError } from "../../shared/errors";
import type { Headers } from "../../shared/types";

/**
 * Use case for downloading files
 */
export class DownloadFileUseCase {
	constructor(
		private sessionRepository: SessionRepository,
		private playwrightAdapter: PlaywrightAdapter,
	) {}

	async *execute(
		sessionId: string,
		url: string,
		headers: Headers,
	): AsyncGenerator<{ data: Uint8Array; totalSize?: number }> {
		// Verify session exists
		const session = await this.sessionRepository.findById(sessionId);
		if (!session) {
			throw new SessionNotFoundError(sessionId);
		}

		// Verify page exists in session
		if (!session.hasPage()) {
			throw new Error(
				"Page not initialized. Call NavigatePage first to create a page.",
			);
		}

		// Download file and stream chunks
		yield* this.playwrightAdapter.downloadFile(sessionId, url, headers);
	}
}
