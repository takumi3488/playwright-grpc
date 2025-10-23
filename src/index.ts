import { resolve } from "node:path";
import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import {
	CloseSessionUseCase,
	CreateSessionUseCase,
	DownloadFileUseCase,
	FetchHttpUseCase,
	NavigatePageUseCase,
} from "./application/usecases";
import type { ProtoGrpcType } from "./infrastructure/grpc/generated/browser_proxy";
import { PlaywrightAdapter } from "./infrastructure/playwright";
import { InMemorySessionRepository } from "./infrastructure/repositories";
import {
	BrowserProxyController,
	HealthController,
} from "./presentation/grpc/controllers";

// Configuration
const BROWSER_PROXY_PROTO_PATH = resolve(
	import.meta.dir,
	"../proto/browser_proxy/v1/browser_proxy.proto",
);
const HEALTH_PROTO_PATH = resolve(
	import.meta.dir,
	"../proto/grpc/health/v1/health.proto",
);
const SERVER_PORT = process.env.PORT ?? "50051";
const SERVER_HOST = process.env.HOST ?? "0.0.0.0";

/**
 * Loads the proto file and returns the gRPC package definition
 */
function loadProtoDefinition(): ProtoGrpcType {
	const packageDefinition = protoLoader.loadSync(BROWSER_PROXY_PROTO_PATH, {
		keepCase: false,
		longs: String,
		enums: String,
		defaults: true,
		oneofs: true,
	});

	return grpc.loadPackageDefinition(
		packageDefinition,
	) as unknown as ProtoGrpcType;
}

/**
 * Loads the health proto file and returns the gRPC package definition
 */
function loadHealthProtoDefinition(): grpc.GrpcObject {
	const packageDefinition = protoLoader.loadSync(HEALTH_PROTO_PATH, {
		keepCase: false,
		longs: String,
		enums: String,
		defaults: true,
		oneofs: true,
	});

	return grpc.loadPackageDefinition(packageDefinition);
}

/**
 * Creates and configures the gRPC server
 */
function createServer(
	browserProxyController: BrowserProxyController,
	healthController: HealthController,
): grpc.Server {
	const server = new grpc.Server();
	const browserProxyProto = loadProtoDefinition();
	const healthProto = loadHealthProtoDefinition();

	// Register BrowserProxyService
	server.addService(
		browserProxyProto.browser_proxy.v1.BrowserProxyService.service,
		browserProxyController as unknown as grpc.UntypedServiceImplementation,
	);

	// Register Health Check Service
	// biome-ignore lint: accessing nested proto package
	const healthService = (healthProto.grpc as any).health.v1.Health.service;
	server.addService(
		healthService,
		healthController as unknown as grpc.UntypedServiceImplementation,
	);

	return server;
}

/**
 * Starts the gRPC server
 */
function startServer(server: grpc.Server): Promise<void> {
	return new Promise((resolve, reject) => {
		server.bindAsync(
			`${SERVER_HOST}:${SERVER_PORT}`,
			grpc.ServerCredentials.createInsecure(),
			(error, port) => {
				if (error) {
					reject(error);
					return;
				}

				console.log(`gRPC server running on ${SERVER_HOST}:${port}`);
				resolve();
			},
		);
	});
}

/**
 * Gracefully shuts down the server
 */
async function shutdown(
	server: grpc.Server,
	playwrightAdapter: PlaywrightAdapter,
): Promise<void> {
	console.log("\\nShutting down gracefully...");

	// Close all Playwright contexts
	await playwrightAdapter.closeAll();

	// Gracefully shutdown gRPC server
	return new Promise((resolve) => {
		server.tryShutdown(() => {
			console.log("Server shut down successfully");
			resolve();
		});
	});
}

/**
 * Main entry point
 */
async function main() {
	try {
		// Initialize dependencies (Dependency Injection)
		const sessionRepository = new InMemorySessionRepository();
		const playwrightAdapter = new PlaywrightAdapter();

		// Create use cases
		const createSessionUseCase = new CreateSessionUseCase(
			sessionRepository,
			playwrightAdapter,
		);
		const navigatePageUseCase = new NavigatePageUseCase(
			sessionRepository,
			playwrightAdapter,
		);
		const fetchHttpUseCase = new FetchHttpUseCase(
			sessionRepository,
			playwrightAdapter,
		);
		const downloadFileUseCase = new DownloadFileUseCase(
			sessionRepository,
			playwrightAdapter,
		);
		const closeSessionUseCase = new CloseSessionUseCase(
			sessionRepository,
			playwrightAdapter,
		);

		// Create controllers
		const browserProxyController = new BrowserProxyController(
			createSessionUseCase,
			navigatePageUseCase,
			fetchHttpUseCase,
			downloadFileUseCase,
			closeSessionUseCase,
		);
		const healthController = new HealthController();

		// Create and start server
		const server = createServer(browserProxyController, healthController);
		await startServer(server);

		// Setup graceful shutdown
		const shutdownHandler = async () => {
			await shutdown(server, playwrightAdapter);
			process.exit(0);
		};

		process.on("SIGINT", shutdownHandler);
		process.on("SIGTERM", shutdownHandler);
	} catch (error) {
		console.error("Failed to start server:", error);
		process.exit(1);
	}
}

// Start the application
main();
