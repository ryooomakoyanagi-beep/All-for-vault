import fs from 'fs'
import path from 'path'
import crypto from 'crypto'

// Vercel KV support (for production)
// Check if we're running on Vercel
const isVercel = process.env.VERCEL === '1' || process.env.VERCEL_ENV

let kv = null
let kvInitialized = false
let kvError = null

// Try to initialize KV client
if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
  try {
    const { createClient } = require('@vercel/kv')
    kv = createClient({
      url: process.env.KV_REST_API_URL,
      token: process.env.KV_REST_API_TOKEN,
    })
    kvInitialized = true
    console.log('Vercel KV initialized successfully with custom credentials')
  } catch (error) {
    kvError = error
    console.error('Vercel KV initialization failed:', error)
  }
} else {
  // Try using default kv client if standard env vars are set
  try {
    const { kv: defaultKv } = require('@vercel/kv')
    if (defaultKv) {
      kv = defaultKv
      kvInitialized = true
      console.log('Vercel KV initialized successfully with default client')
    }
  } catch (error) {
    kvError = error
    console.warn('Vercel KV default client initialization failed:', error)
  }
}

// Log environment info for debugging
console.log('Storage configuration:', {
  isVercel,
  kvInitialized,
  hasKvRestApiUrl: !!process.env.KV_REST_API_URL,
  hasKvRestApiToken: !!process.env.KV_REST_API_TOKEN,
  hasKvUrl: !!process.env.KV_URL,
  nodeEnv: process.env.NODE_ENV
})

const feedbackFilePath = path.join(process.cwd(), 'data', 'feedback.jsonl')
const FEEDBACK_KEY = 'feedback:entries'

// Ensure data directory exists (for file system storage)
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

// Save feedback to storage (KV or file system)
async function saveFeedback(entry) {
  // On Vercel, KV is required
  if (isVercel && !kvInitialized) {
    throw new Error('Vercel KV is not configured. Please set up KV_REST_API_URL and KV_REST_API_TOKEN environment variables in Vercel dashboard.')
  }

  if (kv && kvInitialized) {
    // Use Vercel KV in production
    try {
      const entryId = `feedback:${entry.sessionId}:${Date.now()}`
      await kv.set(entryId, entry)
      await kv.lpush(FEEDBACK_KEY, entryId)
      console.log('Feedback saved to Vercel KV:', entryId)
    } catch (error) {
      console.error('Error saving to Vercel KV:', error)
      throw new Error(`Failed to save feedback to KV: ${error.message}`)
    }
  } else {
    // Use file system in development (local only)
    if (isVercel) {
      throw new Error('File system storage is not available on Vercel. Please configure Vercel KV.')
    }
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }
    const line = JSON.stringify(entry) + '\n'
    await fs.promises.appendFile(feedbackFilePath, line, 'utf8')
    console.log('Feedback saved to file system')
  }
}

// Read all feedback entries from storage
async function readAllFeedback() {
  // On Vercel, KV is required
  if (isVercel && !kvInitialized) {
    throw new Error('Vercel KV is not configured. Please set up KV_REST_API_URL and KV_REST_API_TOKEN environment variables in Vercel dashboard.')
  }

  if (kv && kvInitialized) {
    // Use Vercel KV in production
    try {
      const entryIds = await kv.lrange(FEEDBACK_KEY, 0, -1)
      const entries = []
      for (const entryId of entryIds) {
        const entry = await kv.get(entryId)
        if (entry) {
          entries.push(entry)
        }
      }
      return entries.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    } catch (error) {
      console.error('Error reading from Vercel KV:', error)
      throw new Error(`Failed to read feedback from KV: ${error.message}`)
    }
  } else {
    // Use file system in development (local only)
    if (isVercel) {
      throw new Error('File system storage is not available on Vercel. Please configure Vercel KV.')
    }
    if (!fs.existsSync(feedbackFilePath)) {
      return []
    }
    const fileContent = fs.readFileSync(feedbackFilePath, 'utf8')
    const lines = fileContent.trim().split('\n').filter(line => line.trim())
    return lines
      .map(line => {
        try {
          return JSON.parse(line)
        } catch (e) {
          return null
        }
      })
      .filter(entry => entry !== null)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }
}

export default async function handler(req, res) {
  console.log(`[${new Date().toISOString()}] Feedback API: ${req.method} request received`)
  console.log('Request URL:', req.url)
  console.log('Request headers:', JSON.stringify(req.headers, null, 2))

  // Add CORS headers for development
  if (process.env.NODE_ENV === 'development') {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  }

  if (req.method === 'OPTIONS') {
    console.log('OPTIONS request - returning 200')
    return res.status(200).end()
  }

  if (req.method === 'POST') {
    try {
      console.log('Feedback API: POST request received')
      console.log('Request body:', JSON.stringify(req.body, null, 2))
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

      // Save feedback (KV or file system)
      console.log('Saving feedback using:', kvInitialized ? 'Vercel KV' : 'File system')
      console.log('Environment:', { isVercel, kvInitialized })
      await saveFeedback(entry)
      console.log('Feedback saved successfully')

      console.log('Sending success response')
      res.status(200).json({ success: true, message: 'フィードバックを送信しました' })
    } catch (error) {
      console.error('[ERROR] Feedback API error:', error)
      console.error('[ERROR] Error name:', error.name)
      console.error('[ERROR] Error message:', error.message)
      console.error('[ERROR] Error stack:', error.stack)
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        feedbackFilePath,
        dataDirExists: fs.existsSync(dataDir),
        feedbackFileExists: fs.existsSync(feedbackFilePath)
      })
      res.status(500).json({ 
        error: 'フィードバックの送信に失敗しました',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      })
    }
  } else if (req.method === 'GET') {
    try {
      // Check for admin password
      const adminPassword = req.headers['x-admin-password'] || req.query.password
      const expectedPassword = process.env.ADMIN_PASSWORD

      if (!expectedPassword || adminPassword !== expectedPassword) {
        return res.status(401).json({ error: '認証が必要です' })
      }

      // Read all feedback entries (KV or file system)
      console.log('Reading feedback using:', kv ? 'Vercel KV' : 'File system')
      const entries = await readAllFeedback()

      res.status(200).json({ entries })
    } catch (error) {
      console.error('Feedback GET error:', error)
      res.status(500).json({ error: 'フィードバックの取得に失敗しました' })
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}
