// === Chat Widget Intellih ===
// Exibe ícone flutuante e abre um pequeno painel de chat amigável.

document.addEventListener("DOMContentLoaded", () => {
  // Cria botão flutuante
  const chatButton = document.createElement("div");
  chatButton.id = "intellih-chat-button";
  chatButton.innerHTML = `<img src="/chat-icon.png" alt="Chat Intellih" style="width:60px;height:60px;">`;
  Object.assign(chatButton.style, {
    position: "fixed",
    bottom: "24px",
    right: "24px",
    cursor: "pointer",
    zIndex: "1000",
    borderRadius: "50%",
    boxShadow: "0 3px 10px rgba(0,0,0,0.25)",
  });
  document.body.appendChild(chatButton);

  // Cria janela de chat (oculta inicialmente)
  const chatBox = document.createElement("div");
  chatBox.id = "intellih-chat-box";
  chatBox.innerHTML = `
    <div style="
      background:#fff;
      color:#222;
      border-radius:16px;
      width:320px;
      height:400px;
      position:fixed;
      bottom:100px;
      right:20px;
      box-shadow:0 5px 18px rgba(0,0,0,.25);
      display:none;
      flex-direction:column;
      font-family:Inter,system-ui,sans-serif;
      overflow:hidden;
      z-index:1001;
      ">
      <div style="background:#c44b04;color:#fff;padding:14px;font-weight:600;display:flex;justify-content:space-between;align-items:center;">
        <span>💬 Atendente Intellih</span>
        <span id="close-chat" style="cursor:pointer;font-size:18px;">✕</span>
      </div>
      <div style="flex:1;padding:12px;overflow-y:auto;font-size:14px;line-height:1.4;">
        <p>👋 Olá! Eu sou o assistente da Intellih.</p>
        <p>Posso te ajudar a entender como a Inteligência Artificial pode transformar o seu negócio?</p>
        <p>Deixe seu <b>nome</b> e <b>e-mail</b> para começarmos!</p>
      </div>
      <form id="chat-form" style="padding:12px;border-top:1px solid #eee;background:#fafafa;">
        <input type="text" name="name" placeholder="Seu nome" required style="width:100%;padding:8px;margin-bottom:8px;border:1px solid #ccc;border-radius:6px;">
        <input type="email" name="email" placeholder="Seu e-mail" required style="width:100%;padding:8px;margin-bottom:8px;border:1px solid #ccc;border-radius:6px;">
        <button type="submit" style="width:100%;padding:10px;background:#c44b04;color:#fff;border:none;border-radius:8px;font-weight:600;cursor:pointer;">Enviar</button>
      </form>
    </div>
  `;
  document.body.appendChild(chatBox);

  // Alterna visibilidade do chat
  chatButton.addEventListener("click", () => {
    chatBox.style.display = chatBox.style.display === "none" ? "flex" : "none";
  });
  chatBox.querySelector("#close-chat").addEventListener("click", () => {
    chatBox.style.display = "none";
  });

  // Envio do formulário
  chatBox.querySelector("#chat-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    if (name && email) {
      alert(`Obrigado, ${name}! Em breve entraremos em contato pelo e-mail ${email}.`);
      form.reset();
      chatBox.style.display = "none";
    }
  });
});
