// === Chat Widget Intellih — Agentes de IA (v1) ===
// Widget específico para a página /agentes-ia.
// Não conflita com o chat geral da home, assistentes ou mentoria.

(function () {
  document.addEventListener("DOMContentLoaded", () => {
    const BRAND = "#c44b04";
    const BRAND_DARK = "#923905";
    const PANEL = "#141416";
    const TEXT = "#f6f6f7";
    const MUTED = "#b9bac3";
    const LINE = "rgba(255,255,255,.12)";

    let selectedProcess = "";
    let selectedAgent = "";
    let selectedMaturity = "";

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

    if (document.getElementById("intellih-agentes-chat-button")) return;

    const style = document.createElement("style");
    style.textContent = `
      @keyframes intellihAgentesFadeSlide {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }

      @keyframes intellihAgentesPulse {
        0%,100% { transform: scale(1); box-shadow: 0 12px 34px rgba(196,75,4,.28); }
        50% { transform: scale(1.035); box-shadow: 0 16px 44px rgba(196,75,4,.38); }
      }

      @keyframes intellihAgentesDots {
        0%, 20% { content: ""; }
        40% { content: "."; }
        60% { content: ".."; }
        80%, 100% { content: "..."; }
      }

      .intellih-agentes-chat-fade {
        animation: intellihAgentesFadeSlide .45s ease forwards;
        opacity: 0;
      }

      .intellih-agentes-chat-dots::after {
        content: "";
        animation: intellihAgentesDots 1.4s infinite;
      }

      #intellih-agentes-chat-button {
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
        animation: intellihAgentesPulse 3.2s ease-in-out infinite;
      }

      #intellih-agentes-chat-button:hover {
        transform: translateY(-2px) scale(1.02);
      }

      #intellih-agentes-chat-button svg {
        width: 31px;
        height: 31px;
        stroke: #fff;
      }

      #intellih-agentes-chat-bubble {
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

      #intellih-agentes-chat-window {
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

      .intellih-agentes-chat-header {
        padding: 16px;
        background: rgba(255,255,255,.035);
        border-bottom: 1px solid ${LINE};
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
      }

      .intellih-agentes-chat-title {
        display: flex;
        gap: 10px;
        align-items: center;
        min-width: 0;
      }

      .intellih-agentes-chat-mark {
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

      .intellih-agentes-chat-title strong {
        display: block;
        font-size: 15px;
        line-height: 1.1;
        white-space: nowrap;
      }

      .intellih-agentes-chat-title span {
        display: block;
        font-size: 12px;
        color: ${MUTED};
        margin-top: 3px;
      }

      #intellih-agentes-chat-close {
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

      #intellih-agentes-chat-body {
        flex: 1;
        overflow-y: auto;
        padding: 16px;
        scroll-behavior: smooth;
      }

      #intellih-agentes-chat-body::-webkit-scrollbar {
        width: 8px;
      }

      #intellih-agentes-chat-body::-webkit-scrollbar-thumb {
        background: rgba(255,255,255,.18);
        border-radius: 999px;
      }

      .intellih-agentes-msg {
        margin: 0 0 10px;
        padding: 12px 13px;
        border-radius: 16px;
        line-height: 1.48;
        font-size: 14px;
      }

      .intellih-agentes-msg.assistant {
        background: rgba(255,255,255,.06);
        border: 1px solid rgba(255,255,255,.08);
        color: ${TEXT};
      }

      .intellih-agentes-msg.user {
        background: ${BRAND};
        color: #fff;
        margin-left: 30px;
        text-align: left;
      }

      .intellih-agentes-msg small {
        color: ${MUTED};
      }

      .intellih-agentes-options {
        display: grid;
        gap: 8px;
        margin: 12px 0 14px;
      }

      .intellih-agentes-option {
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

      .intellih-agentes-option:hover {
        transform: translateY(-1px);
        background: rgba(196,75,4,.16);
        border-color: rgba(196,75,4,.6);
      }

      .intellih-agentes-card {
        background: rgba(255,255,255,.05);
        border: 1px solid rgba(255,255,255,.08);
        border-radius: 16px;
        padding: 12px;
        margin: 10px 0;
      }

      .intellih-agentes-card strong {
        display: block;
        margin-bottom: 4px;
        color: #fff;
      }

      .intellih-agentes-card span {
        display: block;
        color: ${MUTED};
        line-height: 1.45;
        font-size: 13px;
      }

      #intellih-agentes-chat-window .intellih-agentes-form {
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

      #intellih-agentes-chat-window .intellih-agentes-form,
      #intellih-agentes-chat-window .intellih-agentes-form * {
        box-sizing: border-box;
      }

      #intellih-agentes-chat-window .intellih-agentes-form-intro {
        padding: 12px;
        border-radius: 14px;
        background: rgba(0,0,0,.22);
        border: 1px solid rgba(255,255,255,.09);
      }

      #intellih-agentes-chat-window .intellih-agentes-form-intro strong {
        display: block;
        color: #ffffff;
        font-size: 14px;
        line-height: 1.3;
        margin-bottom: 4px;
      }

      #intellih-agentes-chat-window .intellih-agentes-form-intro span {
        display: block;
        color: #cfd0d6;
        font-size: 12px;
        line-height: 1.45;
      }

      #intellih-agentes-chat-window .intellih-agentes-form label {
        display: grid;
        gap: 6px;
        color: #ffffff;
        font-size: 12.5px;
        font-weight: 800;
        letter-spacing: .01em;
      }

      #intellih-agentes-chat-window .intellih-agentes-form input,
      #intellih-agentes-chat-window .intellih-agentes-form textarea,
      #intellih-agentes-chat-window .intellih-agentes-form select {
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

      #intellih-agentes-chat-window .intellih-agentes-form input:focus,
      #intellih-agentes-chat-window .intellih-agentes-form textarea:focus,
      #intellih-agentes-chat-window .intellih-agentes-form select:focus {
        border-color: rgba(233,118,39,.9);
        background: rgba(0,0,0,.84);
        box-shadow: 0 0 0 3px rgba(196,75,4,.20);
      }

      #intellih-agentes-chat-window .intellih-agentes-form input::placeholder,
      #intellih-agentes-chat-window .intellih-agentes-form textarea::placeholder {
        color: #a9abb3;
        opacity: 1;
        -webkit-text-fill-color: #a9abb3;
      }

      #intellih-agentes-chat-window .intellih-agentes-form textarea {
        resize: vertical;
        min-height: 96px;
      }

      #intellih-agentes-chat-window .intellih-agentes-submit {
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

      #intellih-agentes-chat-window .intellih-agentes-submit:hover {
        background: linear-gradient(135deg, #d95708, #f08a3a);
      }

      #intellih-agentes-chat-window .intellih-agentes-submit:disabled {
        opacity: .72;
        cursor: not-allowed;
      }

      .intellih-agentes-success {
        background: ${BRAND};
        color: #fff;
        font-size: 14px;
        font-weight: 750;
        padding: 10px 12px;
        border-radius: 12px;
        margin-top: 10px;
        text-align: center;
        animation: intellihAgentesFadeSlide .45s ease forwards;
      }

      .intellih-agentes-error {
        background: #991b1b;
        color: #fff;
        font-size: 14px;
        font-weight: 750;
        padding: 10px 12px;
        border-radius: 12px;
        margin-top: 10px;
        text-align: center;
        animation: intellihAgentesFadeSlide .45s ease forwards;
      }

      #intellih-agentes-chat-window .intellih-agentes-mini-note {
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
        #intellih-agentes-chat-window {
          width: 92vw;
          height: 76vh;
          right: 4vw;
          bottom: 94px;
          border-radius: 22px;
        }

        #intellih-agentes-chat-button {
          right: 18px;
          bottom: 18px;
          width: 64px;
          height: 64px;
        }

        #intellih-agentes-chat-bubble {
          display: none;
        }
      }
    `;
    document.head.appendChild(style);

    const chatButton = document.createElement("button");
    chatButton.id = "intellih-agentes-chat-button";
    chatButton.setAttribute("aria-label", "Abrir assistente de agentes de IA");
    chatButton.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"></path>
        <path d="M8 9h8"></path>
        <path d="M8 13h5"></path>
      </svg>
    `;
    document.body.appendChild(chatButton);

    const chatBubble = document.createElement("div");
    chatBubble.id = "intellih-agentes-chat-bubble";
    chatBubble.textContent = "Seu processo pode virar agente?";
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
    chatWindow.id = "intellih-agentes-chat-window";
    chatWindow.setAttribute("aria-label", "Assistente Agentes Intellih");
    chatWindow.innerHTML = `
      <div class="intellih-agentes-chat-header">
        <div class="intellih-agentes-chat-title">
          <div class="intellih-agentes-chat-mark">IA</div>
          <div>
            <strong>Assistente de Agentes</strong>
            <span>processos com IA e supervisão</span>
          </div>
        </div>
        <button id="intellih-agentes-chat-close" aria-label="Fechar chat">×</button>
      </div>
      <div id="intellih-agentes-chat-body"></div>
    `;
    document.body.appendChild(chatWindow);

    const chatBody = chatWindow.querySelector("#intellih-agentes-chat-body");
    const closeButton = chatWindow.querySelector("#intellih-agentes-chat-close");

    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    function scrollToBottom() {
      chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });
    }

    async function say(html, delay = 430, type = "assistant") {
      await sleep(delay);
      const msg = document.createElement("div");
      msg.className = `intellih-agentes-msg ${type} intellih-agentes-chat-fade`;
      msg.innerHTML = html;
      chatBody.appendChild(msg);
      scrollToBottom();
      return msg;
    }

    function addUserReply(text) {
      const msg = document.createElement("div");
      msg.className = "intellih-agentes-msg user intellih-agentes-chat-fade";
      msg.textContent = text;
      chatBody.appendChild(msg);
      scrollToBottom();
    }

    function addTyping() {
      const typing = document.createElement("div");
      typing.className = "intellih-agentes-msg assistant intellih-agentes-chat-fade";
      typing.innerHTML = `<span class="intellih-agentes-chat-dots">Analisando</span>`;
      chatBody.appendChild(typing);
      scrollToBottom();
      return typing;
    }

    function renderOptions(options, onClick) {
      const wrap = document.createElement("div");
      wrap.className = "intellih-agentes-options intellih-agentes-chat-fade";

      options.forEach((option) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "intellih-agentes-option";
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
      selectedProcess = "";
      selectedAgent = "";
      selectedMaturity = "";
      chatBody.innerHTML = "";

      await say(`Olá. Eu sou o <strong>Assistente de Agentes de IA da Intellih</strong>.`);
      await say(`Vou te ajudar a avaliar se um processo pode virar um agente de IA ou se faz mais sentido começar por uma solução mais simples.`);
      await say(`Qual tipo de processo você quer melhorar?`);

      renderProcessOptions();
    }

    function renderProcessOptions() {
      const options = [
        { label: "Triagem de leads ou solicitações", key: "leads" },
        { label: "Organização ou análise de documentos", key: "documentos" },
        { label: "Apoio ao atendimento", key: "atendimento" },
        { label: "Geração de propostas, relatórios ou materiais", key: "materiais" },
        { label: "Base de conhecimento interna", key: "conhecimento" },
        { label: "Ainda não sei. Quero diagnóstico", key: "diagnostico" }
      ];

      renderOptions(options, async (option) => {
        selectedProcess = option.label;
        track("AgentesChatProcessSelected", { process: selectedProcess });

        const typing = addTyping();
        await sleep(650);
        typing.remove();

        showRecommendation(option.key);
      });
    }

    async function showRecommendation(key) {
      const recommendations = {
        leads: {
          title: "Agente para triagem de leads",
          text: "Indicado quando chegam contatos por formulário, site, WhatsApp ou landing page e é preciso classificar interesse, urgência, perfil e próximo passo.",
          agent: "Agente de triagem de leads",
          next: "Mapear origem dos leads, campos recebidos, critérios de classificação e encaminhamentos desejados."
        },
        documentos: {
          title: "Agente para documentos",
          text: "Indicado quando existe volume de documentos, mensagens ou textos que precisam ser resumidos, classificados ou estruturados.",
          agent: "Agente de organização documental",
          next: "Avaliar tipos de documento, formato das entradas, informações a extrair e nível de revisão humana necessário."
        },
        atendimento: {
          title: "Agente de apoio ao atendimento",
          text: "Indicado quando o atendimento precisa receber contexto organizado, sugestão de resposta ou encaminhamento por tipo de demanda.",
          agent: "Agente de apoio ao atendimento",
          next: "Mapear tipos de solicitação, perguntas recorrentes, limites de resposta e situações que exigem humano."
        },
        materiais: {
          title: "Agente para geração assistida de materiais",
          text: "Indicado para criar rascunhos padronizados de propostas, relatórios, respostas, descrições e materiais internos.",
          agent: "Agente de geração assistida",
          next: "Definir modelos, insumos, tom, estrutura, critérios de revisão e aprovação humana."
        },
        conhecimento: {
          title: "Agente sobre base de conhecimento",
          text: "Indicado quando informações internas estão espalhadas e a equipe precisa consultar procedimentos, regras e materiais com mais agilidade.",
          agent: "Agente de conhecimento interno",
          next: "Identificar fontes, permissões, qualidade dos documentos, tipos de pergunta e critérios de resposta."
        },
        diagnostico: {
          title: "Diagnóstico de agente de IA",
          text: "Indicado quando ainda não está claro se o caso pede agente, assistente, automação simples ou organização de processo.",
          agent: "Diagnóstico de agente de IA",
          next: "Descrever processo, frequência, entradas, saídas, responsáveis, riscos e resultado esperado."
        }
      };

      const rec = recommendations[key] || recommendations.diagnostico;
      selectedAgent = rec.agent;

      await say(`
        <strong>${rec.title}</strong><br>
        <small>${rec.text}</small>
      `);

      const card = document.createElement("div");
      card.className = "intellih-agentes-card intellih-agentes-chat-fade";
      card.innerHTML = `
        <strong>Próximo passo recomendado</strong>
        <span>${rec.next}</span>
      `;
      chatBody.appendChild(card);
      scrollToBottom();

      await say(`Qual é o nível de clareza atual desse processo?`);
      renderMaturityOptions();
    }

    function renderMaturityOptions() {
      const options = [
        { label: "O processo já está bem definido", key: "definido" },
        { label: "Tenho uma ideia, mas ainda está informal", key: "informal" },
        { label: "Tenho muitos dados/documentos, mas estão desorganizados", key: "dados" },
        { label: "Tenho uma dor recorrente, mas não sei modelar", key: "dor" },
        { label: "Quero só avaliar viabilidade primeiro", key: "avaliar" }
      ];

      renderOptions(options, async (option) => {
        selectedMaturity = option.label;

        track("AgentesChatMaturitySelected", {
          process: selectedProcess,
          agent: selectedAgent,
          maturity: selectedMaturity
        });

        await say(`Perfeito. Isso ajuda a definir se o melhor caminho é diagnóstico, piloto ou implementação.`);
        await say(`Quer enviar seus dados para receber uma avaliação inicial?`);

        renderOptions([
          { label: "Sim, quero avaliação inicial", key: "lead" },
          { label: "Quero escolher outro processo", key: "again" }
        ], async (option) => {
          if (option.key === "again") {
            await say(`Sem problema. Escolha outro processo:`);
            renderProcessOptions();
          } else {
            showLeadForm();
          }
        });
      });
    }

    function showLeadForm() {
      const form = document.createElement("form");
      form.className = "intellih-agentes-form intellih-agentes-chat-fade";
      form.innerHTML = `
        <div class="intellih-agentes-form-intro">
          <strong>Solicite avaliação de agente</strong>
          <span>Preencha os dados abaixo para entendermos processo, escopo, riscos e viabilidade.</span>
        </div>

        <label>Nome
          <input type="text" name="name" placeholder="Seu nome" required>
        </label>

        <label>Empresa, projeto ou área de atuação
          <input type="text" name="company" placeholder="Ex.: consultoria, clínica, curso, operação interna...">
        </label>

        <label>E-mail
          <input type="email" name="email" placeholder="voce@email.com" required>
        </label>

        <label>WhatsApp
          <input type="text" name="whatsapp" placeholder="(00) 00000-0000">
        </label>

        <label>Link de referência, se houver
          <input type="text" name="current_channel" placeholder="Site, formulário, sistema, planilha, documento ou material">
        </label>

        <label>Descreva o processo que deseja melhorar
          <textarea name="need_details" placeholder="Ex.: recebemos leads e precisamos classificar; temos documentos para resumir; queremos gerar propostas; a equipe repete a mesma análise..."></textarea>
        </label>

        <button type="submit" class="intellih-agentes-submit">Enviar avaliação</button>
        <div class="intellih-agentes-mini-note">A Intellih responderá com uma orientação inicial sobre viabilidade, escopo e próximo passo.</div>
      `;

      form.onsubmit = async (e) => {
        e.preventDefault();

        const data = Object.fromEntries(new FormData(form).entries());
        const submitButton = form.querySelector(".intellih-agentes-submit");
        const originalSubmitText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = "Enviando...";
        const sending = addTyping();

        try {
          const response = await fetch("https://formsubmit.co/ajax/contato@intellih.com.br", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              _subject: "Novo lead via Assistente - Agentes de IA",
              name: data.name,
              company: data.company,
              email: data.email,
              whatsapp: data.whatsapp,
              current_channel: data.current_channel,
              need_details: data.need_details,
              selected_process: selectedProcess,
              selected_maturity: selectedMaturity,
              recommended_agent: selectedAgent,
              source: "Chat Widget Intellih - Agentes de IA"
            })
          });

          if (!response.ok) throw new Error("Falha no envio");

          sending.remove();
          form.remove();

          track("AgentesChatLeadSuccess", {
            process: selectedProcess,
            maturity: selectedMaturity,
            agent: selectedAgent
          });

          await say(`Obrigado, <strong>${escapeHtml(data.name)}</strong>. Recebemos sua solicitação.`);
          await say(`Vou encaminhar com este foco: <strong>${escapeHtml(selectedAgent)}</strong>.`);
          await say(`Enquanto isso, uma boa preparação é reunir exemplos reais do processo, entradas usadas hoje, saídas esperadas, regras e exceções.`);
          showSuccess("✅ Solicitação enviada com sucesso!");
        } catch (err) {
          sending.remove();

          track("AgentesChatLeadError", {
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
      banner.className = "intellih-agentes-success";
      banner.textContent = text;
      chatBody.appendChild(banner);
      scrollToBottom();
    }

    function showError(text) {
      const banner = document.createElement("div");
      banner.className = "intellih-agentes-error";
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

      track("AgentesChatOpen", { viewport: isMobile() ? "mobile" : "desktop" });
    }

    function closeChat() {
      chatWindow.style.opacity = "0";
      chatWindow.style.transform = "translateY(18px)";

      setTimeout(() => {
        chatWindow.style.display = "none";
      }, 260);

      track("AgentesChatClose");
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
