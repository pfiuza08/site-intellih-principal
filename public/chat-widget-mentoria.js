// === Chat Widget Intellih — Mentoria em IA (v1) ===
// Widget específico para a página /mentoria-ia.
// Não conflita com o chat geral da home nem com o chat de assistentes.

(function () {
  document.addEventListener("DOMContentLoaded", () => {
    const BRAND = "#c44b04";
    const BRAND_DARK = "#923905";
    const PANEL = "#141416";
    const TEXT = "#f6f6f7";
    const MUTED = "#b9bac3";
    const LINE = "rgba(255,255,255,.12)";

    let selectedNeed = "";
    let selectedFormat = "";
    let selectedProfile = "";

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

    if (document.getElementById("intellih-mentoria-chat-button")) return;

    const style = document.createElement("style");
    style.textContent = `
      @keyframes intellihMentoriaFadeSlide {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }

      @keyframes intellihMentoriaPulse {
        0%,100% { transform: scale(1); box-shadow: 0 12px 34px rgba(196,75,4,.28); }
        50% { transform: scale(1.035); box-shadow: 0 16px 44px rgba(196,75,4,.38); }
      }

      @keyframes intellihMentoriaDots {
        0%, 20% { content: ""; }
        40% { content: "."; }
        60% { content: ".."; }
        80%, 100% { content: "..."; }
      }

      .intellih-mentoria-chat-fade {
        animation: intellihMentoriaFadeSlide .45s ease forwards;
        opacity: 0;
      }

      .intellih-mentoria-chat-dots::after {
        content: "";
        animation: intellihMentoriaDots 1.4s infinite;
      }

      #intellih-mentoria-chat-button {
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
        animation: intellihMentoriaPulse 3.2s ease-in-out infinite;
      }

      #intellih-mentoria-chat-button:hover {
        transform: translateY(-2px) scale(1.02);
      }

      #intellih-mentoria-chat-button svg {
        width: 31px;
        height: 31px;
        stroke: #fff;
      }

      #intellih-mentoria-chat-bubble {
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

      #intellih-mentoria-chat-window {
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

      .intellih-mentoria-chat-header {
        padding: 16px;
        background: rgba(255,255,255,.035);
        border-bottom: 1px solid ${LINE};
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
      }

      .intellih-mentoria-chat-title {
        display: flex;
        gap: 10px;
        align-items: center;
        min-width: 0;
      }

      .intellih-mentoria-chat-mark {
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

      .intellih-mentoria-chat-title strong {
        display: block;
        font-size: 15px;
        line-height: 1.1;
        white-space: nowrap;
      }

      .intellih-mentoria-chat-title span {
        display: block;
        font-size: 12px;
        color: ${MUTED};
        margin-top: 3px;
      }

      #intellih-mentoria-chat-close {
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

      #intellih-mentoria-chat-body {
        flex: 1;
        overflow-y: auto;
        padding: 16px;
        scroll-behavior: smooth;
      }

      #intellih-mentoria-chat-body::-webkit-scrollbar {
        width: 8px;
      }

      #intellih-mentoria-chat-body::-webkit-scrollbar-thumb {
        background: rgba(255,255,255,.18);
        border-radius: 999px;
      }

      .intellih-mentoria-msg {
        margin: 0 0 10px;
        padding: 12px 13px;
        border-radius: 16px;
        line-height: 1.48;
        font-size: 14px;
      }

      .intellih-mentoria-msg.assistant {
        background: rgba(255,255,255,.06);
        border: 1px solid rgba(255,255,255,.08);
        color: ${TEXT};
      }

      .intellih-mentoria-msg.user {
        background: ${BRAND};
        color: #fff;
        margin-left: 30px;
        text-align: left;
      }

      .intellih-mentoria-msg small {
        color: ${MUTED};
      }

      .intellih-mentoria-options {
        display: grid;
        gap: 8px;
        margin: 12px 0 14px;
      }

      .intellih-mentoria-option {
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

      .intellih-mentoria-option:hover {
        transform: translateY(-1px);
        background: rgba(196,75,4,.16);
        border-color: rgba(196,75,4,.6);
      }

      .intellih-mentoria-card {
        background: rgba(255,255,255,.05);
        border: 1px solid rgba(255,255,255,.08);
        border-radius: 16px;
        padding: 12px;
        margin: 10px 0;
      }

      .intellih-mentoria-card strong {
        display: block;
        margin-bottom: 4px;
        color: #fff;
      }

      .intellih-mentoria-card span {
        display: block;
        color: ${MUTED};
        line-height: 1.45;
        font-size: 13px;
      }

      #intellih-mentoria-chat-window .intellih-mentoria-form {
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

      #intellih-mentoria-chat-window .intellih-mentoria-form,
      #intellih-mentoria-chat-window .intellih-mentoria-form * {
        box-sizing: border-box;
      }

      #intellih-mentoria-chat-window .intellih-mentoria-form-intro {
        padding: 12px;
        border-radius: 14px;
        background: rgba(0,0,0,.22);
        border: 1px solid rgba(255,255,255,.09);
      }

      #intellih-mentoria-chat-window .intellih-mentoria-form-intro strong {
        display: block;
        color: #ffffff;
        font-size: 14px;
        line-height: 1.3;
        margin-bottom: 4px;
      }

      #intellih-mentoria-chat-window .intellih-mentoria-form-intro span {
        display: block;
        color: #cfd0d6;
        font-size: 12px;
        line-height: 1.45;
      }

      #intellih-mentoria-chat-window .intellih-mentoria-form label {
        display: grid;
        gap: 6px;
        color: #ffffff;
        font-size: 12.5px;
        font-weight: 800;
        letter-spacing: .01em;
      }

      #intellih-mentoria-chat-window .intellih-mentoria-form input,
      #intellih-mentoria-chat-window .intellih-mentoria-form textarea,
      #intellih-mentoria-chat-window .intellih-mentoria-form select {
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

      #intellih-mentoria-chat-window .intellih-mentoria-form input:focus,
      #intellih-mentoria-chat-window .intellih-mentoria-form textarea:focus,
      #intellih-mentoria-chat-window .intellih-mentoria-form select:focus {
        border-color: rgba(233,118,39,.9);
        background: rgba(0,0,0,.84);
        box-shadow: 0 0 0 3px rgba(196,75,4,.20);
      }

      #intellih-mentoria-chat-window .intellih-mentoria-form input::placeholder,
      #intellih-mentoria-chat-window .intellih-mentoria-form textarea::placeholder {
        color: #a9abb3;
        opacity: 1;
        -webkit-text-fill-color: #a9abb3;
      }

      #intellih-mentoria-chat-window .intellih-mentoria-form textarea {
        resize: vertical;
        min-height: 96px;
      }

      #intellih-mentoria-chat-window .intellih-mentoria-submit {
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

      #intellih-mentoria-chat-window .intellih-mentoria-submit:hover {
        background: linear-gradient(135deg, #d95708, #f08a3a);
      }

      #intellih-mentoria-chat-window .intellih-mentoria-submit:disabled {
        opacity: .72;
        cursor: not-allowed;
      }

      .intellih-mentoria-success {
        background: ${BRAND};
        color: #fff;
        font-size: 14px;
        font-weight: 750;
        padding: 10px 12px;
        border-radius: 12px;
        margin-top: 10px;
        text-align: center;
        animation: intellihMentoriaFadeSlide .45s ease forwards;
      }

      .intellih-mentoria-error {
        background: #991b1b;
        color: #fff;
        font-size: 14px;
        font-weight: 750;
        padding: 10px 12px;
        border-radius: 12px;
        margin-top: 10px;
        text-align: center;
        animation: intellihMentoriaFadeSlide .45s ease forwards;
      }

      #intellih-mentoria-chat-window .intellih-mentoria-mini-note {
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
        #intellih-mentoria-chat-window {
          width: 92vw;
          height: 76vh;
          right: 4vw;
          bottom: 94px;
          border-radius: 22px;
        }

        #intellih-mentoria-chat-button {
          right: 18px;
          bottom: 18px;
          width: 64px;
          height: 64px;
        }

        #intellih-mentoria-chat-bubble {
          display: none;
        }
      }
    `;
    document.head.appendChild(style);

    const chatButton = document.createElement("button");
    chatButton.id = "intellih-mentoria-chat-button";
    chatButton.setAttribute("aria-label", "Abrir assistente da mentoria em IA");
    chatButton.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"></path>
        <path d="M8 9h8"></path>
        <path d="M8 13h5"></path>
      </svg>
    `;
    document.body.appendChild(chatButton);

    const chatBubble = document.createElement("div");
    chatBubble.id = "intellih-mentoria-chat-bubble";
    chatBubble.textContent = "Quer usar IA com método?";
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
    chatWindow.id = "intellih-mentoria-chat-window";
    chatWindow.setAttribute("aria-label", "Assistente Mentoria Intellih");
    chatWindow.innerHTML = `
      <div class="intellih-mentoria-chat-header">
        <div class="intellih-mentoria-chat-title">
          <div class="intellih-mentoria-chat-mark">IA</div>
          <div>
            <strong>Assistente da Mentoria</strong>
            <span>IA aplicada com método</span>
          </div>
        </div>
        <button id="intellih-mentoria-chat-close" aria-label="Fechar chat">×</button>
      </div>
      <div id="intellih-mentoria-chat-body"></div>
    `;
    document.body.appendChild(chatWindow);

    const chatBody = chatWindow.querySelector("#intellih-mentoria-chat-body");
    const closeButton = chatWindow.querySelector("#intellih-mentoria-chat-close");

    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    function scrollToBottom() {
      chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });
    }

    async function say(html, delay = 430, type = "assistant") {
      await sleep(delay);
      const msg = document.createElement("div");
      msg.className = `intellih-mentoria-msg ${type} intellih-mentoria-chat-fade`;
      msg.innerHTML = html;
      chatBody.appendChild(msg);
      scrollToBottom();
      return msg;
    }

    function addUserReply(text) {
      const msg = document.createElement("div");
      msg.className = "intellih-mentoria-msg user intellih-mentoria-chat-fade";
      msg.textContent = text;
      chatBody.appendChild(msg);
      scrollToBottom();
    }

    function addTyping() {
      const typing = document.createElement("div");
      typing.className = "intellih-mentoria-msg assistant intellih-mentoria-chat-fade";
      typing.innerHTML = `<span class="intellih-mentoria-chat-dots">Analisando</span>`;
      chatBody.appendChild(typing);
      scrollToBottom();
      return typing;
    }

    function renderOptions(options, onClick) {
      const wrap = document.createElement("div");
      wrap.className = "intellih-mentoria-options intellih-mentoria-chat-fade";

      options.forEach((option) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "intellih-mentoria-option";
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
      selectedFormat = "";
      selectedProfile = "";
      chatBody.innerHTML = "";

      await say(`Olá. Eu sou o <strong>Assistente da Mentoria em IA da Intellih</strong>.`);
      await say(`Vou te ajudar a entender se a mentoria faz sentido para seu momento e qual formato pode ser mais adequado.`);
      await say(`Para começar, o que você mais quer melhorar com IA?`);

      renderNeedOptions();
    }

    function renderNeedOptions() {
      const options = [
        { label: "Quero usar IA no meu trabalho", key: "trabalho" },
        { label: "Quero usar IA em aulas, materiais ou educação", key: "educacao" },
        { label: "Quero aplicar IA no meu negócio", key: "negocio" },
        { label: "Quero criar conteúdo com mais método", key: "conteudo" },
        { label: "Quero capacitar uma equipe", key: "equipe" },
        { label: "Ainda não sei. Quero diagnóstico", key: "diagnostico" }
      ];

      renderOptions(options, async (option) => {
        selectedNeed = option.label;
        track("MentoriaChatNeedSelected", { need: selectedNeed });

        const typing = addTyping();
        await sleep(650);
        typing.remove();

        showRecommendation(option.key);
      });
    }

    async function showRecommendation(key) {
      const recommendations = {
        trabalho: {
          title: "Mentoria para uso profissional de IA",
          text: "Indicada para transformar IA em apoio real à rotina: leitura, síntese, planejamento, escrita, análise, organização e tomada de decisão.",
          format: "Mentoria individual em IA",
          next: "Mapear tarefas recorrentes, ferramentas já usadas, principais gargalos e oportunidades de aplicação."
        },
        educacao: {
          title: "Mentoria em IA para educação",
          text: "Indicada para professores, coordenadores e produtores de conteúdo educacional que querem aplicar IA com rigor pedagógico e responsabilidade.",
          format: "Mentoria em IA para educação",
          next: "Entender disciplina, público, tipos de material, processos de avaliação e limites éticos do uso de IA."
        },
        negocio: {
          title: "Mentoria para IA em negócios",
          text: "Indicada para empreendedores, consultores e profissionais que querem aplicar IA em atendimento, conteúdo, propostas, análise e processos.",
          format: "Mentoria em IA para negócios",
          next: "Identificar processos, canais, dores recorrentes e oportunidades de uso prático de IA."
        },
        conteudo: {
          title: "Mentoria para criação com IA",
          text: "Indicada para estruturar ideias, roteiros, posts, artigos, materiais, apresentações e comunicação com mais método e consistência.",
          format: "Mentoria para criação com IA",
          next: "Definir temas, público, tom, formatos, critérios de revisão e fluxo de produção."
        },
        equipe: {
          title: "Mentoria ou capacitação para equipe",
          text: "Indicada quando várias pessoas precisam usar IA com critérios semelhantes, reduzindo improviso e aumentando segurança.",
          format: "Mentoria para equipe",
          next: "Entender perfil do grupo, objetivos, maturidade, casos de uso e riscos específicos."
        },
        diagnostico: {
          title: "Diagnóstico de uso de IA",
          text: "Indicado quando ainda não está claro por onde começar. O foco é identificar oportunidades reais e evitar dispersão.",
          format: "Sessão diagnóstico de IA",
          next: "Fazer uma leitura inicial do contexto e indicar prioridades de uso, ferramentas e próximos passos."
        }
      };

      const rec = recommendations[key] || recommendations.diagnostico;
      selectedFormat = rec.format;

      await say(`
        <strong>${rec.title}</strong><br>
        <small>${rec.text}</small>
      `);

      const card = document.createElement("div");
      card.className = "intellih-mentoria-card intellih-mentoria-chat-fade";
      card.innerHTML = `
        <strong>Próximo passo recomendado</strong>
        <span>${rec.next}</span>
      `;
      chatBody.appendChild(card);
      scrollToBottom();

      await say(`Qual perfil descreve melhor seu contexto?`);
      renderProfileOptions();
    }

    function renderProfileOptions() {
      const options = [
        { label: "Profissional autônomo ou especialista", key: "profissional" },
        { label: "Professor(a) ou área educacional", key: "educacao" },
        { label: "Empreendedor(a) ou consultor(a)", key: "empreendedor" },
        { label: "Equipe ou empresa", key: "equipe" },
        { label: "Estou em transição profissional", key: "transicao" },
        { label: "Outro contexto", key: "outro" }
      ];

      renderOptions(options, async (option) => {
        selectedProfile = option.label;

        track("MentoriaChatProfileSelected", {
          need: selectedNeed,
          profile: selectedProfile,
          format: selectedFormat
        });

        await say(`Perfeito. Esse contexto ajuda a adaptar a mentoria ao seu nível e objetivo.`);
        await say(`Quer enviar seus dados para receber uma orientação inicial sobre formato e viabilidade?`);

        renderOptions([
          { label: "Sim, quero orientação inicial", key: "lead" },
          { label: "Quero escolher outro objetivo", key: "again" }
        ], async (option) => {
          if (option.key === "again") {
            await say(`Sem problema. Escolha outro objetivo:`);
            renderNeedOptions();
          } else {
            showLeadForm();
          }
        });
      });
    }

    function showLeadForm() {
      const form = document.createElement("form");
      form.className = "intellih-mentoria-form intellih-mentoria-chat-fade";
      form.innerHTML = `
        <div class="intellih-mentoria-form-intro">
          <strong>Solicite orientação sobre mentoria</strong>
          <span>Preencha os dados abaixo para entendermos seu objetivo, contexto e melhor formato.</span>
        </div>

        <label>Nome
          <input type="text" name="name" placeholder="Seu nome" required>
        </label>

        <label>Área de atuação ou projeto
          <input type="text" name="company" placeholder="Ex.: educação, consultoria, negócio próprio, área técnica...">
        </label>

        <label>E-mail
          <input type="email" name="email" placeholder="voce@email.com" required>
        </label>

        <label>WhatsApp
          <input type="text" name="whatsapp" placeholder="(00) 00000-0000">
        </label>

        <label>Link de referência, se houver
          <input type="text" name="current_channel" placeholder="LinkedIn, site, Instagram, projeto, material...">
        </label>

        <label>Conte rapidamente o que quer melhorar com IA
          <textarea name="need_details" placeholder="Ex.: quero usar IA no trabalho; preparar aulas; criar conteúdo; melhorar produtividade; capacitar equipe..."></textarea>
        </label>

        <button type="submit" class="intellih-mentoria-submit">Enviar orientação</button>
        <div class="intellih-mentoria-mini-note">A Intellih responderá com uma orientação inicial sobre formato, viabilidade e próximo passo.</div>
      `;

      form.onsubmit = async (e) => {
        e.preventDefault();

        const data = Object.fromEntries(new FormData(form).entries());
        const submitButton = form.querySelector(".intellih-mentoria-submit");
        const originalSubmitText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = "Enviando...";
        const sending = addTyping();

        try {
          const response = await fetch("https://formsubmit.co/ajax/contato@intellih.com.br", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              _subject: "Novo lead via Assistente - Mentoria em IA",
              name: data.name,
              company: data.company,
              email: data.email,
              whatsapp: data.whatsapp,
              current_channel: data.current_channel,
              need_details: data.need_details,
              selected_need: selectedNeed,
              selected_profile: selectedProfile,
              recommended_format: selectedFormat,
              source: "Chat Widget Intellih - Mentoria em IA"
            })
          });

          if (!response.ok) throw new Error("Falha no envio");

          sending.remove();
          form.remove();

          track("MentoriaChatLeadSuccess", {
            need: selectedNeed,
            profile: selectedProfile,
            format: selectedFormat
          });

          await say(`Obrigado, <strong>${escapeHtml(data.name)}</strong>. Recebemos sua solicitação.`);
          await say(`Vou encaminhar com este foco: <strong>${escapeHtml(selectedFormat)}</strong>.`);
          await say(`Enquanto isso, uma boa preparação é listar tarefas em que você já tentou usar IA, dificuldades encontradas e objetivos que gostaria de alcançar.`);
          showSuccess("✅ Solicitação enviada com sucesso!");
        } catch (err) {
          sending.remove();

          track("MentoriaChatLeadError", {
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
      banner.className = "intellih-mentoria-success";
      banner.textContent = text;
      chatBody.appendChild(banner);
      scrollToBottom();
    }

    function showError(text) {
      const banner = document.createElement("div");
      banner.className = "intellih-mentoria-error";
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

      track("MentoriaChatOpen", { viewport: isMobile() ? "mobile" : "desktop" });
    }

    function closeChat() {
      chatWindow.style.opacity = "0";
      chatWindow.style.transform = "translateY(18px)";

      setTimeout(() => {
        chatWindow.style.display = "none";
      }, 260);

      track("MentoriaChatClose");
    }

    function registrarAberturaAssistenteMentoria(nomePagina) {
      if (window.__assistenteMentoriaAbertoRegistrado) {
        return;
      }
    
      window.__assistenteMentoriaAbertoRegistrado = true;
    
      if (typeof fbq === "function") {
        fbq("trackCustom", "AssistenteMentoriaAberto", {
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
