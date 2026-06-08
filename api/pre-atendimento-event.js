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
      event_name: body.event_name || "UnknownEvent",
      session_id: body.session_id || null,
      lead_id: body.lead_id || null,

      step: body.step || null,
      answer: body.answer || null,

      utm_source: body.utm_source || null,
      utm_medium: body.utm_medium || null,
      utm_campaign: body.utm_campaign || null,
      utm_content: body.utm_content || null,
      utm_term: body.utm_term || null,

      page_url: body.page_url || null,
      user_agent: req.headers["user-agent"] || body.user_agent || null,

      raw_payload: body,
    };

    const response = await fetch(`${SUPABASE_URL}/rest/v1/pre_atendimento_events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        Prefer: "return=minimal",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const data = await response.json();

      return res.status(response.status).json({
        ok: false,
        error: data,
      });
    }

    return res.status(200).json({
      ok: true,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: error.message || "Unexpected error",
    });
  }
}
