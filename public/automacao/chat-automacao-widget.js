// === Chat Widget Intellih Automação Inteligente (v1) ===
// Assistente para a página de automação: identifica situações do negócio,
// sugere fluxos de trabalho inteligentes e coleta dados para orientação inicial.

(function () {
  document.addEventListener("DOMContentLoaded", () => {
    const BRAND = "#c65f22";
    const BRAND_DARK = "#944314";
    const BRAND_LIGHT = "#e47c3c";
    const BRAND_SOFT = "#fff0e7";
    const GRAPHITE = "#25211e";
    const PANEL = "#ffffff";
    const TEXT = "#191715";
    const TEXT_SOFT = "#5f5a55";
    const MUTED = "#817870";
    const LINE = "#e7e0d8";
    const SOFT_BG = "#f7f5f2";

    let selectedArea = "";
    let selectedSituation = "";
    let selectedApplication = "";
    let selectedUrgency = "";

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

    if (document.getElementById("intellih-automation-chat-button")) return;

    const style = document.createElement("style");
    style.textContent = `
      @keyframes intellihAutomationFadeSlide {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }

      @keyframes intellihAutomationPulse {
        0%,100% { transform: scale(1); box-shadow: 0 12px 34px rgba(198,95,34,.25); }
        50% { transform: scale(1.035); box-shadow: 0 16px 44px rgba(198,95,34,.34); }
      }

      @keyframes intellihAutomationDots {
        0%, 20% { content: ""; }
        40% { content: "."; }
        60% { content: ".."; }
        80%, 100% { content: "..."; }
      }

      .intellih-automation-fade {
        animation: intellihAutomationFadeSlide .42s ease forwards;
        opacity: 0;
      }

      .intellih-automation-dots::after {
        content: "";
        animation: intellihAutomationDots 1.4s infinite;
      }

      #intellih-automation-chat-button {
        position: fixed;
        right: 24px;
        bottom: 24px;
        width: 68px;
        height: 68px;
        border-radius: 22px;
        border: 1px solid rgba(255,255,255,.18);
        background:
          radial-gradient(circle at 30% 20%, rgba(255,255,255,.20), transparent 34%),
          linear-gradient(135deg, ${BRAND}, ${BRAND_LIGHT});
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        z-index: 1000;
        box-shadow: 0 12px 34px rgba(198,95,34,.25);
        transition: transform .22s ease, opacity .22s ease, box-shadow .22s ease;
        opacity: 0;
        transform: translateY(18px);
        animation: intellihAutomationPulse 3.2s ease-in-out infinite;
      }

      #intellih-automation-chat-button:hover {
        transform: translateY(-2px) scale(1.02);
      }

      #intellih-automation-chat-button svg {
        width: 31px;
        height: 31px;
        stroke: #fff;
      }

      #intellih-automation-chat-bubble {
        position: fixed;
        right: 100px;
        bottom: 35px;
        z-index: 999;
        background: ${GRAPHITE};
        color: #fff;
        border: 1px solid rgba(255,255,255,.12);
        border-radius: 999px;
        padding: 10px 14px;
        font-family: Inter, system-ui, sans-serif;
        font-size: 14px;
        box-shadow: 0 10px 30px rgba(21,18,15,.28);
        opacity: 0;
        transform: translateY(10px);
        transition: opacity .35s ease, transform .35s ease;
        pointer-events: none;
        max-width: 320px;
        white-space: nowrap;
      }

      #intellih-automation-chat-window {
        position: fixed;
        right: 22px;
        bottom: 104px;
        width: 410px;
        height: 640px;
        display: none;
        flex-direction: column;
        overflow: hidden;
        z-index: 1001;
        border-radius: 26px;
        background:
          radial-gradient(circle at 12% 0, rgba(198,95,34,.12), transparent 34%),
          ${PANEL};
        color: ${TEXT};
        border: 1px solid ${LINE};
        box-shadow: 0 24px 80px rgba(21,18,15,.22);
        font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
        opacity: 0;
        transform: translateY(18px);
        transition: opacity .28s ease, transform .28s ease;
      }

      .intellih-automation-header {
        padding: 16px;
        background: rgba(247,245,242,.82);
        border-bottom: 1px solid ${LINE};
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
      }

      .intellih-automation-title {
        display: flex;
        gap: 10px;
        align-items: center;
        min-width: 0;
      }

      .intellih-automation-mark {
        width: 38px;
        height: 38px;
        border-radius: 14px;
        background: linear-gradient(135deg, ${BRAND}, ${BRAND_LIGHT});
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 900;
        color: #fff;
        box-shadow: 0 8px 24px rgba(198,95,34,.24);
        flex: 0 0 auto;
      }

      .intellih-automation-title strong {
        display: block;
        font-size: 15px;
        line-height: 1.1;
        white-space: nowrap;
        color: ${TEXT};
      }

      .intellih-automation-title span {
        display: block;
        font-size: 12px;
        color: ${TEXT_SOFT};
        margin-top: 3px;
      }

      #intellih-automation-chat-close {
        width: 34px;
        height: 34px;
        border-radius: 12px;
        border: 1px solid ${LINE};
        background: #fff;
        color: ${TEXT};
        cursor: pointer;
        font-size: 18px;
        line-height: 1;
      }

      #intellih-automation-chat-body {
        flex: 1;
        overflow-y: auto;
        padding: 16px;
        scroll-behavior: smooth;
        background: linear-gradient(180deg, #fff 0%, #fbf8f5 100%);
      }

      #intellih-automation-chat-body::-webkit-scrollbar {
        width: 8px;
      }

      #intellih-automation-chat-body::-webkit-scrollbar-thumb {
        background: #d9cfc6;
        border-radius: 999px;
      }

      .intellih-automation-msg {
        margin: 0 0 10px;
        padding: 12px 13px;
        border-radius: 16px;
        line-height: 1.48;
        font-size: 14px;
      }

      .intellih-automation-msg.assistant {
        background: #fff;
        border: 1px solid ${LINE};
        color: ${TEXT};
        box-shadow: 0 8px 20px rgba(21,18,15,.06);
      }

      .intellih-automation-msg.user {
        background: ${BRAND};
        color: #fff;
        margin-left: 32px;
        text-align: left;
        box-shadow: 0 10px 22px rgba(198,95,34,.20);
      }

      .intellih-automation-msg small {
        color: ${TEXT_SOFT};
      }

      .intellih-automation-options {
        display: grid;
        gap: 8px;
        margin: 12px 0 14px;
      }

      .intellih-automation-option {
        width: 100%;
        text-align: left;
        padding: 12px;
        border-radius: 14px;
        border: 1px solid #ffd7c1;
        background: ${BRAND_SOFT};
        color: ${BRAND_DARK};
        cursor: pointer;
        font-weight: 820;
        font-family: inherit;
        transition: transform .12s ease, background .2s ease, border-color .2s ease;
      }

      .intellih-automation-option:hover {
        transform: translateY(-1px);
        background: #ffe5d5;
        border-color: #ffc6a8;
      }

      .intellih-automation-card {
        background: #fff;
        border: 1px solid ${LINE};
        border-radius: 18px;
        padding: 13px;
        margin: 10px 0;
        box-shadow: 0 10px 28px rgba(21,18,15,.08);
      }

      .intellih-automation-card strong {
        display: block;
        margin-bottom: 4px;
        color: ${TEXT};
      }

      .intellih-automation-card span {
        display: block;
        color: ${TEXT_SOFT};
        line-height: 1.45;
        font-size: 13px;
      }

      .intellih-automation-form {
        display: grid;
        gap: 12px;
        margin: 12px 0 0;
        padding: 16px;
        background: #fff;
        border: 1px solid ${LINE};
        border-radius: 18px;
        box-shadow: 0 10px 28px rgba(21,18,15,.08);
      }

      .intellih-automation-form,
      .intellih-automation-form * {
        box-sizing: border-box;
      }

      .intellih-automation-form-intro {
        padding: 12px;
        border-radius: 14px;
        background: ${SOFT_BG};
        border: 1px solid ${LINE};
      }

      .intellih-automation-form-intro strong {
        display: block;
        color: ${TEXT};
        font-size: 14px;
        line-height: 1.3;
        margin-bottom: 4px;
      }

      .intellih-automation-form-intro span {
        display: block;
        color: ${TEXT_SOFT};
        font-size: 12px;
        line-height: 1.45;
      }

      .intellih-automation-form label {
        display: grid;
        gap: 6px;
        color: ${TEXT};
        font-size: 12.5px;
        font-weight: 850;
        letter-spacing: .01em;
      }

      .intellih-automation-form input,
      .intellih-automation-form textarea,
      .intellih-automation-form select {
        width: 100%;
        margin-top: 0;
        padding: 12px 13px;
        border-radius: 13px;
        border: 1px solid #d9cfc6;
        background: #fff;
        color: ${TEXT};
        font: inherit;
        font-size: 14px;
        line-height: 1.45;
        outline: none;
        box-shadow: none;
      }

      .intellih-automation-form input:focus,
      .intellih-automation-form textarea:focus,
      .intellih-automation-form select:focus {
        border-color: ${BRAND};
        box-shadow: 0 0 0 4px rgba(198,95,34,.12);
      }

      .intellih-automation-form input::placeholder,
      .intellih-automation-form textarea::placeholder {
        color: #9a9189;
        opacity: 1;
      }

      .intellih-automation-form textarea {
        resize: vertical;
        min-height: 96px;
      }

      .intellih-automation-submit {
        width: 100%;
        padding: 13px 14px;
        border: none;
        border-radius: 14px;
        background: ${BRAND};
        color: #fff;
        font-weight: 900;
        cursor: pointer;
        font-family: inherit;
        font-size: 15px;
        box-shadow: 0 12px 28px rgba(198,95,34,.24);
      }

      .intellih-automation-submit:hover {
        background: ${BRAND_DARK};
      }

      .intellih-automation-submit:disabled {
        opacity: .72;
        cursor: not-allowed;
      }

      .intellih-automation-success,
      .intellih-automation-error {
        color: #fff;
        font-size: 14px;
        font-weight: 780;
        padding: 10px 12px;
        border-radius: 12px;
        margin-top: 10px;
        text-align: center;
        animation: intellihAutomationFadeSlide .42s ease forwards;
      }

      .intellih-automation-success { background: ${BRAND}; }
      .intellih-automation-error { background: #991b1b; }

      .intellih-automation-mini-note {
        color: ${TEXT_SOFT};
        font-size: 12px;
        line-height: 1.45;
        margin-top: 0;
        padding: 10px 12px;
        border-radius: 12px;
        background: ${SOFT_BG};
        border: 1px solid ${LINE};
      }

      @media (max-width: 520px) {
        #intellih-automation-chat-window {
          width: 92vw;
          height: 76vh;
          right: 4vw;
          bottom: 94px;
          border-radius: 22px;
        }

        #intellih-automation-chat-button {
          right: 18px;
          bottom: 18px;
          width: 64px;
          height: 64px;
        }

        #intellih-automation-chat-bubble {
          display: none;
        }
      }
    `;
    document.head.appendChild(style);

    const chatButton = document.createElement("button");
    chatButton.id = "intellih-automation-chat-button";
    chatButton.setAttribute("aria-label", "Abrir assistente de automação da Intellih");
    chatButton.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"></path>
        <path d="M8 9h8"></path>
        <path d="M8 13h5"></path>
      </svg>
    `;
    document.body.appendChild(chatButton);

    const chatBubble = document.createElement("div");
    chatBubble.id = "intellih-automation-chat-bubble";
    chatBubble.textContent = "Quer descobrir o que pode ser automatizado?";
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

    const chatWindow = document.createElement("section");
    chatWindow.id = "intellih-automation-chat-window";
    chatWindow.setAttribute("aria-label", "Assistente Intellih Automação");
    chatWindow.innerHTML = `
      <div class="intellih-automation-header">
        <div class="intellih-automation-title">
          <div class="intellih-automation-mark">IA</div>
          <div>
            <strong>Assistente Intellih</strong>
            <span>Automação com IA para fluxos de trabalho</span>
          </div>
        </div>
        <button id="intellih-automation-chat-close" aria-label="Fechar chat">×</button>
      </div>
      <div id="intellih-automation-chat-body"></div>
    `;
    document.body.appendChild(chatWindow);

    const chatBody = chatWindow.querySelector("#intellih-automation-chat-body");
    const closeButton = chatWindow.querySelector("#intellih-automation-chat-close");

    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    function scrollToBottom() {
      chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });
    }

    async function say(html, delay = 420, type = "assistant") {
      await sleep(delay);
      const msg = document.createElement("div");
      msg.className = `intellih-automation-msg ${type} intellih-automation-fade`;
      msg.innerHTML = html;
      chatBody.appendChild(msg);
      scrollToBottom();
      return msg;
    }

    function addUserReply(text) {
      const msg = document.createElement("div");
      msg.className = "intellih-automation-msg user intellih-automation-fade";
      msg.textContent = text;
      chatBody.appendChild(msg);
      scrollToBottom();
    }

    function addTyping() {
      const typing = document.createElement("div");
      typing.className = "intellih-automation-msg assistant intellih-automation-fade";
      typing.innerHTML = `<span class="intellih-automation-dots">Analisando</span>`;
      chatBody.appendChild(typing);
      scrollToBottom();
      return typing;
    }

    function renderOptions(options, onClick) {
      const wrap = document.createElement("div");
      wrap.className = "intellih-automation-options intellih-automation-fade";

      options.forEach((option) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "intellih-automation-option";
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
      selectedArea = "";
      selectedSituation = "";
      selectedApplication = "";
      selectedUrgency = "";
      chatBody.innerHTML = "";

      await say(`Olá. Eu sou o assistente da <strong>Intellih Automação Inteligente</strong>.`);
      await say(`Vou te ajudar a organizar uma primeira ideia de automação com IA para o seu negócio.`);
      await say(`Para começar: em qual área você imagina aplicar IA primeiro?`);

      renderAreaOptions();
    }

    function renderAreaOptions() {
      const options = [
        { label: "Atendimento e WhatsApp", key: "atendimento" },
        { label: "Vendas e follow-up", key: "vendas" },
        { label: "Rotinas internas e documentos", key: "operacao" },
        { label: "Educação e exercícios personalizados", key: "educacao" },
        { label: "E-commerce ou varejo", key: "ecommerce" },
        { label: "Finanças e documentos", key: "financas" },
        { label: "Turismo e roteiros personalizados", key: "turismo" },
        { label: "Ainda não sei. Quero orientação", key: "diagnostico" }
      ];

      renderOptions(options, async (option) => {
        selectedArea = option.label;
        track("AutomationChatAreaSelected", { area: selectedArea });

        const typing = addTyping();
        await sleep(620);
        typing.remove();

        showSituationOptions(option.key);
      });
    }

    function showSituationOptions(key) {
      const situationMap = {
        atendimento: [
          { label: "Recebo muitas perguntas repetidas", app: "Atendimento inicial com IA" },
          { label: "Quero organizar triagem antes do atendimento humano", app: "Triagem inteligente de atendimento" },
          { label: "Quero captar contatos pelo site ou página de bio", app: "Assistente para captação e orientação" }
        ],
        vendas: [
          { label: "Perco interessados depois do primeiro contato", app: "Follow-up assistido por IA" },
          { label: "Faço propostas sempre do zero", app: "Gerador assistido de propostas" },
          { label: "Quero qualificar melhor os leads", app: "Qualificação inicial de leads" }
        ],
        operacao: [
          { label: "Tenho informações espalhadas", app: "Base de conhecimento inteligente" },
          { label: "Minha equipe depende de respostas manuais", app: "Assistente interno de consulta" },
          { label: "Quero reduzir tarefas repetitivas", app: "Automação de rotina operacional" }
        ],
        educacao: [
          { label: "Quero gerar exercícios por tema e nível", app: "Agente para exercícios personalizados" },
          { label: "Quero revisar erros dos alunos", app: "Agente de revisão adaptativa" },
          { label: "Quero montar trilhas de estudo", app: "Assistente de plano de estudo" }
        ],
        ecommerce: [
          { label: "Tenho avaliações de produtos pouco aproveitadas", app: "Agente para análise de avaliações" },
          { label: "Quero resumir reclamações e elogios", app: "Classificação de comentários de clientes" },
          { label: "Quero apoiar atendimento e marketing com feedbacks", app: "Resumo de insights de clientes" }
        ],
        financas: [
          { label: "Tenho documentos financeiros extensos", app: "Agente para resumo de documentos" },
          { label: "Quero extrair prazos, valores e obrigações", app: "Leitura assistida de documentos financeiros" },
          { label: "Quero organizar dúvidas antes da análise humana", app: "Preparação de pontos para revisão" }
        ],
        turismo: [
          { label: "Clientes pedem roteiros personalizados", app: "Agente para roteiros personalizados" },
          { label: "Quero organizar preferências de viagem", app: "Assistente de coleta de perfil do viajante" },
          { label: "Quero apoiar venda consultiva", app: "Assistente de atendimento para turismo" }
        ],
        diagnostico: [
          { label: "Quero descobrir onde a IA pode ajudar", app: "Diagnóstico inicial de automação" },
          { label: "Tenho várias ideias e preciso priorizar", app: "Mapa de oportunidades de IA" },
          { label: "Quero começar pequeno e testar", app: "Protótipo de automação com IA" }
        ]
      };

      const options = situationMap[key] || situationMap.diagnostico;

      say(`Escolha a situação mais próxima do que acontece hoje:`, 250).then(() => {
        renderOptions(options, async (option) => {
          selectedSituation = option.label;
          selectedApplication = option.app;

          track("AutomationChatSituationSelected", {
            area: selectedArea,
            situation: selectedSituation,
            application: selectedApplication
          });

          const typing = addTyping();
          await sleep(680);
          typing.remove();

          showRecommendation();
        });
      });
    }

    async function showRecommendation() {
      await say(`Pelo que você escolheu, uma aplicação possível seria: <strong>${escapeHtml(selectedApplication)}</strong>.`);

      const card = document.createElement("div");
      card.className = "intellih-automation-card intellih-automation-fade";
      card.innerHTML = `
        <strong>Como a Intellih avaliaria esse caso</strong>
        <span>Primeiro entendemos o fluxo de trabalho atual, as informações usadas, os pontos de decisão, os limites da IA e quando a equipe humana precisa assumir.</span>
      `;
      chatBody.appendChild(card);
      scrollToBottom();

      await say(`Qual é o melhor resumo do seu momento?`);

      renderOptions([
        { label: "Tenho urgência para implementar", key: "urgente" },
        { label: "Quero avaliar viabilidade primeiro", key: "avaliar" },
        { label: "Quero apenas entender possibilidades", key: "explorar" },
        { label: "Quero escolher outra situação", key: "again" }
      ], async (option) => {
        if (option.key === "again") {
          await say(`Sem problema. Vamos voltar para as áreas de aplicação.`);
          renderAreaOptions();
          return;
        }

        selectedUrgency = option.label;
        track("AutomationChatUrgencySelected", {
          area: selectedArea,
          situation: selectedSituation,
          application: selectedApplication,
          urgency: selectedUrgency
        });

        await say(`Perfeito. Agora posso encaminhar essas informações para uma orientação inicial.`);
        await say(`Quer deixar seus dados para avaliarmos o melhor próximo passo?`);

        renderOptions([
          { label: "Sim, quero uma orientação inicial", key: "lead" },
          { label: "Quero revisar as opções", key: "review" }
        ], async (next) => {
          if (next.key === "review") {
            await say(`Claro. Escolha uma área novamente:`);
            renderAreaOptions();
          } else {
            showLeadForm();
          }
        });
      });
    }

    function showLeadForm() {
      const form = document.createElement("form");
      form.className = "intellih-automation-form intellih-automation-fade";
      form.innerHTML = `
        <div class="intellih-automation-form-intro">
          <strong>Receba uma orientação inicial</strong>
          <span>Preencha os dados abaixo para a Intellih avaliar a possibilidade de automação com IA para seu fluxo de trabalho.</span>
        </div>

        <label>Nome
          <input type="text" name="name" placeholder="Seu nome" required>
        </label>

        <label>Empresa, projeto ou área de atuação
          <input type="text" name="company" placeholder="Ex.: clínica, escola, loja, consultoria, agência...">
        </label>

        <label>E-mail
          <input type="email" name="email" placeholder="voce@email.com" required>
        </label>

        <label>WhatsApp
          <input type="text" name="whatsapp" placeholder="(00) 00000-0000">
        </label>

        <label>Onde esse fluxo de trabalho acontece hoje?
          <select name="channel">
            <option value="">Selecione uma opção</option>
            <option>WhatsApp</option>
            <option>Instagram</option>
            <option>Site ou landing page</option>
            <option>Planilhas</option>
            <option>E-mail</option>
            <option>Sistema interno</option>
            <option>Documentos</option>
            <option>Ainda não sei</option>
          </select>
        </label>

        <label>Conte rapidamente o que você gostaria de automatizar
          <textarea name="details" placeholder="Ex.: recebemos muitas mensagens repetidas; queremos qualificar leads; precisamos resumir documentos; queremos gerar exercícios personalizados..."></textarea>
        </label>

        <button type="submit" class="intellih-automation-submit">Enviar orientação</button>
        <div class="intellih-automation-mini-note">A resposta inicial considera viabilidade, melhor caminho e possíveis próximos passos. A automação só faz sentido quando o fluxo de trabalho está minimamente claro.</div>
      `;

      form.onsubmit = async (e) => {
        e.preventDefault();

        const data = Object.fromEntries(new FormData(form).entries());
        const submitButton = form.querySelector(".intellih-automation-submit");
        const originalText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = "Enviando...";
        const sending = addTyping();

        try {
          const response = await fetch("https://formsubmit.co/ajax/contato@intellih.com.br", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              _subject: "Novo lead via Assistente Intellih Automação",
              name: data.name,
              company: data.company,
              email: data.email,
              whatsapp: data.whatsapp,
              channel: data.channel,
              details: data.details,
              selected_area: selectedArea,
              selected_situation: selectedSituation,
              recommended_application: selectedApplication,
              selected_urgency: selectedUrgency,
              source: "Chat Widget Intellih - Automação Inteligente"
            })
          });

          if (!response.ok) throw new Error("Falha no envio");

          sending.remove();
          form.remove();

          track("AutomationChatLeadSuccess", {
            area: selectedArea,
            situation: selectedSituation,
            application: selectedApplication,
            urgency: selectedUrgency
          });

          await say(`Obrigado, <strong>${escapeHtml(data.name)}</strong>. Recebemos sua solicitação.`);
          await say(`O foco inicial ficou assim: <strong>${escapeHtml(selectedApplication)}</strong>.`);
          await say(`Para preparar a próxima conversa, vale reunir exemplos reais do fluxo de trabalho atual: mensagens, documentos, perguntas frequentes, etapas manuais e ferramentas usadas.`);
          showSuccess("Solicitação enviada com sucesso.");
        } catch (err) {
          sending.remove();

          track("AutomationChatLeadError", {
            message: String(err && err.message ? err.message : err)
          });

          showError("Não consegui enviar agora. Tente novamente em instantes ou chame a Intellih pelo WhatsApp.");
        } finally {
          submitButton.disabled = false;
          submitButton.textContent = originalText;
        }
      };

      chatBody.appendChild(form);
      scrollToBottom();
    }

    function showSuccess(text) {
      const banner = document.createElement("div");
      banner.className = "intellih-automation-success";
      banner.textContent = text;
      chatBody.appendChild(banner);
      scrollToBottom();
    }

    function showError(text) {
      const banner = document.createElement("div");
      banner.className = "intellih-automation-error";
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

      track("AutomationChatOpen", { viewport: isMobile() ? "mobile" : "desktop" });
    }

    function closeChat() {
      chatWindow.style.opacity = "0";
      chatWindow.style.transform = "translateY(18px)";

      setTimeout(() => {
        chatWindow.style.display = "none";
      }, 260);

      track("AutomationChatClose");
    }

    chatButton.addEventListener("click", () => {
      const isOpen = chatWindow.style.display === "flex";
      if (isOpen) closeChat();
      else openChat();
    });

    closeButton.addEventListener("click", closeChat);

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && chatWindow.style.display === "flex") {
        closeChat();
      }
    });
  });
})();
