FROM node:24.6.0-alpine3.22 as builder
WORKDIR /app/
COPY ./server/package*.json ./
RUN npm ci
COPY ./server/ ./
RUN npm run build

FROM node:24.6.0-alpine3.22 as server
WORKDIR /app/
COPY ./server/package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/dist/ ./dist/
ENTRYPOINT npm run start
