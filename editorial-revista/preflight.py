#!/usr/bin/env python3
"""Auditoria read-only da Revista Intellih na BRANCH DE PREVIA.

Executar na raiz: python3 editorial-revista/preflight.py
Nao gera, publica ou modifica qualquer arquivo. Nao e autorizacao de lancamento.
"""
from __future__ import annotations

from html.parser import HTMLParser
import json
from pathlib import Path
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parent.parent
PUBLIC = ROOT / 'public'
REVISTA = PUBLIC / 'revista'
DATA = ROOT / 'editorial-revista' / 'conteudo'


class Tags(HTMLParser):
    def __init__(self):
        super().__init__()
        self.meta = []
        self.links = []
        self.images = []

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == 'meta':
            self.meta.append(a)
        if tag == 'img':
            self.images.append(a)
        for key in ('href', 'src', 'srcset'):
            if a.get(key):
                candidates = (part.strip().split(' ')[0] for part in a[key].split(',')) if key == 'srcset' else (a[key],)
                self.links.extend(candidates)

    def get_meta(self, key, value):
        return [m.get('content') for m in self.meta if m.get(key) == value]


def local_path(value: str, page: Path) -> Path | None:
    parsed = urlsplit(value)
    if parsed.scheme or parsed.netloc or not parsed.path:
        return None
    raw = unquote(parsed.path)
    if raw.startswith('/'):
        candidate = PUBLIC / raw.lstrip('/')
    else:
        candidate = page.parent / raw
    # URLs de diretorio correspondem a index.html; caminhos / do site principal tambem.
    if raw.endswith('/'):
        candidate /= 'index.html'
    elif not candidate.suffix and not candidate.is_file():
        candidate = candidate.with_suffix('.html')
    candidate = candidate.resolve()
    if not candidate.is_relative_to(PUBLIC.resolve()):
        raise AssertionError(f'Referencia sai de public: {page}: {value}')
    return candidate


def main() -> None:
    articles = json.loads((DATA / 'artigos.json').read_text(encoding='utf-8'))
    articles += json.loads((DATA / 'noticias.json').read_text(encoding='utf-8'))
    assert len(articles) == 4, 'Esperados quatro artigos aprovados'
    assert len({a['slug'] for a in articles}) == 4, 'Slugs duplicados'
    assert sum(bool(a.get('destaque')) for a in articles) == 1, 'Destaque incorreto'

    pages = sorted(REVISTA.rglob('*.html'))
    assert len(pages) == 12, f'Esperados 12 HTMLs, encontrados {len(pages)}'
    references = 0
    for page in pages:
        html = page.read_text(encoding='utf-8')
        tags = Tags()
        tags.feed(html)
        assert tags.get_meta('name', 'robots') == ['noindex,nofollow'], f'Noindex ausente: {page}'
        assert not tags.get_meta('property', 'og:url'), f'OG URL de previa: {page}'
        assert not tags.get_meta('property', 'og:image'), f'Imagem social ainda nao aprovada: {page}'
        assert 'rel="canonical"' not in html and 'datePublished' not in html, f'Dados de publicacao na previa: {page}'
        assert all('alt' in img for img in tags.images), f'Imagem sem alt: {page}'
        if page.name != 'ia-com-metodo.html':  # Redirecionamento legado.
            assert 'PRÉVIA EDITORIAL' in html, f'Aviso da previa ausente: {page}'
            for key in ('og:title', 'og:description', 'og:type'):
                assert len(tags.get_meta('property', key)) == 1, (page, key)
        for link in tags.links:
            dest = local_path(link, page)
            if dest is not None:
                assert dest.is_file(), f'Recurso interno ausente em {page.relative_to(ROOT)}: {link}'
                references += 1
        assert '/analise-presenca-digital' not in html, f'Servico especifico ainda referenciado: {page}'

    for a in articles:
        page = REVISTA / 'artigos' / (a['slug'] + '.html')
        text = page.read_text(encoding='utf-8')
        assert a['titulo'] in text, f'Titulo nao encontrado: {a["slug"]}'
        assert 'Rascunho em ' in text, f'Data de rascunho alterada: {a["slug"]}'
        assert a['credito_imagem'] in text, f'Credito ausente: {a["slug"]}'
        if a.get('imagem_url'):
            assert 'IC 348' in text and 'ESA/Webb' in text
        else:
            png = REVISTA / 'assets' / 'img' / a['imagem']
            webp = png.with_suffix('.webp')
            assert png.is_file() and webp.is_file(), f'Imagem original/otimizada ausente: {a["slug"]}'
            assert ('/revista/assets/img/' + webp.name) in text, f'Srcset WebP ausente: {a["slug"]}'
    for slug in ('natureza', 'cultura'):
        text = (REVISTA / 'editorias' / (slug + '.html')).read_text(encoding='utf-8')
        assert 'EM PREPARAÇÃO' in text, f'Editoria {slug} deixou de estar em preparacao'

    cover = (REVISTA / 'index.html').read_text(encoding='utf-8')
    assert 'parece-inventado-icone.png' in cover and 'Soluções baseadas em IA' in cover
    assert (REVISTA / 'assets' / 'img' / 'parece-inventado-icone.png').is_file()
    assert (ROOT / 'robots.txt').is_file() and (ROOT / 'sitemap.xml').is_file()
    assert (PUBLIC / 'index.html').is_file() and (PUBLIC / 'blog').is_dir()
    print(f'PREVIA OK: {len(pages)} HTMLs; {len(articles)} artigos; {references} referencias locais presentes; creditos e avisos de previa conferidos.')
    print('NAO E AUTORIZACAO DE PUBLICACAO: manter noindex e PR em rascunho ate aprovacao expressa.')
    print('NA PUBLICACAO: remover avisos/rascunhos; usar datas reais e URLs canonicas; indexar so paginas com conteudo; atualizar sitemap e link institucional; revalidar site e blog.')


if __name__ == '__main__':
    main()
