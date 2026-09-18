# Revista Intellih — planejamento multilíngue

**Decisão editorial:** a revista terá, em etapa posterior, versões em português do Brasil (`pt-BR`), inglês (`en`) e espanhol (`es`). Os quatro artigos atuais permanecem aprovados em português. Este documento registra o planejamento; não implementa traduções, novas páginas, seletor de idioma nem publicação.

## Estrutura proposta para avaliação

- Português como idioma original: `/revista/` e URLs atuais dos artigos.
- Inglês: `/revista/en/` e páginas de artigos e editorias próprias.
- Espanhol: `/revista/es/` e páginas de artigos e editorias próprias.
- Manter um identificador editorial estável por matéria, com títulos, resumo, corpo, fontes, metadados e slugs traduzidos separados por idioma. Reaproveitar imagens somente quando créditos, licenças e legendas forem compatíveis com cada versão.
- Gerar a navegação, breadcrumbs, rodapé e nomes de editorias conforme o idioma. Exibir seletor de idioma **somente** quando a página correspondente existir e estiver revisada; não encaminhar para uma tradução incompleta.
- Definir tradução e revisão humana de termos científicos, citações e títulos, sem alterar o sentido nem converter hipóteses em fatos. Conferir equivalência editorial de cada versão antes de liberar.
- Preparar atributos `lang`, `hreflang` recíproco, canonical por idioma, Open Graph com localidade e sitemap multilíngue **apenas na fase de publicação autorizada**. Enquanto forem prévias, manter `noindex,nofollow`.

**Limites desta etapa:** nenhum arquivo de `public/`, nenhuma rota pública, `main`, site institucional, blog, `robots.txt`, `sitemap.xml` ou `vercel.json` deve ser alterado por este planejamento. Antes de implementar, validar com a responsável editorial se os códigos `/en/` e `/es/`, a política de tradução de slugs e o seletor de idiomas são a solução desejada. Publicação/merge exigem autorização expressa separada.
