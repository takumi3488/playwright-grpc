# Build stage
FROM oven/bun:1.3@sha256:9c5d3c92b234b4708198577d2f39aab7397a242a40da7c2f059e51b9dc62b408 AS builder
WORKDIR /app

# Copy package files
COPY package.json bun.lockb* ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source code
COPY src /app/src

# Runtime stage
FROM oven/bun:1.3@sha256:9c5d3c92b234b4708198577d2f39aab7397a242a40da7c2f059e51b9dc62b408
WORKDIR /app

# Copy built application
COPY --from=builder /app .

# Expose port (adjust as needed)
EXPOSE 3000

# Start the application
CMD ["bun", "run", "start"]
