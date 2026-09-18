# Revista Intellih — otimização de imagens da prévia

**Data:** 18/09/2026. **Escopo:** exclusivamente `revista-preview-20260917`; não autoriza publicação.

## Alteração aplicada

As três imagens geradas com IA ganharam versões WebP, com as **mesmas dimensões de 1122 × 1402 px**. O gerador em `editorial-revista/build.py` produz `<picture><source type="image/webp" ...><img src="...png" ...></picture>` para as três imagens locais. Os PNGs originais permanecem intactos como alternativa para navegadores sem WebP. A fotografia científica externa ESA/Webb permanece inalterada. O CSS preserva o enquadramento existente.

| Matéria | PNG original | WebP |
|---|---:|---:|
| Lua | 2.169.113 B | 259.900 B |
| Buraco negro | 2.152.106 B | 198.546 B |
| IA não generativa | 1.557.286 B | 113.796 B |
| **Total das três imagens** | **5.878.505 B** | **572.242 B** |

Redução combinada de **90,3%** no tamanho dos três arquivos de imagem quando o navegador escolhe WebP, sem contar demais recursos da página ou a imagem externa da ESA. **Não se afirma que o tempo real de carregamento caiu 90,3%**; isso requer medições no dispositivo/rede. Conversão WebP com qualidade 90, preservando dimensões; inspeção visual das imagens convertidas no site hospedado ainda pendente.

## Verificações e restrições

GitHub Actions: https://github.com/pfiuza08/site-intellih-principal/actions/runs/35385688989 — resultado `success`. Verificados: 12 HTMLs com `noindex,nofollow`, existência dos três WebP e PNGs, ausência de alteração nos PNGs originais, crédito ESA/Webb intacto, créditos das três ilustrações e **corpos dos quatro artigos idênticos** antes/depois da regeneração. Workflow e script temporários removidos ao fim.

A consulta às fontes oficiais NASA/ESA e à página-base do curso Google e da classificação sem parâmetro funcionou. O endereço de classificação com `?hl=pt-BR` retornou **falha de consulta nesta ferramenta**, o que não comprova defeito do link para leitores; conferir em navegador antes de alterá-lo. A prévia Vercel e o destino institucional também não puderam ser verificados por esta ferramenta externa. Não declarar desktop ou teste de rede concluído.

**Próximos gates:** conferir a capa e as quatro matérias no desktop e revisar texto pequeno da imagem de IA no WebP; testar links externos no navegador; definir datas reais de publicação, URL canônica e metadados Open Graph/imagens sociais antes do lançamento. Não retirar o aviso de prévia nem `noindex` e não alterar `main`, homepage, blog, `sitemap.xml` ou `robots.txt` sem autorização expressa.
