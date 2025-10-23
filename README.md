# playwright-grpc

A gRPC server with embedded Playwright that enables remote control of Playwright operations from other applications via gRPC methods.

## Overview

This application provides a gRPC-based interface to Playwright, allowing you to orchestrate browser automation tasks remotely. It exposes Playwright's functionality through gRPC endpoints, making it easy to integrate browser automation into distributed systems or applications written in different programming languages.

## Architecture

This project follows Clean Architecture principles, ensuring separation of concerns and maintainability through clearly defined layers. The architecture promotes independence from frameworks and external dependencies, making the codebase testable and flexible.

### External Dependencies

The application relies on only two core external dependencies:

- **playwright** - Browser automation library providing cross-browser testing and automation capabilities
- **@grpc/grpc-js** - Pure JavaScript implementation of gRPC for building high-performance RPC services

By minimizing external dependencies, we maintain a lightweight footprint while ensuring the system remains focused on its core responsibility: providing a reliable gRPC interface to Playwright operations.

### Directory Structure

The project follows a layered architecture approach, organizing code by architectural concerns:

```
proto/                    # Protocol Buffers definitions (API contract)
└── playwright.proto      # gRPC service definitions

src/
├── domain/               # Domain Layer (innermost)
│   ├── entities/         # Business entities and domain models
│   ├── repositories/     # Repository interfaces (ports)
│   └── services/         # Domain services with business logic
│
├── application/          # Application Layer
│   ├── usecases/         # Use case implementations (business rules)
│   └── interfaces/       # Application interfaces (ports)
│
├── infrastructure/       # Infrastructure Layer
│   ├── playwright/       # Playwright adapter implementation
│   └── repositories/     # Repository implementations (adapters)
│
├── presentation/         # Presentation Layer (outermost)
│   └── grpc/
│       ├── controllers/  # gRPC request handlers
│       └── generated/    # Auto-generated code from proto files
│
└── shared/               # Shared Layer
    ├── types/            # Common type definitions
    ├── errors/           # Error classes and definitions
    └── utils/            # Utility functions and helpers
```

**Layer Dependencies:**
- **Domain Layer**: No dependencies on other layers (pure business logic)
- **Application Layer**: Depends only on Domain Layer
- **Infrastructure Layer**: Implements interfaces defined in Domain/Application layers
- **Presentation Layer**: Depends on Application Layer for use cases
- **Shared Layer**: Can be used by any layer for common utilities

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) runtime
- [Docker](https://www.docker.com/) and Docker Compose (for containerized setup)
- [runn](https://github.com/k1LoW/runn) (for E2E testing)

### Installation

```bash
# Install dependencies
bun install

# Generate TypeScript types from proto files
bun run proto:generate
```

### Configuration

The application can be configured using the following environment variables:

| Environment Variable | Description | Default Value |
|---------------------|-------------|---------------|
| `PORT` | gRPC server port number | `50051` |
| `HOST` | gRPC server host address | `0.0.0.0` |
| `SHUTDOWN_TIMEOUT_MS` | Graceful shutdown timeout in milliseconds | `30000` |

**Example:**

```bash
# Set custom port and shutdown timeout
export PORT=8080
export SHUTDOWN_TIMEOUT_MS=60000
bun run start
```

### Running the Application

#### Local Development

```bash
# Run the gRPC server locally
bun run start
```

The server will start on `localhost:50051` by default.

#### Docker Compose

```bash
# Build and start all services (playwright-grpc + Jaeger)
docker compose up --build

# Stop services
docker compose down
```

Services:
- **playwright-grpc**: gRPC server on port 50051
- **Jaeger UI**: Tracing UI on http://localhost:16686

### Testing

#### Unit Tests

```bash
# Run all unit tests
bun test

# Run tests in watch mode
bun test:watch

# Run tests with coverage
bun test:coverage
```

#### E2E Tests

E2E tests are defined using [runn](https://github.com/k1LoW/runn), a tool for running scenario-based tests.

```bash
# Start the services with Docker Compose
docker compose up -d

# Wait for services to be healthy
docker compose ps

# Run E2E tests
runn run e2e.runbook.yml

# Stop services
docker compose down
```

The E2E test covers the typical usage flow:
1. Create a browser session with cookies and headers
2. Navigate to a page (example.com)
3. Fetch HTTP content
4. Close the session

### Code Quality

```bash
# Check code style and quality
bun run lint

# Auto-fix issues
bun run lint:fix
```
