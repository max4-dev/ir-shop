# Environment Variables

| File | Scope |
|---|---|
| `api/.env` | Backend, PostgreSQL, Redis |
| `client/.env` | Frontend |
| `admin/.env` | Admin |

Compose: `./scripts/docker-compose.sh`

## api/.env

| Variable | Required | Description |
|---|---|---|
| `NODE_ENV` | yes | `production` |
| `APP_PORT` | no | Default: `4444` |
| `API_PREFIX` | no | Default: `api` |
| `BACKEND_PORT` | no | Host port, default: `4444` |
| `POSTGRES_PORT` | no | Host port, default: `5432` |
| `DOMAIN` | yes | Frontend domain |
| `API_DOMAIN` | yes | API domain |
| `ADMIN_DOMAIN` | yes | Admin domain |
| `CLIENT_URL` | yes | CORS origin |
| `ADMIN_URL` | yes | CORS origin |
| `POSTGRES_USER` | yes | |
| `POSTGRES_PASSWORD` | yes | |
| `POSTGRES_DB` | yes | |
| `DATABASE_URL` | yes | Local dev only; Docker uses `POSTGRES_*` |
| `JWT_SECRET` | yes | Min 32 chars |
| `REDIS_HOST` | yes | `redis` in Docker |
| `REDIS_PORT` | no | Default: `6379` |
| `REDIS_PASSWORD` | yes | Min 16 chars |
| `S3_ACCESS_KEY_ID` | yes | Yandex Object Storage |
| `S3_SECRET_ACCESS_KEY` | yes | |
| `S3_BUCKET_NAME` | yes | |
| `YOOKASSA_SHOP_ID` | yes | |
| `YOOKASSA_SECRET_KEY` | yes | |
| `YOOKASSA_RETURN_URL` | yes | |
| `SMTP_*`, `MAIL_*` | yes | |
| `EMAIL_TOKEN_TTL_*` | no | |

## client/.env

| Variable | Required | Description |
|---|---|---|
| `FRONTEND_PORT` | no | Default: `3000` |
| `NEXT_PUBLIC_API_URL` | yes | Public API URL (build-time) |
| `NEXT_PUBLIC_S3_HOST` | yes | Image CDN host |
| `API_URL` | yes | Server-side API URL (build + runtime) |
| `SENTRY_AUTH_TOKEN` | no | |

## admin/.env

| Variable | Required | Description |
|---|---|---|
| `ADMIN_PORT` | no | Default: `8080` |
| `VITE_API_URL` | yes | Public API URL (build-time) |
