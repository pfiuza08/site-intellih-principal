# Revista Intellih — estado da primeira edição (prévia, 17/09/2026)

**Somente na branch `revista-preview-20260917`. Não publicar nem fazer merge na `main` sem nova autorização.**

## Seleção aprovada pela responsável editorial

A homepage exibe **quatro matérias**: Webb e as anãs marrons (destaque), por que a luz não escapa de um buraco negro, a hipótese de formação da Lua em poucas horas (simulação de 2022) e nem toda IA é generativa. A pauta de classificação e previsão da chuva foi retirada das páginas da primeira edição e preservada em `editorial-revista/rascunhos/quando-previsao-e-classificacao.json` para uma edição futura.

O gerador `editorial-revista/build.py` reúne `conteudo/noticias.json` e `conteudo/artigos.json`; executado nesta etapa, gerou homepage, quatro artigos e seis editorias. Todos os HTMLs permanecem com `noindex,nofollow` e aviso de prévia. A capa e o artigo Webb exibem a identificação da observação IC 348 e o crédito completo ESA/Webb, NASA, CSA, K. Luhman, C. Alves De Oliveira, M. Zamani (ESA/Webb), associado à imagem original. A ilustração não deve ser descrita como fotografia individual da anã marrom.

O CSS responsivo aprovado foi preservado. Um fluxo temporário de geração executou e validou a edição, depois foi removido; não há automação editorial permanente criada nesta etapa.

## Antes do lançamento

- Confirmar visualmente o crédito e o carregamento da imagem externa na prévia da Vercel, no computador e no celular.
- Revisar e aprovar **os textos integrais** e as fontes; seleção das pautas não equivale a aprovação final dos textos.
- Substituir ou aprovar as ilustrações conceituais dos três explicadores, com atribuição compatível; manter a Lua como hipótese de simulação publicada em 2022.
- Definir datas reais de publicação, títulos/metadescrições definitivos, canonical, Open Graph e sitemap apenas dos textos aprovados.
- Confirmar autorização expressa para merge/publicação. Até lá, não retirar `noindex,nofollow`.

**Não alterados:** `public/index.html`, `public/blog/`, serviços, `vercel.json`, `robots.txt` e `sitemap.xml`.
