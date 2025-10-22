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

# Linting
bun run lint          # Check for issues
bun run lint:fix      # Auto-fix issues
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

4. **Presentation Layer** (`src/presentation/`)
   - Contains gRPC controllers and generated code from proto files
   - Depends on Application Layer for use cases

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
1. Run `bun run lint` to check for code style and quality issues
2. Use `bun run lint:fix` to automatically fix issues when possible
3. Update this `CLAUDE.md` file if you introduce new architectural patterns, commands, or conventions that future instances should know about

## Protocol Buffers

Proto files should be placed in `proto/` directory. Generated TypeScript code goes to `src/presentation/grpc/generated/`.

## Core Dependencies

- **playwright**: Browser automation
- **@grpc/grpc-js**: gRPC implementation

Keep external dependencies minimal to maintain a lightweight footprint.
