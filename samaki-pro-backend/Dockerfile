# Use the official oven/bun image as the base
FROM oven/bun:1 as base
WORKDIR /usr/src/app

# Install dependencies into a temp directory
# This caches them and speeds up builds
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lock* /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

# Install production dependencies only
RUN mkdir -p /temp/prod
COPY package.json bun.lock* /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

# Copy dependencies and project files to final image
FROM base AS final
# Assuming SQLite database resides in the prisma folder, you might mount a volume here for Render
# VOLUME /usr/src/app/prisma

COPY --from=install /temp/prod/node_modules node_modules
COPY . .

# Generate Prisma Client natively within the container
RUN bunx prisma generate

# Environment variables
ENV NODE_ENV=production
# Update this depending on Render's automatic assigned port
ENV PORT=3000

# Expose the application port
EXPOSE 3000

# Start Elysia backend server
CMD ["bun", "run", "start"]
