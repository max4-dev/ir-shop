# Deployment

## Requirements

- Ubuntu 24.04 VPS
- DNS A-records: `site.ru`, `api.site.ru`, `admin.site.ru`
- Docker, Docker Compose, Nginx, Certbot

## Environment

Three env files, no root `.env`:

| File | Scope |
|---|---|
| `api/.env` | Backend, PostgreSQL, Redis |
| `client/.env` | Frontend build and runtime |
| `admin/.env` | Admin build |

```bash
cp api/.env.example api/.env
cp client/.env.example client/.env
cp admin/.env.example admin/.env
```

Variable reference: [ENV_VARIABLES.md](./ENV_VARIABLES.md).

Production URLs must use `https://`. Run compose via `./scripts/docker-compose.sh` or `./deploy.sh`.

## Deploy

```bash
chmod +x deploy.sh backup-db.sh scripts/docker-compose.sh
./deploy.sh
```

Build order: backend → infra → frontend → full stack.

Verify:

```bash
./scripts/docker-compose.sh ps
curl -f http://127.0.0.1:4444/api/health
curl -I http://127.0.0.1:3000
curl -I http://127.0.0.1:8080/health
```

## Nginx + SSL

HTTP bootstrap:

```bash
sudo cp deploy/nginx/ir-shop.init.conf /etc/nginx/sites-available/ir-shop.conf
sudo ln -sf /etc/nginx/sites-available/ir-shop.conf /etc/nginx/sites-enabled/ir-shop.conf
sudo rm -f /etc/nginx/sites-enabled/default
sudo sed -i 's/site\.ru/your-domain.ru/g' /etc/nginx/sites-available/ir-shop.conf
sudo mkdir -p /var/www/certbot
sudo nginx -t && sudo systemctl reload nginx
```

Certificates:

```bash
sudo certbot certonly --webroot \
  -w /var/www/certbot \
  -d site.ru -d api.site.ru -d admin.site.ru
```

Production config:

```bash
sudo cp deploy/nginx/ir-shop.conf /etc/nginx/sites-available/ir-shop.conf
sudo sed -i 's/site\.ru/your-domain.ru/g' /etc/nginx/sites-available/ir-shop.conf
sudo nginx -t && sudo systemctl reload nginx
```

Renewal hook:

```bash
echo 'deploy-hook = systemctl reload nginx' | sudo tee -a /etc/letsencrypt/cli.ini
```

## Updates

```bash
git pull
./deploy.sh
```

Backend only:

```bash
./scripts/docker-compose.sh build backend
./scripts/docker-compose.sh up -d backend
```

Frontend/admin (backend must be healthy):

```bash
./scripts/docker-compose.sh up -d postgres redis backend
./scripts/docker-compose.sh build frontend admin
./scripts/docker-compose.sh up -d
```

## Logs

```bash
./scripts/docker-compose.sh logs -f backend
./scripts/docker-compose.sh logs --tail=100 backend
```

## Backup

```bash
./backup-db.sh
```

Cron:

```bash
0 3 * * * /opt/ir-shop/backup-db.sh >> /var/log/ir-shop-backup.log 2>&1
```

## Restore

```bash
set -a && source api/.env && set +a

./scripts/docker-compose.sh stop backend
gunzip -c backups/irshop_YYYYMMDD_HHMMSS.sql.gz | \
  ./scripts/docker-compose.sh exec -T postgres psql -U "$POSTGRES_USER" -d "$POSTGRES_DB"
./scripts/docker-compose.sh start backend
```

## Operations

```bash
set -a && source api/.env && set +a

./scripts/docker-compose.sh restart backend
docker inspect --format='{{.State.Health.Status}}' ir-shop-backend
./scripts/docker-compose.sh exec postgres psql -U "$POSTGRES_USER" -d "$POSTGRES_DB"
./scripts/docker-compose.sh exec redis redis-cli -a "$REDIS_PASSWORD"
```
