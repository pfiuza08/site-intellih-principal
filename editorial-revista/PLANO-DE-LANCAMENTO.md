# Revista Intellih — etapa 2: preparar a primeira publicação

**Status:** proposta editorial e técnica para aprovação. **Nada foi publicado ou alterado no domínio.**
**Decisão já tomada:** manter a homepage de soluções como está; lançar a revista separadamente em `https://www.intellih.com.br/revista/`; conservar o blog atual em `/blog/`.

## Entrega inicial enxuta

1. Home editorial da revista, com matéria em destaque e cards recentes.
2. Editorias ativas: Ciência e Tecnologia; coleções transversais: Parece Inventado? e IA com Método. Natureza, Cultura e Comportamento entram no menu quando tiverem ao menos uma matéria aprovada.
3. Três textos de estreia para revisão: (a) notícia atual sobre anãs marrons no aglomerado IC 348, divulgada em 15/09/2026; (b) explicação atemporal sobre por que a luz não escapa de um buraco negro; (c) artigo conceitual sobre funções de IA além da geração de conteúdo. Não tratar o estudo lunar de 2022 como notícia nova.
4. Template de artigo com data de publicação, data de atualização se houver, editoria, fonte primária, crédito e descrição da imagem, links relacionados e distinção entre fato, hipótese e interpretação.
5. Busca: nesta primeira etapa, usar links por editoria. A busca local que filtra apenas cards da página deve ser rotulada assim, não como busca no site inteiro.

## Rotina editorial viável

**Pauta → fonte primária → checagem de cada afirmação → texto → imagem com licença verificada → revisão → publicação → divulgação.**

- Uma notícia curta quando houver um fato recente verificável; um explicador permanente quando não houver.
- O conteúdo do site vem antes dos formatos sociais. Um único texto pode render um carrossel para Intellih e um Short para Parece Inventado? se a história realmente comportar esses formatos.
- Não inventar data de publicação, atribuição de fonte, imagem científica, quote ou detalhes não presentes nas fontes.
- Não publicar páginas de editoria vazias com aparência de cobertura ativa.

## Checklist técnico de lançamento (após a revisão editorial)

- [ ] Confirmar hospedagem, forma de acesso e como hoje são enviados os arquivos ao domínio.
- [ ] Obter o **ZIP original do protótipo da revista** para editar os arquivos exatos, sem recriar ou sobrescrever a página de soluções.
- [ ] Fazer backup do que está publicado e registrar URLs existentes, especialmente `/` e `/blog/`.
- [ ] Adaptar o protótipo para `/revista/` e testar todos os caminhos de imagens, CSS, JS e artigos no endereço final.
- [ ] Substituir avisos de protótipo e ilustrações provisórias; confirmar direito de uso e crédito de cada imagem.
- [ ] Corrigir títulos, descrições, dados de artigo e canonical para URLs finais; não usar a mesma descrição em todos os artigos.
- [ ] Tirar `noindex,nofollow` **somente das páginas efetivamente aprovadas e publicadas**; não remover de páginas provisórias.
- [ ] Atualizar ou gerar um sitemap da revista sem substituir indevidamente o sitemap do restante do domínio.
- [ ] Inserir link navegável para `/revista/` no site institucional, sem mudar seu layout; verificar se o blog antigo continua funcionando.
- [ ] Testar navegação móvel, acessibilidade básica e links das fontes.
- [ ] Inspecionar URL e sitemap no Google Search Console após publicar; acompanhar indexação sem prometer prazo.

**Dependência para a implantação:** saber se os arquivos são publicados por Vercel/GitHub, painel da hospedagem, FTP ou CMS. Sem isso, ainda não é seguro orientar um upload específico.
