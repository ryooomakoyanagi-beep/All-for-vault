import fs from 'fs'
import path from 'path'
import crypto from 'crypto'

const feedbackFilePath = path.join(process.cwd(), 'data', 'feedback.jsonl')

// Ensure data directory exists
const dataDir = path.join(process.cwd(), 'data')
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

// Hash IP address for privacy
function hashIP(ip) {
  if (!ip) return null
  return crypto.createHash('sha256').update(ip).digest('hex').substring(0, 16)
}

// Generate session ID
function generateSessionId() {
  return crypto.randomBytes(16).toString('hex')
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const {
        featureUsed,
        clarity,
        actionability,
        trust,
        cognitiveLoad,
        confusingPhrases,
        goodPhrases,
        rewriteRequest,
        freeComment
      } = req.body

      // Validate required fields
      if (!featureUsed || !clarity || !actionability || !trust || !cognitiveLoad) {
        return res.status(400).json({ error: '必須項目が不足しています' })
      }

      // Validate featureUsed
      if (!['feature1', 'feature2'].includes(featureUsed)) {
        return res.status(400).json({ error: '無効なfeatureUsedです' })
      }

      // Validate Likert scale (1-5)
      const ratings = [clarity, actionability, trust, cognitiveLoad]
      if (ratings.some(r => !Number.isInteger(Number(r)) || Number(r) < 1 || Number(r) > 5)) {
        return res.status(400).json({ error: '評価は1-5の整数である必要があります' })
      }

      // Get client info
      const ip = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || req.connection?.remoteAddress || 'unknown'
      const ipHash = hashIP(ip)
      const userAgent = req.headers['user-agent'] || 'unknown'
      const sessionId = generateSessionId()

      // Create feedback entry
      const entry = {
        createdAt: new Date().toISOString(),
        sessionId,
        userAgent,
        ipHash,
        featureUsed,
        clarity: Number(clarity),
        actionability: Number(actionability),
        trust: Number(trust),
        cognitiveLoad: Number(cognitiveLoad),
        confusingPhrases: confusingPhrases?.trim() || null,
        goodPhrases: goodPhrases?.trim() || null,
        rewriteRequest: rewriteRequest?.trim() || null,
        freeComment: freeComment?.trim() || null
      }

      // Append to JSONL file
      const line = JSON.stringify(entry) + '\n'
      fs.appendFileSync(feedbackFilePath, line, 'utf8')

      res.status(200).json({ success: true, message: 'フィードバックを送信しました' })
    } catch (error) {
      console.error('Feedback API error:', error)
      res.status(500).json({ error: 'フィードバックの送信に失敗しました' })
    }
  } else if (req.method === 'GET') {
    try {
      // Check for admin password
      const adminPassword = req.headers['x-admin-password'] || req.query.password
      const expectedPassword = process.env.ADMIN_PASSWORD

      if (!expectedPassword || adminPassword !== expectedPassword) {
        return res.status(401).json({ error: '認証が必要です' })
      }

      // Read all feedback entries
      if (!fs.existsSync(feedbackFilePath)) {
        return res.status(200).json({ entries: [] })
      }

      const fileContent = fs.readFileSync(feedbackFilePath, 'utf8')
      const lines = fileContent.trim().split('\n').filter(line => line.trim())
      
      const entries = lines
        .map(line => {
          try {
            return JSON.parse(line)
          } catch (e) {
            return null
          }
        })
        .filter(entry => entry !== null)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Newest first

      res.status(200).json({ entries })
    } catch (error) {
      console.error('Feedback GET error:', error)
      res.status(500).json({ error: 'フィードバックの取得に失敗しました' })
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}
