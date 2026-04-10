-- profiles table
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  display_name text,
  avatar_url text,
  created_at timestamptz default now() not null
);

-- RLS
alter table profiles enable row level security;
create policy "Public read" on profiles for select using (true);
create policy "Own update" on profiles for update using (auth.uid() = id);
create policy "Own insert" on profiles for insert with check (auth.uid() = id);

-- Auto-create profile on signup
create or replace function handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into profiles (id) values (new.id) on conflict do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();
