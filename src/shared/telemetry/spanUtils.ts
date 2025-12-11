import { type Span, SpanStatusCode } from "@opentelemetry/api";
import { BaseError } from "../errors";

/**
 * Records error information on a span
 */
export function recordSpanError(span: Span, error: unknown): void {
	span.setStatus({
		code: SpanStatusCode.ERROR,
		message: error instanceof Error ? error.message : String(error),
	});

	if (error instanceof Error) {
		span.recordException(error);
	}

	// Record additional context for BaseError
	if (error instanceof BaseError) {
		span.setAttribute("error.code", error.code);
		if (error.statusCode) {
			span.setAttribute("error.status_code", error.statusCode);
		}
	}
}

/**
 * Sets success status on a span
 */
export function setSpanSuccess(span: Span): void {
	span.setStatus({ code: SpanStatusCode.OK });
}
