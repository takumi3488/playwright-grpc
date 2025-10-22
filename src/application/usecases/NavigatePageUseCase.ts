import type { SessionRepository } from "../../domain/repositories/SessionRepository";
import type { PlaywrightAdapter } from "../../infrastructure/playwright/PlaywrightAdapter";
import { SessionNotFoundError } from "../../shared/errors";
import type { NavigationResult } from "../../shared/types";

/**
 * Use case for navigating to a URL
 */
export class NavigatePageUseCase {
	constructor(
		private sessionRepository: SessionRepository,
		private playwrightAdapter: PlaywrightAdapter,
	) {}

	async execute(sessionId: string, url: string): Promise<NavigationResult> {
		// Verify session exists
		const session = await this.sessionRepository.findById(sessionId);
		if (!session) {
			throw new SessionNotFoundError(sessionId);
		}

		// Navigate page (creates page if not exists)
		const result = await this.playwrightAdapter.navigatePage(sessionId, url);

		// Update session with page ID
		const updatedSession = session.withPage(result.pageId);
		await this.sessionRepository.save(updatedSession);

		return result;
	}
}
