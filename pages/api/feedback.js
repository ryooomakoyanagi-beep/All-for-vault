import fs from 'fs'
import path from 'path'
import crypto from 'crypto'

// Redis/KV support (for production)
// Check if we're running on Vercel
const isVercel = process.env.VERCEL === '1' || process.env.VERCEL_ENV

let redis = null
let redisInitialized = false
let redisError = null
let initializationAttempted = false

// Initialize Redis client (lazy initialization)
function initializeRedis() {
  if (initializationAttempted) {
    return { redis, redisInitialized, redisError }
  }
  
  initializationAttempted = true
  
  // Log environment info for debugging
  console.log('Initializing Redis/KV storage...')
  console.log('Environment variables:', {
    isVercel,
    hasUpstashRedisUrl: !!process.env.UPSTASH_REDIS_REST_URL,
    hasUpstashRedisToken: !!process.env.UPSTASH_REDIS_REST_TOKEN,
    hasKvRestApiUrl: !!process.env.KV_REST_API_URL,
    hasKvRestApiToken: !!process.env.KV_REST_API_TOKEN,
    hasKvUrl: !!process.env.KV_URL,
    hasRedisUrl: !!process.env.REDIS_URL,
    nodeEnv: process.env.NODE_ENV,
    vercel: process.env.VERCEL
  })

  // Priority: 1. Upstash Redis (UPSTASH_REDIS_REST_URL), 2. Vercel KV (KV_REST_API_URL), 3. REDIS_URL, 4. Default KV client
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    // Use Upstash Redis (recommended)
    try {
      const { Redis } = require('@upstash/redis')
      redis = new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
      redisInitialized = true
      console.log('Upstash Redis initialized successfully')
    } catch (error) {
      redisError = error
      console.error('Upstash Redis initialization failed:', error)
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      })
    }
  } else if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    // Use Vercel KV (most common in Vercel Storage)
    try {
      const { createClient } = require('@vercel/kv')
      redis = createClient({
        url: process.env.KV_REST_API_URL,
        token: process.env.KV_REST_API_TOKEN,
      })
      redisInitialized = true
      console.log('Vercel KV initialized successfully with KV_REST_API_URL')
    } catch (error) {
      redisError = error
      console.error('Vercel KV initialization failed:', error)
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      })
    }
  } else if (process.env.REDIS_URL && (process.env.REDIS_TOKEN || process.env.REDIS_PASSWORD)) {
    // Try using REDIS_URL if available (some Redis providers)
    try {
      const { Redis } = require('@upstash/redis')
      // REDIS_URL might be a connection string, try to parse it
      redis = new Redis({
        url: process.env.REDIS_URL,
        token: process.env.REDIS_TOKEN || process.env.REDIS_PASSWORD || '',
      })
      redisInitialized = true
      console.log('Redis initialized successfully with REDIS_URL')
    } catch (error) {
      redisError = error
      console.warn('Redis initialization with REDIS_URL failed:', error)
    }
  } else {
    // No configured Redis/KV credentials found.
    console.log('Redis/KV credentials are not configured; using file storage fallback')
  }
  
  console.log('Storage initialization result:', {
    redisInitialized,
    hasRedis: !!redis,
    error: redisError ? redisError.message : null
  })
  
  return { redis, redisInitialized, redisError }
}

const feedbackDir = isVercel
  ? path.join('/tmp', 'all-for-vault', 'data')
  : path.join(process.cwd(), 'data')
const feedbackCsvPath = path.join(feedbackDir, 'feedback.csv')
const FEEDBACK_KEY = 'feedback:entries'

// Ensure data directory exists (for file system storage)
if (!fs.existsSync(feedbackDir)) {
  fs.mkdirSync(feedbackDir, { recursive: true })
}

// CSV escape: wrap in double quotes and escape internal quotes
function escapeCSVField(value) {
  if (value === null || value === undefined) return ''
  const str = String(value)
  if (str.includes('"') || str.includes(',') || str.includes('\n') || str.includes('\r')) {
    return '"' + str.replace(/"/g, '""') + '"'
  }
  return str
}

const CSV_HEADER = 'createdAt,sessionId,userAgent,ipHash,featureUsed,clarity,actionability,trust,cognitiveLoad,confusingPhrases,goodPhrases,rewriteRequest,freeComment,outputSnapshot'

function appendFeedbackToCSV(entry) {
  const row = [
    entry.createdAt,
    entry.sessionId,
    entry.userAgent || '',
    entry.ipHash || '',
    entry.featureUsed,
    entry.clarity,
    entry.actionability,
    entry.trust,
    entry.cognitiveLoad,
    entry.confusingPhrases || '',
    entry.goodPhrases || '',
    entry.rewriteRequest || '',
    entry.freeComment || '',
    entry.outputSnapshot || ''
  ].map(escapeCSVField).join(',')
  const fileExists = fs.existsSync(feedbackCsvPath)
  const line = fileExists ? '\n' + row : CSV_HEADER + '\n' + row
  fs.appendFileSync(feedbackCsvPath, line, 'utf8')
}

function saveFeedbackToFile(entry) {
  if (!fs.existsSync(feedbackDir)) {
    fs.mkdirSync(feedbackDir, { recursive: true })
  }
  appendFeedbackToCSV(entry)
  console.log('Feedback saved to CSV (data/feedback.csv)')
}

function readFeedbackFromCSV() {
  if (!fs.existsSync(feedbackCsvPath)) return []
  const content = fs.readFileSync(feedbackCsvPath, 'utf8')
  const lines = content.split(/\r?\n/).filter(line => line.trim())
  if (lines.length < 2) return []
  const header = lines[0].split(',')
  const entries = []
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i])
    const entry = {}
    header.forEach((key, idx) => {
      let val = values[idx]
      if (val !== undefined && (key === 'clarity' || key === 'actionability' || key === 'trust' || key === 'cognitiveLoad')) {
        val = Number(val)
      }
      entry[key] = val
    })
    entries.push(entry)
  }
  return entries.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}

function parseCSVLine(line) {
  const result = []
  let current = ''
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const c = line[i]
    if (c === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"'
        i++
      } else {
        inQuotes = !inQuotes
      }
    } else if (inQuotes) {
      current += c
    } else if (c === ',') {
      result.push(current)
      current = ''
    } else {
      current += c
    }
  }
  result.push(current)
  return result
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

// Save feedback to storage (Redis/KV or file system)
async function saveFeedback(entry) {
  // Initialize Redis if not already done
  const { redis: currentRedis, redisInitialized: currentInitialized } = initializeRedis()

  if (currentRedis && currentInitialized) {
    // Use Redis/KV in production
    try {
      const entryId = `feedback:${entry.sessionId}:${Date.now()}`
      // Check if using Upstash Redis or Vercel KV
      if (process.env.UPSTASH_REDIS_REST_URL || process.env.REDIS_URL) {
        // Upstash Redis or standard Redis - need to stringify
        await currentRedis.set(entryId, JSON.stringify(entry))
        await currentRedis.lpush(FEEDBACK_KEY, entryId)
      } else {
        // Vercel KV (legacy) - accepts objects directly
        await currentRedis.set(entryId, entry)
        await currentRedis.lpush(FEEDBACK_KEY, entryId)
      }
      console.log('Feedback saved to Redis/KV:', entryId)
    } catch (error) {
      console.error('Error saving to Redis/KV:', error)
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      })
      console.warn('Falling back to file storage after Redis/KV save failure')
      saveFeedbackToFile(entry)
    }
  } else {
    // Use file system fallback: CSV in data/feedback.csv (Vercel uses /tmp)
    saveFeedbackToFile(entry)
  }
}

// Read all feedback entries from storage
async function readAllFeedback() {
  // Initialize Redis if not already done
  const { redis: currentRedis, redisInitialized: currentInitialized } = initializeRedis()

  if (currentRedis && currentInitialized) {
    // Use Redis/KV in production
    try {
      const entryIds = await currentRedis.lrange(FEEDBACK_KEY, 0, -1)
      const entries = []
      for (const entryId of entryIds) {
        const entryData = await currentRedis.get(entryId)
        if (entryData) {
          // Upstash Redis returns string, Vercel KV returns object
          const entry = typeof entryData === 'string' ? JSON.parse(entryData) : entryData
          if (entry) {
            entries.push(entry)
          }
        }
      }
      return entries.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    } catch (error) {
      console.error('Error reading from Redis/KV:', error)
      console.warn('Falling back to file storage after Redis/KV read failure')
      return readFeedbackFromCSV()
    }
  } else {
    // Use file system fallback: read from CSV (Vercel uses /tmp)
    return readFeedbackFromCSV()
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
        freeComment,
        outputSnapshot
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

      // Create feedback entry (outputSnapshot = 機能①②の出力結果を文字列で保存)
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
        freeComment: freeComment?.trim() || null,
        outputSnapshot: outputSnapshot != null ? (typeof outputSnapshot === 'string' ? outputSnapshot : JSON.stringify(outputSnapshot)) : null
      }

      // Initialize Redis before saving
      const { redisInitialized: currentInitialized } = initializeRedis()
      
      // Save feedback (Redis/KV or file system)
      console.log('Saving feedback using:', currentInitialized ? 'Redis/KV' : 'File system')
      console.log('Environment:', { isVercel, redisInitialized: currentInitialized })
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
        feedbackCsvPath,
        dataDirExists: fs.existsSync(feedbackDir),
        feedbackFileExists: fs.existsSync(feedbackCsvPath)
      })
      // Return detailed error in development, generic error in production
      const errorResponse = {
        error: 'フィードバックの送信に失敗しました'
      }
      
      // Initialize Redis to check status
      const { redisInitialized: currentInitialized } = initializeRedis()
      
      // Include error details in development or if explicitly on Vercel
      if (process.env.NODE_ENV === 'development' || isVercel) {
        errorResponse.details = error.message
        errorResponse.storageConfigured = currentInitialized
        errorResponse.environment = {
          isVercel,
          hasUpstashRedisUrl: !!process.env.UPSTASH_REDIS_REST_URL,
          hasUpstashRedisToken: !!process.env.UPSTASH_REDIS_REST_TOKEN,
          hasKvRestApiUrl: !!process.env.KV_REST_API_URL,
          hasKvRestApiToken: !!process.env.KV_REST_API_TOKEN,
          hasRedisUrl: !!process.env.REDIS_URL
        }
        if (isVercel && !currentInitialized) {
          errorResponse.setupInstructions = 'Please configure UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN (or KV_REST_API_URL and KV_REST_API_TOKEN) in Vercel dashboard Settings > Environment Variables'
        }
      }
      
      res.status(500).json(errorResponse)
    }
  } else if (req.method === 'GET') {
    try {
      // Check for admin password
      const adminPassword = req.headers['x-admin-password'] || req.query.password
      const expectedPassword = process.env.ADMIN_PASSWORD

      if (!expectedPassword) {
        return res.status(500).json({ error: 'ADMIN_PASSWORD が未設定です。環境変数を設定してください。' })
      }

      if (adminPassword !== expectedPassword) {
        return res.status(401).json({ error: '認証が必要です' })
      }

      // Initialize Redis before reading
      const { redisInitialized: currentInitialized } = initializeRedis()
      
      // Read all feedback entries (Redis/KV or file system)
      console.log('Reading feedback using:', currentInitialized ? 'Redis/KV' : 'File system')
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
