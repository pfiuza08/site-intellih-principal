// === Chat Widget Intellih (v5 Final) ===
// Balão de boas-vindas + Animações + Modo adaptativo escuro/claro

document.addEventListener("DOMContentLoaded", () => {
  // Detecta se o fundo do site é escuro
  const bgColor = window.getComputedStyle(document.body).backgroundColor;
  const [r, g, b] = bgColor.match(/\d+/g).map(Number);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  const isDark = brightness < 128;

  // Cores adaptativas
  const bgPanel = isDark ? "#181818" : "#ffffff";
  const textColor = isDark ? "#f0f0f0" : "#222";
  const inputBg = isDark ? "#222" : "#fff";
  const inputBorder = isDark ? "#555" : "#ccc";
  const formBg = isDark ? "#1e1e1e" : "#f8f8f8";

  // === BOTÃO FLUTUANTE ===
  const chatButton = document.createElement("div");
  chatButton.id = "intellih-chat-button";
  chatButton.innerHTML = `<img src="/img/chat-icon.png?v=${Date.now()}" alt="Chat Intellih" style="width:60px;height:60px;">`;
  Object.assign(chatButton.style, {
    position: "fixed",
    bottom: "24px",
    right: "24px",
    cursor: "pointer",
    zIndex: "1000",
    borderRadius: "50%",
    background: "#fff",
    padding: "4px",
    boxShadow: "0 3px 10px rgba(0,0,0,0.3)",
    transition: "transform .25s ease, opacity .25s ease",
    opacity: "0",
    transform: "translateY(20px)"
  });
  document.body.appendChild(chatButton);

  // Anima o botão após o carregamento
  setTimeout(() => {
    chatButton.style.opacity = "1";
    chatButton.style.transform = "translateY(0)";
  }, 600);

  // === BALÃO DE BOAS-VINDAS PERSONALIZADO ===
  const welcomeBubble = document.createElement("div");
  welcomeBubble.innerHTML = `👋 <b>Oi!</b> Quer descobrir como automatizar seu negócio com <b>IA?</b>`;
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
    maxWidth: "240px"
  });
  document.body.appendChild(welcomeBubble);

  setTimeout(() => {
    welcomeBubble.style.opacity = "1";
    welcomeBubble.style.transform = "translateY(0)";
  }, 2000);

  // Desaparece suavemente após 8s
  setTimeout(() => {
    welcomeBubble.style.opacity = "0";
    welcomeBubble.style.transform = "translateY(10px)";
    setTimeout(() => welcomeBubble.remove(), 800);
  }, 8000);

  // === JANELA DO CHAT ===
  const chatBox = document.createElement("div");
  chatBox.id = "intellih-chat-box";
  chatBox.innerHTML = `
    <div style="
      background:${bgPanel};
      color:${textColor};
      border-radius:16px;
      width:340px;
      height:440px;
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
        <span>💬 Atendente Intellih</span>
        <span id="close-chat" style="cursor:pointer;font-size:18px;">✕</span>
      </div>

      <div style="flex:1;padding:14px;overflow-y:auto;font-size:14px;line-height:1.5;">
        <p>👋 Olá! Eu sou o assistente da <b>Intellih</b>.</p>
        <p>Posso te mostrar como usar <b>Inteligência Artificial</b> para economizar tempo e aumentar seus resultados?</p>
        <p>Deixe seu <b>nome</b> e <b>e-mail</b> e entraremos em contato.</p>
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
        ">Enviar</button>
      </form>
    </div>
  `;
  document.body.appendChild(chatBox);

  const chatWindow = chatBox.querySelector("div");

  // === ABRIR / FECHAR COM ANIMAÇÃO ===
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
      alert(`✅ Obrigado, ${name}! Entraremos em contato pelo e-mail ${email}.`);
      form.reset();
      chatWindow.style.opacity = "0";
      chatWindow.style.transform = "translateY(20px)";
      setTimeout(() => (chatWindow.style.display = "none"), 300);
    }
  });

  // === AJUSTE PARA MOBILE ===
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
