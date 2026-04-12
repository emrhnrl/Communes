create or replace function similar_communes(commune_id uuid, match_count int default 4)
returns table (
  id         uuid,
  name       text,
  description text,
  category   text,
  city       text,
  created_at timestamptz,
  member_count bigint,
  similarity float8
)
language sql stable as $$
  select
    c.id,
    c.name,
    c.description,
    c.category,
    c.city,
    c.created_at,
    (select count(*) from members m where m.commune_id = c.id)::bigint,
    (1 - (c.embedding <=> q.embedding))::float8
  from
    communes c,
    (select embedding from communes where id = commune_id) q
  where
    c.id != commune_id
    and c.embedding is not null
    and q.embedding is not null
  order by c.embedding <=> q.embedding
  limit match_count;
$$;
