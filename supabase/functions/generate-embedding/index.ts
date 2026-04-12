const session = new Supabase.ai.Session('gte-small')

Deno.serve(async (req: Request) => {
  const { input } = await req.json()

  if (!input || typeof input !== 'string') {
    return new Response(JSON.stringify({ error: 'input must be a non-empty string' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const embedding = await session.run(input, {
    mean_pool: true,
    normalize: true,
  })

  return new Response(JSON.stringify({ embedding: Array.from(embedding) }), {
    headers: { 'Content-Type': 'application/json' },
  })
})
