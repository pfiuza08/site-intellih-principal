// === Chat Widget Intellih — Assistentes Inteligentes (v2) ===
// Widget específico para a página /assistentes-inteligentes.
// Não conflita com o chat geral da home porque usa IDs e atributos próprios.

(function () {
  document.addEventListener("DOMContentLoaded", () => {
    const BRAND = "#c44b04";
    const BRAND_DARK = "#923905";
    const PANEL = "#141416";
    const TEXT = "#f6f6f7";
    const MUTED = "#b9bac3";
    const LINE = "rgba(255,255,255,.12)";

    let selectedNeed = "";
    let selectedSolution = "";
    let selectedChannel = "";

    const isMobile = () => window.innerWidth <= 520;

    function track(eventName, params = {}) {
      try {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ event: eventName, ...params });
      } catch (e) {}

      try {
        if (typeof fbq === "function") {
          fbq("trackCustom", eventName, params);
        }
      } catch (e) {}
    }

    // Evita duplicação caso o script seja carregado mais de uma vez.
    if (document.getElementById("intellih-assistentes-chat-button")) return;

    // === ESTILOS ===
    const style = document.createElement("style");
    style.textContent = `
      @keyframes intellihAssistentesFadeSlide {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }

      @keyframes intellihAssistentesPulse {
        0%,100% { transform: scale(1); box-shadow: 0 12px 34px rgba(196,75,4,.28); }
        50% { transform: scale(1.035); box-shadow: 0 16px 44px rgba(196,75,4,.38); }
      }

      @keyframes intellihAssistentesDots {
        0%, 20% { content: ""; }
        40% { content: "."; }
        60% { content: ".."; }
        80%, 100% { content: "..."; }
      }

      .intellih-assistentes-chat-fade {
        animation: intellihAssistentesFadeSlide .45s ease forwards;
        opacity: 0;
      }

      .intellih-assistentes-chat-dots::after {
        content: "";
        animation: intellihAssistentesDots 1.4s infinite;
      }

      #intellih-assistentes-chat-button {
        position: fixed;
        right: 24px;
        bottom: 24px;
        width: 68px;
        height: 68px;
        border-radius: 22px;
        border: 1px solid rgba(255,255,255,.12);
        background:
          radial-gradient(circle at 30% 20%, rgba(255,255,255,.18), transparent 34%),
          linear-gradient(135deg, ${BRAND}, ${BRAND_DARK});
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        z-index: 1000;
        box-shadow: 0 12px 34px rgba(196,75,4,.28);
        transition: transform .22s ease, opacity .22s ease, box-shadow .22s ease;
        opacity: 0;
        transform: translateY(18px);
        animation: intellihAssistentesPulse 3.2s ease-in-out infinite;
      }

      #intellih-assistentes-chat-button:hover {
        transform: translateY(-2px) scale(1.02);
      }

      #intellih-assistentes-chat-button svg {
        width: 31px;
        height: 31px;
        stroke: #fff;
      }

      #intellih-assistentes-chat-bubble {
        position: fixed;
        right: 100px;
        bottom: 35px;
        z-index: 999;
        background: rgba(20,20,22,.96);
        color: #fff;
        border: 1px solid rgba(255,255,255,.12);
        border-radius: 999px;
        padding: 12px 18px;
        font-family: Inter, system-ui, sans-serif;
        font-size: 15px;
        font-weight: 750;
        line-height: 1.25;
        box-shadow: 0 12px 34px rgba(0,0,0,.30);
        opacity: 0;
        transform: translateY(10px);
        transition: opacity .35s ease, transform .35s ease;
        pointer-events: none;
        max-width: 360px;
        white-space: nowrap;
      }

      #intellih-assistentes-chat-window {
        position: fixed;
        right: 22px;
        bottom: 104px;
        width: 390px;
        height: 610px;
        display: none;
        flex-direction: column;
        overflow: hidden;
        z-index: 1001;
        border-radius: 24px;
        background:
          radial-gradient(circle at 20% 0, rgba(196,75,4,.16), transparent 42%),
          ${PANEL};
        color: ${TEXT};
        border: 1px solid ${LINE};
        box-shadow: 0 24px 80px rgba(0,0,0,.42);
        font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
        opacity: 0;
        transform: translateY(18px);
        transition: opacity .28s ease, transform .28s ease;
      }

      .intellih-assistentes-chat-header {
        padding: 16px;
        background: rgba(255,255,255,.035);
        border-bottom: 1px solid ${LINE};
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
      }

      .intellih-assistentes-chat-title {
        display: flex;
        gap: 10px;
        align-items: center;
        min-width: 0;
      }

      .intellih-assistentes-chat-mark {
        width: 38px;
        height: 38px;
        border-radius: 14px;
        background: linear-gradient(135deg, ${BRAND}, #e97627);
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 900;
        color: #fff;
        box-shadow: 0 8px 24px rgba(196,75,4,.28);
        flex: 0 0 auto;
      }

      .intellih-assistentes-chat-title strong {
        display: block;
        font-size: 15px;
        line-height: 1.1;
        white-space: nowrap;
      }

      .intellih-assistentes-chat-title span {
        display: block;
        font-size: 12px;
        color: ${MUTED};
        margin-top: 3px;
      }

      #intellih-assistentes-chat-close {
        width: 34px;
        height: 34px;
        border-radius: 12px;
        border: 1px solid rgba(255,255,255,.12);
        background: rgba(255,255,255,.05);
        color: #fff;
        cursor: pointer;
        font-size: 18px;
        line-height: 1;
      }

      #intellih-assistentes-chat-body {
        flex: 1;
        overflow-y: auto;
        padding: 16px;
        scroll-behavior: smooth;
      }

      #intellih-assistentes-chat-body::-webkit-scrollbar {
        width: 8px;
      }

      #intellih-assistentes-chat-body::-webkit-scrollbar-thumb {
        background: rgba(255,255,255,.18);
        border-radius: 999px;
      }

      .intellih-assistentes-msg {
        margin: 0 0 10px;
        padding: 12px 13px;
        border-radius: 16px;
        line-height: 1.48;
        font-size: 14px;
      }

      .intellih-assistentes-msg.assistant {
        background: rgba(255,255,255,.06);
        border: 1px solid rgba(255,255,255,.08);
        color: ${TEXT};
      }

      .intellih-assistentes-msg.user {
        background: ${BRAND};
        color: #fff;
        margin-left: 30px;
        text-align: left;
      }

      .intellih-assistentes-msg small {
        color: ${MUTED};
      }

      .intellih-assistentes-options {
        display: grid;
        gap: 8px;
        margin: 12px 0 14px;
      }

      .intellih-assistentes-option {
        width: 100%;
        text-align: left;
        padding: 12px;
        border-radius: 14px;
        border: 1px solid rgba(196,75,4,.38);
        background: rgba(196,75,4,.08);
        color: #fff;
        cursor: pointer;
        font-weight: 750;
        font-family: inherit;
        transition: transform .12s ease, background .2s ease, border-color .2s ease;
      }

      .intellih-assistentes-option:hover {
        transform: translateY(-1px);
        background: rgba(196,75,4,.16);
        border-color: rgba(196,75,4,.6);
      }

      .intellih-assistentes-card {
        background: rgba(255,255,255,.05);
        border: 1px solid rgba(255,255,255,.08);
        border-radius: 16px;
        padding: 12px;
        margin: 10px 0;
      }

      .intellih-assistentes-card strong {
        display: block;
        margin-bottom: 4px;
        color: #fff;
      }

      .intellih-assistentes-card span {
        display: block;
        color: ${MUTED};
        line-height: 1.45;
        font-size: 13px;
      }

      #intellih-assistentes-chat-window .intellih-assistentes-form {
        display: grid;
        gap: 12px;
        margin: 12px 0 0;
        padding: 16px;
        background:
          radial-gradient(circle at 12% 0, rgba(196,75,4,.18), transparent 38%),
          rgba(255,255,255,.065);
        border: 1px solid rgba(255,255,255,.12);
        border-radius: 18px;
        box-shadow: inset 0 1px 0 rgba(255,255,255,.05);
      }

      #intellih-assistentes-chat-window .intellih-assistentes-form,
      #intellih-assistentes-chat-window .intellih-assistentes-form * {
        box-sizing: border-box;
      }

      #intellih-assistentes-chat-window .intellih-assistentes-form-intro {
        padding: 12px;
        border-radius: 14px;
        background: rgba(0,0,0,.22);
        border: 1px solid rgba(255,255,255,.09);
      }

      #intellih-assistentes-chat-window .intellih-assistentes-form-intro strong {
        display: block;
        color: #ffffff;
        font-size: 14px;
        line-height: 1.3;
        margin-bottom: 4px;
      }

      #intellih-assistentes-chat-window .intellih-assistentes-form-intro span {
        display: block;
        color: #cfd0d6;
        font-size: 12px;
        line-height: 1.45;
      }

      #intellih-assistentes-chat-window .intellih-assistentes-form label {
        display: grid;
        gap: 6px;
        color: #ffffff;
        font-size: 12.5px;
        font-weight: 800;
        letter-spacing: .01em;
      }

      #intellih-assistentes-chat-window .intellih-assistentes-form input,
      #intellih-assistentes-chat-window .intellih-assistentes-form textarea,
      #intellih-assistentes-chat-window .intellih-assistentes-form select {
        width: 100%;
        margin-top: 0;
        padding: 12px 13px;
        border-radius: 13px;
        border: 1px solid rgba(255,255,255,.18);
        background: rgba(8,8,10,.72);
        color: #ffffff;
        font: inherit;
        font-size: 14px;
        line-height: 1.45;
        outline: none;
        box-shadow: none;
        appearance: none;
        -webkit-appearance: none;
        -webkit-text-fill-color: #ffffff;
      }

      #intellih-assistentes-chat-window .intellih-assistentes-form input:focus,
      #intellih-assistentes-chat-window .intellih-assistentes-form textarea:focus,
      #intellih-assistentes-chat-window .intellih-assistentes-form select:focus {
        border-color: rgba(233,118,39,.9);
        background: rgba(0,0,0,.84);
        box-shadow: 0 0 0 3px rgba(196,75,4,.20);
      }

      #intellih-assistentes-chat-window .intellih-assistentes-form input::placeholder,
      #intellih-assistentes-chat-window .intellih-assistentes-form textarea::placeholder {
        color: #a9abb3;
        opacity: 1;
        -webkit-text-fill-color: #a9abb3;
      }

      #intellih-assistentes-chat-window .intellih-assistentes-form textarea {
        resize: vertical;
        min-height: 96px;
      }

      #intellih-assistentes-chat-window .intellih-assistentes-form input:-webkit-autofill,
      #intellih-assistentes-chat-window .intellih-assistentes-form input:-webkit-autofill:hover,
      #intellih-assistentes-chat-window .intellih-assistentes-form input:-webkit-autofill:focus,
      #intellih-assistentes-chat-window .intellih-assistentes-form textarea:-webkit-autofill,
      #intellih-assistentes-chat-window .intellih-assistentes-form select:-webkit-autofill {
        -webkit-text-fill-color: #ffffff;
        -webkit-box-shadow: 0 0 0 1000px rgba(8,8,10,.92) inset;
        box-shadow: 0 0 0 1000px rgba(8,8,10,.92) inset;
        transition: background-color 9999s ease-in-out 0s;
      }

      #intellih-assistentes-chat-window .intellih-assistentes-submit {
        width: 100%;
        padding: 13px 14px;
        border: none;
        border-radius: 14px;
        background: linear-gradient(135deg, ${BRAND}, #e97627);
        color: #fff;
        font-weight: 900;
        cursor: pointer;
        font-family: inherit;
        font-size: 15px;
        box-shadow: 0 12px 28px rgba(196,75,4,.24);
      }

      #intellih-assistentes-chat-window .intellih-assistentes-submit:hover {
        background: linear-gradient(135deg, #d95708, #f08a3a);
      }

      #intellih-assistentes-chat-window .intellih-assistentes-submit:disabled {
        opacity: .72;
        cursor: not-allowed;
      }

      .intellih-assistentes-success {
        background: ${BRAND};
        color: #fff;
        font-size: 14px;
        font-weight: 750;
        padding: 10px 12px;
        border-radius: 12px;
        margin-top: 10px;
        text-align: center;
        animation: intellihAssistentesFadeSlide .45s ease forwards;
      }

      .intellih-assistentes-error {
        background: #991b1b;
        color: #fff;
        font-size: 14px;
        font-weight: 750;
        padding: 10px 12px;
        border-radius: 12px;
        margin-top: 10px;
        text-align: center;
        animation: intellihAssistentesFadeSlide .45s ease forwards;
      }

      #intellih-assistentes-chat-window .intellih-assistentes-mini-note {
        color: #cfd0d6;
        font-size: 12px;
        line-height: 1.45;
        margin-top: 0;
        padding: 10px 12px;
        border-radius: 12px;
        background: rgba(255,255,255,.045);
        border: 1px solid rgba(255,255,255,.08);
      }

      @media (max-width: 520px) {
        #intellih-assistentes-chat-window {
          width: 92vw;
          height: 76vh;
          right: 4vw;
          bottom: 94px;
          border-radius: 22px;
        }

        #intellih-assistentes-chat-button {
          right: 18px;
          bottom: 18px;
          width: 64px;
          height: 64px;
        }

        #intellih-assistentes-chat-bubble {
          display: none;
        }
      }
    `;
    document.head.appendChild(style);

    // === BOTÃO FLUTUANTE ===
    const chatButton = document.createElement("button");
    chatButton.id = "intellih-assistentes-chat-button";
    chatButton.setAttribute("aria-label", "Abrir assistente de demonstração da Intellih");
    chatButton.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"></path>
        <path d="M8 9h8"></path>
        <path d="M8 13h5"></path>
      </svg>
    `;
    document.body.appendChild(chatButton);

    const chatBubble = document.createElement("div");
    chatBubble.id = "intellih-assistentes-chat-bubble";
    chatBubble.textContent = "Quer criar um assistente?";
    document.body.appendChild(chatBubble);

    setTimeout(() => {
      chatButton.style.opacity = "1";
      chatButton.style.transform = "translateY(0)";
      chatBubble.style.opacity = "1";
      chatBubble.style.transform = "translateY(0)";
    }, 700);

    setTimeout(() => {
      chatBubble.style.opacity = "0";
      chatBubble.style.transform = "translateY(10px)";
    }, 8500);

    // === JANELA DO CHAT ===
    const chatWindow = document.createElement("section");
    chatWindow.id = "intellih-assistentes-chat-window";
    chatWindow.setAttribute("aria-label", "Assistente Demo Intellih");
    chatWindow.innerHTML = `
      <div class="intellih-assistentes-chat-header">
        <div class="intellih-assistentes-chat-title">
          <div class="intellih-assistentes-chat-mark">IA</div>
          <div>
            <strong>Assistente Demo Intellih</strong>
            <span>Assistentes inteligentes</span>
          </div>
        </div>
        <button id="intellih-assistentes-chat-close" aria-label="Fechar chat">×</button>
      </div>
      <div id="intellih-assistentes-chat-body"></div>
    `;
    document.body.appendChild(chatWindow);

    const chatBody = chatWindow.querySelector("#intellih-assistentes-chat-body");
    const closeButton = chatWindow.querySelector("#intellih-assistentes-chat-close");

    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    function scrollToBottom() {
      chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });
    }

    async function say(html, delay = 430, type = "assistant") {
      await sleep(delay);
      const msg = document.createElement("div");
      msg.className = `intellih-assistentes-msg ${type} intellih-assistentes-chat-fade`;
      msg.innerHTML = html;
      chatBody.appendChild(msg);
      scrollToBottom();
      return msg;
    }

    function addUserReply(text) {
      const msg = document.createElement("div");
      msg.className = "intellih-assistentes-msg user intellih-assistentes-chat-fade";
      msg.textContent = text;
      chatBody.appendChild(msg);
      scrollToBottom();
    }

    function addTyping() {
      const typing = document.createElement("div");
      typing.className = "intellih-assistentes-msg assistant intellih-assistentes-chat-fade";
      typing.innerHTML = `<span class="intellih-assistentes-chat-dots">Analisando</span>`;
      chatBody.appendChild(typing);
      scrollToBottom();
      return typing;
    }

    function renderOptions(options, onClick) {
      const wrap = document.createElement("div");
      wrap.className = "intellih-assistentes-options intellih-assistentes-chat-fade";

      options.forEach((option) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "intellih-assistentes-option";
        btn.textContent = option.label;
        btn.onclick = () => {
          wrap.remove();
          addUserReply(option.label);
          onClick(option);
        };
        wrap.appendChild(btn);
      });

      chatBody.appendChild(wrap);
      scrollToBottom();
    }

    async function startConversation() {
      selectedNeed = "";
      selectedSolution = "";
      selectedChannel = "";
      chatBody.innerHTML = "";

      await say(`Olá. Eu sou o <strong>Assistente Demo da Intellih</strong>.`);
      await say(`Vou te mostrar como um assistente inteligente pode orientar visitantes, responder dúvidas frequentes e captar contatos com mais contexto.`);
      await say(`Para começar, onde você imagina usar um assistente?`);

      renderChannelOptions();
    }

    function renderChannelOptions() {
      const options = [
        { label: "No meu site atual", key: "site" },
        { label: "Em uma página de bio / Instagram", key: "bio" },
        { label: "Em uma landing page de campanha", key: "landing" },
        { label: "Para reduzir perguntas repetidas no atendimento", key: "faq" },
        { label: "Para orientar minha equipe internamente", key: "internal" },
        { label: "Ainda não sei. Quero uma avaliação", key: "diagnostic" }
      ];

      renderOptions(options, async (option) => {
        selectedChannel = option.label;
        selectedNeed = option.key;
        track("AssistentesChatChannelSelected", { channel: selectedChannel });

        const typing = addTyping();
        await sleep(650);
        typing.remove();

        showRecommendation(option.key);
      });
    }

    async function showRecommendation(key) {
      const recommendations = {
        site: {
          title: "Assistente para site existente",
          text: "Indicado quando seu site já recebe visitantes, mas ainda não orienta bem sobre serviços, dúvidas frequentes e próximo passo.",
          solution: "Assistente para site existente",
          next: "Avaliar estrutura do site, principais páginas, dúvidas frequentes e tipo de encaminhamento desejado."
        },
        bio: {
          title: "Assistente para página de bio",
          text: "Indicado quando o Instagram gera interesse, mas o visitante ainda precisa de um caminho melhor para entender serviços e entrar em contato.",
          solution: "Assistente para página de bio",
          next: "Avaliar sua bio atual, links, serviços, CTAs e perguntas que aparecem no Direct ou WhatsApp."
        },
        landing: {
          title: "Assistente para landing page",
          text: "Indicado para explicar uma oferta específica, como curso, evento, serviço, lançamento, lista de espera ou campanha.",
          solution: "Assistente para landing page",
          next: "Entender a oferta, público, dúvidas de conversão e informações necessárias antes do cadastro ou contato."
        },
        faq: {
          title: "FAQ inteligente e pré-atendimento",
          text: "Indicado quando o atendimento recebe muitas perguntas repetidas e precisa padronizar respostas antes do contato humano.",
          solution: "FAQ inteligente e pré-atendimento",
          next: "Mapear perguntas recorrentes, respostas atuais, limites de resposta e critérios de encaminhamento humano."
        },
        internal: {
          title: "Assistente de conhecimento interno",
          text: "Indicado quando uma equipe precisa consultar procedimentos, instruções, materiais e informações que hoje estão espalhadas.",
          solution: "Assistente de conhecimento interno",
          next: "Identificar fontes de conhecimento, tipos de pergunta, usuários internos e nível de controle necessário."
        },
        diagnostic: {
          title: "Avaliação de assistente inteligente",
          text: "Quando ainda não está claro por onde começar, faz sentido avaliar canal, dúvidas, público, objetivo e nível de complexidade.",
          solution: "Avaliação de assistente inteligente",
          next: "Fazer uma leitura inicial do contexto para indicar se o melhor caminho é FAQ, bio, site, landing page ou solução interna."
        }
      };

      const rec = recommendations[key] || recommendations.diagnostic;
      selectedSolution = rec.solution;

      await say(`
        <strong>${rec.title}</strong><br>
        <small>${rec.text}</small>
      `);

      const card = document.createElement("div");
      card.className = "intellih-assistentes-card intellih-assistentes-chat-fade";
      card.innerHTML = `
        <strong>Próximo passo recomendado</strong>
        <span>${rec.next}</span>
      `;
      chatBody.appendChild(card);
      scrollToBottom();

      await say(`Qual é o seu principal objetivo com esse assistente?`);
      renderGoalOptions();
    }

    function renderGoalOptions() {
      const options = [
        { label: "Responder dúvidas frequentes", key: "duvidas" },
        { label: "Captar contatos mais qualificados", key: "leads" },
        { label: "Explicar melhor meus serviços", key: "servicos" },
        { label: "Reduzir trabalho repetitivo no atendimento", key: "repeticao" },
        { label: "Organizar conhecimento e informações", key: "conhecimento" },
        { label: "Ainda não sei exatamente", key: "indefinido" }
      ];

      renderOptions(options, async (option) => {
        selectedNeed = option.label;

        track("AssistentesChatGoalSelected", {
          channel: selectedChannel,
          goal: selectedNeed,
          solution: selectedSolution
        });

        await say(`Perfeito. Esse objetivo ajuda a definir escopo, base de conhecimento e limites do assistente.`);
        await say(`Quer enviar seus dados para a Intellih avaliar a viabilidade e o melhor ponto de partida?`);

        renderOptions([
          { label: "Sim, quero avaliação", key: "lead" },
          { label: "Quero escolher outro cenário", key: "again" }
        ], async (option) => {
          if (option.key === "again") {
            await say(`Sem problema. Escolha outro cenário:`);
            renderChannelOptions();
          } else {
            showLeadForm();
          }
        });
      });
    }

    function showLeadForm() {
      const form = document.createElement("form");
      form.className = "intellih-assistentes-form intellih-assistentes-chat-fade";
      form.innerHTML = `
        <div class="intellih-assistentes-form-intro">
          <strong>Solicite avaliação do assistente</strong>
          <span>Preencha os dados abaixo para entendermos canal, objetivo, escopo e viabilidade.</span>
        </div>

        <label>Nome
          <input type="text" name="name" placeholder="Seu nome" required>
        </label>

        <label>Empresa, projeto ou área de atuação
          <input type="text" name="company" placeholder="Ex.: clínica, curso, consultoria, empresa de serviço...">
        </label>

        <label>E-mail
          <input type="email" name="email" placeholder="voce@email.com" required>
        </label>

        <label>WhatsApp
          <input type="text" name="whatsapp" placeholder="(00) 00000-0000">
        </label>

        <label>Link de referência, se houver
          <input type="text" name="current_channel" placeholder="Site, Instagram, landing page ou material">
        </label>

        <label>Conte rapidamente o que o assistente deveria ajudar a resolver
          <textarea name="need_details" placeholder="Ex.: responder dúvidas sobre serviços, orientar visitantes, captar leads, reduzir perguntas repetidas, apoiar equipe interna..."></textarea>
        </label>

        <button type="submit" class="intellih-assistentes-submit">Enviar avaliação</button>
        <div class="intellih-assistentes-mini-note">A Intellih responderá com uma orientação inicial sobre viabilidade, escopo e próximo passo.</div>
      `;

      form.onsubmit = async (e) => {
        e.preventDefault();

        const data = Object.fromEntries(new FormData(form).entries());
        const submitButton = form.querySelector(".intellih-assistentes-submit");
        const originalSubmitText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = "Enviando...";
        const sending = addTyping();

        try {
          const response = await fetch("https://formsubmit.co/ajax/contato@intellih.com.br", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              _subject: "Novo lead via Assistente Demo - Assistentes Inteligentes",
              name: data.name,
              company: data.company,
              email: data.email,
              whatsapp: data.whatsapp,
              current_channel: data.current_channel,
              need_details: data.need_details,
              selected_channel: selectedChannel,
              selected_goal: selectedNeed,
              recommended_solution: selectedSolution,
              source: "Chat Widget Intellih - Assistentes Inteligentes"
            })
          });

          if (!response.ok) throw new Error("Falha no envio");

          sending.remove();
          form.remove();

          track("AssistentesChatLeadSuccess", {
            channel: selectedChannel,
            goal: selectedNeed,
            solution: selectedSolution
          });

          await say(`Obrigado, <strong>${escapeHtml(data.name)}</strong>. Recebemos sua solicitação.`);
          await say(`Vou encaminhar com este foco: <strong>${escapeHtml(selectedSolution)}</strong>.`);
          await say(`Enquanto isso, uma boa preparação é reunir: link do canal atual, principais dúvidas dos visitantes, serviços oferecidos e exemplos de respostas que você já usa.`);
          showSuccess("✅ Solicitação enviada com sucesso!");
        } catch (err) {
          sending.remove();

          track("AssistentesChatLeadError", {
            message: String(err && err.message ? err.message : err)
          });

          showError("Não consegui enviar agora. Tente novamente em instantes ou use o formulário da página.");
        } finally {
          submitButton.disabled = false;
          submitButton.textContent = originalSubmitText;
        }
      };

      chatBody.appendChild(form);
      scrollToBottom();
    }

    function showSuccess(text) {
      const banner = document.createElement("div");
      banner.className = "intellih-assistentes-success";
      banner.textContent = text;
      chatBody.appendChild(banner);
      scrollToBottom();
    }

    function showError(text) {
      const banner = document.createElement("div");
      banner.className = "intellih-assistentes-error";
      banner.textContent = text;
      chatBody.appendChild(banner);
      scrollToBottom();
    }

    function escapeHtml(value = "") {
      return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
    }

    function openChat() {
      if (chatWindow.style.display === "flex") return;

      chatWindow.style.display = "flex";
      chatButton.style.animation = "none";
      chatBubble.style.opacity = "0";
      startConversation();

      setTimeout(() => {
        chatWindow.style.opacity = "1";
        chatWindow.style.transform = "translateY(0)";
      }, 10);

      track("AssistentesChatOpen", { viewport: isMobile() ? "mobile" : "desktop" });
    }

    function closeChat() {
      chatWindow.style.opacity = "0";
      chatWindow.style.transform = "translateY(18px)";

      setTimeout(() => {
        chatWindow.style.display = "none";
      }, 260);

      track("AssistentesChatClose");
    }

    function registrarAberturaAssistente(nomePagina) {
      if (window.__assistenteAbertoRegistrado) {
        return;
      }
    
      window.__assistenteAbertoRegistrado = true;
    
      if (typeof fbq === "function") {
        fbq("trackCustom", "AssistenteAberto", {
          pagina: nomePagina || window.location.pathname,
          url: window.location.href
        });
      }
    }

    
    chatButton.addEventListener("click", () => {
      const isOpen = chatWindow.style.display === "flex";
      if (isOpen) {
        closeChat();
      } else {
        openChat();
      }
    });

    closeButton.addEventListener("click", closeChat);

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && chatWindow.style.display === "flex") {
        closeChat();
      }
    });

    // A abertura por botões externos é tratada no HTML da página.
    // Evitamos registrar listener aqui para não duplicar a conversa quando o botão externo for clicado.
  });
})();
