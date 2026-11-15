# kalangos.org

Site do [KalangOS](https://github.com/tiagorodoliv/kalango_os): HTML e CSS estáticos, sem
etapa de build, em inglês (`public/index.html`) e português (`public/pt/index.html`).

## Ver na sua máquina

```sh
python3 -m http.server 8000 --directory public
# abra http://localhost:8000
```

## Publicar

```sh
RSYNC_RSH="ssh -i ~/.ssh/SUA_CHAVE" \
KALANGOS_SITE_DESTINO=root@SEU_VPS:/www/wwwroot/kalangos.org \
    ./publicar.sh
```

O `publicar.sh` nunca apaga `/apt` (repositório de atualizações), `/download` nem `/.well-known`.

## Como está organizado

- Cores e fontes iguais às do sistema (`ui/theme.slint` do repositório principal).
- As capturas em `public/assets/img/*.webp` saem do `cargo run --example snapshot` do
  repositório principal (`target/snapshots/`), reduzidas para 1600 px de largura.
- Texto novo vai nas duas páginas. O inglês é a página principal.
- Doação (seção `#donate`): PIX com QR Code gerado por `tools/gerar_pix.py` (BR Code
  estático, sem valor; precisa do `segno`). Mudou a chave: rode de novo e troque o código
  nos dois `data-copy` das páginas.
- Sem rastreadores, cookies nem fontes de terceiros: tudo é servido daqui.

## Licença

- Código do site (HTML, CSS, JS): GPL-3.0-or-later, como o sistema.
- Textos e capturas de tela: CC BY-SA 4.0.
- Fontes: Inter e JetBrains Mono, SIL Open Font License (`public/assets/fonts/`).
- O nome **KalangOS** e o logotipo são marcas do projeto e não estão cobertos por essas
  licenças (veja o `TRADEMARKS.md` do repositório principal).
