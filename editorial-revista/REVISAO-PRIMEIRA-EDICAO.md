# Revista Intellih — revisão editorial da primeira edição

**Status:** pauta, textos, imagens e SEO em revisão; NÃO publicar nem fazer merge. **Atualizado:** 17/09/2026.

## Ordem editorial recomendada

1. **Destaque — notícia explicada:** anãs marrons de massa estimada em cerca de duas massas de Júpiter em IC 348. Resultado divulgado em 15/09/2026; não dizer que uma estrela adulta encolheu nem que foi descoberto um planeta orbitando uma anã marrom.
2. **Ciência / explicador:** por que a luz não escapa de um buraco negro? O disco luminoso ao redor NÃO é luz saindo de dentro do horizonte de eventos.
3. **Tecnologia / IA com Método:** nem toda IA é generativa. Exemplos de classificação, estimativa numérica, recomendação e geração; não tratar aprendizado de máquina e IA como sinônimos.
4. **Ciência / contexto histórico:** a Lua pode ter se formado em poucas horas? Trata-se de uma simulação publicada em **outubro de 2022**, não de uma descoberta feita em setembro de 2026.
5. **Tecnologia / aprofundamento:** vai chover? A diferença entre classificar e estimar um valor. O texto atual funciona como complemento do artigo anterior, não como nova notícia. Título alternativo mais preciso: “Vai chover? Classificar e estimar são tarefas diferentes”.

## Checagem factual dos quatro artigos existentes

| Rascunho | Avaliação e ajuste antes da publicação | Fonte de referência |
| --- | --- | --- |
| Lua | Explicação alinhada ao trabalho de 2022. Manter “pode”, “simulação” e a data original no corpo e na página; não dar aparência de notícia recém-publicada. | https://www.nasa.gov/solar-system/collision-may-have-formed-the-moon-in-mere-hours-simulations-reveal/ |
| Buraco negro | O texto diferencia corretamente a região externa e o horizonte de eventos. Preservar a distinção entre visualização e fotografia; adicionar explicitamente o crédito da arte final. | https://science.nasa.gov/universe/black-holes/anatomy/ |
| Nem toda IA é generativa | O argumento é adequado para a revista. Melhorar a abertura com uma frase dizendo que *aprendizado de máquina é um conjunto de técnicas dentro de IA*, e que “gerar conteúdo” é apenas um grupo de aplicações. | https://developers.google.com/machine-learning/crash-course?hl=pt-BR |
| Previsão/classificação | Esclarecer “previsão” como termo geral: o resultado pode ser uma classe, probabilidade ou quantidade numérica. Se o alvo for milímetros de chuva, um modelo de regressão é uma das formulações possíveis. | https://developers.google.com/machine-learning/crash-course/classification?hl=pt-BR ; https://developers.google.com/machine-learning/crash-course/linear-regression?hl=pt-BR |

O conteúdo original de `editorial-revista/conteudo/artigos.json` não foi reescrito por este documento: a revisão está registrada separadamente para evitar publicar mudanças não aprovadas.

## Imagens: seleção e uso editorial

**Destaque IC 348 — usar a observação real, não gerar uma “foto” da anã marrom:**

- Página de imagem: https://esawebb.org/images/weic2619a/
- Alternativa de download no site da NASA: https://science.nasa.gov/asset/webb/ic-348-nircam-image-2/
- Sugestão: selecionar o JPEG `Screensize` da ESA/Webb ou JPEG 1616×2000 da NASA e produzir uma versão WebP otimizada para a capa; evitar os arquivos originais de centenas de MB.
- **Crédito da imagem ESA, reproduzir integralmente e associar visivelmente à imagem:** `ESA/Webb, NASA, CSA, K. Luhman, C. Alves De Oliveira, M. Zamani (ESA/Webb)`.
- Legenda: “Região de formação estelar IC 348 observada pelo James Webb. A imagem reúne estrelas jovens, gás e poeira; a massa das anãs marrons foi estimada também a partir de observações espectroscópicas.” Não afirmar que uma estrela específica em um recorte comum corresponde à anã marrom de duas massas de Júpiter, salvo identificação documentada.
- A ESA/Webb publica essas imagens sob CC BY 4.0, com crédito integral, legível e link para a fonte: https://esawebb.org/copyright/. Verificar eventual alteração das condições antes da publicação.

**Buraco negro:** opção científica de visualização, nunca rotular como foto: https://svs.gsfc.nasa.gov/13326/. Crédito indicado: `NASA’s Goddard Space Flight Center/Jeremy Schnittman`. Baixar a imagem estática adequada da página, conferir o crédito do arquivo específico e registrar “visualização científica”.

**Lua:** escolher imagem ou quadro da simulação da notícia original de 04/10/2022: https://www.nasa.gov/solar-system/collision-may-have-formed-the-moon-in-mere-hours-simulations-reveal/. Conferir o crédito do recurso específico e rotular como “simulação”, não fotografia.

**IA:** manter ilustração autoral claramente identificada, ou substituí-la por fotografia editorial com direitos verificados. Não usar captura de tela fabricada nem atribuir uma visualização conceitual a um estudo real.

No HTML, o `alt` descreve **o que a imagem mostra**, enquanto `figcaption` (ou legenda imediatamente adjacente) contém crédito e natureza da imagem. Evitar usar apenas o crédito como texto alternativo.

## Proposta de metadados finais (somente após aprovação)

| Página | `<title>` proposto | Descrição sugerida |
| --- | --- | --- |
| `/revista/` | Revista Intellih: ciência, tecnologia e descobertas | Ciência, tecnologia e histórias surpreendentes explicadas com fontes e contexto. Conheça as notícias e os explicadores da Revista Intellih. |
| `/revista/artigos/webb-anas-marrons-duas-massas-jupiter` | Webb encontra anãs marrons com duas massas de Júpiter | Em IC 348, observações do Webb revelaram anãs marrons com massas estimadas em apenas duas vezes a de Júpiter. Entenda o que os dados indicam. |
| `/revista/artigos/por-que-luz-nao-escapa-buraco-negro` | Por que a luz não escapa de um buraco negro? | A luz não tem massa de repouso. Entenda o horizonte de eventos e por que a geometria do espaço-tempo impede a saída da região interna. |
| `/revista/artigos/nem-toda-ia-e-generativa` | Nem toda IA é generativa: prever, classificar e gerar | IA não se resume a chatbots. Compare classificação, estimativas numéricas, recomendação e geração de conteúdo com exemplos cotidianos. |
| `/revista/artigos/lua-formacao-em-horas` | A Lua pode ter se formado em horas? O que diz o estudo | Simulações divulgadas em 2022 propuseram uma origem rápida para a Lua. Veja o que o modelo indica e quais questões continuam abertas. |

Ajustar slugs e URLs ao comportamento real de `cleanUrls`/`trailingSlash` da Vercel antes de adicionar canonical e sitemap; **não indexar a prévia**. Definir a data de publicação apenas no dia em que cada artigo for aprovado e publicado, distinta da data da pesquisa original. Adicionar Open Graph (`og:title`, `og:description`, `og:image`), canonical absoluto de produção e, para artigos publicados, dados estruturados `Article` com autor/editoria/data/imagem de direitos confirmados.

## Trava de publicação

- [ ] Aprovação editorial dos textos, títulos e ordem da homepage.
- [ ] Download real de cada imagem, licença/crédito, legenda e `alt` revisados.
- [ ] Gerar as páginas HTML e testar mobile, menu, artigos e referências na Vercel Preview.
- [ ] Revisar datas de publicação, canonical, Open Graph e sitemap **somente das páginas finais**.
- [ ] Remover `noindex,nofollow` e aviso de prévia somente na etapa de lançamento aprovada; não usar o sitemap existente para incluir rascunhos.
- [ ] Manter `public/index.html`, `public/blog/` e páginas de soluções intocados. Não fazer merge na `main` sem autorização expressa.
