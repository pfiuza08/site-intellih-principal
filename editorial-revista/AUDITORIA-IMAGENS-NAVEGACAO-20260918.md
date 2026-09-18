# Revista Intellih — auditoria inicial de imagens e navegação

**Data:** 18/09/2026. **Escopo:** branch `revista-preview-20260917`, sem autorização para publicação ou merge na `main`.

## Verificado e corrigido

1. **Imagem Webb na capa e nos artigos:** o endereço `https://cdn.esawebb.org/archives/images/screen/weic2619a.jpg` corresponde à observação da região IC 348, identificada como imagem NIRCam de 15/09/2026 no catálogo ESA/Webb. O crédito integral informado na revista coincide com a linha da página original: `ESA/Webb, NASA, CSA, K. Luhman, C. Alves De Oliveira, M. Zamani (ESA/Webb)`. O texto deixa claro que o panorama não identifica individualmente as anãs marrons. Fonte: https://esawebb.org/images/weic2619a/ . Política de reutilização e crédito: https://esawebb.org/copyright/ . A disponibilidade da imagem externa dentro da prévia hospedada não foi confirmada visualmente nesta auditoria.
2. **Três artes locais:** `lua-impacto.svg`, `buraco-negro.svg` e `ia-modelos.svg` existem na branch, renderizam como ilustrações vetoriais esquemáticas e têm identificação como arte/ilustração conceitual nas páginas das respectivas matérias. Nenhuma é fotografia nem captura da simulação da Lua. Confirmar proveniência e autorização de uso definitivo antes de lançar.
3. **Busca:** corrigido em `public/revista/assets/app.js` o conflito entre `hidden` e o CSS de cartões; busca sem acentos, estado sem resultados e menu passaram em teste local de navegador. A busca, que hoje filtra apenas os cartões da página, não é mais oferecida em artigos individuais e editorias vazias, onde antes era inoperante. Não se afirma que exista busca de acervo completo.
4. **Rodapé:** corrigida no gerador e nas páginas a expressão que chamava todas as imagens de capa de ilustrativas, já que a fotografia científica de IC 348 é uma observação real.
5. **Links e recursos internos:** verificação automatizada da árvore gerada passou para 12 HTMLs e 284 referências internas a páginas/recursos da revista; a URL antiga `/revista/editorias/ia-com-metodo.html` encaminha para a editoria `Inteligência Artificial`.
6. **Segurança da prévia:** a verificação confirmou `noindex,nofollow`, aviso de revisão nas páginas (exceto no redirecionamento legado), crédito Webb nos HTMLs que usam a fotografia e ausência de alterações nas fontes dos quatro textos aprovados.

## Revisões ainda necessárias

- **Visual no site real:** abrir a prévia Vercel no computador e no celular; conferir carregamento, enquadramento e legibilidade do crédito completo da fotografia Webb, assim como cortes e dimensões das três ilustrações. A conexão à prévia ficou indisponível no ambiente de auditoria; testes de código e de navegador local não equivalem a esse teste real.
- **Direção visual:** decidir manter as três ilustrações vetoriais ou substituí-las por visuais mais realistas, conservando identificação precisa e direitos de uso.
- **Editorias vazias:** Natureza e Cultura exibem honestamente `0 artigo(s)` e `Em preparação`. Decidir se permanecem acessíveis no primeiro lançamento ou se seus links devem ficar ocultos até haver conteúdo.
- **Links externos e publicação:** verificar manualmente links das fontes científicas e o destino institucional, direitos das ilustrações, data real, créditos finais, metadata SEO e páginas de privacidade; manter a revista fora da indexação até autorização expressa.

**Não foi feito:** publicação, merge, liberação de indexação, alteração na página principal de negócios/blog, ativação de anúncios ou criação de traduções.
