# syntax=docker/dockerfile:1

FROM node:22-bookworm-slim AS build

WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# NEXT_PUBLIC_* viene inlinata in fase di build: va passata come build arg.
ARG NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}

RUN npm run build

FROM node:22-bookworm-slim AS runner

WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1

# Copia completa: sorgenti e devDependency servono per eseguire db:seed nel container.
COPY --from=build --chown=node:node /app /app

USER node

EXPOSE 3000

CMD ["npm", "run", "start"]
