import type { Session } from "../entities/Session";

/**
 * Repository interface for managing sessions (ports)
 * This interface defines the contract for session storage
 * Implementation details are handled in the Infrastructure layer
 */
export interface SessionRepository {
	/**
	 * Saves a session
	 */
	save(session: Session): Promise<void>;

	/**
	 * Finds a session by ID
	 * @returns Session if found, null otherwise
	 */
	findById(sessionId: string): Promise<Session | null>;

	/**
	 * Deletes a session by ID
	 */
	delete(sessionId: string): Promise<void>;

	/**
	 * Checks if a session exists
	 */
	exists(sessionId: string): Promise<boolean>;
}
