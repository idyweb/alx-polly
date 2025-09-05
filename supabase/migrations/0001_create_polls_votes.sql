-- Enable required extension for gen_random_uuid (usually pre-enabled on Supabase)
create extension if not exists pgcrypto with schema public;

-- =========================
-- Tables
-- =========================

create table if not exists public.polls (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  slug text not null unique,
  question text not null,
  allow_multiple boolean not null default false,
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.poll_options (
  id uuid primary key default gen_random_uuid(),
  poll_id uuid not null references public.polls(id) on delete cascade,
  text text not null,
  idx int not null,
  created_at timestamptz not null default now(),
  unique (poll_id, idx)
);

create table if not exists public.votes (
  id uuid primary key default gen_random_uuid(),
  poll_id uuid not null references public.polls(id) on delete cascade,
  option_id uuid not null references public.poll_options(id) on delete cascade,
  voter_id uuid references auth.users(id) on delete set null,
  voter_token text,
  voter_ip_hash text,
  created_at timestamptz not null default now(),
  check ((voter_id is not null) or (voter_token is not null))
);

-- =========================
-- Indexes
-- =========================

create index if not exists idx_polls_slug on public.polls (slug);
create index if not exists idx_options_poll on public.poll_options (poll_id);
create index if not exists idx_votes_poll on public.votes (poll_id);
create index if not exists idx_votes_option on public.votes (option_id);

-- Multi-choice uniqueness (always active). For single-choice, a trigger will block cross-option duplicates per voter.
create unique index if not exists votes_one_per_option_user
  on public.votes (poll_id, option_id, voter_id) where voter_id is not null;
create unique index if not exists votes_one_per_option_token
  on public.votes (poll_id, option_id, voter_token) where voter_token is not null;

-- =========================
-- RLS
-- =========================

alter table public.polls enable row level security;
alter table public.poll_options enable row level security;
alter table public.votes enable row level security;

-- Polls policies
drop policy if exists polls_select_public on public.polls;
create policy polls_select_public on public.polls for select using (true);

drop policy if exists polls_owner_write on public.polls;
create policy polls_owner_write on public.polls
  for all
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

-- Poll options policies
drop policy if exists options_select_public on public.poll_options;
create policy options_select_public on public.poll_options for select using (true);

drop policy if exists options_owner_write on public.poll_options;
create policy options_owner_write on public.poll_options
  for all
  using (
    exists (
      select 1 from public.polls p where p.id = poll_id and p.owner_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.polls p where p.id = poll_id and p.owner_id = auth.uid()
    )
  );

-- Votes policies
drop policy if exists votes_select_public on public.votes;
create policy votes_select_public on public.votes for select using (true);

-- Authenticated vote inserts
drop policy if exists votes_insert_authed on public.votes;
create policy votes_insert_authed on public.votes
  for insert to authenticated
  with check (
    voter_id = auth.uid()
    and exists (
      select 1 from public.polls p
      where p.id = votes.poll_id and (p.expires_at is null or p.expires_at > now())
    )
  );

-- Anonymous vote inserts
drop policy if exists votes_insert_anon on public.votes;
create policy votes_insert_anon on public.votes
  for insert to anon
  with check (
    voter_token is not null
    and exists (
      select 1 from public.polls p
      where p.id = votes.poll_id and (p.expires_at is null or p.expires_at > now())
    )
  );

-- No update/delete policies: updates are disallowed by default; consider owner-only delete if needed.

-- =========================
-- Trigger: prevent duplicates in single-choice polls
-- =========================

create or replace function public.prevent_multi_option_single_choice()
returns trigger
language plpgsql
as $$
begin
  -- If the poll is single-choice, ensure the same voter hasn't already voted in this poll (any option)
  if exists (
    select 1 from public.polls p where p.id = new.poll_id and p.allow_multiple = false
  ) then
    if exists (
      select 1 from public.votes v
      where v.poll_id = new.poll_id
        and (
          (new.voter_id is not null and v.voter_id = new.voter_id)
          or (new.voter_token is not null and v.voter_token = new.voter_token)
        )
    ) then
      raise exception 'duplicate vote for single-choice poll' using errcode = '23505';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_votes_single_choice_guard on public.votes;
create trigger trg_votes_single_choice_guard
before insert on public.votes
for each row execute function public.prevent_multi_option_single_choice();

-- =========================
-- View: vote counts per option (optional utility for fast reads)
-- =========================

create or replace view public.poll_option_vote_counts as
select
  o.poll_id,
  o.id as option_id,
  count(v.id) as vote_count
from public.poll_options o
left join public.votes v on v.option_id = o.id
group by o.poll_id, o.id;


