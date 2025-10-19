/* ============================================================
   Chat Widget Intellih - Assistente de IA (v1.1)
   Autor: Intellih Tecnologia | intellih.com.br
   ============================================================ */
(function(){
  const brandColor = "#c44b04";

  /* --- META PIXEL (configuração básica) ---------------------- */
  const PIXEL_IDS = ["1240394014783181"]; // ⬅️ coloque aqui um ou mais IDs, separados por vírgula
  (function(f,b,e,v,n,t,s){
    if(f.fbq) return; n=f.fbq=function(){ n.callMethod? n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq) f._fbq=n; n.push=n; n.loaded=!0; n.version='2.0'; n.queue=[];
    t=b.createElement(e); t.async=!0; t.src=v; s=b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t,s)
  })(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
  PIXEL_IDS.forEach(id => { try{ fbq('init', id); }catch(e){} });
  fbq('track', 'PageView');
  setTimeout(()=> fbq('trackCustom','TimeOnPage10s'), 10000);

  /* --- ELEMENTOS DE INTERFACE -------------------------------- */
  const bubble = document.createElement("div");
  bubble.id = "intellih-bubble";
  bubble.innerHTML = "🤖";
  Object.assign(bubble.style,{
    position:"fixed",bottom:"24px",right:"24px",width:"64px",height:"64px",
    borderRadius:"50%",background:brandColor,color:"#fff",fontSize:"30px",
    display:"flex",alignItems:"center",justifyContent:"center",
    cursor:"pointer",boxShadow:"0 4px 12px rgba(0,0,0,.3)",zIndex:"9999"
  });
  document.body.appendChild(bubble);

  const box = document.createElement("div");
  Object.assign(box.style,{
    position:"fixed",bottom:"100px",right:"24px",width:"320px",maxHeight:"480px",
    background:"#0b0b0c",color:"#fff",border:"1px solid rgba(255,255,255,.12)",
    borderRadius:"16px",boxShadow:"0 6px 20px rgba(0,0,0,.4)",
    display:"none",flexDirection:"column",overflow:"hidden",
    fontFamily:"Inter, sans-serif",zIndex:"9999"
  });
  box.innerHTML = `
    <div style="background:${brandColor};padding:14px;font-weight:700;display:flex;justify-content:space-between;align-items:center;">
      <span>Assistente Intellih</span>
      <button id="closeChat" style="background:none;border:none;color:#fff;font-size:18px;cursor:pointer;">×</button>
    </div>
    <div id="chatBody" style="flex:1;padding:14px;overflow-y:auto;font-size:14px;display:flex;flex-direction:column;gap:10px;">
      <div class="msg bot">Olá 👋 Sou o assistente de IA da Intellih.<br>Posso tirar suas dúvidas sobre Inteligência Artificial e automação inteligente.<br><br>Antes de começarmos, posso saber seu nome e e-mail?</div>
    </div>
    <form id="chatForm" style="display:flex;border-top:1px solid rgba(255,255,255,.1);">
      <input type="text" id="chatInput" placeholder="Digite sua mensagem..." style="flex:1;padding:10px;background:#121214;color:#fff;border:none;font-size:14px;">
      <button type="submit" style="background:${brandColor};color:#fff;border:none;padding:0 14px;border-top-right-radius:8px;">➤</button>
    </form>
  `;
  document.body.appendChild(box);

  const chatBody = box.querySelector("#chatBody");
  const chatInput = box.querySelector("#chatInput");
  const chatForm = box.querySelector("#chatForm");
  const closeChat = box.querySelector("#closeChat");

  let userName = null, userEmail = null, stage = "askName";

  function addMessage(text,sender="bot"){
    const msg=document.createElement("div");
    msg.className="msg "+sender;
    msg.innerHTML=text;
    Object.assign(msg.style,{
      padding:"10px 12px",borderRadius:"12px",maxWidth:"80%",lineHeight:"1.4",
      alignSelf:sender==="bot"?"flex-start":"flex-end",
      background:sender==="bot"?"rgba(255,255,255,.08)":brandColor
    });
    chatBody.appendChild(msg); chatBody.scrollTop=chatBody.scrollHeight;
  }

  chatForm.addEventListener("submit",e=>{
    e.preventDefault();
    const text=chatInput.value.trim();
    if(!text) return;
    addMessage(text,"user");
    chatInput.value="";
    setTimeout(()=>{
      if(stage==="askName"){
        userName=text;
        addMessage(`Prazer em te conhecer, ${userName}! 😊 Agora me diga seu e-mail para que eu possa enviar novidades e materiais exclusivos da Intellih.`);
        stage="askEmail";
      } else if(stage==="askEmail"){
        userEmail=text;
        addMessage(`Perfeito, ${userName}! Já registrei seu e-mail: ${userEmail}.`);
        addMessage("Agora me conte: você quer saber mais sobre nossos serviços de automação, agentes de IA ou como aplicar IA no seu negócio?");
        stage="chat";
        sendLead(userName,userEmail);
      } else {
        respondAI(text);
      }
    },600);
  });

  function respondAI(text){
    const lower=text.toLowerCase();
    let reply;
    if(lower.includes("serviço")||lower.includes("produto")){
      reply="Oferecemos consultoria, automações e agentes de IA personalizados para empresas de todos os portes 🚀";
    } else if(lower.includes("automação")){
      reply="A automação inteligente ajuda a economizar tempo e reduzir custos, conectando ferramentas e eliminando tarefas repetitivas ⚙️";
    } else if(lower.includes("ia")||lower.includes("inteligência artificial")){
      reply="A IA pode transformar seu negócio com decisões mais rápidas, personalização e produtividade. Quer um exemplo prático?";
    } else if(lower.includes("exemplo")){
      reply="Por exemplo, criamos agentes que respondem clientes automaticamente, geram relatórios e até ajudam a vender mais 💡";
    } else if(lower.includes("sim")||lower.includes("quero")){
      reply="Perfeito! 🙌 Nossa equipe pode entrar em contato com você em breve.";
      fbq('track','Contact');
    } else {
      reply="Entendi! 😊 Posso te explicar melhor em uma consultoria gratuita. Deseja que a equipe entre em contato?";
    }
    setTimeout(()=>addMessage(reply),800);
  }

  function sendLead(name,email){
    // 🔧 Substitua pelo endpoint do seu Google Form ou webhook
    const endpoint="https://docs.google.com/forms/u/0/d/e/1FAIpQLSc4FVsHnAG9m-3CmvbHOTU75pBvQEKSxB7UJifI6bkUUe93yw/formResponse";
    const data=new FormData();
    data.append("entry.123456789",name);  // ID do campo Nome
    data.append("entry.987654321",email); // ID do campo E-mail
    fetch(endpoint,{method:"POST",body:data})
      .then(()=>{console.log("Lead enviado"); fbq('track','Lead');})
      .catch(err=>console.warn("Erro ao enviar lead:",err));
  }

  /* --- AÇÕES -------------------------------------------------- */
  bubble.addEventListener("click",()=>{
    box.style.display="flex";
    fbq('track','ViewContent',{content_name:'Chat Widget'});
  });
  closeChat.addEventListener("click",()=> box.style.display="none");
})();


