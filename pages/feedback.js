import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import { useLanguage } from '../context/LanguageContext'
import { getTranslations } from '../lib/translations'

export default function Feedback() {
  const router = useRouter()
  const { feature } = router.query
  const { lang } = useLanguage()
  const t = getTranslations(lang)
  
  const [clarity, setClarity] = useState('')
  const [actionability, setActionability] = useState('')
  const [trust, setTrust] = useState('')
  const [cognitiveLoad, setCognitiveLoad] = useState('')
  const [confusingPhrases, setConfusingPhrases] = useState('')
  const [goodPhrases, setGoodPhrases] = useState('')
  const [rewriteRequest, setRewriteRequest] = useState('')
  const [freeComment, setFreeComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [outputSnapshot, setOutputSnapshot] = useState(null)

  // 機能①②の出力結果を sessionStorage から取得
  useEffect(() => {
    if (typeof window === 'undefined' || !feature) return
    try {
      const key = `feedbackContext_${feature}`
      const raw = sessionStorage.getItem(key)
      if (raw) {
        setOutputSnapshot(raw)
      }
    } catch (_) {}
  }, [feature])

  // Determine feature used
  const featureUsed = feature === 'feature1' ? 'feature1' : feature === 'feature2' ? 'feature2' : 'both'
  const featureName = feature === 'feature1' ? t.feature1Name : feature === 'feature2' ? t.feature2Name : t.featureName

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // If feature is 'both', we need to handle it differently
      const featuresToSubmit = featureUsed === 'both' ? ['feature1', 'feature2'] : [featureUsed]

      for (const feat of featuresToSubmit) {
        let response
        try {
          // Create AbortController for timeout
          const controller = new AbortController()
          const timeoutId = setTimeout(() => controller.abort(), 30000) // 30秒タイムアウト

          response = await fetch('/api/feedback', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              featureUsed: feat,
              clarity,
              actionability,
              trust,
              cognitiveLoad,
              confusingPhrases: confusingPhrases || null,
              goodPhrases: goodPhrases || null,
              rewriteRequest: rewriteRequest || null,
              freeComment: freeComment || null,
              outputSnapshot: outputSnapshot || null
            }),
            signal: controller.signal
          })

          clearTimeout(timeoutId)
        } catch (fetchError) {
          console.error('Network error:', fetchError)
          console.error('Error type:', fetchError.name)
          console.error('Error message:', fetchError.message)
          console.error('Full error:', fetchError)
          
          // More specific error messages
          if (fetchError.name === 'AbortError' || fetchError.message === 'The user aborted a request.') {
            throw new Error('リクエストがタイムアウトしました。サーバーが応答していない可能性があります。')
          } else if (fetchError.name === 'TypeError' && (fetchError.message.includes('Failed to fetch') || fetchError.message.includes('NetworkError'))) {
            throw new Error('サーバーに接続できません。開発サーバー（npm run dev）が起動しているか確認してください。')
          } else if (fetchError.name === 'TypeError' && fetchError.message.includes('Network request failed')) {
            throw new Error('ネットワーク接続に失敗しました。インターネット接続を確認してください。')
          } else {
            throw new Error(`接続エラー: ${fetchError.message || '不明なエラーが発生しました'}`)
          }
        }

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          const errorMessage = errorData.error || `フィードバックの送信に失敗しました (ステータス: ${response.status})`
          console.error('Feedback submission error:', {
            status: response.status,
            statusText: response.statusText,
            errorData
          })
          throw new Error(errorMessage)
        }

        // Mark as submitted
        localStorage.setItem(`feedbackSubmitted_${feat}`, '1')
      }

      setSuccess(true)
      setTimeout(() => {
        router.push('/')
      }, 2000)
    } catch (err) {
      const errorMessage = err.message || 'フィードバックの送信に失敗しました。もう一度お試しください。'
      setError(errorMessage)
      console.error('Feedback error:', {
        message: err.message,
        error: err,
        stack: err.stack
      })
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="w-full h-full bg-center bg-cover blur-sm" style={{ backgroundImage: "url(/hero.jpg)" }} />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
          <div className="absolute inset-0 bg-black/30" />
        </div>
        <div className="relative z-10 px-6 py-12 max-w-2xl mx-auto">
          <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 backdrop-blur-sm p-8 rounded-2xl text-center">
            <h1 className="text-2xl font-bold text-white mb-4">{t.thankYou}</h1>
            <p className="text-slate-300">{t.feedbackSent}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Head>
        <title>{t.feedbackPageTitle}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <div className="absolute inset-0">
        <div className="w-full h-full bg-center bg-cover blur-sm" style={{ backgroundImage: "url(/hero.jpg)" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      <div className="relative z-10 px-6 py-12 max-w-2xl mx-auto">
        <Link href="/" className="text-white/90 hover:text-white mb-6 inline-block">← {t.home}</Link>

        <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 backdrop-blur-sm p-8 rounded-2xl">
          <h1 className="text-3xl font-bold text-white mb-2">{t.feedbackTitle}</h1>
          <p className="text-slate-400 mb-6">{featureName}{t.feedbackIntro}</p>
          {outputSnapshot && (
            <p className="text-slate-400 text-sm mb-4 bg-slate-800/50 rounded-lg px-3 py-2">
              {t.outputSavedNote}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Likert Scales */}
            <div className="space-y-4">
              <div>
                <label className="block text-white font-semibold mb-2">
                  {t.clarity} <span className="text-red-400">*</span>
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setClarity(value.toString())}
                      className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
                        clarity === value.toString()
                          ? 'bg-blue-500 text-white'
                          : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {value}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>{t.unclear}</span>
                  <span>{t.veryClear}</span>
                </div>
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">
                  {t.actionability} <span className="text-red-400">*</span>
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setActionability(value.toString())}
                      className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
                        actionability === value.toString()
                          ? 'bg-blue-500 text-white'
                          : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {value}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>{t.notActionable}</span>
                  <span>{t.actionable}</span>
                </div>
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">
                  {t.trust} <span className="text-red-400">*</span>
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setTrust(value.toString())}
                      className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
                        trust === value.toString()
                          ? 'bg-blue-500 text-white'
                          : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {value}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>{t.distrust}</span>
                  <span>{t.veryTrust}</span>
                </div>
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">
                  {t.cognitiveLoad} <span className="text-red-400">*</span>
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setCognitiveLoad(value.toString())}
                      className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
                        cognitiveLoad === value.toString()
                          ? 'bg-blue-500 text-white'
                          : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {value}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>{t.hardToUnderstand}</span>
                  <span>{t.easyToUnderstand}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-white font-medium mb-2">
                  {t.confusingPhrases}
                </label>
                <textarea
                  value={confusingPhrases}
                  onChange={(e) => setConfusingPhrases(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                  placeholder={t.confusingPlaceholder}
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">
                  {t.goodPhrases}
                </label>
                <textarea
                  value={goodPhrases}
                  onChange={(e) => setGoodPhrases(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                  placeholder={t.goodPlaceholder}
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">
                  {t.rewriteRequest}
                </label>
                <textarea
                  value={rewriteRequest}
                  onChange={(e) => setRewriteRequest(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                  placeholder={t.rewritePlaceholder}
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">
                  {t.freeComment}
                </label>
                <textarea
                  value={freeComment}
                  onChange={(e) => {
                    if (e.target.value.length <= 280) {
                      setFreeComment(e.target.value)
                    }
                  }}
                  rows={4}
                  maxLength={280}
                  className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                  placeholder={t.freeCommentPlaceholder}
                />
                <div className="text-right text-xs text-slate-500 mt-1">
                  {freeComment.length}/280
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !clarity || !actionability || !trust || !cognitiveLoad}
              className="w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? t.submitting : t.submit}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
