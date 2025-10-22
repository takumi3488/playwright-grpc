import type { SessionRepository } from "../../domain/repositories/SessionRepository";
import type { PlaywrightAdapter } from "../../infrastructure/playwright/PlaywrightAdapter";
import { SessionNotFoundError } from "../../shared/errors";
import type { Headers, HttpResponse } from "../../shared/types";

/**
 * Use case for fetching HTTP content
 */
export class FetchHttpUseCase {
	constructor(
		private sessionRepository: SessionRepository,
		private playwrightAdapter: PlaywrightAdapter,
	) {}

	async execute(
		sessionId: string,
		url: string,
		headers: Headers,
	): Promise<HttpResponse> {
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

		// Fetch HTTP content
		return await this.playwrightAdapter.fetchHttp(sessionId, url, headers);
	}
}
