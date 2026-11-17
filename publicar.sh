#!/bin/sh
# Publica o site (pasta public/) no servidor por rsync.
#
# Uso:
#   KALANGOS_SITE_DESTINO=root@servidor:/www/wwwroot/kalangos.org ./publicar.sh
#   (RSYNC_RSH="ssh -i ~/.ssh/chave" para escolher a chave SSH)
#   (KALANGOS_SITE_SIMULAR=1 para só listar o que mudaria, sem enviar nada)
#
# Funciona no Linux (rsync GNU) e no macOS (openrsync, o rsync que vem no
# sistema). O openrsync não tem --chmod. Por isso as permissões (pastas 755,
# arquivos 644) são aplicadas numa cópia temporária de public/, enviada com
# -p. O resultado no servidor é o mesmo nos dois sistemas e não depende do
# umask de quem publica.
#
# Apaga no servidor o que saiu do site, mas nunca toca nas pastas que não são
# dele: /apt (repositório de atualizações do sistema), /download (ISOs) e
# /.well-known (certificado), nem nos arquivos do aaPanel (.user.ini).
set -eu

: "${KALANGOS_SITE_DESTINO:?defina KALANGOS_SITE_DESTINO (ex.: root@servidor:/www/wwwroot/kalangos.org)}"
cd "$(dirname "$0")"

# Cópia temporária com as permissões finais; apagada ao sair, mesmo com erro.
# cp -p guarda as datas de modificação, assim o rsync continua enviando só o
# que mudou.
copia=$(mktemp -d "${TMPDIR:-/tmp}/kalangos-site.XXXXXX")
trap 'rm -rf "$copia"' EXIT INT TERM
cp -Rp public/. "$copia/"
find "$copia" -type d -exec chmod 755 {} +
find "$copia" -type f -exec chmod 644 {} +

simular=
[ "${KALANGOS_SITE_SIMULAR:-}" = 1 ] && simular=-n

rsync -rlptvz $simular --delete \
    --filter='P /apt/' --filter='P /download/' --filter='P /.well-known/' \
    --filter='P /.user.ini' --filter='P /.htaccess' \
    "$copia/" "$KALANGOS_SITE_DESTINO/"
