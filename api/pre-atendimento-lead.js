export default async function handler(req, res) {
  // Permitir apenas POST
  if (req.method !== "POST") {
    return res.status(405).json({
      ok: false,
      error: "Method not allowed",
    });
  }

  try {
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return res.status(500).json({
        ok: false,
        error: "Supabase environment variables are missing",
      });
    }

    const body = req.body || {};

    const payload = {
      nome: body.nome || null,
      empresa: body.empresa || null,

      tipo_contato: body.tipo_contato || null,
      canal_principal: body.canal_principal || null,
      informacao_faltante: body.informacao_faltante || null,
      organizacao_atual: body.organizacao_atual || null,
      interesse: body.interesse || null,

      potencial_automacao: body.potencial_automacao || null,
      proximo_passo: body.proximo_passo || null,
      mensagem_whatsapp: body.mensagem_whatsapp || null,

      utm_source: body.utm_source || null,
      utm_medium: body.utm_medium || null,
      utm_campaign: body.utm_campaign || null,
      utm_content: body.utm_content || null,
      utm_term: body.utm_term || null,

      page_url: body.page_url || null,
      user_agent: req.headers["user-agent"] || body.user_agent || null,
      session_id: body.session_id || null,

      raw_payload: body,
    };

    const response = await fetch(`${SUPABASE_URL}/rest/v1/pre_atendimento_leads`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        Prefer: "return=representation",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        ok: false,
        error: data,
      });
    }

    return res.status(200).json({
      ok: true,
      lead: data?.[0] || null,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: error.message || "Unexpected error",
    });
  }
}
