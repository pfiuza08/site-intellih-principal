# Revista Intellih — estado da prévia em 17/09/2026

**Somente branch `revista-preview-20260917`. Não fazer merge na `main` nem publicar.**

## Atualização concluída

A matéria de estreia Webb/IC 348 está no HTML da homepage, em `/revista/artigos/webb-anas-marrons-duas-massas-jupiter.html` e nas editorias Ciência e Parece Inventado?. A foto é carregada da ESA/Webb por URL externa, com identificação e crédito visíveis. O CSS mobile aprovado não foi substituído.

A fonte editorial está agora separada por formato: `editorial-revista/conteudo/noticias.json` contém a notícia de estreia e `editorial-revista/conteudo/artigos.json` mantém os quatro explicadores. `editorial-revista/build.py` combina os arquivos, define a notícia como destaque e gera cinco artigos, seis editorias e a homepage. O gerador não modifica `public/index.html`, `public/blog/`, os serviços, o CSS, o sitemap nem `vercel.json`.

**Comando para reconstrução da prévia:** `python3 editorial-revista/build.py`. Os HTMLs continuam com `noindex,nofollow` e o aviso de revisão. Não executar para publicar a revista: antes do lançamento será necessária uma etapa separada para aprovar os textos, conferir os direitos das imagens, definir as datas reais de publicação, gerar canonical/SEO e obter autorização expressa para a `main`.

## Conferência final pendente

1. Conferir visualmente, no computador e no celular, a imagem da ESA/Webb, a legenda e o título de destaque na prévia da Vercel.
2. Revisar os quatro artigos demonstrativos e imagens ilustrativas antes do lançamento.
3. Testar execução do gerador no clone do repositório e comparar os HTMLs gerados com a prévia aprovada antes de fazer qualquer merge.

**Não houve alteração do site de soluções, do blog ou do domínio de produção.**
