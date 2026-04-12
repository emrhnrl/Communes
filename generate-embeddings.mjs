// generate-embeddings.mjs
// Generates and stores embeddings for all communes via the generate-embedding edge function.
//
// Prerequisites:
//   1. Run supabase/migration_embeddings.sql in the Supabase dashboard
//   2. Deploy the edge function: npx supabase functions deploy generate-embedding
//   3. Add SUPABASE_SERVICE_ROLE_KEY to .env.local (anon key cannot bypass RLS for updates)
//
// Usage: node generate-embeddings.mjs

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'

// Parse .env.local
const envContent = readFileSync(new URL('.env.local', import.meta.url), 'utf8')
const env = Object.fromEntries(
  envContent
    .split('\n')
    .filter((l) => l.includes('=') && !l.startsWith('#'))
    .map((l) => {
      const idx = l.indexOf('=')
      return [l.slice(0, idx).trim(), l.slice(idx + 1).trim()]
    })
)

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL
// Use service role key to bypass RLS for the embedding update.
// If SUPABASE_SERVICE_ROLE_KEY is not set, falls back to anon key (may fail due to RLS).
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY ?? env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or key in .env.local')
  process.exit(1)
}

if (!env.SUPABASE_SERVICE_ROLE_KEY) {
  console.warn(
    'Warning: SUPABASE_SERVICE_ROLE_KEY not found. Using anon key — updates may fail due to RLS.'
  )
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Fetch all communes
const { data: communes, error: fetchError } = await supabase
  .from('communes')
  .select('id, name, description')

if (fetchError) {
  console.error('Failed to fetch communes:', fetchError.message)
  process.exit(1)
}

console.log(`Generating embeddings for ${communes.length} communes…`)

for (const commune of communes) {
  const input = [commune.name, commune.description].filter(Boolean).join(': ')

  // Call the edge function
  const { data, error: fnError } = await supabase.functions.invoke('generate-embedding', {
    body: { input },
  })

  if (fnError || !data?.embedding) {
    console.error(`  [FAIL] ${commune.name}: ${fnError?.message ?? 'no embedding returned'}`)
    continue
  }

  // Store the embedding
  const { error: updateError } = await supabase
    .from('communes')
    .update({ embedding: data.embedding })
    .eq('id', commune.id)

  if (updateError) {
    console.error(`  [FAIL] ${commune.name}: ${updateError.message}`)
  } else {
    console.log(`  [OK]   ${commune.name}`)
  }
}

console.log('Done.')
