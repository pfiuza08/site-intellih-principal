// === Chat Widget Intellih — Capacitação em IA (v1) ===
// Widget específico para a página /capacitacao-ia.
// Não conflita com o chat geral da home, assistentes, mentoria ou agentes.

(function () {
  document.addEventListener("DOMContentLoaded", () => {
    const BRAND = "#c44b04";
    const BRAND_DARK = "#923905";
    const PANEL = "#141416";
    const TEXT = "#f6f6f7";
    const MUTED = "#b9bac3";
    const LINE = "rgba(255,255,255,.12)";

    let selectedAudience = "";
    let selectedFormat = "";
    let selectedGoal = "";

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

    if (document.getElementById("intellih-capacitacao-chat-button")) return;

    const style = document.createElement("style");
    style.textContent = `
      @keyframes intellihCapacitacaoFadeSlide {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }

      @keyframes intellihCapacitacaoPulse {
        0%,100% { transform: scale(1); box-shadow: 0 12px 34px rgba(196,75,4,.28); }
        50% { transform: scale(1.035); box-shadow: 0 16px 44px rgba(196,75,4,.38); }
      }

      @keyframes intellihCapacitacaoDots {
        0%, 20% { content: ""; }
        40% { content: "."; }
        60% { content: ".."; }
        80%, 100% { content: "..."; }
      }

      .intellih-capacitacao-chat-fade {
        animation: intellihCapacitacaoFadeSlide .45s ease forwards;
        opacity: 0;
      }

      .intellih-capacitacao-chat-dots::after {
        content: "";
        animation: intellihCapacitacaoDots 1.4s infinite;
      }

      #intellih-capacitacao-chat-button {
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
        animation: intellihCapacitacaoPulse 3.2s ease-in-out infinite;
      }

      #intellih-capacitacao-chat-button:hover {
        transform: translateY(-2px) scale(1.02);
      }

      #intellih-capacitacao-chat-button svg {
        width: 31px;
        height: 31px;
        stroke: #fff;
      }

      #intellih-capacitacao-chat-bubble {
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
        max-width: 380px;
        white-space: nowrap;
      }

      #intellih-capacitacao-chat-window {
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

      .intellih-capacitacao-chat-header {
        padding: 16px;
        background: rgba(255,255,255,.035);
        border-bottom: 1px solid ${LINE};
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
      }

      .intellih-capacitacao-chat-title {
        display: flex;
        gap: 10px;
        align-items: center;
        min-width: 0;
      }

      .intellih-capacitacao-chat-mark {
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

      .intellih-capacitacao-chat-title strong {
        display: block;
        font-size: 15px;
        line-height: 1.1;
        white-space: nowrap;
      }

      .intellih-capacitacao-chat-title span {
        display: block;
        font-size: 12px;
        color: ${MUTED};
        margin-top: 3px;
      }

      #intellih-capacitacao-chat-close {
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

      #intellih-capacitacao-chat-body {
        flex: 1;
        overflow-y: auto;
        padding: 16px;
        scroll-behavior: smooth;
      }

      #intellih-capacitacao-chat-body::-webkit-scrollbar {
        width: 8px;
      }

      #intellih-capacitacao-chat-body::-webkit-scrollbar-thumb {
        background: rgba(255,255,255,.18);
        border-radius: 999px;
      }

      .intellih-capacitacao-msg {
        margin: 0 0 10px;
        padding: 12px 13px;
        border-radius: 16px;
        line-height: 1.48;
        font-size: 14px;
      }

      .intellih-capacitacao-msg.assistant {
        background: rgba(255,255,255,.06);
        border: 1px solid rgba(255,255,255,.08);
        color: ${TEXT};
      }

      .intellih-capacitacao-msg.user {
        background: ${BRAND};
        color: #fff;
        margin-left: 30px;
        text-align: left;
      }

      .intellih-capacitacao-msg small {
        color: ${MUTED};
      }

      .intellih-capacitacao-options {
        display: grid;
        gap: 8px;
        margin: 12px 0 14px;
      }

      .intellih-capacitacao-option {
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

      .intellih-capacitacao-option:hover {
        transform: translateY(-1px);
        background: rgba(196,75,4,.16);
        border-color: rgba(196,75,4,.6);
      }

      .intellih-capacitacao-card {
        background: rgba(255,255,255,.05);
        border: 1px solid rgba(255,255,255,.08);
        border-radius: 16px;
        padding: 12px;
        margin: 10px 0;
      }

      .intellih-capacitacao-card strong {
        display: block;
        margin-bottom: 4px;
        color: #fff;
      }

      .intellih-capacitacao-card span {
        display: block;
        color: ${MUTED};
        line-height: 1.45;
        font-size: 13px;
      }

      #intellih-capacitacao-chat-window .intellih-capacitacao-form {
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

      #intellih-capacitacao-chat-window .intellih-capacitacao-form,
      #intellih-capacitacao-chat-window .intellih-capacitacao-form * {
        box-sizing: border-box;
      }

      #intellih-capacitacao-chat-window .intellih-capacitacao-form-intro {
        padding: 12px;
        border-radius: 14px;
        background: rgba(0,0,0,.22);
        border: 1px solid rgba(255,255,255,.09);
      }

      #intellih-capacitacao-chat-window .intellih-capacitacao-form-intro strong {
        display: block;
        color: #ffffff;
        font-size: 14px;
        line-height: 1.3;
        margin-bottom: 4px;
      }

      #intellih-capacitacao-chat-window .intellih-capacitacao-form-intro span {
        display: block;
        color: #cfd0d6;
        font-size: 12px;
        line-height: 1.45;
      }

      #intellih-capacitacao-chat-window .intellih-capacitacao-form label {
        display: grid;
        gap: 6px;
        color: #ffffff;
        font-size: 12.5px;
        font-weight: 800;
        letter-spacing: .01em;
      }

      #intellih-capacitacao-chat-window .intellih-capacitacao-form input,
      #intellih-capacitacao-chat-window .intellih-capacitacao-form textarea,
      #intellih-capacitacao-chat-window .intellih-capacitacao-form select {
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

      #intellih-capacitacao-chat-window .intellih-capacitacao-form input:focus,
      #intellih-capacitacao-chat-window .intellih-capacitacao-form textarea:focus,
      #intellih-capacitacao-chat-window .intellih-capacitacao-form select:focus {
        border-color: rgba(233,118,39,.9);
        background: rgba(0,0,0,.84);
        box-shadow: 0 0 0 3px rgba(196,75,4,.20);
      }

      #intellih-capacitacao-chat-window .intellih-capacitacao-form input::placeholder,
      #intellih-capacitacao-chat-window .intellih-capacitacao-form textarea::placeholder {
        color: #a9abb3;
        opacity: 1;
        -webkit-text-fill-color: #a9abb3;
      }

      #intellih-capacitacao-chat-window .intellih-capacitacao-form textarea {
        resize: vertical;
        min-height: 96px;
      }

      #intellih-capacitacao-chat-window .intellih-capacitacao-submit {
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

      #intellih-capacitacao-chat-window .intellih-capacitacao-submit:hover {
        background: linear-gradient(135deg, #d95708, #f08a3a);
      }

      #intellih-capacitacao-chat-window .intellih-capacitacao-submit:disabled {
        opacity: .72;
        cursor: not-allowed;
      }

      .intellih-capacitacao-success {
        background: ${BRAND};
        color: #fff;
        font-size: 14px;
        font-weight: 750;
        padding: 10px 12px;
        border-radius: 12px;
        margin-top: 10px;
        text-align: center;
        animation: intellihCapacitacaoFadeSlide .45s ease forwards;
      }

      .intellih-capacitacao-error {
        background: #991b1b;
        color: #fff;
        font-size: 14px;
        font-weight: 750;
        padding: 10px 12px;
        border-radius: 12px;
        margin-top: 10px;
        text-align: center;
        animation: intellihCapacitacaoFadeSlide .45s ease forwards;
      }

      #intellih-capacitacao-chat-window .intellih-capacitacao-mini-note {
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
        #intellih-capacitacao-chat-window {
          width: 92vw;
          height: 76vh;
          right: 4vw;
          bottom: 94px;
          border-radius: 22px;
        }

        #intellih-capacitacao-chat-button {
          right: 18px;
          bottom: 18px;
          width: 64px;
          height: 64px;
        }

        #intellih-capacitacao-chat-bubble {
          display: none;
        }
      }
    `;
    document.head.appendChild(style);

    const chatButton = document.createElement("button");
    chatButton.id = "intellih-capacitacao-chat-button";
    chatButton.setAttribute("aria-label", "Abrir assistente de capacitação em IA");
    chatButton.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"></path>
        <path d="M8 9h8"></path>
        <path d="M8 13h5"></path>
      </svg>
    `;
    document.body.appendChild(chatButton);

    const chatBubble = document.createElement("div");
    chatBubble.id = "intellih-capacitacao-chat-bubble";
    chatBubble.textContent = "Quer capacitar sua equipe?";
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
    chatWindow.id = "intellih-capacitacao-chat-window";
    chatWindow.setAttribute("aria-label", "Assistente Capacitação Intellih");
    chatWindow.innerHTML = `
      <div class="intellih-capacitacao-chat-header">
        <div class="intellih-capacitacao-chat-title">
          <div class="intellih-capacitacao-chat-mark">IA</div>
          <div>
            <strong>Assistente da Capacitação</strong>
            <span>treinamentos práticos em IA</span>
          </div>
        </div>
        <button id="intellih-capacitacao-chat-close" aria-label="Fechar chat">×</button>
      </div>
      <div id="intellih-capacitacao-chat-body"></div>
    `;
    document.body.appendChild(chatWindow);

    const chatBody = chatWindow.querySelector("#intellih-capacitacao-chat-body");
    const closeButton = chatWindow.querySelector("#intellih-capacitacao-chat-close");

    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    function scrollToBottom() {
      chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });
    }

    async function say(html, delay = 430, type = "assistant") {
      await sleep(delay);
      const msg = document.createElement("div");
      msg.className = `intellih-capacitacao-msg ${type} intellih-capacitacao-chat-fade`;
      msg.innerHTML = html;
      chatBody.appendChild(msg);
      scrollToBottom();
      return msg;
    }

    function addUserReply(text) {
      const msg = document.createElement("div");
      msg.className = "intellih-capacitacao-msg user intellih-capacitacao-chat-fade";
      msg.textContent = text;
      chatBody.appendChild(msg);
      scrollToBottom();
    }

    function addTyping() {
      const typing = document.createElement("div");
      typing.className = "intellih-capacitacao-msg assistant intellih-capacitacao-chat-fade";
      typing.innerHTML = `<span class="intellih-capacitacao-chat-dots">Analisando</span>`;
      chatBody.appendChild(typing);
      scrollToBottom();
      return typing;
    }

    function renderOptions(options, onClick) {
      const wrap = document.createElement("div");
      wrap.className = "intellih-capacitacao-options intellih-capacitacao-chat-fade";

      options.forEach((option) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "intellih-capacitacao-option";
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
      selectedAudience = "";
      selectedFormat = "";
      selectedGoal = "";
      chatBody.innerHTML = "";

      await say(`Olá. Eu sou o <strong>Assistente de Capacitação em IA da Intellih</strong>.`);
      await say(`Vou te ajudar a identificar qual formato de treinamento pode fazer mais sentido para seu grupo.`);
      await say(`Para começar, qual público você quer capacitar?`);

      renderAudienceOptions();
    }

    function renderAudienceOptions() {
      const options = [
        { label: "Equipe de empresa", key: "empresa" },
        { label: "Professores ou instituição de ensino", key: "educacao" },
        { label: "Equipe comercial, atendimento ou administrativa", key: "operacional" },
        { label: "Lideranças e gestores", key: "gestao" },
        { label: "Grupo aberto ou evento", key: "evento" },
        { label: "Ainda não sei. Quero orientação", key: "diagnostico" }
      ];

      renderOptions(options, async (option) => {
        selectedAudience = option.label;
        track("CapacitacaoChatAudienceSelected", { audience: selectedAudience });

        const typing = addTyping();
        await sleep(650);
        typing.remove();

        showRecommendation(option.key);
      });
    }

    async function showRecommendation(key) {
      const recommendations = {
        empresa: {
          title: "Treinamento aplicado para equipe",
          text: "Indicado para times que precisam usar IA em tarefas reais do trabalho, com critérios de qualidade, produtividade e segurança.",
          format: "Treinamento aplicado para equipe",
          next: "Mapear áreas, tarefas recorrentes, nível atual de uso de IA e objetivos da organização."
        },
        educacao: {
          title: "Capacitação em IA para educação",
          text: "Indicada para docentes, coordenações e equipes pedagógicas que querem usar IA em aulas, materiais, atividades e avaliação com responsabilidade.",
          format: "Capacitação em IA para educação",
          next: "Entender perfil docente, disciplinas, tipos de material, políticas institucionais e cuidados pedagógicos."
        },
        operacional: {
          title: "Workshop prático para rotina operacional",
          text: "Indicado para equipes que lidam com atendimento, comunicação, organização, propostas, relatórios ou processos administrativos.",
          format: "Workshop prático operacional",
          next: "Identificar tarefas repetitivas, canais de trabalho, tipos de documentos e exemplos reais da rotina."
        },
        gestao: {
          title: "Capacitação para lideranças",
          text: "Indicada para gestores que precisam entender possibilidades, riscos, governança, produtividade e priorização de iniciativas com IA.",
          format: "Capacitação para lideranças e gestores",
          next: "Mapear objetivos estratégicos, riscos, maturidade da equipe e áreas prioritárias para aplicação."
        },
        evento: {
          title: "Palestra ou workshop introdutório",
          text: "Indicado para sensibilizar um grupo maior e criar repertório inicial sobre IA aplicada, possibilidades e limites.",
          format: "Palestra ou workshop introdutório",
          next: "Definir público, duração, foco temático, nível de profundidade e mensagem principal do evento."
        },
        diagnostico: {
          title: "Diagnóstico de capacitação",
          text: "Indicado quando ainda não está claro qual formato, carga horária ou foco será mais adequado.",
          format: "Diagnóstico de capacitação em IA",
          next: "Levantar público, objetivo, nível de maturidade, disponibilidade de tempo e resultados esperados."
        }
      };

      const rec = recommendations[key] || recommendations.diagnostico;
      selectedFormat = rec.format;

      await say(`
        <strong>${rec.title}</strong><br>
        <small>${rec.text}</small>
      `);

      const card = document.createElement("div");
      card.className = "intellih-capacitacao-card intellih-capacitacao-chat-fade";
      card.innerHTML = `
        <strong>Próximo passo recomendado</strong>
        <span>${rec.next}</span>
      `;
      chatBody.appendChild(card);
      scrollToBottom();

      await say(`Qual é o principal objetivo da capacitação?`);
      renderGoalOptions();
    }

    function renderGoalOptions() {
      const options = [
        { label: "Aumentar produtividade com IA", key: "produtividade" },
        { label: "Ensinar uso seguro e responsável", key: "seguranca" },
        { label: "Aplicar IA em tarefas específicas", key: "tarefas" },
        { label: "Criar repertório inicial para o grupo", key: "repertorio" },
        { label: "Padronizar o uso de IA na equipe", key: "padronizar" },
        { label: "Ainda estou definindo o objetivo", key: "indefinido" }
      ];

      renderOptions(options, async (option) => {
        selectedGoal = option.label;

        track("CapacitacaoChatGoalSelected", {
          audience: selectedAudience,
          format: selectedFormat,
          goal: selectedGoal
        });

        await say(`Perfeito. Esse objetivo ajuda a definir carga horária, atividades e profundidade do treinamento.`);
        await say(`Quer enviar seus dados para receber uma orientação inicial sobre formato e viabilidade?`);

        renderOptions([
          { label: "Sim, quero orientação inicial", key: "lead" },
          { label: "Quero escolher outro público", key: "again" }
        ], async (option) => {
          if (option.key === "again") {
            await say(`Sem problema. Escolha outro público:`);
            renderAudienceOptions();
          } else {
            showLeadForm();
          }
        });
      });
    }

    function showLeadForm() {
      const form = document.createElement("form");
      form.className = "intellih-capacitacao-form intellih-capacitacao-chat-fade";
      form.innerHTML = `
        <div class="intellih-capacitacao-form-intro">
          <strong>Solicite orientação sobre capacitação</strong>
          <span>Preencha os dados abaixo para entendermos público, objetivo, formato e viabilidade.</span>
        </div>

        <label>Nome
          <input type="text" name="name" placeholder="Seu nome" required>
        </label>

        <label>Instituição, empresa ou projeto
          <input type="text" name="company" placeholder="Ex.: empresa, escola, curso, evento, equipe...">
        </label>

        <label>E-mail
          <input type="email" name="email" placeholder="voce@email.com" required>
        </label>

        <label>WhatsApp
          <input type="text" name="whatsapp" placeholder="(00) 00000-0000">
        </label>

        <label>Quantidade aproximada de participantes
          <input type="text" name="participants" placeholder="Ex.: 10 pessoas, 30 docentes, 100 participantes...">
        </label>

        <label>Conte rapidamente o que deseja com a capacitação
          <textarea name="need_details" placeholder="Ex.: capacitar equipe administrativa; treinar professores; fazer workshop introdutório; melhorar uso de IA no atendimento..."></textarea>
        </label>

        <button type="submit" class="intellih-capacitacao-submit">Enviar orientação</button>
        <div class="intellih-capacitacao-mini-note">A Intellih responderá com uma orientação inicial sobre formato, carga horária e próximo passo.</div>
      `;

      form.onsubmit = async (e) => {
        e.preventDefault();

        const data = Object.fromEntries(new FormData(form).entries());
        const submitButton = form.querySelector(".intellih-capacitacao-submit");
        const originalSubmitText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = "Enviando...";
        const sending = addTyping();

        try {
          const response = await fetch("https://formsubmit.co/ajax/contato@intellih.com.br", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              _subject: "Novo lead via Assistente - Capacitação em IA",
              name: data.name,
              company: data.company,
              email: data.email,
              whatsapp: data.whatsapp,
              participants: data.participants,
              need_details: data.need_details,
              selected_audience: selectedAudience,
              selected_goal: selectedGoal,
              recommended_format: selectedFormat,
              source: "Chat Widget Intellih - Capacitação em IA"
            })
          });

          if (!response.ok) throw new Error("Falha no envio");

          sending.remove();
          form.remove();

          track("CapacitacaoChatLeadSuccess", {
            audience: selectedAudience,
            goal: selectedGoal,
            format: selectedFormat
          });

          await say(`Obrigado, <strong>${escapeHtml(data.name)}</strong>. Recebemos sua solicitação.`);
          await say(`Vou encaminhar com este foco: <strong>${escapeHtml(selectedFormat)}</strong>.`);
          await say(`Enquanto isso, uma boa preparação é levantar perfil dos participantes, principais dores, ferramentas já usadas e exemplos de tarefas em que a IA poderia ajudar.`);
          showSuccess("✅ Solicitação enviada com sucesso!");
        } catch (err) {
          sending.remove();

          track("CapacitacaoChatLeadError", {
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
      banner.className = "intellih-capacitacao-success";
      banner.textContent = text;
      chatBody.appendChild(banner);
      scrollToBottom();
    }

    function showError(text) {
      const banner = document.createElement("div");
      banner.className = "intellih-capacitacao-error";
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

      track("CapacitacaoChatOpen", { viewport: isMobile() ? "mobile" : "desktop" });
    }

    function closeChat() {
      chatWindow.style.opacity = "0";
      chatWindow.style.transform = "translateY(18px)";

      setTimeout(() => {
        chatWindow.style.display = "none";
      }, 260);

      track("CapacitacaoChatClose");
    }

    function registrarAberturaAssistenteCapacitacao(nomePagina) {
      if (window.__assistenteCapacitacaoAbertoRegistrado) {
        return;
      }
    
      window.__assistenteCapacitacaoAbertoRegistrado = true;
    
      if (typeof fbq === "function") {
        fbq("trackCustom", "AssistenteCapacitacaoAberto", {
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
