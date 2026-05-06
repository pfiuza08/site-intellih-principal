// === Chat Widget Intellih (v32) ===
// Assistente comercial da home principal da Intellih:
// IA aplicada, mentoria, assistentes inteligentes, agentes de IA, capacitação e soluções sob medida.

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
    let selectedAudience = "";

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
    if (document.getElementById("intellih-chat-button")) return;

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
        max-width: 290px;
        white-space: nowrap;
      }

      #intellih-chat-window {
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

      #intellih-chat-window .intellih-form {
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

      #intellih-chat-window .intellih-form,
      #intellih-chat-window .intellih-form * {
        box-sizing: border-box;
      }

      #intellih-chat-window .intellih-form-intro {
        padding: 12px;
        border-radius: 14px;
        background: rgba(0,0,0,.22);
        border: 1px solid rgba(255,255,255,.09);
      }

      #intellih-chat-window .intellih-form-intro strong {
        display: block;
        color: #ffffff;
        font-size: 14px;
        line-height: 1.3;
        margin-bottom: 4px;
      }

      #intellih-chat-window .intellih-form-intro span {
        display: block;
        color: #cfd0d6;
        font-size: 12px;
        line-height: 1.45;
      }

      #intellih-chat-window .intellih-form label {
        display: grid;
        gap: 6px;
        color: #ffffff;
        font-size: 12.5px;
        font-weight: 800;
        letter-spacing: .01em;
      }

      #intellih-chat-window .intellih-form input,
      #intellih-chat-window .intellih-form textarea,
      #intellih-chat-window .intellih-form select {
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

      #intellih-chat-window .intellih-form input:focus,
      #intellih-chat-window .intellih-form textarea:focus,
      #intellih-chat-window .intellih-form select:focus {
        border-color: rgba(233,118,39,.9);
        background: rgba(0,0,0,.84);
        box-shadow: 0 0 0 3px rgba(196,75,4,.20);
      }

      #intellih-chat-window .intellih-form input::placeholder,
      #intellih-chat-window .intellih-form textarea::placeholder {
        color: #a9abb3;
        opacity: 1;
        -webkit-text-fill-color: #a9abb3;
      }

      #intellih-chat-window .intellih-form textarea {
        resize: vertical;
        min-height: 96px;
      }

      #intellih-chat-window .intellih-form input:-webkit-autofill,
      #intellih-chat-window .intellih-form input:-webkit-autofill:hover,
      #intellih-chat-window .intellih-form input:-webkit-autofill:focus,
      #intellih-chat-window .intellih-form textarea:-webkit-autofill,
      #intellih-chat-window .intellih-form select:-webkit-autofill {
        -webkit-text-fill-color: #ffffff;
        -webkit-box-shadow: 0 0 0 1000px rgba(8,8,10,.92) inset;
        box-shadow: 0 0 0 1000px rgba(8,8,10,.92) inset;
        transition: background-color 9999s ease-in-out 0s;
      }

      #intellih-chat-window .intellih-submit {
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

      #intellih-chat-window .intellih-submit:hover {
        background: linear-gradient(135deg, #d95708, #f08a3a);
      }

      #intellih-chat-window .intellih-submit:disabled {
        opacity: .72;
        cursor: not-allowed;
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

      #intellih-chat-window .intellih-mini-note {
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
    chatBubble.textContent = "Quer aplicar IA com método no seu contexto?";
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
    chatWindow.id = "intellih-chat-window";
    chatWindow.setAttribute("aria-label", "Assistente Intellih");
    chatWindow.innerHTML = `
      <div class="intellih-chat-header">
        <div class="intellih-chat-title">
          <div class="intellih-chat-mark">IA</div>
          <div>
            <strong>Assistente Intellih</strong>
            <span>IA aplicada com método</span>
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

    async function say(html, delay = 430, type = "assistant") {
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
      selectedNeed = "";
      selectedSolution = "";
      selectedAudience = "";
      chatBody.innerHTML = "";

      await say(`Olá. Eu sou o assistente da <strong>Intellih Tecnologia</strong>.`);
      await say(`Posso te ajudar a identificar qual frente de IA faz mais sentido para o seu momento: mentoria, assistentes inteligentes, agentes de IA, capacitação ou uma solução sob medida.`);
      await say(`Primeiro, qual situação parece mais próxima do que você procura?`);

      renderNeedOptions();
    }

    function renderNeedOptions() {
      const options = [
        { label: "Quero entender como usar IA no meu trabalho", key: "mentoria" },
        { label: "Quero um assistente para site, bio ou atendimento", key: "assistant" },
        { label: "Quero criar um agente de IA para um processo específico", key: "agent" },
        { label: "Quero capacitar uma equipe para usar IA melhor", key: "training" },
        { label: "Quero melhorar minha presença digital com IA", key: "presence" },
        { label: "Ainda não sei. Quero orientação", key: "diagnostic" }
      ];

      renderOptions(options, async (option) => {
        selectedNeed = option.label;
        track("ChatNeedSelected", { need: selectedNeed });

        const typing = addTyping();
        await sleep(650);
        typing.remove();

        showRecommendation(option.key);
      });
    }

    async function showRecommendation(key) {
      const recommendations = {
        mentoria: {
          title: "Mentoria em IA",
          text: "Esse caminho é indicado quando você quer usar IA com mais clareza na própria rotina, mas ainda precisa transformar possibilidades em método, fluxos e práticas concretas.",
          solution: "Mentoria em IA",
          next: "Mapear sua rotina, identificar oportunidades de uso, definir ferramentas, limites, cuidados e um plano de aplicação."
        },
        assistant: {
          title: "Assistentes inteligentes",
          text: "Esse caminho faz sentido quando você quer orientar visitantes, responder dúvidas frequentes, organizar atendimento inicial ou captar contatos em site, página de bio ou canal digital.",
          solution: "Assistentes inteligentes",
          next: "Definir onde o assistente será usado, quais perguntas deve responder, quais limites precisa respeitar e quando encaminhar para atendimento humano."
        },
        agent: {
          title: "Agente de IA para processo específico",
          text: "Esse caminho é mais adequado quando existe um fluxo recorrente que pode ser apoiado por IA, como triagem, organização de informações, geração de documentos, apoio comercial ou análise inicial.",
          solution: "Agente de IA",
          next: "Entender o processo, entradas, saídas esperadas, regras, integrações, riscos e nível de supervisão humana necessário."
        },
        training: {
          title: "Capacitação em IA",
          text: "Esse caminho é indicado para equipes, instituições ou negócios que precisam usar IA de forma mais produtiva, segura e alinhada ao trabalho real.",
          solution: "Capacitação em IA",
          next: "Identificar perfil da equipe, objetivos do treinamento, casos de uso prioritários e nível de maturidade em IA."
        },
        presence: {
          title: "Presença digital inteligente",
          text: "Esse caminho é útil quando o objetivo é melhorar site, Instagram, link da bio, FAQ, landing page ou atendimento inicial com apoio de IA.",
          solution: "Presença digital inteligente",
          next: "Avaliar canais atuais, clareza da oferta, jornada até o contato e oportunidades de assistente, FAQ ou página inteligente."
        },
        diagnostic: {
          title: "Diagnóstico de IA aplicada",
          text: "Quando ainda não está claro por onde começar, o melhor primeiro passo é entender contexto, dores, oportunidades e nível de complexidade adequado.",
          solution: "Diagnóstico de IA aplicada",
          next: "Fazer uma conversa inicial para identificar se faz mais sentido mentoria, assistente, agente, capacitação ou solução sob medida."
        }
      };

      const rec = recommendations[key] || recommendations.diagnostic;
      selectedSolution = rec.solution;

      await say(`
        <strong>${rec.title}</strong><br>
        <small>${rec.text}</small>
      `);

      const card = document.createElement("div");
      card.className = "intellih-card intellih-chat-fade";
      card.innerHTML = `
        <strong>Próximo passo recomendado</strong>
        <span>${rec.next}</span>
      `;
      chatBody.appendChild(card);
      scrollToBottom();

      await say(`Antes de enviar, me diga qual perfil descreve melhor seu contexto:`);
      renderAudienceOptions();
    }

    function renderAudienceOptions() {
      const options = [
        { label: "Pessoa ou profissional autônomo", key: "individual" },
        { label: "Professor, curso ou instituição educacional", key: "educacao" },
        { label: "Pequeno negócio ou profissional liberal", key: "pequeno_negocio" },
        { label: "Empresa ou equipe", key: "empresa" },
        { label: "Projeto, startup ou solução digital", key: "projeto" },
        { label: "Outro contexto", key: "outro" }
      ];

      renderOptions(options, async (option) => {
        selectedAudience = option.label;
        track("ChatAudienceSelected", {
          need: selectedNeed,
          solution: selectedSolution,
          audience: selectedAudience
        });

        await say(`Perfeito. Com esse contexto, a Intellih consegue indicar um caminho mais adequado.`);
        await say(`Quer enviar seus dados para receber uma orientação inicial?`);

        renderOptions([
          { label: "Sim, quero uma orientação inicial", key: "lead" },
          { label: "Quero escolher outra necessidade", key: "again" }
        ], async (option) => {
          if (option.key === "again") {
            await say(`Sem problema. Escolha outro ponto que também faça sentido:`);
            renderNeedOptions();
          } else {
            showLeadForm();
          }
        });
      });
    }

    function showLeadForm() {
      const form = document.createElement("form");
      form.className = "intellih-form intellih-chat-fade";
      form.innerHTML = `
        <div class="intellih-form-intro">
          <strong>Receba uma orientação inicial</strong>
          <span>Preencha os dados abaixo para entendermos qual solução de IA faz mais sentido para o seu contexto.</span>
        </div>

        <label>Nome
          <input type="text" name="name" placeholder="Seu nome" required>
        </label>

        <label>Empresa, projeto ou área de atuação
          <input type="text" name="company" placeholder="Ex.: clínica, escola, consultoria, projeto pessoal...">
        </label>

        <label>E-mail
          <input type="email" name="email" placeholder="voce@email.com" required>
        </label>

        <label>WhatsApp
          <input type="text" name="whatsapp" placeholder="(00) 00000-0000">
        </label>

        <label>Link de referência, se houver
          <input type="text" name="current_channel" placeholder="Site, Instagram, LinkedIn, página ou material">
        </label>

        <label>Conte rapidamente o que quer resolver com IA
          <textarea name="need_details" placeholder="Ex.: quero usar IA no meu trabalho; preciso de um assistente para atendimento; quero automatizar um processo; preciso capacitar minha equipe..."></textarea>
        </label>

        <button type="submit" class="intellih-submit">Enviar orientação</button>
        <div class="intellih-mini-note">A Intellih responderá com uma orientação inicial sobre viabilidade, melhor caminho e possível próximo passo.</div>
      `;

      form.onsubmit = async (e) => {
        e.preventDefault();

        const data = Object.fromEntries(new FormData(form).entries());
        const submitButton = form.querySelector('.intellih-submit');
        const originalSubmitText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = 'Enviando...';
        const sending = addTyping();

        try {
          const response = await fetch("https://formsubmit.co/ajax/contato@intellih.com.br", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              _subject: "Novo lead via Assistente Intellih",
              name: data.name,
              company: data.company,
              email: data.email,
              whatsapp: data.whatsapp,
              current_channel: data.current_channel,
              need_details: data.need_details,
              selected_need: selectedNeed,
              selected_audience: selectedAudience,
              recommended_solution: selectedSolution,
              source: "Chat Widget Intellih - Home IA Aplicada"
            })
          });

          if (!response.ok) throw new Error("Falha no envio");

          sending.remove();
          form.remove();

          track("ChatLeadSuccess", {
            need: selectedNeed,
            audience: selectedAudience,
            solution: selectedSolution
          });

          await say(`Obrigado, <strong>${escapeHtml(data.name)}</strong>. Recebemos sua solicitação.`);
          await say(`Vou encaminhar com este foco: <strong>${escapeHtml(selectedSolution)}</strong>.`);
          await say(`Enquanto isso, uma boa preparação é reunir: objetivo principal, rotina ou processo envolvido, exemplos de tarefas repetitivas e materiais ou links de referência.`);
          showSuccess("✅ Solicitação enviada com sucesso!");
        } catch (err) {
          sending.remove();

          track("ChatLeadError", {
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
})();
