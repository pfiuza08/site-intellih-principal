#!/usr/bin/env python3
"""Gera a prévia estática da revista a partir de conteudo/artigos.json e noticias.json.
Executar na raiz do repositório: python3 editorial-revista/build.py
Não publica em produção nem altera o site institucional.
"""
from __future__ import annotations
from datetime import datetime
from html import escape
import json
from pathlib import Path
from urllib.parse import urlparse

BASE = Path(__file__).resolve().parent
SITE = BASE.parent / 'public' / 'revista'
EVERGREEN = json.loads((BASE / 'conteudo' / 'artigos.json').read_text(encoding='utf-8'))
NEWS = json.loads((BASE / 'conteudo' / 'noticias.json').read_text(encoding='utf-8'))
# A pauta principal é a notícia aprovada para a prévia; a Lua (estudo de 2022) não é notícia recente.
ARTICLES = NEWS + [{**a, 'destaque': False} for a in EVERGREEN]
EDITORIAS = {
    'ciencia': ('Ciência', 'O que a pesquisa revela sobre o Universo, a Terra e as grandes perguntas da ciência.', lambda a: a['categoria'] == 'Ciência'),
    'tecnologia': ('Tecnologia', 'IA, ferramentas e conceitos tecnológicos explicados com contexto e método.', lambda a: a['categoria'] == 'Tecnologia'),
    'natureza': ('Natureza', 'Animais, ambientes e fenômenos naturais que merecem ser compreendidos.', lambda a: a['categoria'] == 'Natureza'),
    'cultura': ('Cultura', 'Música, cinema, criatividade e histórias culturais.', lambda a: a['categoria'] == 'Cultura'),
    'parece-inventado': ('Parece Inventado?', 'O surpreendente encontra explicação: fatos curiosos, evidências e exageros.', lambda a: a.get('parece', False)),
    'inteligencia-artificial': ('Inteligência Artificial', 'Conceitos, aplicações e limites da inteligência artificial, explicados com clareza.', lambda a: a['categoria'] == 'Tecnologia'),
}

def h(value): return escape(str(value), quote=True)

def url_ok(url): return urlparse(url).scheme == 'https' and bool(urlparse(url).netloc)

def art_link(a, prefix='./'): return prefix + 'artigos/' + a['slug'] + '.html'

def asset(name, prefix='./'): return prefix + 'assets/' + name

def heading(headline, subheading, label='REVISTA INTELLIH'):
    return f'<section class="inner-hero"><div class="wrap"><div class="eyebrow">{h(label)}</div><h1>{h(headline)}</h1><p>{h(subheading)}</p></div></section>'

def header(prefix='./', active='Revista'):
    nav = [('Revista',prefix+'index.html'), ('Ciência',prefix+'editorias/ciencia.html'),
           ('Tecnologia',prefix+'editorias/tecnologia.html'), ('Parece Inventado?',prefix+'editorias/parece-inventado.html'),
           ('Soluções','https://www.intellih.com.br/')]
    links=''.join(f'<a href="{h(link)}"'+(' class="active" aria-current="page"' if name==active else '')+f'>{h(name)}</a>' for name,link in nav[:-1])
    links += f'<a class="nav-action" href="{h(nav[-1][1])}">Soluções da Intellih ↗</a>'
    sections=''.join(f'<a href="{prefix}editorias/{slug}.html">{h(EDITORIAS[slug][0])}</a>' for slug in ('ciencia','tecnologia','natureza','cultura','inteligencia-artificial'))
    return f'''<a class="skip" href="#conteudo">Pular para o conteúdo</a>
<div class="demo-bar">EDIÇÃO PILOTO · Protótipo para revisão — ainda não publicado na Intellih</div>
<header class="header"><div class="wrap header-main">
<a href="{prefix}index.html" class="logo" aria-label="Intellih Revista — início"><img src="{asset('img/intellih-horizontal-dark.png',prefix)}" alt="Intellih" width="188" height="56"></a>
<div class="header-right"><nav class="primary-nav" id="main-menu" data-primary-nav aria-label="Navegação principal">{links}</nav>
<button class="icon-btn" data-search-toggle aria-controls="search-panel" aria-expanded="false" aria-label="Abrir busca" title="Buscar artigos"><svg width="19" height="19" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m16.2 16.2 5 5"/></svg></button>
<button class="icon-btn menu-toggle" data-menu-toggle aria-controls="main-menu" aria-expanded="false" aria-label="Abrir menu"><svg width="19" height="19" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M3 12h18M3 18h18"/></svg></button>
</div></div><div class="subnav"><nav class="wrap" aria-label="Editorias">{sections}</nav></div>
<div class="search-panel" id="search-panel" data-search-panel><div class="wrap"><form data-search-form role="search"><label class="sr-only" for="busca">Buscar artigos exibidos nesta página</label><input id="busca" type="search" placeholder="Busque por assunto nesta página" autocomplete="off"><button type="submit">Buscar</button></form><p class="search-hint">A busca filtra os artigos exibidos nesta página. A busca em todo o acervo ficará para a próxima etapa.</p></div></div></header>'''

def footer(prefix='./'):
    return f'''<footer class="footer"><div class="wrap"><div class="footer-grid">
<div><img src="{asset('img/intellih-horizontal-dark.png',prefix)}" class="footer-logo" width="171" height="51" alt="Intellih"><p>Inteligência para entender o mundo. Ciência, tecnologia e ideias com contexto e fontes.</p></div>
<div><b>Explore</b><a href="{prefix}index.html">Revista Intellih</a><a href="{prefix}editorias/ciencia.html">Ciência</a><a href="{prefix}editorias/tecnologia.html">Tecnologia</a><a href="{prefix}editorias/parece-inventado.html">Parece Inventado?</a><a href="{prefix}editorias/inteligencia-artificial.html">Inteligência Artificial</a></div>
<div><b>Intellih</b><a href="https://www.intellih.com.br/">Site institucional ↗</a><a href="https://www.intellih.com.br/analise-presenca-digital">Soluções para negócios ↗</a><a href="mailto:contato@intellih.com.br">Contato por e-mail</a><p>Este protótipo não possui newsletter nem sistema automático de publicação.</p></div></div>
<div class="footer-end">© Intellih · Protótipo editorial · Fotografias e ilustrações identificadas nas matérias; fontes em cada artigo.</div></div></footer>
<script src="{asset('app.js',prefix)}" defer></script>'''

def doc(title, desc, main, prefix='./', active='Revista', page_type='website'):
    page = f'''<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow"><title>{h(title)} | Intellih Revista</title><meta name="description" content="{h(desc)}"><meta name="theme-color" content="#050505">
<meta property="og:site_name" content="Revista Intellih"><meta property="og:locale" content="pt_BR"><meta property="og:type" content="{h(page_type)}"><meta property="og:title" content="{h(title)} | Intellih Revista"><meta property="og:description" content="{h(desc)}">
<meta name="twitter:card" content="summary"><meta name="twitter:title" content="{h(title)} | Intellih Revista"><meta name="twitter:description" content="{h(desc)}">
<link rel="icon" type="image/png" href="{asset('img/intellih-symbol-dark.png',prefix)}"><link rel="stylesheet" href="{asset('style.css',prefix)}"></head>
<body>{header(prefix,active)}<main id="conteudo">{main}</main>{footer(prefix)}</body></html>'''
    page = page.replace('href="../', 'href="/revista/').replace('src="../', 'src="/revista/')
    page = page.replace('href="./', 'href="/revista/').replace('src="./', 'src="/revista/')
    page = page.replace('href="/revista/index.html"', 'href="/revista/"')
    page = page.replace('href="https://www.intellih.com.br/"', 'href="/"')
    page = page.replace('href="https://www.intellih.com.br/analise-presenca-digital"', 'href="/analise-presenca-digital"')
    page = page.replace('EDIÇÃO PILOTO · Protótipo para revisão — ainda não publicado na Intellih', 'PRÉVIA EDITORIAL · Conteúdo e imagens em revisão; não publicar sem aprovação')
    page = page.replace('edição piloto', 'prévia editorial').replace('Protótipo editorial', 'Prévia editorial')
    return page

def picture(a, prefix='./', tag=False, link_credit=False):
    """Mostra a observação original e seu crédito visível, sem simular fotografia."""
    sticker='<span class="image-tag">'+h(a['formato'])+'</span>' if tag else ''
    src=a.get('imagem_url') or asset('img/'+a['imagem'],prefix)
    alt=a.get('alt_imagem',a['credito_imagem'])
    loading='eager' if tag else 'lazy'
    credit=''
    if a.get('credito_exibir'):
        credit_name=h(a['credito_imagem'])
        if link_credit and a.get('fonte_imagem'):
            credit_name='<a href="'+h(a['fonte_imagem'])+'" target="_blank" rel="noopener noreferrer">'+credit_name+'</a>'
        credit='<figcaption class="image-credit">'+h(a.get('legenda_imagem',''))+' Crédito: '+credit_name+'</figcaption>'
    img=f'<img src="{h(src)}" alt="{h(alt)}" width="808" height="1000" loading="{loading}">'
    if not a.get('imagem_url'):
        optimized='/revista/assets/img/'+Path(a['imagem']).with_suffix('.webp').name
        img=f'<picture><source type="image/webp" srcset="{h(optimized)}">{img}</picture>'
    return f'<figure class="editorial-figure"><div class="image-box">{img}{sticker}</div>{credit}</figure>'

def article_card(a, prefix='./', search=False):
    dat=(f' data-search-card data-search="{h(a["titulo"]+" "+a["subtitulo"]+" "+a["categoria"]+" "+a["editoria"])}"' if search else '')
    return f'<a class="story-card" href="{art_link(a,prefix)}"{dat}>{picture(a,prefix)}<span class="eyebrow">{h(a["categoria"])} · {h(a["editoria"])} </span><h3>{h(a["titulo"])}</h3><p>{h(a["chamada"])}</p><div class="meta">{h(a["formato"])} · {h(a["leitura"])}</div></a>'

def index_page():
    feature=next(a for a in ARTICLES if a['destaque'])
    other=[a for a in ARTICLES if a is not feature]
    rail=''.join(f'<a class="rail-item" href="{art_link(a)}"><div><span class="eyebrow">{h(a["categoria"])} · {h(a["editoria"])}</span><h3>{h(a["titulo"])}</h3><span class="meta">{h(a["leitura"])} de leitura</span></div>{picture(a)}</a>' for a in other[:3])
    cards=''.join(article_card(a,search=True) for a in ARTICLES)
    cats=''.join(f'<a class="category-tile" href="./editorias/{slug}.html"><span>↗ EDITORIA</span><h3>{h(name)}</h3><p>{h(text)}</p></a>' for slug,(name,text,_) in list(EDITORIAS.items())[:4])
    body=f'''<section class="hero-intro"><div class="wrap"><div class="line"></div><span class="eyebrow">REVISTA INTELLIH</span><h1>Inteligência para<br>entender o mundo.</h1><p>Ciência, tecnologia e histórias extraordinárias — explicadas com contexto, evidências e sem exagero.</p><div class="edition">Uma publicação da Intellih · primeira edição em revisão · {len(ARTICLES)} artigos</div></div></section>
<section class="wrap lead-grid" aria-label="Destaques"><a class="lead-card" href="{art_link(feature)}">{picture(feature,tag=True)}<span class="eyebrow" style="display:block;margin-top:18px">{h(feature['categoria'])} · {h(feature['editoria'])}</span><h2>{h(feature['titulo'])}</h2><p>{h(feature['subtitulo'])}</p><span class="meta">{h(feature['formato'])} · {h(feature['leitura'])} de leitura</span></a>
<aside class="lead-rail"><div class="rail-label">Para descobrir <span style="color:var(--accent)">↗</span></div>{rail}<div class="rail-note"><b>O que é a revista Intellih?</b><p>Uma seleção editorial: fatos, conceitos e descobertas com explicação e fontes. Não é um serviço de notícias em tempo real.</p></div></aside></section>
<section class="section section-cream" data-collection><div class="wrap"><div class="divider-title"><h2>Explore os artigos</h2><span class="meta">{len(ARTICLES)} leituras</span></div><div class="cards">{cards}</div><p class="search-empty" data-search-empty>Nenhum artigo desta página corresponde à busca.</p></div></section>
<section class="brand-feature"><div class="wrap feature-grid"><div><span class="eyebrow" style="color:#ff9e5e">ESPECIAL · PARECE INVENTADO?</span><h2>O extraordinário também é real.</h2><p>Por trás de uma pergunta surpreendente, há uma história que merece ser investigada. Descubra o que é fato, hipótese ou exagero.</p><a class="feature-link" href="./editorias/parece-inventado.html">Conheça o especial →</a></div><div class="feature-symbol-wrap"><img class="feature-symbol" src="./assets/img/intellih-symbol-dark.png" width="320" height="320" alt="Símbolo da Intellih"></div></div></section>
<section class="section section-cream"><div class="wrap"><div class="divider-title"><h2>Escolha sua editoria</h2></div><div class="category-grid">{cats}</div></div></section>
<section class="bottom-note"><div class="wrap"><div><h2>Conhecimento que também se transforma em aplicação.</h2><p>Conheça a frente de educação e soluções em inteligência artificial da Intellih.</p></div><a class="pill" href="https://www.intellih.com.br/">Intellih para negócios ↗</a></div></section>'''
    (SITE/'index.html').write_text(doc('Inteligência para entender o mundo', 'Revista Intellih: ciência, tecnologia e descobertas explicadas com contexto e fontes.',body),encoding='utf-8')

def render_block(block):
    if block['tipo']=='p':return '<p>'+h(block['texto'])+'</p>'
    if block['tipo']=='h2':return '<h2>'+h(block['texto'])+'</h2>'
    if block['tipo']=='callout':return '<aside class="callout"><strong>'+h(block['titulo'])+'</strong><p>'+h(block['texto'])+'</p></aside>'
    raise ValueError('Tipo de bloco inválido: '+block['tipo'])

def article_page(a):
    prefix='../'
    prose=''.join(render_block(b) for b in a['corpo'])
    sources=''.join('<li><a href="'+h(s['url'])+'" target="_blank" rel="noopener noreferrer">'+h(s['nome'])+' ↗</a></li>' for s in a['fontes'])
    related=[b for b in ARTICLES if b is not a][:3]
    rec=''.join('<a href="'+art_link(b,prefix)+'">'+h(b['titulo'])+'</a>' for b in related)
    body=f'''<div class="wrap article-hero"><div class="breadcrumbs"><a href="../index.html">Revista</a> / <a href="../editorias/{'ciencia' if a['categoria']=='Ciência' else 'tecnologia'}.html">{h(a['categoria'])}</a> / {h(a['editoria'])}</div><span class="eyebrow">{h(a['categoria'])} · {h(a['formato'])}</span><h1>{h(a['titulo'])}</h1><p class="dek">{h(a['subtitulo'])}</p><div class="article-meta"><span>Redação Intellih · texto em revisão</span><span>Rascunho em {datetime.strptime(a['data'],'%Y-%m-%d').strftime('%d/%m/%Y')}</span><span>{h(a['leitura'])} de leitura</span></div></div>
<div class="article-media">{picture(a,prefix,link_credit=True)}{'' if a.get('credito_exibir') else '<p class="credit">'+h(a['credito_imagem'])+'</p>'}</div>
<div class="article-layout"><article class="prose" aria-label="Texto do artigo">{prose}<section class="source-box" aria-labelledby="fontes"><h2 id="fontes">Fontes e referências</h2><ul>{sources}</ul><p style="font-size:12px;color:#777;font-family:Inter,Arial,sans-serif">Texto editorial preparado para avaliação; revisar informações, imagens e direitos antes da publicação definitiva.</p></section></article><aside class="aside"><div class="aside-title">Continue explorando</div>{rec}<p>Leitura com contexto, sem transformar hipótese em certeza.</p></aside></div>
<section class="article-footer"><div class="wrap"><h2>Gostou de descobrir mais?</h2><a class="pill-link" href="../index.html">Voltar à revista →</a></div></section>'''
    (SITE/'artigos'/f'{a["slug"]}.html').write_text(doc(a.get('titulo_seo',a['titulo']),a.get('descricao_seo',a['subtitulo']),body,prefix,active='Revista',page_type='article'),encoding='utf-8')

def section_page(slug, data):
    title, desc, predicate=data
    selection=[a for a in ARTICLES if predicate(a)]
    if selection:
        cards='<div class="cards">'+''.join(article_card(a,'../',search=True) for a in selection)+'</div><p class="search-empty" data-search-empty>Nenhum artigo desta editoria corresponde à busca.</p>'
    else:
        cards='<div class="empty-state"><span class="eyebrow">EM PREPARAÇÃO</span><h2>Novas histórias vêm aí.</h2><p>Esta editoria ainda não tem artigos no protótipo. Preferimos uma página transparente a preencher o espaço com notícias fictícias.</p><a class="pill-link" href="../index.html">Voltar à revista →</a></div>'
    body=heading(title,desc)+f'<section class="collection"><div class="wrap" data-collection><div class="divider-title"><h2>Artigos desta editoria</h2><span class="meta">{len(selection)} artigo(s)</span></div>{cards}</div></section>'
    (SITE/'editorias'/f'{slug}.html').write_text(doc(title,desc,body,'../',active=title),encoding='utf-8')

def validate():
    slugs=set()
    if sum(bool(a.get('destaque')) for a in ARTICLES)!=1:raise ValueError('A prévia deve ter exatamente um destaque')
    for a in ARTICLES:
        if a['slug'] in slugs:raise ValueError('Slug duplicado: '+a['slug'])
        slugs.add(a['slug'])
        if a.get('imagem_url'):
            if a['imagem_url']!='https://cdn.esawebb.org/archives/images/screen/weic2619a.jpg':raise ValueError('Imagem externa não aprovada')
            if not a.get('credito_exibir') or not a.get('credito_imagem'):raise ValueError('Crédito obrigatório para a imagem ESA')
        elif a['imagem'] not in ('formacao-lua-impacto-realista.png','buraco-negro-realista.png','inteligencia-artificial-aplicacoes-pt.png') or not (SITE/'assets'/'img'/a['imagem']).is_file():raise ValueError('Imagem ausente ou não aprovada')
        for s in a['fontes']:
            if not url_ok(s['url']):raise ValueError('Fonte inválida '+repr(s))

if __name__=='__main__':
    validate()
    (SITE/'artigos').mkdir(parents=True,exist_ok=True)
    (SITE/'editorias').mkdir(parents=True,exist_ok=True)
    index_page()
    for article in ARTICLES:article_page(article)
    for key,value in EDITORIAS.items():section_page(key,value)
    print(f'OK: {len(ARTICLES)} artigos, {len(EDITORIAS)} editorias e homepage gerados em {SITE}')
