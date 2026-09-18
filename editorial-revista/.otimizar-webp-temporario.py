from pathlib import Path
from PIL import Image, features
import hashlib, re, subprocess, json

assert subprocess.check_output(['git', 'branch', '--show-current'], text=True).strip() == 'revista-preview-20260917'
assert features.check('webp'), 'Pillow sem suporte a WebP'
base = Path('public/revista')
originals = ['formacao-lua-impacto-realista.png', 'buraco-negro-realista.png', 'inteligencia-artificial-aplicacoes-pt.png']
checksums = {}
total_original = total_webp = 0
for name in originals:
    src = base / 'assets' / 'img' / name
    assert src.is_file() and src.stat().st_size > 100000
    checksums[name] = hashlib.sha256(src.read_bytes()).hexdigest()
    dst = src.with_suffix('.webp')
    assert not dst.exists(), 'WebP ja existe, nao sobrescrever automaticamente: ' + str(dst)
    with Image.open(src) as im:
        assert im.format == 'PNG' and im.width > 600 and im.height > 600
        size = im.size
        im.convert('RGB').save(dst, format='WEBP', quality=90, method=6)
    with Image.open(dst) as test:
        assert test.format == 'WEBP' and test.size == size
        test.verify()
    assert dst.stat().st_size < src.stat().st_size, 'WebP nao reduziu: ' + name
    total_original += src.stat().st_size
    total_webp += dst.stat().st_size
    print('OTIMIZADA:', name, 'PNG', src.stat().st_size, 'WebP', dst.stat().st_size, 'px', size)

buildpath = Path('editorial-revista/build.py')
build = buildpath.read_text(encoding='utf-8')
old = """    return f'<figure class="editorial-figure"><div class="image-box"><img src="{h(src)}" alt="{h(alt)}" width="808" height="1000" loading="{loading}">{sticker}</div>{credit}</figure>'"""
new = """    img=f'<img src="{h(src)}" alt="{h(alt)}" width="808" height="1000" loading="{loading}">'
    if not a.get('imagem_url'):
        optimized=asset('img/'+Path(a['imagem']).with_suffix('.webp').name,prefix)
        img=f'<picture><source type="image/webp" srcset="{h(optimized)}">{img}</picture>'
    return f'<figure class="editorial-figure"><div class="image-box">{img}{sticker}</div>{credit}</figure>'"""
assert build.count(old) == 1, 'A estrutura do gerador mudou, abortando sem alterar'
buildpath.write_text(build.replace(old, new), encoding='utf-8')

csspath = base / 'assets' / 'style.css'
css = csspath.read_text(encoding='utf-8')
rule = '\n/* Imagens WebP com PNG como alternativa, sem alterar os enquadramentos existentes. */\n.image-box picture{display:block;width:100%;height:100%}\n'
assert '.image-box picture{' not in css
csspath.write_text(css + rule, encoding='utf-8')

pages = list(base.rglob('*.html'))
assert len(pages) == 12
def approved_text(page):
    raw = page.read_text(encoding='utf-8')
    match = re.search(r'<article class="prose" aria-label="Texto do artigo">(.*?)<section class="source-box"', raw, re.S)
    assert match, 'Corpo de artigo nao encontrado: ' + str(page)
    return match.group(1)
old_bodies = {p.name: approved_text(p) for p in (base / 'artigos').glob('*.html')}
assert len(old_bodies) == 4
subprocess.check_call(['python3', 'editorial-revista/build.py'])
assert {p.name: approved_text(p) for p in (base / 'artigos').glob('*.html')} == old_bodies, 'Conteudo aprovado mudou'
for name in originals:
    src = base / 'assets' / 'img' / name
    assert hashlib.sha256(src.read_bytes()).hexdigest() == checksums[name], 'PNG original foi alterado'
    assert src.with_suffix('.webp').is_file()
for html in base.rglob('*.html'):
    raw = html.read_text(encoding='utf-8')
    assert '<meta name="robots" content="noindex,nofollow">' in raw
    if html.name != 'ia-com-metodo.html':
        assert 'PRÉVIA EDITORIAL' in raw
for article in json.loads(Path('editorial-revista/conteudo/artigos.json').read_text(encoding='utf-8')):
    raw = (base / 'artigos' / (article['slug'] + '.html')).read_text(encoding='utf-8')
    assert article['imagem'].replace('.png', '.webp') in raw and article['imagem'] in raw
    assert article['credito_imagem'] in raw
webb = (base / 'artigos' / 'webb-anas-marrons-duas-massas-jupiter.html').read_text(encoding='utf-8')
assert 'ESA/Webb, NASA, CSA' in webb and 'weic2619a.jpg' in webb and 'srcset=' not in webb
changed = subprocess.check_output(['git', 'status', '--porcelain'], text=True)
print('ARQUIVOS ALTERADOS:', changed)
assert 'editorial-revista/conteudo/' not in changed and 'public/index.html' not in changed and 'public/blog/' not in changed
print('TOTAL_BYTES_PNG', total_original, 'TOTAL_BYTES_WEBP', total_webp, 'REDUCAO_PCT', round(100 * (1 - total_webp / total_original), 1))
print('TESTE: 12 HTMLs, 4 corpos preservados, PNGs intactos, creditos e noindex preservados')
