-- Run this migration manually in the Supabase SQL editor or via the Supabase CLI.

create table rsvps (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references events(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (event_id, user_id)
);

alter table rsvps enable row level security;

create policy "rsvps_read" on rsvps for select using (true);
create policy "rsvps_insert" on rsvps for insert with check (auth.uid() = user_id);
create policy "rsvps_delete" on rsvps for delete using (auth.uid() = user_id);
