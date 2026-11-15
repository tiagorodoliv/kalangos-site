#!/bin/sh
# Publica o site (pasta public/) no servidor por rsync.
#
# Uso:
#   KALANGOS_SITE_DESTINO=root@servidor:/www/wwwroot/kalangos.org ./publicar.sh
#   (RSYNC_RSH="ssh -i ~/.ssh/chave" para escolher a chave SSH)
#
# Apaga no servidor o que saiu do site, mas nunca toca nas pastas que não são
# dele: /apt (repositório de atualizações do sistema), /download (ISOs) e
# /.well-known (certificado), nem nos arquivos do aaPanel (.user.ini).
set -eu

: "${KALANGOS_SITE_DESTINO:?defina KALANGOS_SITE_DESTINO (ex.: root@servidor:/www/wwwroot/kalangos.org)}"
cd "$(dirname "$0")"

rsync -rlptvz --delete --chmod=D755,F644 \
    --filter='P /apt/' --filter='P /download/' --filter='P /.well-known/' \
    --filter='P /.user.ini' --filter='P /.htaccess' \
    public/ "$KALANGOS_SITE_DESTINO/"
