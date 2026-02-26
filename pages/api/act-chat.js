import OpenAI from 'openai'
import { buildSystemPrompt } from '../../lib/act-knowledge-base'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { messages, selectedPhaseIds, bestRecord, locale = 'ja' } = req.body

    if (!selectedPhaseIds || selectedPhaseIds.length === 0) {
      return res.status(400).json({ error: '局面が選択されていません' })
    }

    if (!bestRecord || bestRecord < 0) {
      return res.status(400).json({ error: 'ベスト記録が無効です' })
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        error: 'OPENAI_API_KEY が設定されていません。.env.local ファイルを確認してください。',
      })
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    const systemPrompt = buildSystemPrompt(selectedPhaseIds, bestRecord, locale)

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'system', content: systemPrompt }, ...messages],
      temperature: 0.7,
      max_tokens: 1500,
    })

    const assistantMessage = completion.choices[0]?.message?.content ?? ''
    return res.status(200).json({ message: assistantMessage })
  } catch (error) {
    console.error('ACT Chat API error:', error)

    if (error?.status) {
      return res.status(error.status).json({ error: `OpenAI API Error: ${error.message}` })
    }

    return res.status(500).json({ error: '内部サーバーエラーが発生しました' })
  }
}
