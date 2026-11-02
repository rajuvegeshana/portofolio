-- The browser has no direct access to these tables. The portfolio Edge
-- Function uses the project's server-side secret key and applies access rules.
create table if not exists public.portfolio_documents (
  key text primary key check (key in ('projects', 'experience', 'about')),
  body jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.portfolio_private_projects (
  slug text primary key check (slug ~ '^[a-z0-9-]{1,80}$'),
  body jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.portfolio_settings (
  key text primary key check (key in ('access')),
  body jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.portfolio_admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.portfolio_rate_limits (
  key text primary key,
  attempts integer not null default 0,
  reset_at timestamptz not null
);

alter table public.portfolio_documents enable row level security;
alter table public.portfolio_private_projects enable row level security;
alter table public.portfolio_settings enable row level security;
alter table public.portfolio_admin_users enable row level security;
alter table public.portfolio_rate_limits enable row level security;

revoke all on public.portfolio_documents from anon, authenticated;
revoke all on public.portfolio_private_projects from anon, authenticated;
revoke all on public.portfolio_settings from anon, authenticated;
revoke all on public.portfolio_admin_users from anon, authenticated;
revoke all on public.portfolio_rate_limits from anon, authenticated;

-- An atomic, server-only guard for password and access-key attempts.
create or replace function public.portfolio_check_attempt(p_key text)
returns boolean language plpgsql security definer set search_path = public as $$
declare n integer;
begin
  insert into public.portfolio_rate_limits(key, attempts, reset_at)
  values (p_key, 1, now() + interval '15 minutes')
  on conflict (key) do update set
    attempts = case when portfolio_rate_limits.reset_at <= now() then 1
                    else portfolio_rate_limits.attempts + 1 end,
    reset_at = case when portfolio_rate_limits.reset_at <= now()
                    then now() + interval '15 minutes'
                    else portfolio_rate_limits.reset_at end
  returning attempts into n;
  return n <= 12;
end;
$$;

revoke all on function public.portfolio_check_attempt(text) from public, anon, authenticated;
grant execute on function public.portfolio_check_attempt(text) to service_role;
