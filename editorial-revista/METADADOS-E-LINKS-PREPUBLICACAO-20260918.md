# Revista Intellih — metadados e links antes da publicação

**Data:** 18/09/2026. **Escopo:** apenas `revista-preview-20260917` e PR #2 em rascunho. **Não é autorização para lançamento.**

## Implementado e testado na prévia

- Gerador e 11 páginas completas: `og:site_name`, `og:locale=pt_BR`, `og:type` (`article` nos quatro artigos; `website` nas outras páginas), `og:title`, `og:description`, além de `twitter:card=summary`, `twitter:title` e `twitter:description`. Títulos e descrições vêm do conteúdo editorial existente; nada foi inventado.
- A referência de classificação do artigo sobre IA foi trocada da URL com `?hl=pt-BR`, que produziu erro no ambiente de consulta, pela página sem o parâmetro, que abriu. Isso altera apenas o endereço da fonte, **não** a narração nem o texto aprovado. O leitor pode usar o seletor de idioma do Google.
- Automação de teste: https://github.com/pfiuza08/site-intellih-principal/actions/runs/35387696897 — resultado `success`. Confirmou 12 HTMLs com `noindex,nofollow`, metadados textuais nas 11 páginas completas, quatro corpos editoriais e imagens intactos. A página legada de redirecionamento não recebeu cartões sociais. Workflow temporário removido.

## Fontes consultadas

- NASA e ESA/Webb, comunicado sobre IC 348 e catálogo da fotografia: https://science.nasa.gov/missions/webb/nasas-webb-reveals-dynamic-panorama-of-star-formation/ ; https://esawebb.org/news/weic2619/ ; https://esawebb.org/images/weic2619a/ ; https://esawebb.org/copyright/ — páginas abriram na consulta.
- Formação da Lua: https://www.nasa.gov/solar-system/collision-may-have-formed-the-moon-in-mere-hours-simulations-reveal/ ; https://science.nasa.gov/moon/formation/ — páginas abriram.
- Buracos negros: https://science.nasa.gov/universe/black-holes/anatomy/ ; https://www.nasa.gov/universe/what-are-black-holes/ — páginas abriram.
- IA: https://developers.google.com/machine-learning/crash-course ; https://developers.google.com/machine-learning/crash-course/classification — páginas abriram. O endereço antigo com `?hl=pt-BR` não pôde ser verificado na mesma ferramenta; **não afirmar que estava quebrado para todos os visitantes**.
- O site institucional `https://www.intellih.com.br/` abriu na consulta. A rota `https://www.intellih.com.br/analise-presenca-digital` não pôde ser aberta por esta ferramenta; o arquivo correspondente existe no repositório e o destino deve ser testado em navegador humano antes de publicar. A prévia hospedada da Vercel também não pôde ser acessada por esta ferramenta nesta rodada.

## Ainda pendente de decisão ou implementação

- **Imagem social:** não adicionar `og:image` nem `twitter:image` até existir uma versão adequada, com crédito visível para a fotografia ESA/Webb e identificação correta das imagens de IA. Imagens verticais dos artigos não garantem bom recorte de cartões horizontais.
- **URLs e SEO de publicação:** não adicionar `og:url`, `canonical`, `datePublished` ou dados estruturados de publicação na prévia. Na publicação, usar apenas as URLs realmente disponibilizadas no domínio definitivo e a **data efetiva** de cada artigo. Os campos atuais de 16 e 17/09/2026 são datas de rascunho; o estudo da Lua continua sendo de 2022.
- Testar no navegador a página institucional de análise, os links das fontes, os créditos e a imagem social quando pronta. Definir como Natureza e Cultura vazias serão tratadas na indexação sem removê-las do menu — a decisão editorial de mantê-las como `Em preparação` permanece.
- **Somente mediante autorização expressa:** alterar avisos de prévia, `noindex`, sitemap, homepage institucional, blog ou fazer merge na `main`. Não houve alterações em `public/index.html`, `public/blog/`, serviços, `vercel.json`, `robots.txt` ou `sitemap.xml` nesta rodada.
