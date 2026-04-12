-- Enable pgvector extension (safe to run even if already enabled)
create extension if not exists vector;

-- Add embedding column to communes (gte-small produces 384-dimension vectors)
alter table communes add column if not exists embedding vector(384);

-- Index for fast approximate nearest-neighbour search
create index if not exists communes_embedding_idx
  on communes using ivfflat (embedding vector_cosine_ops)
  with (lists = 10);
