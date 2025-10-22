import type { Session } from "../../domain/entities/Session";
import type { SessionRepository } from "../../domain/repositories/SessionRepository";

/**
 * In-memory implementation of SessionRepository
 * Stores sessions in memory using a Map
 */
export class InMemorySessionRepository implements SessionRepository {
	private sessions: Map<string, Session> = new Map();

	async save(session: Session): Promise<void> {
		this.sessions.set(session.id, session);
	}

	async findById(sessionId: string): Promise<Session | null> {
		return this.sessions.get(sessionId) ?? null;
	}

	async delete(sessionId: string): Promise<void> {
		this.sessions.delete(sessionId);
	}

	async exists(sessionId: string): Promise<boolean> {
		return this.sessions.has(sessionId);
	}
}
