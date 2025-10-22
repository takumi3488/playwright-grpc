import { BaseError } from "./BaseError";

/**
 * Error thrown when a requested session is not found
 */
export class SessionNotFoundError extends BaseError {
	constructor(sessionId: string) {
		super(`Session not found: ${sessionId}`, "SESSION_NOT_FOUND", 404);
	}
}
