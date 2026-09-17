# Revista Intellih — prévia GitHub/Vercel

Este projeto adiciona `public/revista/` e `editorial-revista/` ao repositório `pfiuza08/site-intellih-principal` na branch `revista-preview-20260917`. **Não altera** a homepage institucional, o blog, APIs, páginas comerciais nem o sitemap.

## Fontes de conteúdo

- `editorial-revista/conteudo/noticias.json`: matéria de estreia do James Webb (IC 348), com imagem científica da ESA/Webb, crédito, legenda, texto e referências.
- `editorial-revista/conteudo/artigos.json`: quatro explicadores demonstrativos. A matéria sobre a Lua trata da simulação divulgada em 2022; não apresentá-la como descoberta de 2026.
- `editorial-revista/build.py`: combina os dois arquivos e gera a homepage, **cinco artigos** e seis páginas de editorias. O destaque é a matéria Webb.

## Gerar e conferir localmente

```bash
python3 editorial-revista/build.py
python3 -m http.server 8000 --directory public
# Abra http://localhost:8000/revista/
```

A geração grava arquivos apenas em `public/revista/`. Os caminhos internos usam `/revista/`. O CSS responsivo aprovado fica em `public/revista/assets/style.css` e não é alterado pelo gerador. A busca filtra os cards da página atual; não pesquisa o acervo inteiro.

## Restrições da prévia

Todos os HTMLs gerados contêm `noindex,nofollow` e aviso de revisão. Os quatro artigos demonstrativos e suas ilustrações ainda precisam de aprovação. A imagem de IC 348 é carregada por URL externa e deve ter sua exibição e atribuição verificadas visualmente. A lógica do gerador foi reproduzida e testada localmente com os cinco artigos; não equivale a teste do deploy remoto.

**Não faça merge na `main` nem remova os bloqueios de indexação sem aprovação explícita.** Antes de publicar, revisar conteúdo e licenças, registrar datas reais, incluir canonical/SEO/sitemap somente das páginas aprovadas, testar a prévia na Vercel e confirmar que `/`, `/blog/` e as páginas de soluções permanecem intactos.
