function formatarRespostas(respostas) {
  if (!Array.isArray(respostas)) return "Nenhuma resposta registrada.";

  return respostas
    .map((item, index) => {
      return `${index + 1}. ${item.question || "Pergunta não informada"}
Resposta: ${item.answer || ""}
Pontuação: ${item.score ?? ""}`;
    })
    .join("\n\n");
}

function montarEmailTexto(data) {
  return `
Novo lead recebido pela Intellih.

Origem: ${data.origem || ""}
Nome: ${data.nome || ""}
E-mail: ${data.email || ""}
WhatsApp: ${data.whatsapp || ""}
Segmento: ${data.segmento || ""}
Negócio: ${data.negocio || ""}
Site ou Instagram: ${data.canal || ""}

Pontuação: ${data.pontuacao ?? ""}
Resultado: ${data.resultado || ""}

Observação:
${data.observacao || ""}

UTMs:
utm_source: ${data.utm_source || ""}
utm_medium: ${data.utm_medium || ""}
utm_campaign: ${data.utm_campaign || ""}
utm_content: ${data.utm_content || ""}
utm_term: ${data.utm_term || ""}

Página:
${data.page_url || ""}

Respostas:
${formatarRespostas(data.respostas)}
`;
}

function montarEmailHtml(data) {
  const respostas = Array.isArray(data.respostas)
    ? data.respostas
        .map((item, index) => `
          <div style="padding:12px 0;border-bottom:1px solid #eee;">
            <strong>${index + 1}. ${item.question || "Pergunta não informada"}</strong><br>
            Resposta: ${item.answer || ""}<br>
            Pontuação: ${item.score ?? ""}
          </div>
        `)
        .join("")
    : "<p>Nenhuma resposta registrada.</p>";

  return `
  <div style="font-family:Arial,sans-serif;line-height:1.5;color:#191715;">
    <h2>Novo lead recebido pela Intellih</h2>

    <p><strong>Origem:</strong> ${data.origem || ""}</p>
    <p><strong>Nome:</strong> ${data.nome || ""}</p>
    <p><strong>E-mail:</strong> ${data.email || ""}</p>
    <p><strong>WhatsApp:</strong> ${data.whatsapp || ""}</p>
    <p><strong>Segmento:</strong> ${data.segmento || ""}</p>
    <p><strong>Negócio:</strong> ${data.negocio || ""}</p>
    <p><strong>Site ou Instagram:</strong> ${data.canal || ""}</p>

    <hr>

    <p><strong>Pontuação:</strong> ${data.pontuacao ?? ""}</p>
    <p><strong>Resultado:</strong> ${data.resultado || ""}</p>

    <p><strong>Observação:</strong><br>${data.observacao || ""}</p>

    <hr>

    <h3>Campanha</h3>
    <p><strong>utm_source:</strong> ${data.utm_source || ""}</p>
    <p><strong>utm_medium:</strong> ${data.utm_medium || ""}</p>
    <p><strong>utm_campaign:</strong> ${data.utm_campaign || ""}</p>
    <p><strong>utm_content:</strong> ${data.utm_content || ""}</p>
    <p><strong>utm_term:</strong> ${data.utm_term || ""}</p>

    <p><strong>Página:</strong><br>${data.page_url || ""}</p>

    <hr>

    <h3>Respostas do checklist</h3>
    ${respostas}
  </div>
  `;
}

async function enviarEmailLead(data) {
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const LEAD_NOTIFICATION_TO = process.env.LEAD_NOTIFICATION_TO;
  const LEAD_NOTIFICATION_FROM = process.env.LEAD_NOTIFICATION_FROM;

  if (!RESEND_API_KEY || !LEAD_NOTIFICATION_TO || !LEAD_NOTIFICATION_FROM) {
    console.warn("Variáveis do Resend não configuradas.");
    return { sent: false, reason: "missing_env" };
  }

  const subject = `Novo lead Intellih — ${data.origem || "Landing"}`;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: LEAD_NOTIFICATION_FROM,
      to: [LEAD_NOTIFICATION_TO],
      subject,
      text: montarEmailTexto(data),
      html: montarEmailHtml(data)
    })
  });

  const result = await response.json();

  if (!response.ok) {
    console.error("Erro ao enviar e-mail pelo Resend:", result);
    return { sent: false, error: result };
  }

  return { sent: true, result };
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Método não permitido"
    });
  }

  try {
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return res.status(500).json({
        success: false,
        message: "Variáveis de ambiente do Supabase não configuradas"
      });
    }

    const data = req.body || {};

    if (!data.origem) {
      return res.status(400).json({
        success: false,
        message: "Origem é obrigatória"
      });
    }

    const lead = {
      origem: data.origem,
      nome: data.nome || null,
      email: data.email || null,
      whatsapp: data.whatsapp || null,
      segmento: data.segmento || null,
      negocio: data.negocio || null,
      canal: data.canal || null,
      observacao: data.observacao || null,

      pontuacao: data.pontuacao ?? null,
      resultado: data.resultado || null,
      respostas: data.respostas || null,

      utm_source: data.utm_source || null,
      utm_medium: data.utm_medium || null,
      utm_campaign: data.utm_campaign || null,
      utm_content: data.utm_content || null,
      utm_term: data.utm_term || null,

      page_url: data.page_url || null,
      referrer: data.referrer || null,
      user_agent: req.headers["user-agent"] || null,

      status: "novo",
      origem_campanha: data.origem_campanha || null
    };

    const response = await fetch(`${SUPABASE_URL}/rest/v1/leads_intellih`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        Prefer: "return=representation"
      },
      body: JSON.stringify(lead)
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Erro Supabase:", result);

      return res.status(response.status).json({
        success: false,
        message: "Erro ao registrar lead no Supabase",
        error: result
      });
    }

    let emailStatus = { sent: false };

    try {
      emailStatus = await enviarEmailLead({
        ...data,
        id: result?.[0]?.id,
        created_at: result?.[0]?.created_at
      });
    } catch (emailError) {
      console.error("Lead registrado, mas erro ao enviar e-mail:", emailError);
      emailStatus = {
        sent: false,
        error: emailError.message
      };
    }

    return res.status(200).json({
      success: true,
      message: "Lead registrado com sucesso",
      lead: result[0],
      email: emailStatus
    });

  } catch (error) {
    console.error("Erro geral:", error);

    return res.status(500).json({
      success: false,
      message: "Erro interno ao registrar lead",
      error: error.message
    });
  }
}
