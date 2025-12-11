import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-grpc";
import { GrpcInstrumentation } from "@opentelemetry/instrumentation-grpc";
import { NodeSDK } from "@opentelemetry/sdk-node";
import { BatchSpanProcessor } from "@opentelemetry/sdk-trace-node";

let sdk: NodeSDK | null = null;

/**
 * Initialize OpenTelemetry tracing
 */
export function initTracing(): void {
	const otlpEndpoint =
		process.env.OTEL_EXPORTER_OTLP_ENDPOINT || "http://localhost:4317";

	console.log(`Initializing OpenTelemetry with endpoint: ${otlpEndpoint}`);

	const traceExporter = new OTLPTraceExporter({
		url: otlpEndpoint,
	});

	sdk = new NodeSDK({
		serviceName: "playwright-grpc",
		traceExporter,
		spanProcessor: new BatchSpanProcessor(traceExporter),
		instrumentations: [
			new GrpcInstrumentation(),
			getNodeAutoInstrumentations({
				"@opentelemetry/instrumentation-fs": {
					enabled: false,
				},
				"@opentelemetry/instrumentation-grpc": {
					enabled: false, // We use explicit GrpcInstrumentation instead
				},
			}),
		],
	});

	sdk.start();
	console.log("OpenTelemetry tracing initialized successfully");
}

/**
 * Shutdown OpenTelemetry tracing
 */
export async function shutdownTracing(): Promise<void> {
	if (sdk) {
		console.log("Shutting down OpenTelemetry tracing...");
		await sdk.shutdown();
		console.log("OpenTelemetry tracing shut down successfully");
	}
}
