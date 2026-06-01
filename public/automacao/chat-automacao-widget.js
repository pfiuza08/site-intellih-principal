selectedSituation = option.label;
selectedApplication = option.app;

track("AutomationChatSituationSelected", {
  area: selectedArea,
  situation: selectedSituation,
  application: selectedApplication,
  direct_whatsapp: Boolean(option.directWhatsapp)
});

const typing = addTyping();
await sleep(680);
typing.remove();

if (option.directWhatsapp) {
  selectedUrgency = "Prefere explicar o caso diretamente pelo WhatsApp";

  await say(`Tudo bem. Como seu caso é diferente das opções iniciais, o melhor caminho é explicar diretamente pelo WhatsApp.`);
  await say(`Preparei uma mensagem inicial para posicionar a conversa.`);

  showWhatsAppCopyBox();
  return;
}

showRecommendation();
