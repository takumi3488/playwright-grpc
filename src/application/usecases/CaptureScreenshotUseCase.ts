import type { SessionRepository } from "../../domain/repositories/SessionRepository";
import type { PlaywrightAdapter } from "../../infrastructure/playwright/PlaywrightAdapter";
import { SessionNotFoundError } from "../../shared/errors";
import type { ScreenshotResult } from "../../shared/types";

/**
 * Use case for capturing a screenshot
 */
export class CaptureScreenshotUseCase {
	constructor(
		private sessionRepository: SessionRepository,
		private playwrightAdapter: PlaywrightAdapter,
	) {}

	async execute(
		sessionId: string,
		selector?: string,
		fullPage?: boolean,
	): Promise<ScreenshotResult> {
		// Verify session exists
		const session = await this.sessionRepository.findById(sessionId);
		if (!session) {
			throw new SessionNotFoundError(sessionId);
		}

		// Capture screenshot
		const result = await this.playwrightAdapter.captureScreenshot(
			sessionId,
			selector,
			fullPage,
		);

		return result;
	}
}
