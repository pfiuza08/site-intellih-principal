# Revista Intellih — estado editorial da prévia

**Somente branch `revista-preview-20260917`. Não fazer merge na `main` nem publicar.**

## Seleção e andamento da primeira edição

- **Webb / IC 348:** texto revisado, aprovado e incorporado à prévia; massa estimada em cerca de duas massas de Júpiter; crédito ESA/Webb visível na capa e no artigo.
- **Buracos negros:** texto revisado, aprovado e incorporado à prévia; imagem identificada como ilustração conceitual.
- **Formação da Lua:** texto revisado, aprovado e incorporado à prévia; destaca que as simulações são de 2022 e que a formação em horas não é fato comprovado. Imagem identificada como ilustração editorial, não como a simulação original.
- **Nem toda IA é generativa:** revisão proposta em `editorial-revista/REVISAO-TEXTO-IA-NAO-GENERATIVA.md`, ainda pendente de aprovação final; texto atual da prévia não foi substituído.

O artigo sobre previsão/classificação da chuva foi arquivado em `editorial-revista/rascunhos/` para uma edição futura. A fonte editorial é `editorial-revista/conteudo/noticias.json` mais `editorial-revista/conteudo/artigos.json`; `python3 editorial-revista/build.py` gera homepage, quatro artigos e seis editorias. As automações temporárias usadas para incorporar os textos foram removidas.

## Segurança e pendências

Todas as páginas continuam com `noindex,nofollow` e aviso de prévia; nada foi incluído no sitemap de produção. O CSS mobile aprovado foi preservado. Não alterar `public/index.html`, `public/blog/`, serviços, `vercel.json`, `robots.txt` nem `sitemap.xml`.

Antes de publicar, aprovar o artigo de IA, conferir ilustrações e direitos, datas reais de publicação, metadados definitivos, links e visual desktop/mobile. Somente com autorização expressa será possível planejar a entrada no domínio de produção.
