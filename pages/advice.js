import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'

export default function Advice() {
  const router = useRouter()
  const [input, setInput] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showFeedbackPrompt, setShowFeedbackPrompt] = useState(false)

  // Check if feedback should be shown
  useEffect(() => {
    if (result && !localStorage.getItem('feedbackSubmitted_feature2') && !localStorage.getItem('feedbackDismissed_feature2')) {
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
        <title>Technique Advice - All for Vault</title>
        <meta name="description" content="AI技術アドバイスページ" />
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
        <Link href="/" className="back-link">← ホームに戻る</Link>
        
        <h1 className="advice-title">Technique Advice</h1>
        <p className="advice-subtitle">現在の技術的な問題やパフォーマンスの懸念について説明してください</p>

        <form onSubmit={handleSubmit} className="advice-form">
          <div className="form-group">
            <label htmlFor="input">技術的な問題や懸念事項を入力してください</label>
            <textarea
              id="input"
              name="input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={8}
              placeholder="例：スイングのコツを教えて。空中で体が離れてしまいます。真上に行くにはどうしたらいいですか？助走の効果的な練習方法絵お教えて。"
              required
              className="advice-textarea"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading || !input.trim()} 
            className="submit-button"
          >
            {loading ? 'アドバイス生成中…' : 'アドバイスを受ける'}
          </button>
        </form>

        {loading && (
          <div className="loading-message">
            <p>アドバイス生成中…</p>
          </div>
        )}

        {error && (
          <div className="error-message">
            <p>エラー: {error}</p>
          </div>
        )}

        {result && (
          <div className="advice-result">
            <h2 className="result-title">AIからのアドバイス</h2>
            <div className="result-content" style={{ whiteSpace: 'pre-wrap' }}>
              {result.advice || result.message || 'アドバイスを取得できませんでした'}
            </div>
            {result.question && (
              <div className="result-question">
                <p className="question-label">ご質問:</p>
                <p className="question-text">{result.question}</p>
              </div>
            )}
          </div>
        )}

        {/* Feedback Prompt */}
        {showFeedbackPrompt && (
          <div className="mt-6 bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 backdrop-blur-sm p-6 rounded-2xl">
            <p className="text-white font-semibold mb-4">アドバイスは完了しました。30秒でフィードバックお願いします</p>
            <div className="flex gap-4">
              <Link
                href="/feedback?feature=feature2"
                className="px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all"
              >
                フィードバックする
              </Link>
              <button
                onClick={() => {
                  localStorage.setItem('feedbackDismissed_feature2', '1')
                  setShowFeedbackPrompt(false)
                }}
                className="px-6 py-2 bg-slate-700/50 text-slate-300 font-semibold rounded-lg hover:bg-slate-700 transition-all"
              >
                あとで
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
