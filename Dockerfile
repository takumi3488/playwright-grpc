# Build stage
FROM oven/bun:1.3@sha256:9c5d3c92b234b4708198577d2f39aab7397a242a40da7c2f059e51b9dc62b408 AS builder
WORKDIR /app

# Copy package files
COPY package.json bun.lockb* ./

# Install dependencies
RUN --mount=type=cache,target=/root/.bun/install/cache \
    bun install --frozen-lockfile

# Install Playwright browsers
RUN bunx --bun playwright install chromium --with-deps

# Copy proto files and generate types
COPY proto /app/proto
RUN bun run proto:generate

# Copy source code
COPY src /app/src

# Runtime stage
FROM oven/bun:1.3@sha256:9c5d3c92b234b4708198577d2f39aab7397a242a40da7c2f059e51b9dc62b408
WORKDIR /app

# Install Playwright system dependencies and grpc-health-probe
RUN --mount=type=cache,target=/var/cache/apt,sharing=locked \
    --mount=type=cache,target=/var/lib/apt/lists,sharing=locked \
    apt-get update && \
    apt-get install -y wget && \
    bunx --bun playwright install-deps chromium && \
    wget -qO/usr/local/bin/grpc_health_probe https://github.com/grpc-ecosystem/grpc-health-probe/releases/download/v0.4.37/grpc_health_probe-linux-amd64 && \
    chmod +x /usr/local/bin/grpc_health_probe

# Copy built application
COPY --from=builder /app .

# Copy Playwright browsers from builder
COPY --from=builder /root/.cache/ms-playwright /root/.cache/ms-playwright

# Expose gRPC port
EXPOSE 50051

# Start the application
CMD ["bun", "run", "start"]
