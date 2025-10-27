import type { SessionRepository } from "../../domain/repositories/SessionRepository";
import type { PlaywrightAdapter } from "../../infrastructure/playwright/PlaywrightAdapter";
import { SessionNotFoundError } from "../../shared/errors";
import type { Cookie } from "../../shared/types";

/**
 * Use case for retrieving cookies from a session
 */
export class GetCookiesUseCase {
	constructor(
		private sessionRepository: SessionRepository,
		private playwrightAdapter: PlaywrightAdapter,
	) {}

	async execute(sessionId: string, url?: string): Promise<Cookie[]> {
		// Verify session exists
		const session = await this.sessionRepository.findById(sessionId);
		if (!session) {
			throw new SessionNotFoundError(sessionId);
		}

		// Retrieve cookies
		return await this.playwrightAdapter.getCookies(sessionId, url);
	}
}
