import * as grpc from "@grpc/grpc-js";
import type { HealthCheckRequest__Output } from "../../../infrastructure/grpc/generated/grpc/health/v1/HealthCheckRequest";
import type { HealthCheckResponse } from "../../../infrastructure/grpc/generated/grpc/health/v1/HealthCheckResponse";
import { _grpc_health_v1_HealthCheckResponse_ServingStatus } from "../../../infrastructure/grpc/generated/grpc/health/v1/HealthCheckResponse";

/**
 * gRPC controller for Health Check service
 * Implements the standard gRPC Health Checking Protocol
 * See: https://github.com/grpc/grpc/blob/master/doc/health-checking.md
 */
export class HealthController {
	/**
	 * Check the health status of a service
	 * Returns SERVING for all services
	 */
	Check: grpc.handleUnaryCall<HealthCheckRequest__Output, HealthCheckResponse> =
		async (_call, callback) => {
			try {
				// For simplicity, we return SERVING for all services
				// In a more complex application, you might check specific services
				const response: HealthCheckResponse = {
					status: _grpc_health_v1_HealthCheckResponse_ServingStatus.SERVING,
				};

				callback(null, response);
			} catch (error) {
				callback({
					code: grpc.status.INTERNAL,
					message: error instanceof Error ? error.message : "Unknown error",
				});
			}
		};

	/**
	 * Watch for changes in the health status
	 * Currently returns a single SERVING status and ends the stream
	 */
	Watch: grpc.handleServerStreamingCall<
		HealthCheckRequest__Output,
		HealthCheckResponse
	> = async (call) => {
		try {
			// Send initial status
			const response: HealthCheckResponse = {
				status: _grpc_health_v1_HealthCheckResponse_ServingStatus.SERVING,
			};

			call.write(response);

			// For simplicity, we end the stream immediately
			// In a real implementation, you might keep the stream open
			// and send updates when the health status changes
			call.end();
		} catch (error) {
			call.destroy({
				code: grpc.status.INTERNAL,
				message: error instanceof Error ? error.message : "Unknown error",
			});
		}
	};
}
