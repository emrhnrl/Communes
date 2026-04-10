-- Revert members.user_id FK back to auth.users.
-- Pointing it at profiles caused FK violations for users without a profile row.

alter table members drop constraint if exists members_user_id_fkey;

alter table members
  add constraint members_user_id_fkey
  foreign key (user_id) references auth.users(id) on delete cascade;
