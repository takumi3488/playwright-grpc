import { describe, expect, it } from "bun:test";
import { Session } from "./Session";

describe("Session", () => {
	describe("constructor", () => {
		it("should create a session with required properties", () => {
			const session = new Session(
				"session-123",
				{ cookie1: "value1" },
				{ "User-Agent": "test" },
			);

			expect(session.id).toBe("session-123");
			expect(session.cookies).toEqual({ cookie1: "value1" });
			expect(session.defaultHeaders).toEqual({ "User-Agent": "test" });
			expect(session.pageId).toBeUndefined();
		});

		it("should create a session with pageId", () => {
			const session = new Session(
				"session-123",
				{ cookie1: "value1" },
				{ "User-Agent": "test" },
				"page-456",
			);

			expect(session.id).toBe("session-123");
			expect(session.pageId).toBe("page-456");
		});
	});

	describe("withPage", () => {
		it("should return a new session with updated pageId", () => {
			const originalSession = new Session(
				"session-123",
				{ cookie1: "value1" },
				{ "User-Agent": "test" },
			);

			const updatedSession = originalSession.withPage("page-456");

			expect(updatedSession).not.toBe(originalSession);
			expect(updatedSession.id).toBe("session-123");
			expect(updatedSession.cookies).toEqual({ cookie1: "value1" });
			expect(updatedSession.defaultHeaders).toEqual({ "User-Agent": "test" });
			expect(updatedSession.pageId).toBe("page-456");
		});

		it("should not mutate the original session", () => {
			const originalSession = new Session(
				"session-123",
				{ cookie1: "value1" },
				{ "User-Agent": "test" },
			);

			originalSession.withPage("page-456");

			expect(originalSession.pageId).toBeUndefined();
		});
	});

	describe("hasPage", () => {
		it("should return false when pageId is undefined", () => {
			const session = new Session(
				"session-123",
				{ cookie1: "value1" },
				{ "User-Agent": "test" },
			);

			expect(session.hasPage()).toBe(false);
		});

		it("should return true when pageId is set", () => {
			const session = new Session(
				"session-123",
				{ cookie1: "value1" },
				{ "User-Agent": "test" },
				"page-456",
			);

			expect(session.hasPage()).toBe(true);
		});
	});
});
