# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A gRPC server with embedded Playwright that enables remote control of Playwright operations from other applications via gRPC methods. The project follows Clean Architecture principles with strict layer separation.

## Development Commands

This project uses Bun as the runtime.

```bash
# Run the application
bun run src/index.ts

# Install dependencies
bun install

# Testing
bun test              # Run all tests
bun test:watch        # Run tests in watch mode
bun test:coverage     # Run tests with coverage

# Linting
bun run lint          # Check for issues
bun run lint:fix      # Auto-fix issues

# Protocol Buffers
bun run proto:generate # Generate TypeScript type definitions from proto files
```

## Architecture Layers

The codebase follows Clean Architecture with these layers (from innermost to outermost):

1. **Domain Layer** (`src/domain/`)
   - Contains entities, repository interfaces (ports), and domain services
   - **Must not** depend on any other layers
   - Pure business logic with no framework dependencies

2. **Application Layer** (`src/application/`)
   - Contains use cases and application interfaces (ports)
   - **May only** depend on Domain Layer

3. **Infrastructure Layer** (`src/infrastructure/`)
   - Contains Playwright adapters and repository implementations
   - Implements interfaces defined in Domain/Application layers
   - Contains gRPC type definitions generated from proto files (`src/infrastructure/grpc/generated/`)

4. **Presentation Layer** (`src/presentation/`)
   - Contains gRPC controllers and request handlers
   - Depends on Application Layer for use cases
   - Uses type definitions from Infrastructure Layer

5. **Shared Layer** (`src/shared/`)
   - Common types, errors, and utilities
   - Can be used by any layer

**Critical Rule**: Dependencies flow inward only. Outer layers depend on inner layers, never the reverse.

## Code Style

- **Indentation**: Tabs (enforced by Biome)
- **Quotes**: Double quotes
- **TypeScript**: Strict mode enabled
- **Module System**: ESNext with bundler resolution
- Import organization is automated via Biome

## Development Workflow

**After making code changes:**
1. Run `bun test` to execute all unit tests
2. Run `bun run lint` to check for code style and quality issues
3. Use `bun run lint:fix` to automatically fix issues when possible
4. Update this `CLAUDE.md` file if you introduce new architectural patterns, commands, or conventions that future instances should know about

## Testing

The project includes comprehensive unit tests for all layers:

- **Domain Layer**: Entity behavior tests
- **Infrastructure Layer**: Repository and adapter tests
- **Application Layer**: Use case tests with mocked dependencies
- **Presentation Layer**: Controller tests with mocked use cases

Test files are located next to their implementation files with a `.test.ts` extension.

## Protocol Buffers

- **Proto files**: Place in `proto/` directory
- **Generated type definitions**: Auto-generated to `src/infrastructure/grpc/generated/` via `bun run proto:generate`
- **Approach**: Uses `@grpc/proto-loader` for dynamic proto loading at runtime with `proto-loader-gen-types` for TypeScript type definitions

## gRPC API Usage Flow

The typical usage flow for the Browser Proxy Service:

```
CreateSession → Creates a BrowserContext with cookies and headers
     ↓
NavigatePage → Creates a page if not exists & navigates to URL with page.goto()
     ↓
FetchHttp / DownloadFile → Performs operations on the page
     ↓
CloseSession → Destroys the BrowserContext
```

**Key Design Principle**: One session (BrowserContext) has one page. The page is created on the first `NavigatePage` call and reused for subsequent operations within the same session.

## Core Dependencies

- **playwright**: Browser automation
- **@grpc/grpc-js**: gRPC server/client implementation
- **@grpc/proto-loader**: Dynamic proto file loading with type generation support

Keep external dependencies minimal to maintain a lightweight footprint.
