# syntax=docker/dockerfile:1
FROM node:24-alpine AS deps
WORKDIR /app
RUN npm install -g bun
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

FROM deps AS build
WORKDIR /app
# Client-side (React island) fetches read this at build time via
# import.meta.env.PUBLIC_API_BASE_URL — must be supplied as a build
# arg, unlike server-only fetches which read process.env at runtime.
ARG PUBLIC_API_BASE_URL
ENV PUBLIC_API_BASE_URL=$PUBLIC_API_BASE_URL
COPY . .
RUN npm run build

FROM node:24-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=4321
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./package.json

EXPOSE 4321
CMD ["node", "dist/server/entry.mjs"]
