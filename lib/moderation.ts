import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

type ModerationResult =
  | { approved: true }
  | { approved: false; reason: string }

export async function moderateContent(content: {
  title: string
  description: string
}): Promise<ModerationResult> {
  try {
    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 256,
      system:
        'You are a content moderation assistant for a community platform. Reject content that contains: spam or advertising, hate speech, illegal content, sexual or vulgar language, offensive or obscene terms used as names or titles, or content that is completely off-topic for a community platform. Approve legitimate community content about hobbies, interests, local groups, activities, and similar topics. Respond ONLY with a JSON object: {"approved": true} or {"approved": false, "reason": "short user-facing explanation"}. No other text.',
      messages: [
        {
          role: 'user',
          content: `Title: ${content.title}\nDescription: ${content.description}`,
        },
      ],
    })

    const block = message.content[0]
    const text = block.type === 'text' ? block.text : ''
    const parsed = JSON.parse(text) as ModerationResult
    return parsed
  } catch (err) {
    console.error('[moderation] API call failed, failing open:', err)
    return { approved: true }
  }
}
