const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getEnv(...names) {
  for (const name of names) {
    if (process.env[name]) return process.env[name];
  }
  return '';
}

function clean(value, maxLength = 500) {
  return String(value ?? '').trim().slice(0, maxLength);
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function normalizeBody(body) {
  return {
    name: clean(body.name, 120),
    email: clean(body.email, 180).toLowerCase(),
    phone: clean(body.phone, 40),
    business: clean(body.business, 160),
    interest: clean(body.interest, 180),
    message: clean(body.message, 1800),
    consent: body.consent === true,
    website: clean(body.website, 200),
    source: clean(body.source, 80) || 'mapa-aplicacoes',
    page_url: clean(body.page_url, 1000),
    referrer: clean(body.referrer, 1000),
    utm_source: clean(body.utm_source, 160),
    utm_medium: clean(body.utm_medium, 160),
    utm_campaign: clean(body.utm_campaign, 240),
    utm_content: clean(body.utm_content, 240)
  };
}

async function readJsonBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') return JSON.parse(req.body || '{}');
  let raw = '';
  for await (const chunk of req) raw += chunk;
  return JSON.parse(raw || '{}');
}

function tableCandidates() {
  const configured = getEnv('SUPABASE_LEADS_TABLE', 'LEADS_TABLE', 'CONTACTS_TABLE');
  return [...new Set([configured, 'leads', 'contact_leads', 'contatos', 'leads_site'].filter(Boolean))];
}

function recordCandidates(lead) {
  const tracking = [
    lead.interest ? `Interesse: ${lead.interest}` : '',
    lead.business ? `Contexto: ${lead.business}` : '',
    lead.message,
    lead.page_url ? `Página: ${lead.page_url}` : '',
    lead.referrer ? `Referência: ${lead.referrer}` : '',
    lead.utm_source || lead.utm_medium || lead.utm_campaign
      ? `UTM: source=${lead.utm_source || '-'}; medium=${lead.utm_medium || '-'}; campaign=${lead.utm_campaign || '-'}; content=${lead.utm_content || '-'}`
      : ''
  ].filter(Boolean).join('\n\n');

  const metadata = {
    interest: lead.interest,
    business: lead.business,
    page_url: lead.page_url,
    referrer: lead.referrer,
    utm_source: lead.utm_source,
    utm_medium: lead.utm_medium,
    utm_campaign: lead.utm_campaign,
    utm_content: lead.utm_content
  };

  return [
    {
      name: lead.name,
      email: lead.email,
      phone: lead.phone || null,
      company: lead.business || null,
      interest: lead.interest || null,
      message: lead.message,
      source: lead.source,
      status: 'new',
      metadata
    },
    {
      name: lead.name,
      email: lead.email,
      phone: lead.phone || null,
      company: lead.business || null,
      message: tracking,
      source: lead.source,
      status: 'new'
    },
    {
      name: lead.name,
      email: lead.email,
      phone: lead.phone || null,
      message: tracking,
      source: lead.source,
      status: 'new'
    },
    {
      nome: lead.name,
      email: lead.email,
      telefone: lead.phone || null,
      empresa: lead.business || null,
      interesse: lead.interest || null,
      mensagem: lead.message,
      origem: lead.source,
      status: 'novo',
      metadata
    },
    {
      nome: lead.name,
      email: lead.email,
      telefone: lead.phone || null,
      empresa: lead.business || null,
      mensagem: tracking,
      origem: lead.source,
      status: 'novo'
    },
    {
      nome: lead.name,
      email: lead.email,
      telefone: lead.phone || null,
      mensagem: tracking,
      origem: lead.source,
      status: 'novo'
    }
  ];
}

async function saveToSupabase(lead) {
  const supabaseUrl = getEnv('SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_URL', 'VITE_SUPABASE_URL');
  const serviceKey = getEnv('SUPABASE_SERVICE_ROLE_KEY', 'SUPABASE_SERVICE_KEY', 'SUPABASE_SECRET_KEY');
  if (!supabaseUrl || !serviceKey) {
    throw new Error('Configuração do Supabase não encontrada.');
  }

  const errors = [];
  for (const table of tableCandidates()) {
    for (const record of recordCandidates(lead)) {
      const response = await fetch(`${supabaseUrl.replace(/\/$/, '')}/rest/v1/${encodeURIComponent(table)}`, {
        method: 'POST',
        headers: {
          apikey: serviceKey,
          Authorization: `Bearer ${serviceKey}`,
          'Content-Type': 'application/json',
          Prefer: 'return=representation'
        },
        body: JSON.stringify(record)
      });

      if (response.ok) {
        const rows = await response.json().catch(() => []);
        return { table, row: Array.isArray(rows) ? rows[0] : rows };
      }

      const text = await response.text();
      errors.push(`${table}: ${response.status} ${text.slice(0, 260)}`);

      // Authentication errors will not be fixed by trying another schema/table.
      if (response.status === 401 || response.status === 403) {
        throw new Error(`Falha de autenticação no Supabase: ${text.slice(0, 260)}`);
      }
    }
  }

  throw new Error(`Não foi possível gravar o lead no Supabase. Tentativas: ${errors.join(' | ')}`);
}

async function sendLeadEmail(lead) {
  const apiKey = getEnv('RESEND_API_KEY');
  const from = getEnv('CONTACT_FROM_EMAIL', 'RESEND_FROM_EMAIL', 'EMAIL_FROM', 'MAIL_FROM');
  const to = getEnv('CONTACT_NOTIFICATION_EMAIL', 'CONTACT_TO_EMAIL', 'LEAD_NOTIFICATION_EMAIL') || 'contato@intellih.com.br';

  if (!apiKey || !from) {
    throw new Error('Configuração de e-mail não encontrada.');
  }

  const safe = Object.fromEntries(Object.entries(lead).map(([key, value]) => [key, escapeHtml(value)]));
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: lead.email,
      subject: `Novo lead — Mapa de Aplicações — ${lead.name}`,
      html: `
        <div style="font-family:Arial,sans-serif;color:#202124;line-height:1.55;max-width:680px">
          <h1 style="font-size:22px;margin:0 0 18px">Novo lead do Mapa de Aplicações</h1>
          <table style="border-collapse:collapse;width:100%">
            <tr><td style="padding:8px 0;font-weight:bold;width:150px">Nome</td><td style="padding:8px 0">${safe.name}</td></tr>
            <tr><td style="padding:8px 0;font-weight:bold">E-mail</td><td style="padding:8px 0">${safe.email}</td></tr>
            <tr><td style="padding:8px 0;font-weight:bold">Telefone</td><td style="padding:8px 0">${safe.phone || 'Não informado'}</td></tr>
            <tr><td style="padding:8px 0;font-weight:bold">Contexto</td><td style="padding:8px 0">${safe.business || 'Não informado'}</td></tr>
            <tr><td style="padding:8px 0;font-weight:bold">Assunto</td><td style="padding:8px 0">${safe.interest || 'Não informado'}</td></tr>
            <tr><td style="padding:8px 0;font-weight:bold">Origem</td><td style="padding:8px 0">${safe.source}</td></tr>
          </table>
          <h2 style="font-size:17px;margin:24px 0 8px">Mensagem</h2>
          <div style="white-space:pre-wrap;background:#f3f1ec;padding:16px;border-radius:10px">${safe.message}</div>
          <p style="font-size:12px;color:#60646c;margin-top:20px">Página: ${safe.page_url || 'Não informada'}<br>Referência: ${safe.referrer || 'Não informada'}<br>UTM: ${safe.utm_source || '-'} / ${safe.utm_medium || '-'} / ${safe.utm_campaign || '-'}</p>
        </div>`
    })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Falha ao enviar aviso por e-mail: ${response.status} ${text.slice(0, 300)}`);
  }
  return response.json().catch(() => ({}));
}

module.exports = async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'OPTIONS') {
    res.setHeader('Allow', 'POST, OPTIONS');
    return res.status(204).end();
  }
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST, OPTIONS');
    return res.status(405).json({ error: 'Método não permitido.' });
  }

  try {
    const raw = await readJsonBody(req);
    const lead = normalizeBody(raw);

    // Honeypot: responde como sucesso, mas não grava nem envia.
    if (lead.website) return res.status(200).json({ ok: true });

    if (!lead.name || lead.name.length < 2) return res.status(400).json({ error: 'Informe seu nome.' });
    if (!EMAIL_PATTERN.test(lead.email)) return res.status(400).json({ error: 'Informe um e-mail válido.' });
    if (!lead.message || lead.message.length < 15) return res.status(400).json({ error: 'Descreva um pouco melhor a sua solicitação.' });
    if (!lead.consent) return res.status(400).json({ error: 'É necessário autorizar o uso das informações para responder ao contato.' });

    const saved = await saveToSupabase(lead);

    let emailSent = true;
    try {
      await sendLeadEmail(lead);
    } catch (emailError) {
      emailSent = false;
      console.error('[contact] Lead salvo, mas o aviso por e-mail falhou:', emailError);
    }

    return res.status(200).json({ ok: true, saved: Boolean(saved), email_sent: emailSent });
  } catch (error) {
    console.error('[contact] Erro ao processar lead:', error);
    return res.status(500).json({ error: 'Não foi possível registrar seu contato agora. Tente novamente em alguns instantes.' });
  }
};
