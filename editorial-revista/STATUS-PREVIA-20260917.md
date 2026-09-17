# Revista Intellih — estado editorial da prévia

**Somente branch `revista-preview-20260917`. Não fazer merge na `main` nem publicar sem autorização expressa.**

## Seleção e textos aprovados da primeira edição

- **Webb / IC 348:** texto revisado, aprovado e incorporado à prévia; massa estimada em cerca de duas massas de Júpiter; crédito ESA/Webb visível na capa e no artigo.
- **Buracos negros:** texto revisado, aprovado e incorporado à prévia; imagem identificada como ilustração conceitual.
- **Formação da Lua:** texto revisado, aprovado e incorporado à prévia; as simulações são de 2022, e a formação em horas não é fato comprovado. Imagem identificada como ilustração editorial, não como a simulação original.
- **Nem toda IA é generativa:** texto revisado, aprovado e incorporado à prévia; diferencia classificação, previsão, reconhecimento, recomendação, otimização e geração, sem equiparar toda automação a IA.

A pauta de previsão/classificação da chuva continua arquivada em `editorial-revista/rascunhos/` para uma edição futura. A fonte editorial é `editorial-revista/conteudo/noticias.json` mais `editorial-revista/conteudo/artigos.json`; `python3 editorial-revista/build.py` gera homepage, quatro artigos e seis editorias. As automações temporárias usadas para incorporar os textos foram removidas.

## Segurança e pendências

Todas as páginas continuam com `noindex,nofollow` e aviso de prévia; nada foi incluído no sitemap de produção. O CSS mobile aprovado foi preservado. Não alterar `public/index.html`, `public/blog/`, serviços, `vercel.json`, `robots.txt` nem `sitemap.xml`.

Antes de publicar, conferir ilustrações e direitos, a foto ESA/Webb e seu crédito em desktop/mobile, links, datas reais de publicação, metadados definitivos e a apresentação visual. Somente com autorização expressa será possível planejar a entrada no domínio de produção.
