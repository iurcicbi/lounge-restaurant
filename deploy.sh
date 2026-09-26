#!/usr/bin/env bash
# Deploy di noir.salonix.xyz (Noir Lounge)
# Uso: bash /root/noir-lounge/deploy.sh [deploy|seed|seed-force|renew|backup|logs]
set -euo pipefail
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

CERTBOT_DIR=/root/ivi-trasporti-frontend/deploy/certbot
NGINX_CONTAINER=ivi-trasporti-frontend-nginx-1

MODE="${1:-deploy}"

case "$MODE" in
  deploy)
    docker compose up -d --build
    docker compose ps
    ;;
  seed)
    # Non sovrascrive l'account staff esistente, ma riallinea il menu ai contenuti del repo.
    docker compose run --rm app npm run db:seed
    ;;
  seed-force)
    # Sovrascrive anche la password dello staff: usa SEED_ADMIN_PASSWORD_HASH aggiornato in .env.production.
    docker compose run --rm app npm run db:seed -- --force
    ;;
  renew)
    docker run --rm \
      -v "$CERTBOT_DIR/etc:/etc/letsencrypt" \
      -v "$CERTBOT_DIR/www:/var/www/certbot" \
      certbot/certbot renew --quiet
    docker restart "$NGINX_CONTAINER"
    ;;
  backup)
    TS=$(date +%Y%m%d-%H%M)
    mkdir -p "$ROOT_DIR/backups"
    docker compose exec -T mongo mongodump --quiet --db noir-lounge --archive --gzip \
      > "$ROOT_DIR/backups/noir-lounge-$TS.archive.gz"
    chmod 600 "$ROOT_DIR/backups/noir-lounge-$TS.archive.gz"
    find "$ROOT_DIR/backups" -name 'noir-lounge-*.archive.gz' -mtime +14 -delete
    echo "Backup salvato: backups/noir-lounge-$TS.archive.gz"
    ;;
  logs)
    docker compose logs -f --tail 100 app
    ;;
  *)
    echo "Uso: bash deploy.sh [deploy|seed|seed-force|renew|backup|logs]" >&2
    exit 1
    ;;
esac
