const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DEFAULT_TABLE = 'mapa_aplicacoes_leads';
const DEFAULT_NOTIFICATION_EMAIL = 'contato@intellih.com.br';

class AppError extends Error {
  constructor(code, publicMessage, internalMessage = publicMessage, status = 500) {
    super(internalMessage);
    this.name = 'AppError';
    this.code = code;
    this.publicMessage = publicMessage;
    this.status = status;
  }
}

function getEnv(...names) {
  for (const name of names) {
    const value = process.env[name];
    if (value) return value;
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

function validateLead(lead) {
  if (!lead.name || lead.name.length < 2) {
    throw new AppError('INVALID_NAME', 'Informe seu nome.', 'Nome ausente ou inválido.', 400);
  }
  if (!EMAIL_PATTERN.test(lead.email)) {
    throw new AppError('INVALID_EMAIL', 'Informe um e-mail válido.', 'E-mail ausente ou inválido.', 400);
  }
  if (!lead.message || lead.message.length < 15) {
    throw new AppError(
      'INVALID_MESSAGE',
      'Descreva um pouco melhor a sua solicitação.',
      'Mensagem com menos de 15 caracteres.',
      400
    );
  }
  if (!lead.consent) {
    throw new AppError(
      'CONSENT_REQUIRED',
      'É necessário autorizar o uso das informações para responder ao contato.',
      'Consentimento não informado.',
      400
    );
  }
}

function getSupabaseConfig() {
  const url = getEnv('SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_URL');
  const serviceRoleKey = getEnv(
    'SUPABASE_SERVICE_ROLE_KEY',
    'SUPABASE_SERVICE_KEY',
    'SUPABASE_SECRET_KEY'
  );
  const table = getEnv('SUPABASE_LEADS_TABLE') || DEFAULT_TABLE;

  if (!url) {
    throw new AppError(
      'SUPABASE_URL_MISSING',
      'O formulário está temporariamente indisponível.',
      'Variável SUPABASE_URL não encontrada no Vercel.'
    );
  }
  if (!serviceRoleKey) {
    throw new AppError(
      'SUPABASE_KEY_MISSING',
      'O formulário está temporariamente indisponível.',
      'Variável SUPABASE_SERVICE_ROLE_KEY não encontrada no Vercel.'
    );
  }

  return {
    url: url.replace(/\/$/, ''),
    serviceRoleKey,
    table
  };
}

async function saveToSupabase(lead) {
  const { url, serviceRoleKey, table } = getSupabaseConfig();

  const record = {
    name: lead.name,
    email: lead.email,
    phone: lead.phone || null,
    business: lead.business || null,
    interest: lead.interest || null,
    message: lead.message,
    consent: lead.consent,
    source: lead.source,
    page_url: lead.page_url || null,
    referrer: lead.referrer || null,
    utm_source: lead.utm_source || null,
    utm_medium: lead.utm_medium || null,
    utm_campaign: lead.utm_campaign || null,
    utm_content: lead.utm_content || null,
    status: 'novo',
    metadata: {
      user_agent: null
    }
  };

  const endpoint = `${url}/rest/v1/${encodeURIComponent(table)}`;
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      'Content-Type': 'application/json',
      'Content-Profile': 'public',
      Prefer: 'return=minimal'
    },
    body: JSON.stringify(record)
  });

  if (!response.ok) {
    const body = await response.text();
    const details = `Supabase respondeu ${response.status}: ${body.slice(0, 1200)}`;

    if (response.status === 401 || response.status === 403) {
      throw new AppError(
        'SUPABASE_AUTH_ERROR',
        'Não foi possível registrar seu contato agora.',
        details
      );
    }

    if (response.status === 404 || body.includes('PGRST205') || body.includes('Could not find the table')) {
      throw new AppError(
        'SUPABASE_TABLE_NOT_FOUND',
        'A estrutura de contatos ainda não está disponível.',
        details
      );
    }

    if (body.includes('column') || body.includes('schema cache')) {
      throw new AppError(
        'SUPABASE_SCHEMA_ERROR',
        'A estrutura de contatos precisa ser atualizada.',
        details
      );
    }

    throw new AppError(
      'SUPABASE_INSERT_ERROR',
      'Não foi possível registrar seu contato agora.',
      details
    );
  }

  return { table };
}

function getEmailConfig() {
  return {
    apiKey: getEnv('RESEND_API_KEY'),
    from: getEnv('CONTACT_FROM_EMAIL', 'RESEND_FROM_EMAIL', 'EMAIL_FROM', 'MAIL_FROM'),
    to:
      getEnv('CONTACT_NOTIFICATION_EMAIL', 'CONTACT_TO_EMAIL', 'LEAD_NOTIFICATION_EMAIL') ||
      DEFAULT_NOTIFICATION_EMAIL
  };
}

async function sendLeadEmail(lead) {
  const { apiKey, from, to } = getEmailConfig();

  // O lead já foi salvo. Falta de configuração de e-mail não deve desfazer o contato.
  if (!apiKey || !from) {
    console.warn('[contact] Aviso por e-mail ignorado: RESEND_API_KEY ou remetente ausente.');
    return { sent: false, reason: 'not_configured' };
  }

  const safe = Object.fromEntries(
    Object.entries(lead).map(([key, value]) => [key, escapeHtml(value)])
  );

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
          <p style="font-size:12px;color:#60646c;margin-top:20px">
            Página: ${safe.page_url || 'Não informada'}<br>
            Referência: ${safe.referrer || 'Não informada'}<br>
            UTM: ${safe.utm_source || '-'} / ${safe.utm_medium || '-'} / ${safe.utm_campaign || '-'}
          </p>
        </div>`
    })
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Resend respondeu ${response.status}: ${body.slice(0, 1000)}`);
  }

  return { sent: true };
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
    return res.status(405).json({
      ok: false,
      code: 'METHOD_NOT_ALLOWED',
      error: 'Método não permitido.'
    });
  }

  const requestId = globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`;

  try {
    const raw = await readJsonBody(req);
    const lead = normalizeBody(raw);

    // Honeypot: responde como sucesso, mas não grava nem envia.
    if (lead.website) return res.status(200).json({ ok: true });

    validateLead(lead);

    const saved = await saveToSupabase(lead);

    let emailSent = false;
    try {
      const emailResult = await sendLeadEmail(lead);
      emailSent = emailResult.sent;
    } catch (emailError) {
      console.error(`[contact:${requestId}] Lead salvo, mas o aviso por e-mail falhou:`, emailError);
    }

    return res.status(200).json({
      ok: true,
      saved: true,
      email_sent: emailSent,
      request_id: requestId,
      table: saved.table
    });
  } catch (error) {
    const appError =
      error instanceof AppError
        ? error
        : new AppError(
            'UNEXPECTED_ERROR',
            'Não foi possível registrar seu contato agora. Tente novamente em alguns instantes.',
            error?.stack || String(error)
          );

    console.error(`[contact:${requestId}] ${appError.code}:`, appError.message);

    return res.status(appError.status || 500).json({
      ok: false,
      code: appError.code,
      error: appError.publicMessage,
      request_id: requestId
    });
  }
};
