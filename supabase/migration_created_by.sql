-- Run this in the Supabase dashboard SQL editor before deploying edit/delete features.

alter table communes add column if not exists created_by uuid references auth.users(id) on delete set null;
alter table events   add column if not exists created_by uuid references auth.users(id) on delete set null;

-- RLS: only the creator can update or delete their own rows
create policy "communes_update" on communes for update using (auth.uid() = created_by);
create policy "communes_delete" on communes for delete using (auth.uid() = created_by);
create policy "events_update"   on events   for update using (auth.uid() = created_by);
create policy "events_delete"   on events   for delete using (auth.uid() = created_by);
