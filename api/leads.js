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

    return res.status(200).json({
      success: true,
      message: "Lead registrado com sucesso",
      lead: result[0]
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
