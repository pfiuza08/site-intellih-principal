create table if not exists public.assistentes_leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  nome text not null,
  email text not null,
  whatsapp text not null,
  interesse text not null,
  mensagem text not null,
  canal_preferido text not null check (canal_preferido in ('email', 'whatsapp')),
  origem text not null default 'assistentes-inteligentes',
  pagina text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  status text not null default 'novo'
);

create index if not exists assistentes_leads_created_at_idx
  on public.assistentes_leads (created_at desc);

create index if not exists assistentes_leads_status_idx
  on public.assistentes_leads (status);

alter table public.assistentes_leads enable row level security;

-- Não criamos política pública de INSERT.
-- O site grava os leads somente pela função serverless, usando a service role no servidor.
