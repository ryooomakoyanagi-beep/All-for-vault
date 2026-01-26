import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'

export default function AdminFeedback() {
  const router = useRouter()
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(false) // Changed to false - only show loading when actually fetching
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('all') // all, feature1, feature2
  const [password, setPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false) // Track if user has successfully authenticated

  useEffect(() => {
    // Check if password is provided in URL
    const urlPassword = router.query.password
    if (urlPassword && !isAuthenticated) {
      setPassword(urlPassword)
      fetchFeedback(urlPassword)
    }
  }, [router.query])

  const fetchFeedback = async (pwd) => {
    if (!pwd || pwd.trim() === '') {
      setError('パスワードを入力してください')
      return
    }
    
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/feedback', {
        headers: {
          'X-Admin-Password': pwd
        }
      })

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('認証に失敗しました。パスワードを確認してください。')
        }
        throw new Error('フィードバックの取得に失敗しました')
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
      setError('パスワードを入力してください')
      return
    }
    fetchFeedback(password)
  }

  const filteredEntries = filter === 'all' 
    ? entries 
    : entries.filter(entry => entry.featureUsed === filter)

  const featureNames = {
    feature1: '助走・ポール分析',
    feature2: '技術アドバイス'
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <Head>
        <title>フィードバック管理 - All for Vault</title>
      </Head>

      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">フィードバック管理</h1>

        {!isAuthenticated && (
          <form onSubmit={handleSubmit} className="mb-6">
            <div className="flex gap-4">
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setError(null) // Clear error when user types
                }}
                placeholder="管理者パスワード"
                className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                required
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '認証中...' : '認証'}
              </button>
            </div>
            {error && !loading && (
              <p className="text-red-400 mt-2">エラー: {error}</p>
            )}
          </form>
        )}

        {isAuthenticated && (
          <>
            {/* Filter Tabs */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  filter === 'all'
                    ? 'bg-blue-500 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                すべて
              </button>
              <button
                onClick={() => setFilter('feature1')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  filter === 'feature1'
                    ? 'bg-blue-500 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                助走・ポール分析
              </button>
              <button
                onClick={() => setFilter('feature2')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  filter === 'feature2'
                    ? 'bg-blue-500 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                技術アドバイス
              </button>
            </div>

            {loading && <p className="text-slate-400">読み込み中...</p>}
            {error && <p className="text-red-400">エラー: {error}</p>}

            {!loading && !error && (
              <div className="space-y-4">
                <p className="text-slate-400">
                  {filteredEntries.length}件のフィードバック（{filter === 'all' ? 'すべて' : featureNames[filter]}）
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
                        {entry.ipHash} | {entry.sessionId.substring(0, 8)}...
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <span className="text-slate-400 text-sm">明確さ</span>
                        <p className="text-2xl font-bold text-white">{entry.clarity}</p>
                      </div>
                      <div>
                        <span className="text-slate-400 text-sm">実行可能性</span>
                        <p className="text-2xl font-bold text-white">{entry.actionability}</p>
                      </div>
                      <div>
                        <span className="text-slate-400 text-sm">信頼性</span>
                        <p className="text-2xl font-bold text-white">{entry.trust}</p>
                      </div>
                      <div>
                        <span className="text-slate-400 text-sm">認知負荷</span>
                        <p className="text-2xl font-bold text-white">{entry.cognitiveLoad}</p>
                      </div>
                    </div>

                    {(entry.confusingPhrases || entry.goodPhrases || entry.rewriteRequest || entry.freeComment) && (
                      <div className="space-y-2 mt-4 pt-4 border-t border-slate-700">
                        {entry.confusingPhrases && (
                          <div>
                            <span className="text-slate-400 text-sm">分かりにくい表現:</span>
                            <p className="text-white">{entry.confusingPhrases}</p>
                          </div>
                        )}
                        {entry.goodPhrases && (
                          <div>
                            <span className="text-slate-400 text-sm">良い表現:</span>
                            <p className="text-white">{entry.goodPhrases}</p>
                          </div>
                        )}
                        {entry.rewriteRequest && (
                          <div>
                            <span className="text-slate-400 text-sm">書き直しリクエスト:</span>
                            <p className="text-white">{entry.rewriteRequest}</p>
                          </div>
                        )}
                        {entry.freeComment && (
                          <div>
                            <span className="text-slate-400 text-sm">自由コメント:</span>
                            <p className="text-white">{entry.freeComment}</p>
                          </div>
                        )}
                      </div>
                    )}
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
