# Revista Intellih — estado da prévia após correção do upload

**Somente branch `revista-preview-20260917`. Não fazer merge na `main` nem publicar.**

A tentativa de upload via navegador não havia incluído a matéria de estreia. A correção direta no GitHub atualizou o HTML da homepage, acrescentou a página do artigo Webb/IC 348, incluiu a matéria nas editorias Ciência e Parece Inventado? e adicionou estilos de crédito fotográfico ao JavaScript da revista, sem substituir o CSS mobile aprovado.

**Importante:** o gerador em `editorial-revista/build.py` e os dados em `editorial-revista/conteudo/artigos.json` ainda descrevem a versão anterior (quatro artigos). **Não execute `python editorial-revista/build.py` nem sobrescreva os HTMLs até sincronizarmos o gerador e o acervo na próxima etapa**, pois isso retiraria a matéria de estreia da prévia.

Os quatro artigos anteriores são demonstrações ainda sujeitas a revisão. Todos os HTMLs da prévia permanecem com `noindex,nofollow`; a imagem de IC 348 está carregada por URL externa da ESA/Webb e deve ser verificada visualmente, incluindo o crédito. Não alteramos `public/index.html`, `public/blog/`, `sitemap.xml` ou as páginas comerciais.

**Próxima revisão:** confirmar imagem e navegação na Vercel, sincronizar fonte de dados e gerador, revisar texto e direitos, depois decidir com autorização separada sobre a publicação na `main`.
