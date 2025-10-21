// === Chat Widget Intellih (v7 Conversa Consultiva + Lead) ===
// Começa com pergunta de valor, depois pede nome e e-mail

document.addEventListener("DOMContentLoaded", () => {
  // Detecta tema claro/escuro
  const bgColor = window.getComputedStyle(document.body).backgroundColor;
  const [r, g, b] = bgColor.match(/\d+/g).map(Number);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  const isDark = brightness < 128;

  const bgPanel = isDark ? "#181818" : "#ffffff";
  const textColor = isDark ? "#f0f0f0" : "#222";
  const inputBg = isDark ? "#222" : "#fff";
  const inputBorder = isDark ? "#555" : "#ccc";
  const formBg = isDark ? "#1e1e1e" : "#f8f8f8";

  // === BOTÃO FLUTUANTE ===
  const chatButton = document.createElement("div");
  chatButton.id = "intellih-chat-button";
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

  // === BALÃO DE ABERTURA ===
  const welcomeBubble = document.createElement("div");
  welcomeBubble.innerHTML = `🤖 Quer receber <b>sugestões de aplicações de IA</b> para o seu negócio?`;
  Object.assign(welcomeBubble.style, {
    position: "fixed",
    bottom: "100px",
    right: "100px",
    background: "#fff",
    color: "#222",
    padding: "10px 14px",
    borderRadius: "16px",
    boxShadow: "0 3px 12px rgba(0,0,0,.25)",
    fontFamily: "Inter, system-ui, sans-serif",
    fontSize: "14px",
    lineHeight: "1.4",
    opacity: "0",
    transform: "translateY(10px)",
    transition: "opacity .6s ease, transform .6s ease",
    zIndex: "999",
    maxWidth: "260px"
  });
  document.body.appendChild(welcomeBubble);
  setTimeout(() => {
    welcomeBubble.style.opacity = "1";
    welcomeBubble.style.transform = "translateY(0)";
  }, 1800);
  setTimeout(() => {
    welcomeBubble.style.opacity = "0";
    welcomeBubble.style.transform = "translateY(10px)";
    setTimeout(() => welcomeBubble.remove(), 800);
  }, 8000);

  // === JANELA DE CHAT ===
  const chatBox = document.createElement("div");
  chatBox.id = "intellih-chat-box";
  chatBox.innerHTML = `
    <div style="
      background:${bgPanel};
      color:${textColor};
      border-radius:16px;
      width:340px;
      height:460px;
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
      transition:opacity .3s ease, transform .3s ease;
    ">
      <div style="background:#c44b04;color:#fff;padding:14px;font-weight:600;display:flex;justify-content:space-between;align-items:center;">
        <span>💬 Assistente Intellih</span>
        <span id="close-chat" style="cursor:pointer;font-size:18px;">✕</span>
      </div>

      <div id="chat-messages" style="flex:1;padding:14px;overflow-y:auto;font-size:14px;line-height:1.5;">
        <p>👋 Oi! Eu sou o assistente da <b>Intellih</b>.</p>
        <p>Quer descobrir <b>onde aplicar IA</b> para gerar mais lucro, economizar tempo e automatizar processos no seu negócio?</p>
        <p><b>Posso te mostrar algumas sugestões personalizadas!</b></p>
      </div>

      <form id="chat-form" style="padding:12px;border-top:1px solid ${inputBorder};background:${formBg};">
        <input type="text" name="name" placeholder="Seu nome" required style="
          width:100%;
          padding:10px;
          margin-bottom:8px;
          border:1px solid ${inputBorder};
          border-radius:6px;
          font-size:14px;
          background:${inputBg};
          color:${textColor};
        ">
        <input type="email" name="email" placeholder="Seu e-mail" required style="
          width:100%;
          padding:10px;
          margin-bottom:10px;
          border:1px solid ${inputBorder};
          border-radius:6px;
          font-size:14px;
          background:${inputBg};
          color:${textColor};
        ">
        <button type="submit" style="
          width:100%;
          padding:10px;
          background:#c44b04;
          color:#fff;
          border:none;
          border-radius:8px;
          font-weight:600;
          cursor:pointer;
          font-size:15px;
        ">Ver sugestões de IA</button>
      </form>
    </div>
  `;
  document.body.appendChild(chatBox);

  const chatWindow = chatBox.querySelector("div");
  const messages = chatBox.querySelector("#chat-messages");

  // === ABRIR / FECHAR ===
  chatButton.addEventListener("click", () => {
    const isOpen = chatWindow.style.display === "flex";
    if (isOpen) {
      chatWindow.style.opacity = "0";
      chatWindow.style.transform = "translateY(20px)";
      setTimeout(() => (chatWindow.style.display = "none"), 300);
    } else {
      chatWindow.style.display = "flex";
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

  // === FORMULÁRIO ===
  chatBox.querySelector("#chat-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value.trim();
    const email = form.email.value.trim();

    if (name && email) {
      messages.innerHTML += `<p>✅ Perfeito, <b>${name}</b>! Estamos analisando seu perfil...</p>`;
      setTimeout(() => {
        messages.innerHTML += `<p>📩 Em breve você receberá no e-mail <b>${email}</b> nossas <b>sugestões práticas de aplicação de IA</b> no seu negócio.</p>`;
        messages.scrollTop = messages.scrollHeight;
      }, 1200);

      if (typeof fbq === "function") fbq("track", "Lead");

      form.reset();
      setTimeout(() => {
        chatWindow.style.opacity = "0";
        chatWindow.style.transform = "translateY(20px)";
        setTimeout(() => (chatWindow.style.display = "none"), 800);
      }, 5000);
    }
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
