import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useLanguage } from '../context/LanguageContext'
import { getTranslations } from '../lib/translations'

export default function Advice() {
  const router = useRouter()
  const { lang } = useLanguage()
  const t = getTranslations(lang)
  const [input, setInput] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showFeedbackPrompt, setShowFeedbackPrompt] = useState(false)

  // Show feedback prompt whenever a new advice result is generated
  useEffect(() => {
    if (result) {
      setShowFeedbackPrompt(true)
    }
  }, [result])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch('/api/advice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: input }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'アドバイスの取得に失敗しました')
      }

      const data = await response.json()
      setResult(data)
      try {
        const userQuestion = data.question || input
        const aiAnswer = data.advice || data.message
        sessionStorage.setItem('feedbackContext_feature2', JSON.stringify({
          source: 'advice',
          question: userQuestion,
          advice: aiAnswer,
          userQuestion,
          aiAnswer,
        }))
      } catch (_) {}
    } catch (err) {
      setError(err.message)
      console.error('Advice error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="advice-page relative min-h-screen overflow-hidden">
      <Head>
        <title>{t.adviceTitle} - All for Vault</title>
        <meta name="description" content={lang === 'en' ? 'AI technique advice' : 'AI技術アドバイスページ'} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      {/* Background */}
      <div className="absolute inset-0">
        <div
          className="w-full h-full bg-center bg-cover blur-sm"
          style={{ backgroundImage: "url(/picture2.jpg)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      <main className="advice-container relative z-10">
        <Link href="/" className="back-link">← {t.home}</Link>
        
        <h1 className="advice-title">{t.adviceTitle}</h1>
        <p className="advice-subtitle">{t.adviceSubtitle}</p>

        <form onSubmit={handleSubmit} className="advice-form">
          <div className="form-group">
            <label htmlFor="input">{t.adviceLabel}</label>
            <textarea
              id="input"
              name="input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={8}
              placeholder={t.advicePlaceholder}
              required
              className="advice-textarea"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading || !input.trim()} 
            className="submit-button"
          >
            {loading ? t.adviceLoading : t.adviceSubmit}
          </button>
        </form>

        {loading && (
          <div className="loading-message">
            <p>{t.adviceLoading}</p>
          </div>
        )}

        {error && (
          <div className="error-message">
            <p>{t.errorPrefix} {error}</p>
          </div>
        )}

        {result && (
          <div className="advice-result">
            <h2 className="result-title">{t.adviceResultTitle}</h2>
            <div className="result-content" style={{ whiteSpace: 'pre-wrap' }}>
              {result.advice || result.message || (lang === 'en' ? 'Could not get advice.' : 'アドバイスを取得できませんでした')}
            </div>
            {result.question && (
              <div className="result-question">
                <p className="question-label">{t.adviceQuestionLabel}</p>
                <p className="question-text">{result.question}</p>
              </div>
            )}
          </div>
        )}

        {showFeedbackPrompt && (
          <div className="mt-6 bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 backdrop-blur-sm p-6 rounded-2xl">
            <p className="text-white font-semibold mb-4">{t.feedbackPrompt}</p>
            <div className="flex gap-4">
              <Link
                href="/feedback?feature=feature2"
                className="px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all"
              >
                {t.feedbackCta}
              </Link>
              <button
                onClick={() => {
                  setShowFeedbackPrompt(false)
                }}
                className="px-6 py-2 bg-slate-700/50 text-slate-300 font-semibold rounded-lg hover:bg-slate-700 transition-all"
              >
                {t.feedbackLater}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
