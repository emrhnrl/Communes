-- Repoint members.user_id FK from auth.users → profiles
-- This lets Supabase PostgREST resolve profiles(display_name, avatar_url)
-- directly in a members query. The chain members → profiles → auth.users
-- preserves cascade-delete behaviour via the existing profiles FK.

alter table members drop constraint if exists members_user_id_fkey;

alter table members
  add constraint members_user_id_fkey
  foreign key (user_id) references profiles(id) on delete cascade;
