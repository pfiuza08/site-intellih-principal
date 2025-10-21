// === Chat Widget Intellih (v10 Diagnóstico Expandido) ===
// Agora com 4 nichos, sugestões personalizadas e fluxo conversacional aprimorado

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

  // === BOTÃO ===
  const chatButton = document.createElement("div");
  chatButton.innerHTML = `<img src="/img/chat-icon.png?v=${Date.now()}" alt="Chat Intellih" style="width:64px;height:64px;">`;
  Object.assign(chatButton.style, {
    position: "fixed", bottom: "24px", right: "24px",
    cursor: "pointer", zIndex: "1000", borderRadius: "50%",
    background: "#fff", padding: "6px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.35)",
    transition: "transform .25s ease, opacity .25s ease",
    opacity: "0", transform: "translateY(20px)"
  });
  document.body.appendChild(chatButton);
  setTimeout(() => { chatButton.style.opacity = "1"; chatButton.style.transform = "translateY(0)"; }, 600);

  // === BALÃO DE ABERTURA ===
  const welcomeBubble = document.createElement("div");
  welcomeBubble.innerHTML = `💡 Quer descobrir <b>onde aplicar IA</b> no seu negócio ou carreira?`;
  Object.assign(welcomeBubble.style, {
    position: "fixed", bottom: "100px", right: "100px",
    background: "#fff", color: "#222", padding: "10px 14px",
    borderRadius: "16px", boxShadow: "0 3px 12px rgba(0,0,0,.25)",
    fontFamily: "Inter, system-ui, sans-serif", fontSize: "14px", lineHeight: "1.4",
    opacity: "0", transform: "translateY(10px)", transition: "opacity .6s ease, transform .6s ease",
    zIndex: "999", maxWidth: "280px"
  });
  document.body.appendChild(welcomeBubble);
  setTimeout(() => { welcomeBubble.style.opacity = "1"; welcomeBubble.style.transform = "translateY(0)"; }, 1800);
  setTimeout(() => { welcomeBubble.style.opacity = "0"; welcomeBubble.style.transform = "translateY(10px)"; setTimeout(() => welcomeBubble.remove(), 800); }, 8000);

  // === JANELA DO CHAT ===
  const chatBox = document.createElement("div");
  chatBox.id = "intellih-chat-box";
  chatBox.innerHTML = `
    <div style="
      background:${bgPanel}; color:${textColor};
      border-radius:16px; width:360px; height:520px;
      position:fixed; bottom:100px; right:20px;
      box-shadow:0 5px 20px rgba(0,0,0,.3);
      display:none; flex-direction:column;
      font-family:Inter,system-ui,sans-serif;
      overflow:hidden; z-index:1001;
      opacity:0; transform:translateY(20px);
      transition:opacity .3s ease, transform .3s ease;">
      
      <div style="background:#c44b04;color:#fff;padding:14px;font-weight:600;
                  display:flex;justify-content:space-between;align-items:center;">
        <span>🤖 Assistente Intellih</span>
        <span id="close-chat" style="cursor:pointer;font-size:18px;">✕</span>
      </div>

      <div id="chat-body" style="flex:1;padding:14px;overflow-y:auto;font-size:14px;line-height:1.5;"></div>
    </div>
  `;
  document.body.appendChild(chatBox);

  const chatWindow = chatBox.querySelector(":scope > div");
  const chatBody = chatBox.querySelector("#chat-body");

  // === Funções ===
  const addMessage = (html, delay = 400) => {
    setTimeout(() => {
      const msg = document.createElement("div");
      msg.innerHTML = html;
      chatBody.appendChild(msg);
      chatBody.scrollTop = chatBody.scrollHeight;
    }, delay);
  };

  const showNiches = () => {
    chatBody.innerHTML = "";
    addMessage(`<p>👋 Oi! Eu sou o assistente da <b>Intellih</b>.</p>`);
    addMessage(`<p>Quer ver onde a <b>Inteligência Artificial</b> pode gerar resultado rápido no seu negócio ou na sua rotina profissional?</p>`);
    addMessage(`<p>Escolha abaixo o que mais se parece com você:</p>`);

    const options = document.createElement("div");
    Object.assign(options.style, {
      display: "flex", flexDirection: "column", gap: "8px", marginTop: "10px"
    });

    const niches = [
      "🚀 Vendas & Crescimento",
      "🤖 Atendimento & Experiência do Cliente",
      "⚙️ Operações & Eficiência Interna",
      "💼 Profissionais & Consultores"
    ];

    niches.forEach((opt) => {
      const btn = document.createElement("button");
      btn.textContent = opt;
      Object.assign(btn.style, {
        padding: "10px", borderRadius: "8px", border: "1px solid #c44b04",
        background: "#fff", color: "#c44b04", cursor: "pointer", fontWeight: "600"
      });
      btn.addEventListener("click", () => showApplications(opt));
      options.appendChild(btn);
    });

    chatBody.appendChild(options);
  };

  const showApplications = (niche) => {
    chatBody.innerHTML = `<p><b>${niche}</b> — veja algumas ideias práticas de IA:</p>`;

    const ideas = {
      "🚀 Vendas & Crescimento": [
        "📊 IA que analisa leads e prevê chance de conversão.",
        "✍️ Gerador de campanhas e textos personalizados por público.",
        "📈 Painéis automáticos com alertas de metas e desempenho."
      ],
      "🤖 Atendimento & Experiência do Cliente": [
        "💬 Agente virtual inteligente, treinado com o conteúdo da empresa.",
        "🎯 IA que identifica insatisfação e antecipa cancelamentos.",
        "⏱ Respostas automáticas com linguagem natural e empática."
      ],
      "⚙️ Operações & Eficiência Interna": [
        "📑 Automação de relatórios, planilhas e documentos.",
        "🧠 Assistente interno que responde dúvidas da equipe.",
        "📆 IA que detecta gargalos e sugere otimizações diárias."
      ],
      "💼 Profissionais & Consultores": [
        "🧩 Chat de atendimento automatizado para captar clientes.",
        "📚 IA que cria conteúdo e posts para redes sociais.",
        "📅 Agente pessoal que organiza agenda e envia follow-ups."
      ]
    };

    ideas[niche].forEach((i) => addMessage(`<p>${i}</p>`, 300));

    setTimeout(() => {
      addMessage(`<p>Quer receber um <b>diagnóstico gratuito</b> com sugestões personalizadas de IA para você?</p>`);
      showLeadForm();
    }, 1800);
  };

  const showLeadForm = () => {
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
        Receber diagnóstico
      </button>`;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = form.name.value.trim();
      const email = form.email.value.trim();
      addMessage(`<p>✅ Obrigado, <b>${name}</b>! Em breve você receberá no e-mail <b>${email}</b> suas <b>sugestões práticas de IA</b>.</p>`);
      if (typeof fbq === "function") fbq("track", "Lead");
      form.reset();
      setTimeout(() => {
        chatWindow.style.opacity = "0";
        chatWindow.style.transform = "translateY(20px)";
        setTimeout(() => (chatWindow.style.display = "none"), 800);
      }, 5000);
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
      showNiches();
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

  // === MOBILE ===
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
