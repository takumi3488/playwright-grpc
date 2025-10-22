import { describe, expect, it } from "bun:test";
import { Session } from "../../domain/entities/Session";
import { InMemorySessionRepository } from "./InMemorySessionRepository";

describe("InMemorySessionRepository", () => {
	describe("save", () => {
		it("should save a session", async () => {
			const repository = new InMemorySessionRepository();
			const session = new Session(
				"session-123",
				{ cookie1: "value1" },
				{ "User-Agent": "test" },
			);

			await repository.save(session);

			const found = await repository.findById("session-123");
			expect(found).toEqual(session);
		});

		it("should overwrite an existing session", async () => {
			const repository = new InMemorySessionRepository();
			const session1 = new Session(
				"session-123",
				{ cookie1: "value1" },
				{ "User-Agent": "test" },
			);
			const session2 = new Session(
				"session-123",
				{ cookie2: "value2" },
				{ "User-Agent": "test2" },
			);

			await repository.save(session1);
			await repository.save(session2);

			const found = await repository.findById("session-123");
			expect(found).toEqual(session2);
		});
	});

	describe("findById", () => {
		it("should return a session if it exists", async () => {
			const repository = new InMemorySessionRepository();
			const session = new Session(
				"session-123",
				{ cookie1: "value1" },
				{ "User-Agent": "test" },
			);

			await repository.save(session);
			const found = await repository.findById("session-123");

			expect(found).toEqual(session);
		});

		it("should return null if session does not exist", async () => {
			const repository = new InMemorySessionRepository();

			const found = await repository.findById("non-existent");

			expect(found).toBeNull();
		});
	});

	describe("delete", () => {
		it("should delete an existing session", async () => {
			const repository = new InMemorySessionRepository();
			const session = new Session(
				"session-123",
				{ cookie1: "value1" },
				{ "User-Agent": "test" },
			);

			await repository.save(session);
			await repository.delete("session-123");

			const found = await repository.findById("session-123");
			expect(found).toBeNull();
		});

		it("should not throw error when deleting non-existent session", async () => {
			const repository = new InMemorySessionRepository();

			await expect(repository.delete("non-existent")).resolves.toBeUndefined();
		});
	});

	describe("exists", () => {
		it("should return true if session exists", async () => {
			const repository = new InMemorySessionRepository();
			const session = new Session(
				"session-123",
				{ cookie1: "value1" },
				{ "User-Agent": "test" },
			);

			await repository.save(session);
			const exists = await repository.exists("session-123");

			expect(exists).toBe(true);
		});

		it("should return false if session does not exist", async () => {
			const repository = new InMemorySessionRepository();

			const exists = await repository.exists("non-existent");

			expect(exists).toBe(false);
		});
	});
});
