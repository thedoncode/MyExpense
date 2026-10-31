-- MyExpense database schema for Postgres (Supabase). Version 1.
--
-- __SCHEMA__ is the environment's own schema (myexpense for production, myexpense_qa for QA) and
-- __ROLE__ the login the server uses (myexpense_app, myexpense_qa_app). `node server/tools.js sql prod`
-- prints this file filled in for an environment, ready for the Supabase SQL editor.
--
-- Security, in layers:
--   * The schema isn't one Supabase's Data API exposes, and the anon and authenticated roles get
--     nothing in it, so nothing here is reachable from the internet except through the server.
--   * Row Level Security is on for every table, with policies only for the server's own login, so any
--     other role (including a mistakenly exposed API) sees no rows.
--   * The server's login can read and write rows but can't create, change or drop tables.
--   * Reports, receipts, details and two-step secrets are encrypted by the server before they get here.

create schema if not exists __SCHEMA__;
revoke all on schema __SCHEMA__ from public;
do $$ begin
  if exists (select 1 from pg_roles where rolname = 'anon') then execute 'revoke all on schema __SCHEMA__ from anon'; end if;
  if exists (select 1 from pg_roles where rolname = 'authenticated') then execute 'revoke all on schema __SCHEMA__ from authenticated'; end if;
end $$;

-- The server's login. Its password is set separately (alter role ... password), never in this file.
do $$ begin
  if not exists (select 1 from pg_roles where rolname = '__ROLE__') then
    create role __ROLE__ login noinherit nocreatedb nocreaterole;
  end if;
end $$;
grant usage on schema __SCHEMA__ to __ROLE__;
alter role __ROLE__ set search_path = __SCHEMA__;
alter role __ROLE__ set statement_timeout = '30s';

set search_path = __SCHEMA__;

create table if not exists schema_version (
  version int primary key,
  applied_at bigint not null
);

create table if not exists users (
  id int generated always as identity primary key,
  email text not null unique check (length(email) <= 254),
  name text not null default '' check (length(name) <= 80),
  role text not null default 'user' check (role in ('user', 'admin')),
  status text not null default 'active' check (status in ('active', 'disabled')),
  pw_hash text,
  totp_secret bytea,
  totp_last_step bigint not null default 0,
  failed_logins int not null default 0,
  locked_until bigint not null default 0,
  created_at bigint not null,
  last_login_at bigint
);

create table if not exists recovery_codes (
  user_id int not null references users(id) on delete cascade,
  code_hash bytea not null,
  primary key (user_id, code_hash)
);

create table if not exists sessions (
  id int generated always as identity primary key,
  token_hash bytea not null unique,
  user_id int not null references users(id) on delete cascade,
  stage text not null check (stage in ('totp', 'enroll', 'full')),
  pending_secret bytea,
  created_at bigint not null,
  last_seen_at bigint not null,
  expires_at bigint not null,
  ip text not null default '',
  user_agent text not null default ''
);
create index if not exists sessions_user on sessions (user_id);

create table if not exists links (
  id int generated always as identity primary key,
  kind text not null check (kind in ('invite', 'reset')),
  token_hash bytea not null unique,
  email text not null,
  role text not null default 'user' check (role in ('user', 'admin')),
  user_id int references users(id) on delete cascade,
  created_by int,
  created_at bigint not null,
  expires_at bigint not null,
  used_at bigint
);

create table if not exists reports (
  user_id int not null references users(id) on delete cascade,
  id text not null check (id ~ '^[A-Za-z0-9_-]{1,64}$'),
  body bytea not null,
  bytes int not null,
  updated_at bigint not null,
  primary key (user_id, id)
);

create table if not exists receipts (
  user_id int not null references users(id) on delete cascade,
  id text not null check (id ~ '^[A-Za-z0-9_-]{1,64}$'),
  meta bytea not null,
  img_parts int not null default 0,
  orig_parts int not null default 0,
  bytes int not null default 0,
  created_at bigint not null,
  primary key (user_id, id)
);

create table if not exists receipt_parts (
  user_id int not null,
  receipt_id text not null,
  kind smallint not null,
  seq int not null,
  body bytea not null,
  primary key (user_id, receipt_id, kind, seq),
  foreign key (user_id, receipt_id) references receipts(user_id, id) on delete cascade
);

create table if not exists settings (
  user_id int primary key references users(id) on delete cascade,
  body bytea not null
);

create table if not exists ai_usage (
  user_id int not null references users(id) on delete cascade,
  day text not null,
  n int not null default 0,
  primary key (user_id, day)
);

-- No foreign keys, so the log outlives the accounts it mentions. It never holds anyone's expenses.
create table if not exists audit (
  id bigint generated always as identity primary key,
  at bigint not null,
  actor_id int,
  subject_id int,
  event text not null,
  ip text not null default '',
  detail text not null default ''
);
create index if not exists audit_at on audit (at);

insert into schema_version (version, applied_at) values (1, (extract(epoch from now()) * 1000)::bigint) on conflict do nothing;

-- Row Level Security on every table; only the server's login has policies
do $$
declare t text;
begin
  foreach t in array array['schema_version', 'users', 'recovery_codes', 'sessions', 'links', 'reports', 'receipts', 'receipt_parts', 'settings', 'ai_usage', 'audit'] loop
    execute format('alter table %I.%I enable row level security', '__SCHEMA__', t);
    execute format('alter table %I.%I force row level security', '__SCHEMA__', t);
    if not exists (select 1 from pg_policies where schemaname = '__SCHEMA__' and tablename = t and policyname = 'server_only') then
      execute format('create policy server_only on %I.%I to __ROLE__ using (true) with check (true)', '__SCHEMA__', t);
    end if;
    execute format('revoke all on %I.%I from public', '__SCHEMA__', t);
  end loop;
end $$;

grant select, insert, update, delete on all tables in schema __SCHEMA__ to __ROLE__;
revoke insert, update, delete on schema_version from __ROLE__;
grant usage, select on all sequences in schema __SCHEMA__ to __ROLE__;
