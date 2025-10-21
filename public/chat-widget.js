// === Chat Widget Intellih (v19) ===
// Correção: frase posicionada após o nome do nicho + todas as opções visíveis

document.addEventListener("DOMContentLoaded", () => {
  const bgColor = window.getComputedStyle(document.body).backgroundColor;
  const [r, g, b] = bgColor.match(/\d+/g).map(Number);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  const isDark = brightness < 128;

  const bgPanel = isDark ? "#181818" : "#ffffff";
  const textColor = isDark ? "#f0f0f0" : "#222";
  const inputBg = isDark ? "#222" : "#fff";
  const inputBorder = isDark ? "#555" : "#ccc";
  const formBg = isDark ? "#1e1e1e" : "#f8f8f8";

  let selectedNiche = null;

  // === BOTÃO FLUTUANTE DO CHAT ===
  const chatButton = document.createElement("div");
  chatButton.innerHTML = `<img src="/img/chat-icon.png?v=${Date.now()}" alt="Chat Intellih" style="width:64px;height:64px;">`;
  Object.assign(chatButton.style, {
    position: "fixed",
    bottom: "24px",
    right: "24px",
    cursor: "pointer",
    zIndex: "1000",
    borderRadius: "50%",
    background: "#fff",
    padding: "6px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.35)",
    transition: "transform .25s ease, opacity .25s ease",
    opacity: "0",
    transform: "translateY(20px)"
  });
  document.body.appendChild(chatButton);
  setTimeout(() => {
    chatButton.style.opacity = "1";
    chatButton.style.transform = "translateY(0)";
  }, 600);

  // === JANELA DO CHAT ===
  const chatBox = document.createElement("div");
  chatBox.id = "intellih-chat-box";
  chatBox.innerHTML = `
    <div style="
      background:${bgPanel};
      color:${textColor};
      border-radius:16px;
      width:360px;
      height:520px;
      position:fixed;
      bottom:100px;
      right:20px;
      box-shadow:0 5px 20px rgba(0,0,0,.3);
      display:none;
      flex-direction:column;
      font-family:Inter,system-ui,sans-serif;
      overflow:hidden;
      z-index:1001;
      opacity:0;
      transform:translateY(20px);
      transition:opacity .3s ease, transform .3s ease;">
      <div style="background:#c44b04;color:#fff;padding:14px;font-weight:600;display:flex;justify-content:space-between;align-items:center;">
        <span>Assistente Intellih</span>
        <span id="close-chat" style="cursor:pointer;font-size:18px;">✕</span>
      </div>
      <div id="chat-body" style="flex:1;padding:14px;overflow-y:auto;font-size:14px;line-height:1.5;scroll-behavior:smooth;"></div>
    </div>`;
  document.body.appendChild(chatBox);

  const chatWindow = chatBox.querySelector(":scope > div");
  const chatBody = chatBox.querySelector("#chat-body");

  // --- Indicador de digitação (singleton) + Fila de mensagens ---
  const typing = document.createElement("div");
  typing.setAttribute("aria-live", "polite");
  typing.style.cssText = "opacity:0; transition:opacity .25s ease; margin:6px 0;";
  typing.innerHTML = `
    <span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:#bbb;margin-right:4px;animation:blink 1s infinite alternate;"></span>
    <span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:#bbb;margin-right:4px;animation:blink 1s .2s infinite alternate;"></span>
    <span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:#bbb;animation:blink 1s .4s infinite alternate;"></span>`;
  const keyframes = document.createElement("style");
  keyframes.textContent = `@keyframes blink { from{opacity:.3} to{opacity:1} }`;
  document.head.appendChild(keyframes);

  let typingOn = false;
  function showTyping() {
    if (typingOn) return;
    typingOn = true;
    chatBody.appendChild(typing);
    requestAnimationFrame(() => (typing.style.opacity = "1"));
  }
  function hideTyping() {
    if (!typingOn) return;
    typing.style.opacity = "0";
    setTimeout(() => {
      if (typing.parentNode) typing.remove();
      typingOn = false;
    }, 200);
  }

  const msgQueue = [];
  let processing = false;

  function say(html, delay = 800) {
    msgQueue.push({ html, delay });
    if (!processing) processQueue();
  }

  async function processQueue() {
    processing = true;
    while (msgQueue.length) {
      const { html, delay } = msgQueue.shift();
      showTyping();
      await new Promise((r) => setTimeout(r, Math.max(0, delay)));
      hideTyping();

      const msg = document.createElement("div");
      msg.innerHTML = html;
      msg.style.opacity = "0";
      msg.style.transition = "opacity .35s ease";
      msg.style.marginBottom = "8px";
      chatBody.appendChild(msg);
      chatBody.scrollTop = chatBody.scrollHeight;
      requestAnimationFrame(() => (msg.style.opacity = "1"));
    }
    processing = false;
  }

  const showConfirmation = (message) => {
    const confirm = document.createElement("div");
    confirm.textContent = message;
    Object.assign(confirm.style, {
      color: "#0ad67d",
      fontWeight: "600",
      marginTop: "10px",
      padding: "8px",
      border: "1px solid #0ad67d",
      borderRadius: "6px",
      textAlign: "center",
      fontSize: "14px",
      opacity: "0",
      transition: "opacity .6s ease"
    });
    chatBody.appendChild(confirm);
    chatBody.scrollTop = chatBody.scrollHeight;
    setTimeout(() => (confirm.style.opacity = "1"), 100);
  };

  const startConversation = () => {
    chatBody.innerHTML = "";
    say(`<p>Olá, eu sou o assistente da <b>Intellih Tecnologia</b>.</p>`, 800);
    say(`<p>Trabalhamos com soluções em Inteligência Artificial para empresas e profissionais que desejam automatizar processos e acelerar resultados.</p>`, 1600);
    say(`<p>Quer ver onde a IA pode ser aplicada no seu negócio?</p>`, 2500);
    setTimeout(showNicheOptions, 3400);
  };

  const showNicheOptions = () => {
    const options = document.createElement("div");
    Object.assign(options.style, {
      display: "flex",
      flexDirection: "column",
      gap: "8px",
      marginTop: "12px"
    });

    const niches = [
      "Vendas e Marketing",
      "Atendimento e Experiência do Cliente",
      "Operações e Eficiência Interna",
      "Profissionais e Consultores"
    ];

    niches.forEach((opt) => {
      const btn = document.createElement("button");
      btn.textContent = opt;
      Object.assign(btn.style, {
        padding: "10px",
        borderRadius: "8px",
        border: "1px solid #c44b04",
        background: "#fff",
        color: "#c44b04",
        cursor: "pointer",
        fontWeight: "600"
      });
      btn.addEventListener("click", () => {
        selectedNiche = opt;
        showApplications(opt);
      });
      options.appendChild(btn);
    });
    chatBody.appendChild(options);
  };

  const showApplications = (niche) => {
    chatBody.innerHTML = `<p><b>${niche}</b></p><p>Veja exemplos práticos de aplicação de IA:</p>`;

    const ideas = {
      "Vendas e Marketing": [
        "Análise automática de leads e previsão de conversão.",
        "Geração de campanhas e textos persuasivos com IA.",
        "Painéis de métricas com alertas inteligentes."
      ],
      "Atendimento e Experiência do Cliente": [
        "Agentes virtuais personalizados com linguagem natural.",
        "Análise de sentimentos para retenção de clientes.",
        "Respostas automáticas baseadas em contexto real."
      ],
      "Operações e Eficiência Interna": [
        "Automação de relatórios e dashboards.",
        "Assistentes internos para equipes operacionais.",
        "IA que identifica gargalos e otimiza rotinas."
      ],
      "Profissionais e Consultores": [
        "Chats inteligentes para captação de clientes.",
        "Geração de conteúdo automatizado para redes sociais.",
        "Assistente pessoal para organização e produtividade."
      ]
    };

    ideas[niche].forEach((i) => say(`<p>${i}</p>`, 900));

    setTimeout(() => {
      say(`<p>Deseja receber um <b>diagnóstico gratuito</b> com sugestões específicas para o seu caso?</p>`, 2200);
      showContactForm();
    }, 2600);
  };

  const showContactForm = () => {
    const form = document.createElement("form");
    form.innerHTML = `
      <input type="text" name="name" placeholder="Seu nome" required style="
        width:100%;padding:10px;margin:8px 0;border:1px solid ${inputBorder};
        border-radius:6px;font-size:14px;background:${inputBg};color:${textColor};">
      <input type="email" name="email" placeholder="Seu e-mail" required style="
        width:100%;padding:10px;margin-bottom:10px;border:1px solid ${inputBorder};
        border-radius:6px;font-size:14px;background:${inputBg};color:${textColor};">
      <button type="submit" style="
        width:100%;padding:10px;background:#c44b04;color:#fff;border:none;
        border-radius:8px;font-weight:600;cursor:pointer;font-size:15px;">
        Enviar
      </button>`;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = form.name.value.trim();
      const email = form.email.value.trim();
      say(`<p>Obrigado, <b>${name}</b>. Sua solicitação foi registrada. Em breve entraremos em contato pelo e-mail <b>${email}</b> com o diagnóstico de IA ideal para você.</p>`, 600);
      showConfirmation("✔ Dados registrados com sucesso");
      say(`<p>Se preferir, fale agora mesmo com nossa equipe pelo WhatsApp:</p>`, 1800);

      const btn = document.createElement("button");
      btn.innerHTML = `<img src="/img/whatsapp-icon.svg" alt="WhatsApp" style="width:20px;height:20px;vertical-align:middle;margin-right:8px;"> Falar pelo WhatsApp`;
      Object.assign(btn.style, {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        marginTop: "10px",
        padding: "10px",
        borderRadius: "8px",
        border: "1px solid #ccc",
        background: "#fff",
        color: "#000",
        cursor: "pointer",
        fontWeight: "600"
      });
      btn.onclick = () => {
        const msg = encodeURIComponent("Olá! Vim do site da Intellih e quero saber mais sobre aplicações de IA no meu negócio.");
        window.open(`https://wa.me/5521995558808?text=${msg}`, "_blank");
      };
      chatBody.appendChild(btn);
      form.reset();
    });
    chatBody.appendChild(form);
  };

  // === ABRIR / FECHAR ===
  chatButton.addEventListener("click", () => {
    const isOpen = chatWindow.style.display === "flex";
    if (isOpen) {
      chatWindow.style.opacity = "0";
      chatWindow.style.transform = "translateY(20px)";
      setTimeout(() => (chatWindow.style.display = "none"), 300);
    } else {
      chatWindow.style.display = "flex";
      chatBody.innerHTML = "";
      startConversation();
      setTimeout(() => {
        chatWindow.style.opacity = "1";
        chatWindow.style.transform = "translateY(0)";
      }, 10);
    }
  });

  chatBox.querySelector("#close-chat").addEventListener("click", () => {
    chatWindow.style.opacity = "0";
    chatWindow.style.transform = "translateY(20px)";
    setTimeout(() => (chatWindow.style.display = "none"), 300);
  });

  function adjustChatForMobile() {
    if (window.innerWidth <= 480) {
      chatWindow.style.width = "92vw";
      chatWindow.style.height = "75vh";
      chatWindow.style.right = "4%";
      chatWindow.style.bottom = "100px";
      chatWindow.style.fontSize = "15px";
    }
  }
  window.addEventListener("resize", adjustChatForMobile);
  adjustChatForMobile();
});
