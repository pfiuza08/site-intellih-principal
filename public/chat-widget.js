// === Chat Widget Intellih (v14) ===
// Conversa natural + Indicador de digitação + Diagnóstico personalizado + Botão WhatsApp fixo

document.addEventListener("DOMContentLoaded", () => {
  const bgColor = window.getComputedStyle(document.body).backgroundColor;
  const [r, g, b] = bgColor.match(/\d+/g).map(Number);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  const isDark = brightness < 128;

  const bgPanel = isDark ? "#181818" : "#ffffff";
  const textColor = isDark ? "#f0f0f0" : "#222";
  const inputBg = isDark ? "#222" : "#fff";
  const inputBorder = isDark ? "#555" : "#ccc";

  let selectedNiche = null;

  // === BOTÃO DO CHAT ===
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

  // === BOTÃO FIXO DO WHATSAPP ===
  const whatsappButton = document.createElement("div");
  whatsappButton.innerHTML = `<img src="/img/whatsapp-icon.png?v=${Date.now()}" alt="WhatsApp Intellih" style="width:60px;height:60px;">`;
  Object.assign(whatsappButton.style, {
    position: "fixed", bottom: "100px", right: "24px",
    cursor: "pointer", zIndex: "999", borderRadius: "50%",
    background: "#25d366", padding: "6px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.35)",
    transition: "transform .25s ease, opacity .25s ease",
    opacity: "0", transform: "translateY(20px)"
  });
  whatsappButton.addEventListener("click", () => {
    const msg = encodeURIComponent("Olá! Vim do site da Intellih e quero saber mais sobre aplicações de IA no meu negócio.");
    window.open(`https://wa.me/5521995558808?text=${msg}`, "_blank");
  });
  document.body.appendChild(whatsappButton);
  setTimeout(() => { whatsappButton.style.opacity = "1"; whatsappButton.style.transform = "translateY(0)"; }, 800);

  // === BALÃO DE ABERTURA ===
  const welcomeBubble = document.createElement("div");
  welcomeBubble.innerHTML = `<b>Quer descobrir onde aplicar Inteligência Artificial no seu negócio?</b>`;
  Object.assign(welcomeBubble.style, {
    position: "fixed", bottom: "170px", right: "100px",
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
        <span>Assistente Intellih</span>
        <span id="close-chat" style="cursor:pointer;font-size:18px;">✕</span>
      </div>

      <div id="chat-body" style="flex:1;padding:14px;overflow-y:auto;font-size:14px;line-height:1.5;"></div>
    </div>
  `;
  document.body.appendChild(chatBox);

  const chatWindow = chatBox.querySelector(":scope > div");
  const chatBody = chatBox.querySelector("#chat-body");

  // === Efeito de digitação ===
  const typingIndicator = document.createElement("div");
  typingIndicator.innerHTML = `<span style="font-style:italic;color:${textColor};opacity:0.7">Assistente digitando...</span>`;
  Object.assign(typingIndicator.style, {marginTop:"4px"});

  const showTyping = () => {
    chatBody.appendChild(typingIndicator);
    chatBody.scrollTop = chatBody.scrollHeight;
  };

  const hideTyping = () => {
    if (typingIndicator.parentNode) typingIndicator.remove();
  };

  const addMessage = (html, delay = 1000) => {
    showTyping();
    setTimeout(() => {
      hideTyping();
      const msg = document.createElement("div");
      msg.innerHTML = html;
      chatBody.appendChild(msg);
      chatBody.scrollTop = chatBody.scrollHeight;
    }, delay);
  };

  // === Fluxo principal ===
  const startConversation = () => {
    chatBody.innerHTML = "";
    addMessage(`<p>Olá! Eu sou o assistente da <b>Intellih Tecnologia</b>.</p>`, 800);
    addMessage(`<p>Trabalhamos com estratégias, automações e agentes de IA para gerar resultados reais em empresas e profissionais.</p>`, 1500);
    addMessage(`<p>Quer ver onde a Inteligência Artificial pode gerar mais impacto para você?</p>`, 2200);
    setTimeout(showNiches, 3400);
  };

  const showNiches = () => {
    const options = document.createElement("div");
    Object.assign(options.style, {
      display: "flex", flexDirection: "column", gap: "8px", marginTop: "12px"
    });

    const niches = [
      "Vendas e Crescimento",
      "Atendimento e Experiência do Cliente",
      "Operações e Eficiência Interna",
      "Profissionais e Consultores"
    ];

    addMessage(`<p>Escolha abaixo o que melhor representa você:</p>`, 500);

    setTimeout(() => {
      niches.forEach((opt) => {
        const btn = document.createElement("button");
        btn.textContent = opt;
        Object.assign(btn.style, {
          padding: "10px", borderRadius: "8px", border: "1px solid #c44b04",
          background: "#fff", color: "#c44b04", cursor: "pointer", fontWeight: "600"
        });
        btn.addEventListener("click", () => {
          selectedNiche = opt;
          showApplications(opt);
        });
        options.appendChild(btn);
      });
      chatBody.appendChild(options);
    }, 1200);
  };

  const showApplications = (niche) => {
    chatBody.innerHTML = `<p><b>${niche}</b> — veja algumas formas práticas de aplicar IA:</p>`;

    const ideas = {
      "Vendas e Crescimento": [
        "IA que analisa leads e prevê conversão.",
        "Gerador automático de campanhas e textos.",
        "Painéis com métricas e alertas inteligentes."
      ],
      "Atendimento e Experiência do Cliente": [
        "Agente virtual com conhecimento da empresa.",
        "IA que identifica insatisfação e retém clientes.",
        "Respostas automáticas com linguagem natural."
      ],
      "Operações e Eficiência Interna": [
        "Automação de relatórios e dashboards.",
        "Assistentes internos para equipes operacionais.",
        "IA que otimiza rotinas e detecta gargalos."
      ],
      "Profissionais e Consultores": [
        "Chat de atendimento automatizado para captar clientes.",
        "IA que gera conteúdo e textos para redes sociais.",
        "Agente pessoal que organiza tarefas e agenda."
      ]
    };

    let delay = 800;
    ideas[niche].forEach((i) => addMessage(`<p>${i}</p>`, delay += 700));

    setTimeout(() => {
      addMessage(`<p>Deseja receber um <b>diagnóstico gratuito</b> com sugestões personalizadas para o seu caso?</p>`, delay + 500);
      showLeadForm();
    }, delay + 1000);
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
      const msgNiche = selectedNiche
        ? `Estamos preparando um diagnóstico de IA voltado para <b>${selectedNiche.toLowerCase()}</b>.`
        : `Estamos preparando um diagnóstico de IA personalizado para você.`;

      addMessage(`<p>Obrigado, <b>${name}</b>! Em breve você receberá no e-mail <b>${email}</b> suas sugestões práticas de aplicação de IA. ${msgNiche}</p>`, 600);
      addMessage(`<p>Se preferir, você pode falar conosco agora mesmo pelo WhatsApp.</p>`, 1600);

      const btn = document.createElement("button");
      btn.textContent = "Falar pelo WhatsApp";
      Object.assign(btn.style, {
        marginTop: "10px", padding: "10px", borderRadius: "8px",
        border: "none", background: "#25d366", color: "#fff",
        cursor: "pointer", fontWeight: "600"
      });
      btn.onclick = () => {
        const msg = encodeURIComponent("Olá! Vim do site da Intellih e quero saber mais sobre aplicações de IA no meu negócio.");
        window.open(`https://wa.me/5521995558808?text=${msg}`, "_blank");
      };
      chatBody.appendChild(btn);

      if (typeof fbq === "function") fbq("track", "Lead");
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
