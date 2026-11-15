#!/usr/bin/env python3
"""Código PIX "copia e cola" (BR Code estático) e o QR Code da seção de doação.

Padrão EMV do Banco Central (Manual de Padrões para Iniciação do Pix): campos
ID + tamanho (2 dígitos) + valor, e CRC16-CCITT (0x1021, início 0xFFFF) no
fim. Sem valor fixo: quem doa escolhe quanto. O nome e a cidade do código são
só informativos; o banco mostra o titular da chave na hora de pagar.

Uso: python3 tools/gerar_pix.py   (precisa do segno: pip install segno)
Gera public/assets/img/pix-qr.svg e mostra o código para colar no HTML.
"""

from pathlib import Path

CHAVE = "26390eae-98e7-4fdb-b6a3-cdf8e32a6955"  # chave aleatória
NOME = "KalangOS"
CIDADE = "BRASIL"
SAIDA = Path(__file__).resolve().parents[1] / "public/assets/img/pix-qr.svg"


def campo(id_: str, valor: str) -> str:
    return f"{id_}{len(valor):02d}{valor}"


def crc16(dados: str) -> str:
    crc = 0xFFFF
    for byte in dados.encode():
        crc ^= byte << 8
        for _ in range(8):
            crc = ((crc << 1) ^ 0x1021) if crc & 0x8000 else (crc << 1)
            crc &= 0xFFFF
    return f"{crc:04X}"


def payload() -> str:
    conta = campo("00", "br.gov.bcb.pix") + campo("01", CHAVE)
    corpo = (
        campo("00", "01")
        + campo("26", conta)
        + campo("52", "0000")
        + campo("53", "986")
        + campo("58", "BR")
        + campo("59", NOME)
        + campo("60", CIDADE)
        + campo("62", campo("05", "***"))
        + "6304"
    )
    return corpo + crc16(corpo)


if __name__ == "__main__":
    import segno

    codigo = payload()
    assert crc16("123456789") == "29B1", "CRC16-CCITT errado"
    segno.make(codigo, error="m", micro=False).save(
        str(SAIDA), kind="svg", scale=1, border=2, dark="#07090d", light="#ffffff", xmldecl=False, svgns=True
    )
    # viewBox: o SVG cresce com o CSS; crispEdges: módulos sem borrar.
    svg = SAIDA.read_text()
    lado = svg.split('width="', 1)[1].split('"', 1)[0]
    svg = svg.replace(f'width="{lado}" height="{lado}"', f'viewBox="0 0 {lado} {lado}" shape-rendering="crispEdges"', 1)
    SAIDA.write_text(svg)
    print(codigo)
    print(f"gerado {SAIDA}")
