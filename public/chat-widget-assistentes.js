(function () {
  const WHATSAPP_NUMBER = '5521995558808';
  const demos = {
    site: {
      tag: 'Site', title: 'Assistente para site', name: 'Clara — Clínica Aurora',
      interest: 'Site existente', message: 'Tenho interesse em um assistente para meu site.',
      description: 'Veja como orientamos o visitante até o pré-agendamento.',
      flow: [
        ['Olá! Eu sou a Clara, assistente da Clínica Aurora. Como posso ajudar?', ['Conhecer especialidades', 'Consultar horários', 'Iniciar pré-agendamento']],
        ['Atendemos clínica geral, dermatologia, ginecologia, pediatria e nutrição. Qual especialidade você procura?', ['Nutrição', 'Dermatologia', 'Ainda não sei']],
        ['Você prefere atendimento presencial ou online?', ['Presencial', 'Online']],
        ['Qual período costuma ser melhor para você?', ['Manhã', 'Tarde', 'Noite']],
        ['Posso registrar seu interesse e encaminhar estas informações para a equipe continuar o atendimento.', ['Pode encaminhar', 'Quero falar com alguém']],
        ['A continuidade do atendimento foi encaminhada para uma pessoa da equipe, com as informações da conversa já organizadas.', ['FINAL:Especialidade identificada • modalidade e período registrados • atendimento encaminhado para a equipe']]
      ]
    },
    bio: {
      tag: 'Instagram', title: 'Assistente para bio', name: 'Marina — Nutrição e Conteúdo',
      interest: 'Página de bio / Instagram', message: 'Tenho interesse em uma página de bio com assistente.',
      description: 'Em vez de vários botões, identificamos o objetivo e indicamos o caminho adequado.',
      flow: [
        ['Olá! O que você procura hoje?', ['Conhecer atendimentos', 'Encontrar conteúdo', 'Descobrir o melhor caminho']],
        ['Você quer atendimento, material gratuito ou informações sobre acompanhamento?', ['Atendimento', 'Conteúdo gratuito', 'Acompanhamento']],
        ['Prefere uma opção online ou presencial?', ['Online', 'Presencial']],
        ['Qual é o seu principal objetivo neste momento?', ['Organizar alimentação', 'Melhorar hábitos', 'Tirar uma dúvida']],
        ['Com essas informações, posso indicar o caminho mais adequado.', ['Ver recomendação']],
        ['A página direcionou você para a opção mais coerente com o seu objetivo.', ['FINAL:Objetivo identificado • formato de atendimento definido • próximo passo apresentado']]
      ]
    },
    landing: {
      tag: 'Campanha', title: 'Assistente para landing page', name: 'Assistente do Curso',
      interest: 'Landing page de campanha', message: 'Tenho interesse em uma landing page com assistente.',
      description: 'Explicamos a oferta e qualificamos o interessado ao longo da conversa.',
      flow: [
        ['Quer descobrir se este curso combina com você?', ['Sim, quero avaliar', 'Quero conhecer o conteúdo']],
        ['Qual é o seu nível de experiência com IA?', ['Estou começando', 'Já uso algumas ferramentas', 'Uso no trabalho']],
        ['O que você mais quer aprender?', ['Aplicações práticas', 'Como a IA funciona', 'Como usar com mais método']],
        ['Você prefere aulas mais conceituais ou exemplos aplicados?', ['Mais conceituais', 'Mais aplicados', 'Uma combinação']],
        ['Com base nas suas respostas, o curso parece adequado ao seu momento.', ['Quero receber mais informações']],
        ['Seu interesse foi registrado com contexto para que a equipe continue a conversa.', ['FINAL:Perfil identificado • objetivo de aprendizagem registrado • oferta apresentada de forma contextualizada']]
      ]
    },
    faq: {
      tag: 'Atendimento', title: 'FAQ inteligente', name: 'Atendimento CasaCerta',
      interest: 'FAQ / atendimento inicial', message: 'Tenho interesse em um FAQ inteligente para atendimento inicial.',
      description: 'Trabalhamos com respostas validadas, limites claros e encaminhamento quando necessário.',
      flow: [
        ['Olá! Posso responder dúvidas sobre serviços, regiões e orçamento.', ['Regiões atendidas', 'Como pedir orçamento', 'Prazo do serviço']],
        ['Atendemos o Rio de Janeiro e parte da região metropolitana. Qual serviço você procura?', ['Elétrica', 'Hidráulica', 'Manutenção geral']],
        ['Para informar prazo e valor, a equipe precisa avaliar alguns detalhes.', ['Entendi', 'Quero solicitar avaliação']],
        ['Você gostaria de informar a região e o melhor período para contato?', ['Zona Sul — manhã', 'Zona Norte — tarde', 'Outra região']],
        ['A dúvida foi respondida dentro do que estava validado e o restante foi preparado para avaliação humana.', ['Continuar']],
        ['A equipe recebeu a solicitação com o contexto necessário para responder sem repetir todas as perguntas.', ['FINAL:Dúvida respondida • limites respeitados • solicitação preparada para atendimento humano']]
      ]
    },
    triagem: {
      tag: 'Pré-atendimento', title: 'Triagem de interessados', name: 'Assistente de Orçamentos',
      interest: 'FAQ / atendimento inicial', message: 'Tenho interesse em um assistente de pré-atendimento e triagem.',
      description: 'Podemos disponibilizar esse fluxo no site, no WhatsApp ou em outros canais digitais.',
      flow: [
        ['Olá! Vou fazer algumas perguntas para organizar seu pedido de orçamento. Esse atendimento poderia acontecer aqui no site, no WhatsApp ou em outro canal digital. Que serviço você procura?', ['Manutenção elétrica', 'Reparo hidráulico', 'Outro serviço']],
        ['Em qual região o serviço será realizado?', ['Zona Sul', 'Zona Norte', 'Outra região']],
        ['Quando você precisa do atendimento?', ['Com urgência', 'Nesta semana', 'Ainda estou pesquisando']],
        ['Qual é a melhor forma de a equipe continuar o contato?', ['WhatsApp', 'Ligação', 'E-mail']],
        ['Perfeito. Vou organizar o serviço, a região, o prazo e o canal escolhido.', ['Pode continuar']],
        ['A equipe poderá dar continuidade pelo canal escolhido, inclusive pelo WhatsApp, com o contexto da solicitação já registrado e sem pedir tudo novamente.', ['FINAL:Serviço, região e prazo identificados • canal de continuidade definido • lead pronto para retorno']]
      ]
    },
    conhecimento: {
      tag: 'Uso interno', title: 'Assistente de conhecimento', name: 'Base Interna da Equipe',
      interest: 'Base de conhecimento interna', message: 'Tenho interesse em um assistente para consulta de conhecimento interno.',
      description: 'Facilitamos a consulta a procedimentos validados sem exigir buscas em vários documentos.',
      flow: [
        ['Olá! Qual procedimento você precisa consultar?', ['Cadastrar cliente', 'Política de cancelamento', 'Localizar um documento']],
        ['Vou buscar apenas nas orientações internas validadas.', ['Continuar']],
        ['O cadastro exige nome, contato, serviço contratado e responsável pelo atendimento.', ['Ver próximos passos']],
        ['Depois do cadastro, a equipe deve confirmar os documentos e registrar a etapa atual do processo.', ['Consultar exceções']],
        ['Casos fora do procedimento devem ser encaminhados ao responsável, sem inventar uma orientação.', ['Entendi']],
        ['A informação foi localizada com fonte, sequência e limites definidos.', ['FINAL:Procedimento localizado • resposta padronizada • exceções encaminhadas ao responsável']]
      ]
    }
  };

  function track(event, params = {}) {
    try { window.dataLayer = window.dataLayer || []; window.dataLayer.push({ event, ...params }); } catch (_) {}
    try { if (typeof window.fbq === 'function') window.fbq('trackCustom', event, params); } catch (_) {}
  }

  function replaceExact(selector, from, to) {
    document.querySelectorAll(selector).forEach((el) => {
      if (el.textContent.trim() === from) el.textContent = to;
    });
  }

  function prepareCopy() {
    replaceExact('p', 'A Intellih cria assistentes inteligentes para sites, páginas de bio, landing pages e canais digitais. Eles ajudam a explicar serviços, responder perguntas frequentes e encaminhar o visitante para o próximo passo.', 'Criamos assistentes inteligentes para sites, páginas de bio, landing pages e canais digitais. Eles ajudam você a explicar serviços, responder perguntas frequentes e encaminhar cada visitante para o próximo passo.');
    replaceExact('p', 'A proposta não é substituir pessoas. É organizar o primeiro contato, reduzir dúvidas repetidas e melhorar a experiência de quem chega até o seu negócio.', 'Eles não substituem pessoas. Organizam o primeiro contato, reduzem dúvidas repetidas e melhoram a experiência de quem chega até o seu negócio.');
    replaceExact('p', 'O assistente inteligente funciona como um ponto inicial de conversa entre o visitante e o negócio. Ele pode apresentar serviços, responder dúvidas frequentes, coletar informações básicas e encaminhar para atendimento humano quando necessário.', 'Desenvolvemos o assistente inteligente como um ponto inicial de conversa entre o visitante e o negócio. Podemos configurá-lo para apresentar serviços, responder dúvidas frequentes, coletar informações básicas e encaminhar para atendimento humano quando necessário.');
    replaceExact('p', 'Ele não deve prometer o que não sabe, não deve substituir decisões sensíveis e não deve inventar informações. Um bom assistente precisa ter escopo claro, base de conhecimento validada e regras de encaminhamento.', 'Definimos o assistente para não prometer o que não sabe, não substituir decisões sensíveis e não inventar informações. Trabalhamos com escopo claro, base de conhecimento validada e regras de encaminhamento.');
    replaceExact('p', 'Na prática, ele transforma uma página estática em uma experiência mais orientada, útil e interativa.', 'Na prática, transformamos uma página estática em uma experiência mais orientada, útil e interativa.');
    replaceExact('p', 'O assistente pode começar de forma simples e evoluir conforme o negócio amadurece. A escolha depende do canal, da demanda e do tipo de pergunta que o visitante costuma fazer.', 'Podemos começar com uma aplicação simples e evoluí-la conforme o negócio amadurece. Definimos o ponto de partida de acordo com o canal, a demanda e o tipo de pergunta que o visitante costuma fazer.');
    replaceExact('p', 'A tecnologia é apenas uma parte da solução. O valor está em estruturar o escopo, as respostas, os limites e a experiência de conversa.', 'Tratamos a tecnologia como uma parte da solução. Nosso trabalho está em estruturar o escopo, as respostas, os limites e a experiência de conversa.');
    replaceExact('p', 'Nem todo negócio precisa de um assistente complexo no início. O melhor ponto de partida depende do canal, do volume de dúvidas e do objetivo comercial.', 'Não recomendamos começar com complexidade desnecessária. Definimos o melhor ponto de partida de acordo com o canal, o volume de dúvidas e o objetivo comercial.');
    replaceExact('p', 'Envie seu contexto e vamos avaliar se o melhor caminho é um FAQ, uma página com assistente, um assistente para site existente ou uma solução mais avançada.', 'Conte-nos o seu contexto. Vamos avaliar se o melhor caminho é um FAQ, uma página com assistente, um assistente para site existente ou uma solução mais avançada.');
    replaceExact('p', 'Um assistente útil precisa ter limites. Isso aumenta confiança e reduz risco de respostas inadequadas.', 'Definimos limites claros para cada assistente. Assim, aumentamos a confiança e reduzimos o risco de respostas inadequadas.');
    replaceExact('p', 'Quando não souber responder, o assistente deve reconhecer a limitação e encaminhar para atendimento humano.', 'Quando a resposta estiver fora do escopo, configuramos o assistente para reconhecer o limite e encaminhar para atendimento humano quando necessário.');
    replaceExact('p', 'Respostas precisam vir de informações revisadas, regras claras e escopo definido para o negócio.', 'Construímos as respostas a partir de informações revisadas, regras claras e um escopo definido para o negócio.');
    replaceExact('p', 'Não. Ele funciona como primeira camada de orientação. Quando a dúvida exige decisão, negociação ou avaliação específica, o visitante deve ser encaminhado para uma pessoa.', 'Não. Usamos o assistente como primeira camada de orientação. Quando a dúvida exige decisão, negociação ou avaliação específica, encaminhamos o visitante para uma pessoa.');
    replaceExact('p', 'Sim. Uma página de bio inteligente pode reunir serviços, links, FAQ, formulário e assistente para orientar quem chega pelo Instagram.', 'Sim. Podemos criar uma página de bio inteligente que reúna serviços, links, FAQ, formulário e assistente para orientar quem chega pelo Instagram.');
    replaceExact('p', 'Não. Ele deve responder dentro do escopo definido. Perguntas fora do contexto devem ser recusadas ou encaminhadas para atendimento humano.', 'Ele responde tudo o que preparamos para o objetivo para o qual foi criado. Perguntas fora desse contexto são desconsideradas ou, quando fizer sentido, encaminhadas para atendimento humano. Assim, evitamos respostas improvisadas e mantemos o assistente focado no que realmente deve fazer.');
    replaceExact('p', 'Em projetos com assistente ativo, é recomendável ter acompanhamento para ajustes, atualização de informações, revisão de respostas e suporte básico.', 'Em projetos com assistente ativo, recomendamos acompanhamento para ajustes, atualização de informações, revisão de respostas e suporte básico.');
    replaceExact('p', 'Conte onde você quer usar o assistente e qual problema deseja resolver. A Intellih avalia o melhor ponto de partida.', 'Conte-nos onde você quer usar o assistente e qual problema deseja resolver. Avaliamos o melhor ponto de partida para o seu negócio.');
    replaceExact('h2', 'Onde o assistente pode ser usado', 'Onde podemos aplicar o assistente');
    replaceExact('h2', 'O que um assistente não deve fazer', 'Como definimos os limites do assistente');

    const panel = document.querySelector('.hero-panel');
    if (panel) panel.remove();
    const grid = document.querySelector('.hero-grid');
    if (grid) { grid.style.gridTemplateColumns = '1fr'; grid.style.maxWidth = '900px'; }

    const primary = document.querySelector('.hero-actions .btn-primary');
    if (primary) { primary.textContent = 'Teste uma simulação'; primary.setAttribute('href', '#aplicacoes'); }
    const secondary = document.querySelector('.hero-actions .btn-light');
    if (secondary) {
      secondary.textContent = 'Solicite uma avaliação';
      secondary.removeAttribute('data-open-assistentes-chat');
      secondary.onclick = () => document.getElementById('contato')?.scrollIntoView({ behavior: 'smooth' });
    }
    document.querySelectorAll('[data-open-assistentes-chat]').forEach((button) => {
      button.removeAttribute('data-open-assistentes-chat');
      button.textContent = 'Veja as simulações';
      button.onclick = () => document.getElementById('aplicacoes')?.scrollIntoView({ behavior: 'smooth' });
    });
  }

  const styles = `
    .assist-demo-btn{width:100%;margin-top:18px}
    .assist-demo-modal{position:fixed;inset:0;z-index:9999;display:none;place-items:center;padding:20px;background:#111c;backdrop-filter:blur(8px)}
    .assist-demo-modal.open{display:grid}.assist-demo-dialog{width:min(900px,100%);height:min(610px,calc(100vh - 40px));overflow:hidden;background:#fff;border-radius:28px;display:grid;grid-template-columns:.82fr 1.18fr}
    .assist-demo-side{background:#25211e;color:#fff;padding:30px}.assist-demo-chat{height:100%;min-height:0;display:flex;flex-direction:column;background:#fbf8f5;overflow:hidden}
    .assist-demo-head{padding:16px 20px;display:flex;justify-content:space-between;align-items:center;background:#fff;border-bottom:1px solid #e7e0d8}.assist-demo-title{display:flex;gap:12px;align-items:center}
    .assist-demo-avatar{width:42px;height:42px;border-radius:15px;display:grid;place-items:center;background:#c65f22;color:#fff;font-weight:900}.assist-demo-close{width:40px;height:40px;border:1px solid #ddd;border-radius:12px;background:#fff;font-size:20px}
    .assist-demo-messages{flex:1;min-height:0;overflow-y:auto;padding:22px;display:flex;flex-direction:column;gap:12px}.assist-demo-message{max-width:86%;padding:13px 15px;border-radius:17px}.assist-demo-assistant{align-self:flex-start;background:#fff;border:1px solid #e7e0d8}.assist-demo-user{align-self:flex-end;background:#c65f22;color:#fff}
    .assist-demo-options{padding:0 22px 22px}.assist-demo-progress,.assist-demo-summary{padding:12px;border-radius:14px;background:#f0ede9;border:1px solid #e7e0d8}.assist-demo-actions{display:grid;gap:9px}
    .assist-demo-float{position:fixed;right:22px;bottom:22px;z-index:950;min-height:52px;padding:0 18px;border-radius:999px;border:2px solid #c65f22;background:#25211e;color:#fff;font:inherit;font-weight:900;box-shadow:0 14px 34px rgba(0,0,0,.28),0 0 0 5px rgba(198,95,34,.16);cursor:pointer;display:inline-flex;align-items:center;gap:10px}
    .assist-demo-float::before{content:'▶';width:28px;height:28px;border-radius:50%;display:grid;place-items:center;background:#c65f22;color:#fff;font-size:.72rem}
    .lead-channel{display:grid;gap:10px;padding-top:4px}.lead-channel-title{font-weight:850}.lead-channel-actions{display:grid;grid-template-columns:1fr 1fr;gap:10px}.lead-channel-actions .btn{width:100%}.lead-help{font-size:.86rem;color:#5f5a55;margin:0}.lead-status{display:none;padding:12px 14px;border-radius:14px;font-weight:760}.lead-status.ok{display:block;background:#eaf8ee;color:#226b38;border:1px solid #bce9c8}.lead-status.error{display:block;background:#fff0eb;color:#944314;border:1px solid #ffd0bf}
    @media(max-width:900px){.assist-demo-dialog{grid-template-columns:1fr}.assist-demo-side{display:none}}
    @media(max-width:640px){.assist-demo-modal{padding:0}.assist-demo-dialog{width:100%;height:100vh;border-radius:0}.assist-demo-float{right:12px;bottom:12px;min-height:48px;padding:0 14px;font-size:.88rem}.lead-channel-actions{grid-template-columns:1fr}}
  `;

  function buildWhatsappMessage(data) {
    return [
      'Olá! Conheci as simulações de assistentes da Intellih e gostaria de conversar.',
      '',
      `Nome: ${data.nome}`,
      `Interesse: ${data.interesse}`,
      `E-mail: ${data.email}`,
      `WhatsApp: ${data.whatsapp}`,
      '',
      `Contexto: ${data.mensagem}`
    ].join('\n');
  }

  function setupLeadForm() {
    const original = document.getElementById('contactForm');
    if (!original) return;

    const form = original.cloneNode(true);
    original.replaceWith(form);
    form.removeAttribute('action');
    form.removeAttribute('method');

    const oldSubmit = form.querySelector('button[type="submit"]');
    if (oldSubmit) oldSubmit.remove();
    const oldStatus = form.querySelector('#formStatus');
    if (oldStatus) oldStatus.remove();

    form.insertAdjacentHTML('beforeend', `
      <div class="lead-channel">
        <div class="lead-channel-title">Como você prefere continuar?</div>
        <div class="lead-channel-actions">
          <button class="btn btn-primary" type="button" data-lead-channel="email">Enviar por e-mail</button>
          <button class="btn btn-secondary" type="button" data-lead-channel="whatsapp">Continuar pelo WhatsApp</button>
        </div>
        <p class="lead-help">Em qualquer opção, registramos seus dados para dar continuidade ao atendimento.</p>
      </div>
      <div class="lead-status" id="leadStatus" role="status"></div>
    `);

    const status = form.querySelector('#leadStatus');
    const buttons = [...form.querySelectorAll('[data-lead-channel]')];

    async function sendLead(channel) {
      if (!form.reportValidity()) return;
      const formData = new FormData(form);
      const params = new URLSearchParams(location.search);
      const payload = {
        nome: formData.get('nome'),
        whatsapp: formData.get('whatsapp'),
        email: formData.get('email'),
        interesse: formData.get('interesse'),
        mensagem: formData.get('mensagem'),
        canal_preferido: channel,
        origem: 'pagina-assistentes-inteligentes',
        pagina: location.href,
        utm_source: params.get('utm_source') || '',
        utm_medium: params.get('utm_medium') || '',
        utm_campaign: params.get('utm_campaign') || ''
      };

      buttons.forEach((button) => { button.disabled = true; });
      const selected = form.querySelector(`[data-lead-channel="${channel}"]`);
      const previous = selected.textContent;
      selected.textContent = 'Registrando...';
      status.className = 'lead-status';
      status.textContent = '';

      try {
        const response = await fetch('/api/assistentes-lead', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(payload)
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok || !result.ok) throw new Error(result.error || 'Não foi possível registrar o contato.');

        track('lead_assistentes_registrado', { canal: channel, interesse: payload.interesse });
        if (channel === 'whatsapp') {
          status.className = 'lead-status ok';
          status.textContent = 'Contato registrado. Abrindo o WhatsApp para continuar a conversa.';
          const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildWhatsappMessage(payload))}`;
          setTimeout(() => window.open(url, '_blank', 'noopener,noreferrer'), 250);
        } else {
          status.className = 'lead-status ok';
          status.textContent = 'Contato registrado e enviado por e-mail. Nossa equipe dará continuidade.';
          form.reset();
        }
      } catch (error) {
        status.className = 'lead-status error';
        status.textContent = error.message || 'Não foi possível registrar o contato agora.';
      } finally {
        buttons.forEach((button) => { button.disabled = false; });
        selected.textContent = previous;
      }
    }

    buttons.forEach((button) => button.addEventListener('click', () => sendLead(button.dataset.leadChannel)));
    form.addEventListener('submit', (event) => event.preventDefault());
  }

  function setupSimulations() {
    const keys = ['site', 'bio', 'landing', 'faq', 'triagem', 'conhecimento'];
    document.querySelectorAll('#aplicacoes .use-card').forEach((card, index) => {
      if (!keys[index]) return;
      const button = document.createElement('button');
      button.className = 'btn btn-primary assist-demo-btn';
      button.type = 'button';
      button.textContent = 'Assistir à simulação automática';
      button.dataset.demo = keys[index];
      card.appendChild(button);
    });

    document.body.insertAdjacentHTML('beforeend', `
      <div class="assist-demo-modal" id="assistModal" aria-hidden="true">
        <div class="assist-demo-dialog" role="dialog" aria-modal="true">
          <aside class="assist-demo-side"><span id="assistTag"></span><h2 id="assistTitle"></h2><p id="assistDescription"></p><p><strong>O que observar</strong><br>Em cada projeto, adaptamos conteúdo, regras, limites e encaminhamentos ao negócio.</p></aside>
          <div class="assist-demo-chat"><div class="assist-demo-head"><div class="assist-demo-title"><div class="assist-demo-avatar" id="assistAvatar">IA</div><div><strong id="assistName"></strong><br><small>simulação automática</small></div></div><button class="assist-demo-close" id="assistClose" type="button">×</button></div><div class="assist-demo-messages" id="assistMessages"></div><div class="assist-demo-options" id="assistOptions"></div></div>
        </div>
      </div>
      <button id="intellih-assistentes-chat-button" class="assist-demo-float" type="button" aria-label="Ver simulações de assistentes">Ver simulações</button>
    `);

    const modal = document.getElementById('assistModal');
    const messages = document.getElementById('assistMessages');
    const options = document.getElementById('assistOptions');
    let current = null;
    let step = 0;
    let timer = null;

    const clearTimer = () => { if (timer) clearTimeout(timer); timer = null; };
    const scroll = () => requestAnimationFrame(() => requestAnimationFrame(() => messages.scrollTo({ top: messages.scrollHeight, behavior: 'smooth' })));
    const addMessage = (text, type) => {
      const element = document.createElement('div');
      element.className = `assist-demo-message assist-demo-${type}`;
      element.textContent = text;
      messages.appendChild(element);
      scroll();
    };
    const close = () => { clearTimer(); modal.classList.remove('open'); document.body.style.overflow = ''; };
    const finish = (text) => {
      const summary = document.createElement('div');
      summary.className = 'assist-demo-summary';
      summary.innerHTML = `<strong>Resultado da simulação</strong><br>${text}`;
      messages.appendChild(summary);
      options.innerHTML = '<div class="assist-demo-actions"><button class="btn btn-primary" id="assistCta">Quero adaptar ao meu negócio</button><button class="btn btn-light" id="assistRestart">Reiniciar</button></div>';
      document.getElementById('assistCta').onclick = () => {
        const form = document.getElementById('contactForm');
        if (form && current) {
          form.querySelector('[name="interesse"]').value = current.interest;
          const message = form.querySelector('[name="mensagem"]');
          if (!message.value.trim()) message.value = current.message;
        }
        close();
        document.getElementById('contato')?.scrollIntoView({ behavior: 'smooth' });
      };
      document.getElementById('assistRestart').onclick = () => { step = 0; messages.innerHTML = ''; render(); };
      scroll();
      track('simulacao_assistente_concluida', { simulacao: current.key });
    };
    const render = () => {
      const item = current.flow[step];
      addMessage(item[0], 'assistant');
      options.innerHTML = '<div class="assist-demo-progress">Simulação automática em andamento…</div>';
      const choice = item[1].find((value) => !value.startsWith('FINAL:')) || item[1][0];
      timer = setTimeout(() => {
        if (choice.startsWith('FINAL:')) return finish(choice.slice(6));
        addMessage(choice, 'user');
        step = Math.min(step + 1, current.flow.length - 1);
        timer = setTimeout(render, 650);
      }, 900);
    };
    const open = (key) => {
      clearTimer(); current = { ...demos[key], key }; step = 0; messages.innerHTML = '';
      document.getElementById('assistTag').textContent = current.tag;
      document.getElementById('assistTitle').textContent = current.title;
      document.getElementById('assistDescription').textContent = current.description;
      document.getElementById('assistName').textContent = current.name;
      document.getElementById('assistAvatar').textContent = current.name.charAt(0);
      modal.classList.add('open'); document.body.style.overflow = 'hidden';
      track('simulacao_assistente_aberta', { simulacao: key }); render();
    };

    document.querySelectorAll('[data-demo]').forEach((button) => button.onclick = () => open(button.dataset.demo));
    document.getElementById('intellih-assistentes-chat-button').onclick = () => document.getElementById('aplicacoes')?.scrollIntoView({ behavior: 'smooth' });
    document.getElementById('assistClose').onclick = close;
    modal.onclick = (event) => { if (event.target === modal) close(); };
    document.addEventListener('keydown', (event) => { if (event.key === 'Escape') close(); });
    const requested = new URLSearchParams(location.search).get('demo');
    if (requested && demos[requested]) setTimeout(() => open(requested), 250);
  }

  function init() {
    prepareCopy();
    const style = document.createElement('style'); style.textContent = styles; document.head.appendChild(style);
    setupLeadForm();
    setupSimulations();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
