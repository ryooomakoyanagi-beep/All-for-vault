import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { useLanguage } from '../../context/LanguageContext'
import { getTranslations } from '../../lib/translations'

function OutputSnapshotBlock({ entry, t }) {
  const [open, setOpen] = useState(false)
  const output = entry.outputSnapshot
  if (!output) return null
  let parsed = null
  try {
    parsed = typeof output === 'string' ? JSON.parse(output) : output
  } catch (_) {
    return (
      <div className="mt-4 pt-4 border-t border-slate-700">
        <button type="button" onClick={() => setOpen(!open)} className="text-slate-400 text-sm font-semibold hover:text-white">
          {open ? '▼' : '▶'} {t.outputSnapshotRaw}
        </button>
        {open && <pre className="mt-2 text-xs text-slate-400 whitespace-pre-wrap break-all">{output}</pre>}
      </div>
    )
  }
  const isFeature2 = entry.featureUsed === 'feature2'
  return (
    <div className="mt-4 pt-4 border-t border-slate-700">
      <button type="button" onClick={() => setOpen(!open)} className="text-slate-400 text-sm font-semibold hover:text-white">
        {open ? '▼' : '▶'} {t.outputSnapshotLabel}
      </button>
      {open && (
        <div className="mt-3 space-y-3 text-sm">
          {isFeature2 && parsed.question != null && (
            <div>
              <span className="text-slate-500">{t.questionLabel}</span>
              <p className="text-white mt-1 whitespace-pre-wrap">{parsed.question}</p>
            </div>
          )}
          {isFeature2 && (parsed.advice != null || parsed.message != null) && (
            <div>
              <span className="text-slate-500">{t.adviceLabel}</span>
              <p className="text-white mt-1 whitespace-pre-wrap">{parsed.advice ?? parsed.message}</p>
            </div>
          )}
          {!isFeature2 && parsed && (
            <div className="space-y-2">
              {parsed.gripAdjustment && (
                <p className="text-white">
                  <span className="text-slate-500">{t.gripSuggestion}</span> {parsed.gripAdjustment.direction}{parsed.gripAdjustment.amount}cm → {parsed.gripAdjustment.newGripPosition?.toFixed(1)}cm
                </p>
              )}
              {parsed.newPole && (
                <p className="text-white">
                  <span className="text-slate-500">{t.recommendedPoleLabel}</span> {parsed.newPole.length}ft, {parsed.newPole.weight}lbs
                </p>
              )}
              {parsed.recommendedMidMark != null && (
                <p className="text-white">
                  <span className="text-slate-500">{t.recommendedMidMarkLabel}</span> {parsed.recommendedMidMark}m
                </p>
              )}
              {parsed.startAdjustment && <p className="text-white">{parsed.startAdjustment}</p>}
              {parsed.techFeedback && <p className="text-white">{parsed.techFeedback}</p>}
              {parsed.recommendation && <p className="text-white">{parsed.recommendation}</p>}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function AdminFeedback() {
  const router = useRouter()
  const { lang } = useLanguage()
  const t = getTranslations(lang)
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('all')
  const [password, setPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Check if password is provided in URL
    const urlPassword = router.query.password
    if (urlPassword && !isAuthenticated) {
      setPassword(urlPassword)
      fetchFeedback(urlPassword)
    }
  }, [router.query])

  const fetchFeedback = async (pwd) => {
    const normalizedPassword = (pwd || '').trim()
    if (!normalizedPassword) {
      setError(t.passwordRequired)
      return
    }
    
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/feedback?password=${encodeURIComponent(normalizedPassword)}`, {
        headers: {
          'X-Admin-Password': normalizedPassword
        }
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        if (response.status === 401) {
          throw new Error(t.authFailed)
        }
        throw new Error(errorData.error || t.fetchFailed)
      }

      const data = await response.json()
      setEntries(data.entries || [])
      setIsAuthenticated(true) // Mark as authenticated on success
    } catch (err) {
      setError(err.message)
      setIsAuthenticated(false)
      setEntries([]) // Clear entries on error
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (password.trim() === '') {
      setError(t.passwordRequired)
      return
    }
    fetchFeedback(password)
  }

  const filteredEntries = filter === 'all' 
    ? entries 
    : entries.filter(entry => entry.featureUsed === filter)

  const featureNames = {
    feature1: t.feature1Name,
    feature2: t.feature2Name
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <Head>
        <title>{t.adminTitle}</title>
      </Head>

      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">{t.adminHeading}</h1>

        {!isAuthenticated && (
          <form onSubmit={handleSubmit} className="mb-6">
            <div className="flex gap-4">
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setError(null)
                }}
                placeholder={t.adminPasswordPlaceholder}
                className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                required
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? t.authenticating : t.authenticate}
              </button>
            </div>
            {error && !loading && (
              <p className="text-red-400 mt-2">{t.errorLabel} {error}</p>
            )}
          </form>
        )}

        {isAuthenticated && (
          <>
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  filter === 'all'
                    ? 'bg-blue-500 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {t.all}
              </button>
              <button
                onClick={() => setFilter('feature1')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  filter === 'feature1'
                    ? 'bg-blue-500 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {t.feature1Name}
              </button>
              <button
                onClick={() => setFilter('feature2')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  filter === 'feature2'
                    ? 'bg-blue-500 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {t.feature2Name}
              </button>
            </div>

            {loading && <p className="text-slate-400">{t.loading}</p>}
            {error && <p className="text-red-400">{t.errorLabel} {error}</p>}

            {!loading && !error && (
              <div className="space-y-4">
                <p className="text-slate-400">
                  {filteredEntries.length}{t.entriesCount}{filter === 'all' ? t.all : featureNames[filter]}）
                </p>
                {filteredEntries.map((entry, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 backdrop-blur-sm p-6 rounded-2xl"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="inline-block px-3 py-1 bg-blue-500/20 text-blue-300 rounded-lg text-sm font-semibold mb-2">
                          {featureNames[entry.featureUsed] || entry.featureUsed}
                        </span>
                        <p className="text-slate-400 text-sm">
                          {new Date(entry.createdAt).toLocaleString('ja-JP')}
                        </p>
                      </div>
                      <div className="text-xs text-slate-500">
                        {entry.ipHash || 'unknown'} | {(entry.sessionId || 'unknown').substring(0, 8)}...
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <span className="text-slate-400 text-sm">{t.clarityLabel}</span>
                        <p className="text-2xl font-bold text-white">{entry.clarity}</p>
                      </div>
                      <div>
                        <span className="text-slate-400 text-sm">{t.actionabilityLabel}</span>
                        <p className="text-2xl font-bold text-white">{entry.actionability}</p>
                      </div>
                      <div>
                        <span className="text-slate-400 text-sm">{t.trustLabel}</span>
                        <p className="text-2xl font-bold text-white">{entry.trust}</p>
                      </div>
                      <div>
                        <span className="text-slate-400 text-sm">{t.cognitiveLoadLabel}</span>
                        <p className="text-2xl font-bold text-white">{entry.cognitiveLoad}</p>
                      </div>
                    </div>

                    {(entry.confusingPhrases || entry.goodPhrases || entry.rewriteRequest || entry.freeComment) && (
                      <div className="space-y-2 mt-4 pt-4 border-t border-slate-700">
                        {entry.confusingPhrases && (
                          <div>
                            <span className="text-slate-400 text-sm">{t.confusingPhrasesLabel}</span>
                            <p className="text-white">{entry.confusingPhrases}</p>
                          </div>
                        )}
                        {entry.goodPhrases && (
                          <div>
                            <span className="text-slate-400 text-sm">{t.goodPhrasesLabel}</span>
                            <p className="text-white">{entry.goodPhrases}</p>
                          </div>
                        )}
                        {entry.rewriteRequest && (
                          <div>
                            <span className="text-slate-400 text-sm">{t.rewriteRequestLabel}</span>
                            <p className="text-white">{entry.rewriteRequest}</p>
                          </div>
                        )}
                        {entry.freeComment && (
                          <div>
                            <span className="text-slate-400 text-sm">{t.freeCommentLabel}</span>
                            <p className="text-white">{entry.freeComment}</p>
                          </div>
                        )}
                      </div>
                    )}
                    <OutputSnapshotBlock entry={entry} t={t} />
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
