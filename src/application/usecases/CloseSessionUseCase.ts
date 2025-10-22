import type { SessionRepository } from "../../domain/repositories/SessionRepository";
import type { PlaywrightAdapter } from "../../infrastructure/playwright/PlaywrightAdapter";
import { SessionNotFoundError } from "../../shared/errors";

/**
 * Use case for closing a session
 */
export class CloseSessionUseCase {
	constructor(
		private sessionRepository: SessionRepository,
		private playwrightAdapter: PlaywrightAdapter,
	) {}

	async execute(sessionId: string): Promise<boolean> {
		// Verify session exists
		const session = await this.sessionRepository.findById(sessionId);
		if (!session) {
			throw new SessionNotFoundError(sessionId);
		}

		// Close browser context
		const success = await this.playwrightAdapter.closeContext(sessionId);

		// Delete session from repository
		if (success) {
			await this.sessionRepository.delete(sessionId);
		}

		return success;
	}
}
