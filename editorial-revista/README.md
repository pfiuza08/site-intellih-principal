# Revista Intellih — prévia GitHub/Vercel

Este pacote foi montado a partir do ZIP aprovado, para ser **adicionado sem substituições** ao repositório `pfiuza08/site-intellih-principal` numa branch de revisão. A integração acrescenta `public/revista/` e `editorial-revista/`; **não modifica** `public/index.html`, `public/blog/`, `vercel.json`, `sitemap.xml`, `robots.txt`, APIs nem arquivos de serviços.

## Prévia local

```bash
python3 -m http.server 8000 --directory public
# Acesse http://localhost:8000/revista/
```

## Gerar páginas após editar conteúdos

```bash
python3 editorial-revista/build.py
```

As páginas são geradas de `editorial-revista/conteudo/artigos.json`. As URLs internas usam `/revista/` para funcionarem com `cleanUrls: true` do Vercel. Execute o servidor local com raiz `public` para simular esse caminho. A busca filtra somente os cards da página atual.

## Não publicar no domínio ainda

As páginas incluem `noindex,nofollow` e aviso de PRÉVIA. Os quatro artigos presentes no ZIP original são demonstrativos, com imagens vetoriais ilustrativas e datas a revisar. O rascunho de estreia `ARTIGO-ESTREIA-RASCUNHO.md` **não aparece** na homepage e precisa de revisão editorial e imagem autorizada. Não adicionar a revista ao sitemap nem ao menu institucional antes da aprovação; não remover `noindex` no preview.

## Publicação depois da aprovação

1. Revisar e aprovar texto, fontes, título, imagem e créditos; ocultar ou substituir os artigos demonstrativos não aprovados.
2. Preparar canonical, metadados sociais e sitemap da revista, sem sobrescrever o sitemap atual.
3. Validar URLs com o Vercel Preview da branch e executar smoke test de `/`, `/blog/` e páginas comerciais.
4. Só depois: remover avisos e `noindex` **nas páginas aprovadas**; criar link discreto no site institucional, preservando o layout existente; fazer merge em `main` com autorização explícita.

O protótipo não inclui CMS nem integração de newsletter. O Vercel Preview depende de a branch ser adicionada ao GitHub e da integração Vercel estar ativa; este ZIP por si só não cria deploy.
