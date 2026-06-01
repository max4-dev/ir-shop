FROM node:20-alpine AS deps

WORKDIR /app

COPY package.json package-lock.json .npmrc ./
RUN npm ci

FROM node:20-alpine AS build

WORKDIR /app

ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_S3_HOST
ARG NEXT_PUBLIC_YANDEX_METRIKA_ID
ARG SENTRY_AUTH_TOKEN
ARG API_URL

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_S3_HOST=$NEXT_PUBLIC_S3_HOST
ENV NEXT_PUBLIC_YANDEX_METRIKA_ID=$NEXT_PUBLIC_YANDEX_METRIKA_ID
ENV SENTRY_AUTH_TOKEN=$SENTRY_AUTH_TOKEN
ENV API_URL=$API_URL
ENV NEXT_TELEMETRY_DISABLED=1
ENV CI=true

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

FROM node:20-alpine AS production

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

COPY --from=build /app/public ./public
COPY --from=build --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
