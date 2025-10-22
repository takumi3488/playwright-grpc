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
