# Revista Intellih — gate de lançamento

**Revisão:** 18/09/2026 · **Situação:** preparação na branch `revista-preview-20260917`; PR #2 aberto em rascunho. **Este documento não autoriza merge ou publicação.**

## Confirmado

- Quatro artigos aprovados e imagens respectivas; a responsável editorial confirmou a capa, artigos e miniaturas no celular e no computador, inclusive o novo símbolo do especial “Parece Inventado?”.
- Natureza e Cultura **continuam visíveis no menu** com páginas “Em preparação”. Nenhuma matéria fictícia será criada para preenchê-las.
- O rodapé traz o único link “Soluções baseadas em IA” para `https://intellih.com.br/`. O serviço específico Análise de Presença Digital foi removido dos links da revista.
- As ilustrações de IA permanecem identificadas como tais e o panorama IC 348 possui crédito integral da ESA/Webb. Preservar essa atribuição e a distinção entre fotografia e ilustração.
- Metadados sociais de **texto** (Open Graph e Twitter/X) existem. Imagens sociais horizontais são melhoria posterior, não condição para lançar; não configurar `og:image` não revisado.
- [Auditoria técnica de prévia](https://github.com/pfiuza08/site-intellih-principal/actions/runs/35401556465): `success`; **12 HTMLs, quatro artigos, 311 referências locais resolvidas**, `alt`, créditos, recursos de imagens, menus e avisos de prévia checados. Auditoria **estática**, não substitui ensaio no domínio público nem teste de todos os links externos. Script de auditoria somente leitura: `editorial-revista/preflight.py`.
- Conferida a lista de arquivos alterados pelo PR: mudanças limitadas à revista, arquivos editoriais e ferramenta de teste; `public/index.html`, `public/blog/`, `robots.txt`, `sitemap.xml` e `vercel.json` permanecem fora do PR neste estágio.

## Preparação pendente — executar somente depois da autorização explícita de publicar

1. **Data verdadeira:** no ato do lançamento, preencher a data efetiva de publicação dos quatro artigos; preservar separadamente as datas dos fatos científicos (Webb, 15/09/2026; simulação lunar, 2022). Substituir “Rascunho em”, “texto em revisão”, “primeira edição em revisão”, aviso `PRÉVIA EDITORIAL`, referências de “protótipo” e nota de revisão editorial. Não fazer esta limpeza antes do sinal de publicação: a prévia precisa continuar claramente identificada.
2. **Páginas que podem ser indexadas:** remover `noindex,nofollow` apenas da capa, quatro artigos e editorias com artigos. Manter `noindex` nas editorias vazias Natureza/Cultura e no redirecionamento legado, sem removê-los do menu. `nofollow` não deve ser usado para suprimir artificialmente os links editoriais das páginas lançadas.
3. **URL definitiva:** confirmar como `cleanUrls: true` e `trailingSlash: false` resolvem, no domínio `https://www.intellih.com.br`, cada endereço real antes de gravar `canonical` e `og:url`. A raiz revista pode redirecionar entre `/revista/` e `/revista`; usar como canônica a URL que efetivamente prevalecer, jamais o subdomínio da Vercel. Adicionar `datePublished` somente com data efetiva e revisão dos dados estruturados, se implementados.
4. **Sitemap institucional:** acrescentar apenas a revista, quatro matérias e editorias com artigos ao `sitemap.xml` que já existe **na raiz do repositório**, preservando todas as entradas originais; não inserir Natureza, Cultura ou prévia. O `robots.txt` da raiz já aponta para esse sitemap: evitar reescrevê-lo sem necessidade.
5. **Site principal:** adicionar link visível “Revista” para a URL definitiva no site institucional com alteração mínima e sem recriar a homepage; preservar `/`, `/blog/` e serviços. Fazer comparação com os arquivos da `main` imediatamente antes do merge e revisar a alteração da página institucional isoladamente.
6. **Deploy e smoke test:** após autorização, testar no domínio final `/`, `/blog/`, revista, quatro artigos, editorias vazias, busca local, menu mobile, miniaturas WebP/PNG, crédito legível da ESA/Webb, fonte científica e “Soluções baseadas em IA”. Verificar HTML efetivamente entregue (robots/canonical/og:url/data), redirects e sitemap. Em caso de falha, reverter a alteração pelo GitHub/Vercel, sem apagar o site original.

## Itens que não precisam atrasar a estreia

Imagens sociais personalizadas, versão multilíngue, AdSense, newsletter e novas matérias para Natureza/Cultura. Esses itens serão tratados depois, sem simular funcionalidades disponíveis.

## Gate humano

**Pedir autorização inequívoca para publicar a Revista Intellih em `intellih.com.br/revista` antes de editar `main`, liberar indexação, alterar o site institucional, fazer merge ou ativar auto-merge.** A aprovação do layout da prévia e o desejo de lançar “quanto antes” não equivalem a autorização de publicação. Depois da aprovação, aplicar e validar as mudanças acima; informar a URL final e qualquer pendência residual antes de anunciar conclusão.
