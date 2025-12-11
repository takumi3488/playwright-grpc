import { DiagConsoleLogger, DiagLogLevel, diag } from "@opentelemetry/api";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { NodeSDK } from "@opentelemetry/sdk-node";

// Enable diagnostic logging
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);

const otlpEndpoint =
	process.env.OTEL_EXPORTER_OTLP_ENDPOINT || "http://localhost:4318";

console.log(`Initializing OpenTelemetry with endpoint: ${otlpEndpoint}`);

const traceExporter = new OTLPTraceExporter({
	url: `${otlpEndpoint}/v1/traces`,
});

const sdk = new NodeSDK({
	serviceName: "playwright-grpc",
	traceExporter,
	instrumentations: [
		getNodeAutoInstrumentations({
			"@opentelemetry/instrumentation-fs": {
				enabled: false,
			},
		}),
	],
});

sdk.start();
console.log("OpenTelemetry tracing initialized successfully");

// Graceful shutdown
process.on("SIGTERM", () => {
	sdk
		.shutdown()
		.then(() => console.log("Tracing terminated"))
		.catch((error) => console.log("Error terminating tracing", error))
		.finally(() => process.exit(0));
});

export default sdk;
