(function () {
  'use strict';
  // Estilos adicionais exclusivos da edição de estreia; CSS mobile aprovado permanece inalterado.
  if (document.querySelector('.editorial-figure')) {
    const style = document.createElement('style');
    style.textContent = '.editorial-figure{margin:0;min-width:0}.editorial-figure .image-credit{color:#4d4a46;font-size:11px;font-weight:500;line-height:1.45;margin:6px 0 0}.lead-card .editorial-figure .image-credit{margin-bottom:4px}.article-media .editorial-figure .image-credit{font-size:12px;margin-top:8px}.article-media .image-credit a{text-decoration:underline;text-underline-offset:2px;color:#844016}';
    document.head.appendChild(style);
  }
  const menu = document.querySelector('[data-menu-toggle]');
  const nav = document.querySelector('[data-primary-nav]');
  const searchToggle = document.querySelector('[data-search-toggle]');
  const panel = document.querySelector('[data-search-panel]');
  if (menu && nav) {
    menu.addEventListener('click', () => {
      const opened = nav.classList.toggle('open');
      menu.setAttribute('aria-expanded', String(opened));
    });
    nav.addEventListener('click', (e) => {
      if (e.target.closest('a')) { nav.classList.remove('open'); menu.setAttribute('aria-expanded','false'); }
    });
  }
  if (searchToggle && panel) {
    searchToggle.addEventListener('click', () => {
      const opened = panel.classList.toggle('open');
      searchToggle.setAttribute('aria-expanded', String(opened));
      if (opened) panel.querySelector('input')?.focus();
    });
  }
  const form = document.querySelector('[data-search-form]');
  const input = form?.querySelector('input');
  const cards = Array.from(document.querySelectorAll('[data-search-card]'));
  const empty = document.querySelector('[data-search-empty]');
  function filter() {
    if (!input || !cards.length) return;
    const query = input.value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
    let count = 0;
    for (const card of cards) {
      const hay = (card.dataset.search || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
      const shown = hay.includes(query);
      card.hidden = !shown;
      if (shown) count++;
    }
    if (empty) empty.style.display = count ? 'none' : 'block';
  }
  form?.addEventListener('submit', e => { e.preventDefault(); filter(); document.querySelector('[data-collection]')?.scrollIntoView({behavior:'smooth'}); });
  input?.addEventListener('input', filter);
})();
