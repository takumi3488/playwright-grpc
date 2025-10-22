import { randomUUID } from "node:crypto";
import { Session } from "../../domain/entities/Session";
import type { SessionRepository } from "../../domain/repositories/SessionRepository";
import type { PlaywrightAdapter } from "../../infrastructure/playwright/PlaywrightAdapter";
import type { Cookies, Headers } from "../../shared/types";

/**
 * Use case for creating a new browser session
 */
export class CreateSessionUseCase {
	constructor(
		private sessionRepository: SessionRepository,
		private playwrightAdapter: PlaywrightAdapter,
	) {}

	async execute(cookies: Cookies, defaultHeaders: Headers): Promise<string> {
		// Generate unique session ID
		const sessionId = randomUUID();

		// Create browser context in Playwright
		await this.playwrightAdapter.createContext(
			sessionId,
			cookies,
			defaultHeaders,
		);

		// Create and save session entity
		const session = new Session(sessionId, cookies, defaultHeaders);
		await this.sessionRepository.save(session);

		return sessionId;
	}
}
