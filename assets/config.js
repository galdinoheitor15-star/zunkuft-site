// Configuração do site da Zunkuft. Edite só este arquivo.
window.ZK_CONFIG = {
  // WhatsApp comercial: DDI + DDD + número, só dígitos. Ex.: "5511987654321".
  // Vazio = os botões de WhatsApp ficam escondidos.
  whatsapp: "",

  // Perfil do Instagram.
  instagram: "https://www.instagram.com/",

  // Links de agenda (Cal.com ou Calendly).
  calHighTicket: "", // call de diagnóstico, 45 min
  calExpressa: "",   // call expressa, 20 min

  // URL que recebe os leads em JSON (Make, Zapier, Kommo ou Google Apps Script).
  // Recebe um envio "parcial" depois da 1ª pergunta e um "completa" no fim.
  webhook: "",

  // Nome de quem faz as calls.
  closer: "nosso especialista",

  // Vagas restantes do Programa Clientes Fundadores (de 0 a 5).
  vagasFundadores: 5,

  // Links de pagamento dos pacotes prontos (Asaas, Mercado Pago, Stripe...).
  // Vazio = o botão abre o WhatsApp com o nome do pacote.
  pagamentos: {
    landing: "",
    site: "",
    combo: ""
  }
};
