# Revista Intellih — revisão pré-publicação

**Preparada em:** 18/09/2026. **Alvo auditado:** branch `revista-preview-20260917`, PR #2 em rascunho. **Estado:** prévia, não autorização para lançamento. O site institucional, o blog, o `sitemap.xml` e o `robots.txt` de produção não foram alterados.

## 1. O que já foi conferido

| Item | Situação e limite da verificação |
|---|---|
| Conteúdo | Quatro artigos aprovados permanecem na prévia. O estudo lunar de 2022 é apresentado como hipótese, não notícia recém-divulgada. Não foi feita nova revisão linha a linha de toda a ciência nesta rodada. |
| Celular | Responsável editorial confirmou a correção da abertura dos artigos e enviou capturas da capa, da Lua, do buraco negro e da IA. Nas imagens fornecidas, enquadramentos e créditos estão legíveis. Isso não substitui teste em outros aparelhos/tamanhos. |
| Integridade estática | Auditoria executada em GitHub Actions com resultado `success` em 18/09: **12 HTMLs, 318 referências internas verificadas**, sem referência local ausente, título HTML duplicado, ID repetido, imagem sem `alt` ou crédito ausente nas quatro páginas de artigo. Teste: https://github.com/pfiuza08/site-intellih-principal/actions/runs/35384755046 . É teste dos arquivos do repositório, não um teste de rede da Vercel. |
| Imagens | Fotografia do Webb: panorama IC 348, crédito integral ESA/Webb na capa e no artigo. Três outras matérias: imagens de IA identificadas como ilustração artística/conceitual. Os três arquivos locais existem. |
| Editorias | **Natureza e Cultura permanecem no menu, com “Em preparação”**, conforme decisão da responsável editorial. |
| Estado de prévia | Todas as 12 páginas verificadas mantêm `noindex,nofollow` e o PR continua em rascunho. Isso protege contra indexação pretendida, mas não torna a URL da Vercel privada ou inacessível a quem possuir o link. |
| Otimização de imagens | **Concluída na prévia:** três WebPs (572.242 B no total) com fallback dos PNGs originais (5.878.505 B no total), redução de 90,3% dos bytes dessas três imagens quando o navegador usa WebP. Teste dos quatro corpos aprovados e das 12 páginas passou. Detalhes: `editorial-revista/OTIMIZACAO-IMAGENS-20260918.md`. Revalidar visualmente no site hospedado após a conversão. |

## 2. Fontes, datas e direitos — verificação de referência

- **Webb:** o comunicado ESA/Webb `weic2619` é de **15/09/2026** e relata anãs marrons com massa estimada em cerca de duas massas de Júpiter na região IC 348. O arquivo da revista usa `data_divulgacao: 2026-09-15`; o campo `data: 2026-09-17` corresponde ao **rascunho da revista**, não à data do comunicado. O catálogo da imagem `weic2619a` confirma a fotografia de observação e o crédito `ESA/Webb, NASA, CSA, K. Luhman, C. Alves De Oliveira, M. Zamani (ESA/Webb)`. Fontes: https://esawebb.org/news/weic2619/ e https://esawebb.org/images/weic2619a/ . A política ESA/Webb determina crédito **completo, claramente visível e legível**, sem implicar endosso institucional: https://esawebb.org/copyright/ . A presença do crédito foi confirmada no HTML e em captura de celular; confirmar também no desktop.
- **Lua:** o texto da NASA que apresenta a hipótese de formação em horas foi publicado em **04/10/2022**; a imagem da revista é arte gerada com IA, **não** um frame da simulação. Fonte: https://www.nasa.gov/solar-system/collision-may-have-formed-the-moon-in-mere-hours-simulations-reveal/ .
- **Buraco negro:** as duas páginas de referência da NASA abriram na consulta: https://science.nasa.gov/universe/black-holes/anatomy/ e https://www.nasa.gov/universe/what-are-black-holes/ .
- **IA:** o curso do Google e a página de classificação sem parâmetro abriram: https://developers.google.com/machine-learning/crash-course e https://developers.google.com/machine-learning/crash-course/classification . A URL atual do artigo com `?hl=pt-BR` retornou erro na ferramenta de consulta, **sem comprovação de erro para o leitor**. Testar essa URL num navegador comum e, se falhar, substituir pelo endereço canônico sem parâmetro e regenerar o artigo.
- **Datas editoriais:** os três artigos atemporais apresentam rascunho de **16/09/2026**; Webb, **17/09/2026**. Não transformar esses campos em “Publicado em” nem usar `datePublished` com essas datas por conveniência. Definir a data efetiva de cada publicação no momento do lançamento; usar a data do evento científico separadamente.

## 3. Pendências para o lançamento — por prioridade

### Necessárias antes de disponibilizar ao público

- [ ] **Validar em desktop** a capa, quatro artigos, menu, créditos (especialmente o crédito integral do Webb), links de “Continue explorando”, imagens e editorias. Até agora a Vercel retornou `success`, mas a visualização remota no desktop não pôde ser concluída pelos instrumentos desta revisão.
- [ ] **Testar no navegador** os links externos, sobretudo a URL do Google com `?hl=pt-BR`, e os destinos institucionais e de contato. Resultado de busca ou status de CI não garante que o link funcione no navegador do visitante.
- [ ] **Definir a data real de publicação** da edição e dos quatro artigos; substituir avisos e rótulos de rascunho apenas nas páginas efetivamente aprovadas. Manter o estudo lunar datado em 2022 nas referências, sem apresentá-lo como novidade de setembro de 2026.
- [ ] **Preparar metadados de compartilhamento e SEO**: o teste encontrou 11 páginas completas sem `og:title`; o gerador atual também não produz `og:description`, `og:image`, URL canônica nem cartões sociais específicos. Definir URL definitiva sob `https://www.intellih.com.br/revista/`, imagem de compartilhamento por matéria e data real antes de acrescentar canonical, Open Graph, Twitter/X e, se útil, dados estruturados `Article`/`NewsArticle`. Não usar a URL da Vercel como canonical.
- [ ] **Preparar a indexação apenas das páginas lançadas**: remover `noindex,nofollow` delas somente após aprovação expressa, decidir o tratamento de Natureza/Cultura enquanto vazias, integrar as URLs da revista ao `sitemap.xml` da raiz **sem apagar as entradas institucionais** e definir link para a revista no site principal, preservando `/` e `/blog/`. O `sitemap.xml` atual está na raiz do repositório, sem entradas da revista; `robots.txt` aponta para ele. Não alterar essas configurações durante a prévia.
- [ ] **Revisar os direitos e o uso das três imagens criadas com IA** segundo os termos aplicáveis à ferramenta e o uso comercial pretendido; conservar rótulos de ilustração. Não chamar simulação, arte conceitual ou imagem gerada de fotografia científica.

### Melhorias recomendadas antes de divulgação ampla

- [x] **Otimizar as três imagens locais para celular, mantendo os PNGs originais.** WebP gerados com redução de 90,3% nos bytes dessas imagens; converter dimensões sem alteração; teste do gerador e preservação de créditos e artigos passaram. **Pendente:** confirmação visual dos WebP na prévia e medição real de carregamento/LCP. Ver relatório de otimização.
- [ ] Conferir títulos e descrições que aparecerão no Google e nos compartilhamentos; confirmar logo, favicon, imagem social e textos finais sem prometer descoberta definitiva nem endosso da ESA.
- [ ] Testar teclado, foco, contraste e leitor de tela; a auditoria de HTML verificou apenas presença de `alt`, IDs e alguns elementos, **não** certificação WCAG.
- [ ] Decidir responsável editorial e canal de correções para fatos posteriores, além da rotina de atualização das datas e das fontes.

## 4. Gate de publicação

**Não fazer merge, não ativar auto-merge e não alterar `main`, homepage, blog, `vercel.json`, `robots.txt` ou `sitemap.xml` antes da autorização expressa da responsável editorial.** Depois de concluir os itens necessários, apresentar uma versão final para aprovação e receber instrução inequívoca sobre publicar a revista em `/revista/`. O deploy da branch de prévia **não é** a publicação no domínio principal.

**Registro de evidência:** auditoria estática https://github.com/pfiuza08/site-intellih-principal/actions/runs/35384755046 e otimização https://github.com/pfiuza08/site-intellih-principal/actions/runs/35385688989 . Consulta às fontes oficiais e revisão dos arquivos citados acima. Visuais de celular foram fornecidos pela responsável editorial; não houve teste automatizado da Vercel em desktop nesta rodada.
