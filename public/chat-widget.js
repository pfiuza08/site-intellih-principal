// === Chat Widget Intellih (v28) ===
// Assistente comercial com foco em diagnóstico de IA, problema do cliente e captação de lead qualificado.

document.addEventListener("DOMContentLoaded", () => {
  const BRAND = "#c44b04";
  const BRAND_DARK = "#923905";
  const DARK = "#0b0b0c";
  const PANEL = "#141416";
  const PANEL_2 = "#1d1d21";
  const TEXT = "#f6f6f7";
  const MUTED = "#b9bac3";
  const LINE = "rgba(255,255,255,.12)";

  let selectedProblem = "";
  let selectedSolution = "";

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

  // === ESTILOS ===
  const style = document.createElement("style");
  style.textContent = `
    @keyframes intellihFadeSlide {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes intellihPulse {
      0%,100% { transform: scale(1); box-shadow: 0 12px 34px rgba(196,75,4,.28); }
      50% { transform: scale(1.035); box-shadow: 0 16px 44px rgba(196,75,4,.38); }
    }

    @keyframes intellihDots {
      0%, 20% { content: ""; }
      40% { content: "."; }
      60% { content: ".."; }
      80%, 100% { content: "..."; }
    }

    .intellih-chat-fade {
      animation: intellihFadeSlide .45s ease forwards;
      opacity: 0;
    }

    .intellih-chat-dots::after {
      content: "";
      animation: intellihDots 1.4s infinite;
    }

    #intellih-chat-button {
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
      animation: intellihPulse 3.2s ease-in-out infinite;
    }

    #intellih-chat-button:hover {
      transform: translateY(-2px) scale(1.02);
    }

    #intellih-chat-button svg {
      width: 31px;
      height: 31px;
      stroke: #fff;
    }

    #intellih-chat-bubble {
      position: fixed;
      right: 100px;
      bottom: 35px;
      z-index: 999;
      background: rgba(20,20,22,.94);
      color: #fff;
      border: 1px solid rgba(255,255,255,.1);
      border-radius: 999px;
      padding: 10px 14px;
      font-family: Inter, system-ui, sans-serif;
      font-size: 14px;
      box-shadow: 0 10px 30px rgba(0,0,0,.28);
      opacity: 0;
      transform: translateY(10px);
      transition: opacity .35s ease, transform .35s ease;
      pointer-events: none;
      max-width: 260px;
      white-space: nowrap;
    }

    #intellih-chat-window {
      position: fixed;
      right: 22px;
      bottom: 104px;
      width: 380px;
      height: 590px;
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

    .intellih-chat-header {
      padding: 16px;
      background: rgba(255,255,255,.035);
      border-bottom: 1px solid ${LINE};
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }

    .intellih-chat-title {
      display: flex;
      gap: 10px;
      align-items: center;
      min-width: 0;
    }

    .intellih-chat-mark {
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

    .intellih-chat-title strong {
      display: block;
      font-size: 15px;
      line-height: 1.1;
      white-space: nowrap;
    }

    .intellih-chat-title span {
      display: block;
      font-size: 12px;
      color: ${MUTED};
      margin-top: 3px;
    }

    #intellih-chat-close {
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

    #intellih-chat-body {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      scroll-behavior: smooth;
    }

    #intellih-chat-body::-webkit-scrollbar {
      width: 8px;
    }

    #intellih-chat-body::-webkit-scrollbar-thumb {
      background: rgba(255,255,255,.18);
      border-radius: 999px;
    }

    .intellih-msg {
      margin: 0 0 10px;
      padding: 12px 13px;
      border-radius: 16px;
      line-height: 1.48;
      font-size: 14px;
    }

    .intellih-msg.assistant {
      background: rgba(255,255,255,.06);
      border: 1px solid rgba(255,255,255,.08);
      color: ${TEXT};
    }

    .intellih-msg.user {
      background: ${BRAND};
      color: #fff;
      margin-left: 30px;
      text-align: left;
    }

    .intellih-msg small {
      color: ${MUTED};
    }

    .intellih-options {
      display: grid;
      gap: 8px;
      margin: 12px 0 14px;
    }

    .intellih-option {
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

    .intellih-option:hover {
      transform: translateY(-1px);
      background: rgba(196,75,4,.16);
      border-color: rgba(196,75,4,.6);
    }

    .intellih-card {
      background: rgba(255,255,255,.05);
      border: 1px solid rgba(255,255,255,.08);
      border-radius: 16px;
      padding: 12px;
      margin: 10px 0;
    }

    .intellih-card strong {
      display: block;
      margin-bottom: 4px;
      color: #fff;
    }

    .intellih-card span {
      display: block;
      color: ${MUTED};
      line-height: 1.45;
      font-size: 13px;
    }

    .intellih-form {
      display: grid;
      gap: 10px;
      margin-top: 12px;
    }

    .intellih-form label {
      color: #f4f4f5;
      font-size: 13px;
      font-weight: 750;
    }

    .intellih-form input,
    .intellih-form textarea,
    .intellih-form select {
      width: 100%;
      margin-top: 6px;
      padding: 11px 12px;
      border-radius: 12px;
      border: 1px solid rgba(255,255,255,.16);
      background: rgba(0,0,0,.22);
      color: #fff;
      font: inherit;
      font-size: 14px;
      outline: none;
    }

    .intellih-form input::placeholder,
    .intellih-form textarea::placeholder {
      color: #8f9098;
    }

    .intellih-form textarea {
      resize: vertical;
      min-height: 84px;
    }

    .intellih-submit {
      width: 100%;
      padding: 12px;
      border: none;
      border-radius: 14px;
      background: ${BRAND};
      color: #fff;
      font-weight: 850;
      cursor: pointer;
      font-family: inherit;
      font-size: 15px;
    }

    .intellih-submit:hover {
      background: #d95708;
    }

    .intellih-success {
      background: ${BRAND};
      color: #fff;
      font-size: 14px;
      font-weight: 750;
      padding: 10px 12px;
      border-radius: 12px;
      margin-top: 10px;
      text-align: center;
      animation: intellihFadeSlide .45s ease forwards;
    }

    .intellih-error {
      background: #991b1b;
      color: #fff;
      font-size: 14px;
      font-weight: 750;
      padding: 10px 12px;
      border-radius: 12px;
      margin-top: 10px;
      text-align: center;
      animation: intellihFadeSlide .45s ease forwards;
    }

    @media (max-width: 520px) {
      #intellih-chat-window {
        width: 92vw;
        height: 76vh;
        right: 4vw;
        bottom: 94px;
        border-radius: 22px;
      }

      #intellih-chat-button {
        right: 18px;
        bottom: 18px;
        width: 64px;
        height: 64px;
      }

      #intellih-chat-bubble {
        display: none;
      }
    }
  `;
  document.head.appendChild(style);

  // === BOTÃO FLUTUANTE ===
  const chatButton = document.createElement("button");
  chatButton.id = "intellih-chat-button";
  chatButton.setAttribute("aria-label", "Abrir assistente da Intellih");
  chatButton.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"></path>
      <path d="M8 9h8"></path>
      <path d="M8 13h5"></path>
    </svg>
  `;
  document.body.appendChild(chatButton);

  const chatBubble = document.createElement("div");
  chatBubble.id = "intellih-chat-bubble";
  chatBubble.textContent = "Avalie onde aplicar IA no seu negócio";
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
  }, 8000);

  // === JANELA DO CHAT ===
  const chatWindow = document.createElement("section");
  chatWindow.id = "intellih-chat-window";
  chatWindow.setAttribute("aria-label", "Assistente Intellih");
  chatWindow.innerHTML = `
    <div class="intellih-chat-header">
      <div class="intellih-chat-title">
        <div class="intellih-chat-mark">IA</div>
        <div>
          <strong>Assistente Intellih</strong>
          <span>Diagnóstico rápido de IA</span>
        </div>
      </div>
      <button id="intellih-chat-close" aria-label="Fechar chat">×</button>
    </div>
    <div id="intellih-chat-body"></div>
  `;
  document.body.appendChild(chatWindow);

  const chatBody = chatWindow.querySelector("#intellih-chat-body");
  const closeButton = chatWindow.querySelector("#intellih-chat-close");

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  function scrollToBottom() {
    chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });
  }

  async function say(html, delay = 450, type = "assistant") {
    await sleep(delay);
    const msg = document.createElement("div");
    msg.className = `intellih-msg ${type} intellih-chat-fade`;
    msg.innerHTML = html;
    chatBody.appendChild(msg);
    scrollToBottom();
    return msg;
  }

  function addUserReply(text) {
    const msg = document.createElement("div");
    msg.className = "intellih-msg user intellih-chat-fade";
    msg.textContent = text;
    chatBody.appendChild(msg);
    scrollToBottom();
  }

  function addTyping() {
    const typing = document.createElement("div");
    typing.className = "intellih-msg assistant intellih-chat-fade";
    typing.innerHTML = `<span class="intellih-chat-dots">Analisando</span>`;
    chatBody.appendChild(typing);
    scrollToBottom();
    return typing;
  }

  function renderOptions(options, onClick) {
    const wrap = document.createElement("div");
    wrap.className = "intellih-options intellih-chat-fade";

    options.forEach((option) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "intellih-option";
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
    selectedProblem = "";
    selectedSolution = "";
    chatBody.innerHTML = "";

    await say(`Olá. Eu sou o assistente da <strong>Intellih Tecnologia</strong>.`);
    await say(`Posso te ajudar a identificar onde a IA pode gerar resultado prático: atendimento, leads, rotinas internas, documentos ou treinamento.`);
    await say(`Qual destes problemas parece mais próximo da sua realidade?`);

    renderProblemOptions();
  }

  function renderProblemOptions() {
    const options = [
      { label: "Perco leads ou demoro para responder contatos", key: "leads" },
      { label: "Minha equipe repete muitas respostas", key: "atendimento" },
      { label: "Tenho processos manuais e retrabalho", key: "processos" },
      { label: "Tenho documentos e informações espalhadas", key: "conhecimento" },
      { label: "Quero treinar minha equipe para usar IA", key: "treinamento" },
      { label: "Ainda não sei por onde começar", key: "descoberta" }
    ];

    renderOptions(options, async (option) => {
      selectedProblem = option.label;
      track("ChatProblemSelected", { problem: selectedProblem });

      const typing = addTyping();
      await sleep(650);
      typing.remove();

      showRecommendation(option.key);
    });
  }

  async function showRecommendation(key) {
    const recommendations = {
      leads: {
        title: "Assistente de atendimento e captação de leads",
        text: "Um bom primeiro passo é um assistente que responde dúvidas, coleta dados essenciais e encaminha contatos qualificados para sua equipe.",
        solution: "Assistente de atendimento e captação de leads"
      },
      atendimento: {
        title: "Base de respostas com IA e atendimento guiado",
        text: "Aqui faz sentido mapear perguntas frequentes, criar respostas com contexto e definir quando o atendimento deve ir para uma pessoa.",
        solution: "Base de respostas com IA e atendimento guiado"
      },
      processos: {
        title: "Automação de rotinas internas",
        text: "O caminho é identificar tarefas repetitivas, entradas e saídas de informação, e criar um fluxo com IA, planilhas, formulários ou sistemas.",
        solution: "Automação de rotinas internas"
      },
      conhecimento: {
        title: "Assistente para consulta a documentos",
        text: "Podemos organizar materiais, políticas, documentos e bases internas para criar um assistente que responda com base no conteúdo da empresa.",
        solution: "Assistente para consulta a documentos"
      },
      treinamento: {
        title: "Capacitação prática em IA aplicada",
        text: "A melhor abordagem é treinar a equipe com casos reais da rotina, criando guias de uso, exemplos e fluxos práticos.",
        solution: "Capacitação prática em IA aplicada"
      },
      descoberta: {
        title: "Diagnóstico de IA",
        text: "Neste caso, o mais seguro é começar por um diagnóstico: mapear processos, priorizar oportunidades e escolher um protótipo de baixo risco.",
        solution: "Diagnóstico de IA"
      }
    };

    const rec = recommendations[key] || recommendations.descoberta;
    selectedSolution = rec.solution;

    await say(`
      <strong>${rec.title}</strong><br>
      <small>${rec.text}</small>
    `);

    const card = document.createElement("div");
    card.className = "intellih-card intellih-chat-fade";
    card.innerHTML = `
      <strong>Próximo passo recomendado</strong>
      <span>Fazer um diagnóstico rápido para avaliar impacto, esforço, dados disponíveis e viabilidade de um protótipo funcional.</span>
    `;
    chatBody.appendChild(card);
    scrollToBottom();

    await say(`Quer que a Intellih analise seu caso e diga por onde começar?`);

    renderOptions([
      { label: "Sim, quero avaliar minha empresa", key: "lead" },
      { label: "Quero ver outras possibilidades", key: "again" }
    ], async (option) => {
      if (option.key === "again") {
        await say(`Sem problema. Escolha outro ponto que também faça sentido:`);
        renderProblemOptions();
      } else {
        showLeadForm();
      }
    });
  }

  function showLeadForm() {
    const form = document.createElement("form");
    form.className = "intellih-form intellih-chat-fade";
    form.innerHTML = `
      <label>Nome
        <input type="text" name="name" placeholder="Seu nome" required>
      </label>

      <label>Empresa
        <input type="text" name="company" placeholder="Nome da empresa">
      </label>

      <label>E-mail
        <input type="email" name="email" placeholder="voce@empresa.com" required>
      </label>

      <label>WhatsApp
        <input type="text" name="whatsapp" placeholder="(00) 00000-0000">
      </label>

      <label>Conte em uma frase o que você quer resolver
        <textarea name="need" placeholder="Ex.: recebo muitos contatos e perco leads; minha equipe repete respostas; tenho documentos espalhados..."></textarea>
      </label>

      <button type="submit" class="intellih-submit">Enviar diagnóstico</button>
    `;

    form.onsubmit = async (e) => {
      e.preventDefault();

      const data = Object.fromEntries(new FormData(form).entries());
      const sending = addTyping();

      try {
        const response = await fetch("https://formsubmit.co/ajax/intellih.tec@gmail.com", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            _subject: "Novo lead via Assistente Intellih",
            name: data.name,
            company: data.company,
            email: data.email,
            whatsapp: data.whatsapp,
            need: data.need,
            problem: selectedProblem,
            recommended_solution: selectedSolution,
            source: "Chat Widget Intellih"
          })
        });

        if (!response.ok) throw new Error("Falha no envio");

        sending.remove();
        form.remove();

        track("ChatLeadSuccess", {
          problem: selectedProblem,
          solution: selectedSolution
        });

        await say(`Obrigado, <strong>${escapeHtml(data.name)}</strong>. Recebemos seu pedido.`);
        await say(`Vou encaminhar com este foco: <strong>${escapeHtml(selectedSolution)}</strong>. A Intellih responderá em até 1 dia útil.`);
        showSuccess("✅ Mensagem enviada com sucesso!");

      } catch (err) {
        sending.remove();

        track("ChatLeadError", {
          message: String(err && err.message ? err.message : err)
        });

        showError("Não consegui enviar agora. Tente pelo formulário da página ou envie novamente em instantes.");
      }
    };

    chatBody.appendChild(form);
    scrollToBottom();
  }

  function showSuccess(text) {
    const banner = document.createElement("div");
    banner.className = "intellih-success";
    banner.textContent = text;
    chatBody.appendChild(banner);
    scrollToBottom();
  }

  function showError(text) {
    const banner = document.createElement("div");
    banner.className = "intellih-error";
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
    chatWindow.style.display = "flex";
    chatButton.style.animation = "none";
    chatBubble.style.opacity = "0";
    startConversation();

    setTimeout(() => {
      chatWindow.style.opacity = "1";
      chatWindow.style.transform = "translateY(0)";
    }, 10);

    track("ChatOpen", { viewport: isMobile() ? "mobile" : "desktop" });
  }

  function closeChat() {
    chatWindow.style.opacity = "0";
    chatWindow.style.transform = "translateY(18px)";

    setTimeout(() => {
      chatWindow.style.display = "none";
    }, 260);

    track("ChatClose");
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
});
