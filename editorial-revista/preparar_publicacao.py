#!/usr/bin/env python3
"""Converte a primeira edicao aprovada para publicacao, apenas na branch de lancamento.
Uso: REVISTA_DATA_PUBLICACAO=AAAA-MM-DD python3 editorial-revista/preparar_publicacao.py
Nao executa deploy nem altera refs do GitHub. O merge exige aprovacao ja recebida.
"""
from __future__ import annotations

from datetime import date, datetime
from pathlib import Path
from zoneinfo import ZoneInfo
import hashlib
import json
import os
import re
import subprocess
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parent.parent
PUBLIC = ROOT / 'public'
REVISTA = PUBLIC / 'revista'
BASE = ROOT / 'editorial-revista'
BRANCH = 'revista-lancamento-20260918'
ORIGIN = 'https://www.intellih.com.br'


def replace_once(text: str, before: str, after: str, label: str) -> str:
    count = text.count(before)
    if count != 1:
        raise RuntimeError(f'{label}: esperada 1 ocorrencia, encontradas {count}')
    return text.replace(before, after)


def digest(p: Path) -> str:
    return hashlib.sha256(p.read_bytes()).hexdigest()


def run() -> None:
    if subprocess.check_output(['git', 'branch', '--show-current'], cwd=ROOT, text=True).strip() != BRANCH:
        raise RuntimeError('Publicacao bloqueada: branch errada')
    provided = os.environ.get('REVISTA_DATA_PUBLICACAO', '')
    try:
        release_day = date.fromisoformat(provided)
    except ValueError as exc:
        raise RuntimeError('Defina REVISTA_DATA_PUBLICACAO=AAAA-MM-DD') from exc
    today = datetime.now(ZoneInfo('America/Sao_Paulo')).date()
    if release_day != today:
        raise RuntimeError(f'Data real divergente: solicitada {release_day}, hoje no Brasil {today}')
    publication_date = release_day.isoformat()

    originals = {p: digest(ROOT / p) for p in ('public/index.html', 'sitemap.xml', 'robots.txt', 'vercel.json')}
    old_articles = {p.name: digest(p) for p in (REVISTA / 'artigos').glob('*.html')}
    if len(old_articles) != 4:
        raise RuntimeError('Esperados quatro artigos previamente aprovados')

    # Persistir a data de publicacao separadamente da data original do rascunho.
    for filename in ('artigos.json', 'noticias.json'):
        path = BASE / 'conteudo' / filename
        content = json.loads(path.read_text(encoding='utf-8'))
        for item in content:
            if 'publicado_em' in item:
                raise RuntimeError(f'{filename}: data de publicacao ja preenchida')
            item['publicado_em'] = publication_date
        path.write_text(json.dumps(content, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')

    build_file = BASE / 'build.py'
    builder = build_file.read_text(encoding='utf-8')
    builder = replace_once(builder, 'import json\n', 'import json\nimport re\n', 'Importar re')
    builder = replace_once(builder,
        "ARTICLES = NEWS + [{**a, 'destaque': False} for a in EVERGREEN]",
        "ARTICLES = NEWS + [{**a, 'destaque': False} for a in EVERGREEN]\nPUBLICATION_DATE = '" + publication_date + "'\nPUBLICATION_DATE_BR = datetime.strptime(PUBLICATION_DATE, '%Y-%m-%d').strftime('%d/%m/%Y')",
        'Data efetiva da primeira edicao')
    builder = replace_once(builder,
        "def doc(title, desc, main, prefix='./', active='Revista', page_type='website'):",
        "def doc(title, desc, main, prefix='./', active='Revista', page_type='website', canonical_path='/revista/', publication_date=None, is_empty=False):",
        'Argumentos doc')
    builder = replace_once(builder,
        "    return page\n\ndef picture(a, prefix='./', tag=False, link_credit=False):",
        '''    # Metadados de producao, sem data ficticia e sem indexar editorias vazias.
    robots = 'noindex,follow' if is_empty else 'index,follow'
    page = page.replace('<meta name="robots" content="noindex,nofollow">', f'<meta name="robots" content="{robots}">')
    canonical = 'https://www.intellih.com.br' + canonical_path
    metadata = f'<link rel="canonical" href="{h(canonical)}"><meta property="og:url" content="{h(canonical)}">'
    if publication_date:
        metadata += f'<meta property="article:published_time" content="{h(publication_date)}">'
    page = page.replace('</head>', metadata + '</head>')
    page = page.replace('<div class="demo-bar">PRÉVIA EDITORIAL · Conteúdo e imagens em revisão; não publicar sem aprovação</div>', '')
    page = page.replace('Redação Intellih · texto em revisão', 'Redação Intellih')
    page = page.replace('© Intellih · Prévia editorial · ', '© Intellih · ')
    page = page.replace('<p>Este protótipo não possui newsletter nem sistema automático de publicação.</p>', '')
    page = page.replace('Esta editoria ainda não tem artigos no protótipo. Preferimos uma página transparente a preencher o espaço com notícias fictícias.', 'Esta editoria está em preparação. Novos artigos serão publicados quando estiverem prontos.')
    page = re.sub(r'<p style="font-size:12px;color:#777;font-family:Inter,Arial,sans-serif">Texto editorial preparado para avaliação; revisar informações, imagens e direitos antes da publicação definitiva.</p>', '', page)
    return page

def picture(a, prefix='./', tag=False, link_credit=False):''',
        'Metadados publicos')
    builder = replace_once(builder,
        '· primeira edição em revisão · {len(ARTICLES)} artigos',
        '· edição de {PUBLICATION_DATE_BR} · {len(ARTICLES)} artigos',
        'Data da capa')
    builder = replace_once(builder,
        "datetime.strptime(a['data'],'%Y-%m-%d').strftime('%d/%m/%Y')",
        "datetime.strptime(a['publicado_em'],'%Y-%m-%d').strftime('%d/%m/%Y')",
        'Data real nos artigos')
    builder = replace_once(builder, 'Rascunho em {datetime.strptime', 'Publicado em {datetime.strptime', 'Rotulo da data')
    builder = replace_once(builder,
        "body,prefix,active='Revista',page_type='article'),encoding='utf-8')",
        "body,prefix,active='Revista',page_type='article',canonical_path='/revista/artigos/'+a['slug'],publication_date=a['publicado_em']),encoding='utf-8')",
        'Canonical por artigo')
    builder = replace_once(builder,
        "doc(title,desc,body,'../',active=title),encoding='utf-8')",
        "doc(title,desc,body,'../',active=title,canonical_path='/revista/editorias/'+slug,is_empty=not selection),encoding='utf-8')",
        'Canonical por editoria')
    build_file.write_text(builder, encoding='utf-8')

    # Modificacao minima da homepage institucional: somente mais um item no menu.
    home = PUBLIC / 'index.html'
    homepage = home.read_text(encoding='utf-8')
    homepage = replace_once(homepage,
        '        <a href="https://intellih.com.br/blog">Blog</a>',
        '        <a href="/revista/">Revista</a>\n        <a href="https://intellih.com.br/blog">Blog</a>',
        'Link institucional para revista')
    home.write_text(homepage, encoding='utf-8')

    # Preservar integralmente as URLs ja existentes do sitemap da raiz.
    sitemap = ROOT / 'sitemap.xml'
    xml = sitemap.read_text(encoding='utf-8')
    if '/revista' in xml or xml.count('</urlset>') != 1:
        raise RuntimeError('Sitemap alterado desde a revisao: nao sobrescrever')
    paths = ['/revista/']
    paths += ['/revista/artigos/' + article['slug'] for article in
              json.loads((BASE/'conteudo'/'noticias.json').read_text(encoding='utf-8')) +
              json.loads((BASE/'conteudo'/'artigos.json').read_text(encoding='utf-8'))]
    paths += ['/revista/editorias/' + slug for slug in ('ciencia', 'tecnologia', 'parece-inventado', 'inteligencia-artificial')]
    addition = ''.join(f'  <url>\n    <loc>{ORIGIN}{path}</loc>\n    <lastmod>{publication_date}</lastmod>\n  </url>\n' for path in paths)
    sitemap.write_text(xml.replace('</urlset>', '\n  <!-- Revista Intellih: primeira edicao -->\n' + addition + '</urlset>'), encoding='utf-8')
    ET.parse(sitemap)
    assert digest(ROOT / 'robots.txt') == originals['robots.txt']
    assert digest(ROOT / 'vercel.json') == originals['vercel.json']

    subprocess.check_call(['python3', str(build_file)], cwd=ROOT)

    # A geracao nao pode alterar o corpo das quatro materias aprovadas.
    def body_hash(path: Path) -> str:
        content = path.read_text(encoding='utf-8')
        match = re.search(r'<article class="prose" aria-label="Texto do artigo">(.*?)<section class="source-box"', content, flags=re.S)
        if not match:
            raise RuntimeError('Corpo editorial ausente: ' + str(path))
        return hashlib.sha256(match.group(1).encode('utf-8')).hexdigest()
    for p in (REVISTA/'artigos').glob('*.html'):
        previous = subprocess.check_output(['git', 'show', 'HEAD:public/revista/artigos/'+p.name], cwd=ROOT).decode('utf-8')
        previous_body = re.search(r'<article class="prose" aria-label="Texto do artigo">(.*?)<section class="source-box"', previous, re.S)
        if not previous_body or body_hash(p) != hashlib.sha256(previous_body.group(1).encode('utf-8')).hexdigest():
            raise RuntimeError('Corpo editorial mudou: ' + p.name)

    from html.parser import HTMLParser
    class Html(HTMLParser):
        def __init__(self):
            super().__init__(); self.refs=[]; self.images=[]
        def handle_starttag(self, tag, attrs):
            attrs=dict(attrs)
            if tag in ('img', 'source', 'script', 'link', 'a'):
                for field in ('src', 'srcset', 'href'):
                    if field in attrs: self.refs.append((tag, field, attrs[field]))
            if tag=='img': self.images.append(attrs)
    pages = sorted(REVISTA.rglob('*.html'))
    if len(pages)!=12: raise RuntimeError(f'Quantidade inesperada de paginas: {len(pages)}')
    index_count = 0
    for p in pages:
        text = p.read_text(encoding='utf-8')
        parsed = Html(); parsed.feed(text)
        path='/revista/'+p.relative_to(REVISTA).as_posix()
        if p.name == 'ia-com-metodo.html':
            if 'noindex,nofollow' not in text: raise RuntimeError('Redirecionamento legado indexavel')
            continue
        should_index = p.parent.name!='editorias' or p.stem not in ('natureza','cultura')
        expected = 'index,follow' if should_index else 'noindex,follow'
        if f'<meta name="robots" content="{expected}">' not in text:
            raise RuntimeError('Robots incorreto: '+path)
        if '<link rel="canonical"' not in text or '<meta property="og:url"' not in text:
            raise RuntimeError('Canonical ou og:url ausente: '+path)
        if any(marker in text for marker in ('PRÉVIA EDITORIAL', 'primeira edição em revisão', 'Rascunho em', 'texto em revisão', 'Texto editorial preparado', 'Este protótipo')):
            raise RuntimeError('Texto de rascunho: '+path)
        if should_index:index_count+=1
        for tag,field,value in parsed.refs:
            if value.startswith('/revista/') and tag!='a':
                candidate = PUBLIC / value.lstrip('/')
                if not candidate.is_file():
                    raise RuntimeError(f'Recurso local ausente: {path} {value}')
        if p.parent.name=='artigos' and 'Crédito: ESA/Webb' not in text and 'gerada com IA' not in text:
            raise RuntimeError('Credito da imagem ausente em '+path)
    if index_count != 9:raise RuntimeError(f'Quantidade inesperada de paginas indexaveis: {index_count}')
    if any('/revista/editorias/'+empty in sitemap.read_text(encoding='utf-8') for empty in ('natureza','cultura')):
        raise RuntimeError('Editorias vazias indevidamente no sitemap')
    assert 'href="/revista/">Revista</a>' in home.read_text(encoding='utf-8')
    # Arquivos institucionais e blog devem ser mantidos byte a byte, salvo link minimo na homepage.
    assert digest(ROOT / 'robots.txt') == originals['robots.txt']
    assert digest(ROOT / 'vercel.json') == originals['vercel.json']
    print('PUBLICACAO PREPARADA: 12 paginas, 9 indexaveis, 3 noindex, quatro textos preservados, sitemap +9 URLs, homepage +1 link, robots e Vercel intactos.')
    print('Data editorial: '+publication_date+'; URLs canonicas: '+ORIGIN+'; falta merge e teste HTTP no dominio publico.')


if __name__ == '__main__':
    run()
