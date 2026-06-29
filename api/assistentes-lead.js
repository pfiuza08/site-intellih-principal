const NOTIFICATION_EMAIL = process.env.LEAD_NOTIFICATION_EMAIL || 'contato@intellih.com.br';

function json(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(body));
}

function clean(value, max = 2000) {
  return String(value || '').trim().slice(0, max);
}

async function saveToSupabase(lead) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Supabase não configurado');

  const response = await fetch(`${url.replace(/\/$/, '')}/rest/v1/assistentes_leads`, {
    method: 'POST',
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation'
    },
    body: JSON.stringify(lead)
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Falha ao salvar lead: ${response.status} ${detail}`);
  }

  const rows = await response.json();
  return rows[0] || null;
}

async function notifyByEmail(lead) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.LEAD_FROM_EMAIL;

  if (!apiKey) {
    throw new Error('RESEND_API_KEY não configurada na Vercel');
  }
  if (!from) {
    throw new Error('LEAD_FROM_EMAIL não configurado na Vercel');
  }

  const subject = `Novo lead — Assistentes Inteligentes — ${lead.nome}`;
  const body = [
    `Nome: ${lead.nome}`,
    `E-mail: ${lead.email}`,
    `WhatsApp: ${lead.whatsapp}`,
    `Canal escolhido: ${lead.canal_preferido}`,
    `Interesse: ${lead.interesse}`,
    `Origem: ${lead.origem}`,
    `Página: ${lead.pagina || '-'}`,
    '',
    'Mensagem:',
    lead.mensagem
  ].join('\n');

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from,
      to: [NOTIFICATION_EMAIL],
      reply_to: lead.email,
      subject,
      text: body,
      tags: [{ name: 'source', value: 'assistentes-lead' }]
    })
  });

  const responseText = await response.text();
  if (!response.ok) {
    throw new Error(`Resend ${response.status}: ${responseText}`);
  }

  try {
    return JSON.parse(responseText);
  } catch (_) {
    return { raw: responseText };
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return json(res, 405, { ok: false, error: 'Método não permitido' });
  }

  try {
    const input = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const lead = {
      nome: clean(input.nome, 160),
      email: clean(input.email, 200).toLowerCase(),
      whatsapp: clean(input.whatsapp, 40),
      interesse: clean(input.interesse, 200),
      mensagem: clean(input.mensagem, 4000),
      canal_preferido: clean(input.canal_preferido, 30) || 'email',
      origem: clean(input.origem, 200) || 'assistentes-inteligentes',
      pagina: clean(input.pagina, 500),
      utm_source: clean(input.utm_source, 200),
      utm_medium: clean(input.utm_medium, 200),
      utm_campaign: clean(input.utm_campaign, 200),
      status: 'novo'
    };

    if (!lead.nome || !lead.email || !lead.whatsapp || !lead.interesse || !lead.mensagem) {
      return json(res, 400, { ok: false, error: 'Preencha todos os campos obrigatórios.' });
    }
    if (!/^\S+@\S+\.\S+$/.test(lead.email)) {
      return json(res, 400, { ok: false, error: 'Informe um e-mail válido.' });
    }
    if (!['email', 'whatsapp'].includes(lead.canal_preferido)) {
      return json(res, 400, { ok: false, error: 'Canal de contato inválido.' });
    }

    const saved = await saveToSupabase(lead);

    try {
      const emailResult = await notifyByEmail(lead);
      return json(res, 200, {
        ok: true,
        id: saved?.id || null,
        email_sent: true,
        email_id: emailResult?.id || null
      });
    } catch (emailError) {
      console.error('Lead salvo, mas o aviso por e-mail falhou:', emailError);
      return json(res, 200, {
        ok: true,
        id: saved?.id || null,
        email_sent: false,
        warning: 'Lead salvo, mas o aviso por e-mail não foi enviado.',
        email_error: emailError.message
      });
    }
  } catch (error) {
    console.error(error);
    return json(res, 500, { ok: false, error: 'Não foi possível registrar o contato agora.' });
  }
}
