(function () {
  'use strict';

  const measurementId = 'G-PLP8JCYHE5';

  const storageKey = 'intellih_analytics_consent_v1';
  let preference = null;
  let started = false;
  try { preference = localStorage.getItem(storageKey); } catch (_) { /* Armazenamento indisponível. */ }

  function startAnalytics() {
    if (started) return;
    started = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', measurementId);
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(measurementId);
    document.head.appendChild(script);

    // A medição automática de cliques do GA4 cobre links externos. Este evento
    // identifica os acessos a matérias dentro da própria revista.
    document.addEventListener('click', function (event) {
      const link = event.target.closest('a[href]');
      if (!link) return;
      const url = new URL(link.href, location.href);
      if (url.origin !== location.origin || !/^\/revista\/artigos\/[^/]+(?:\.html)?\/?$/.test(url.pathname)) return;
      const slug = url.pathname.split('/').filter(Boolean).pop().replace(/\.html$/, '');
      window.gtag('event', 'article_click', {
        article_slug: slug,
        link_source: location.pathname
      });
    });
  }

  const notice = document.createElement('section');
  notice.className = 'analytics-choice';
  notice.setAttribute('role', 'dialog');
  notice.setAttribute('aria-label', 'Preferências de medição');
  notice.innerHTML = '<h2>Medição de acessos</h2><p>Podemos medir as páginas lidas e os cliques em matérias da revista com o Google Analytics? <a href="/politica-de-privacidade.html">Leia a política de privacidade</a>.</p><div class="analytics-choice-actions"><button type="button" data-analytics-allow>Permitir medição</button><button type="button" data-analytics-deny>Não permitir</button></div>';
  notice.hidden = preference === 'granted' || preference === 'denied';
  document.body.appendChild(notice);

  function choose(value) {
    preference = value;
    try { localStorage.setItem(storageKey, value); } catch (_) { /* Escolha válida nesta página. */ }
    notice.hidden = true;
    if (value === 'granted') startAnalytics();
    if (value === 'denied' && started) location.reload();
  }
  notice.querySelector('[data-analytics-allow]').addEventListener('click', function () { choose('granted'); });
  notice.querySelector('[data-analytics-deny]').addEventListener('click', function () { choose('denied'); });
  document.querySelector('[data-analytics-settings]')?.addEventListener('click', function () {
    notice.hidden = false;
    notice.querySelector('[data-analytics-allow]').focus();
  });
  if (preference === 'granted') startAnalytics();
})();
