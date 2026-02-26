import { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import {
  getSkillLevel,
  getSuggestedPrompts,
  buildAutoAdvicePrompt,
} from '../../lib/act-knowledge-base'
import { useLanguage } from '../../context/LanguageContext'

export default function AdviceView({ phase, bestRecord, onBack }) {
  const { lang } = useLanguage()
  const isEn = lang === 'en'

  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [input, setInput] = useState('')
  const [showFeedbackPrompt, setShowFeedbackPrompt] = useState(false)
  const [feedbackDismissed, setFeedbackDismissed] = useState(false)
  const lastMessageRef = useRef(null)
  const messagesEndRef = useRef(null)
  const textareaRef = useRef(null)
  const hasFetchedRef = useRef(false)
  const prevMessageCountRef = useRef(0)

  const skillLevel = getSkillLevel(bestRecord)
  const suggestedPrompts = getSuggestedPrompts(
    phase.phaseIds[0],
    skillLevel.level
  )

  useEffect(() => {
    const newCount = messages.length
    const prevCount = prevMessageCountRef.current
    prevMessageCountRef.current = newCount

    if (newCount === 0) return

    const lastMsg = messages[newCount - 1]

    if (lastMsg.role === 'assistant' && newCount > prevCount) {
      requestAnimationFrame(() => {
        lastMessageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    } else if (lastMsg.role === 'user') {
      requestAnimationFrame(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
      })
    }
  }, [messages])

  useEffect(() => {
    if (isLoading && messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [isLoading, messages.length])

  const fetchAutoAdvice = useCallback(async () => {
    if (hasFetchedRef.current) return
    hasFetchedRef.current = true
    setIsLoading(true)

    try {
      const phaseLabel = isEn ? phase.labelEn : phase.label
      const autoPrompt = buildAutoAdvicePrompt(phaseLabel, phase.phaseIds, lang)

      const systemMessage = { role: 'user', content: autoPrompt }

      const response = await fetch('/api/act-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [systemMessage],
          selectedPhaseIds: phase.phaseIds,
          bestRecord,
          locale: lang,
        }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error)

      const assistantMsg = { role: 'assistant', content: data.message }
      setMessages([assistantMsg])
      setShowFeedbackPrompt(true)
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : (isEn ? 'An error occurred' : 'エラーが発生しました')
      setMessages([{ role: 'assistant', content: `⚠ ${errMsg}\n\n${isEn ? 'Please check your API key configuration.' : 'APIキーの設定を確認してください。'}` }])
    } finally {
      setIsLoading(false)
    }
  }, [phase, bestRecord, lang, isEn])

  useEffect(() => { fetchAutoAdvice() }, [fetchAutoAdvice])

  const sendMessage = useCallback(async (content) => {
    const userMsg = { role: 'user', content }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setIsLoading(true)
    setInput('')

    try {
      const response = await fetch('/api/act-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          selectedPhaseIds: phase.phaseIds,
          bestRecord,
          locale: lang,
        }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error)

      const assistantMsg = { role: 'assistant', content: data.message }
      const updated = [...newMessages, assistantMsg]
      setMessages(updated)
      setShowFeedbackPrompt(true)
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : (isEn ? 'An error occurred' : 'エラーが発生しました')
      setMessages([...newMessages, { role: 'assistant', content: `⚠ ${errMsg}` }])
    } finally {
      setIsLoading(false)
    }
  }, [messages, phase.phaseIds, bestRecord, lang, isEn])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (input.trim() && !isLoading) sendMessage(input.trim())
    }
  }

  const autoResize = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
    }
  }

  useEffect(() => {
    if (messages.length === 0) return
    const lastMsg = messages[messages.length - 1]
    if (lastMsg.role !== 'assistant') return

    let latestUserQuestion = null
    for (let i = messages.length - 2; i >= 0; i -= 1) {
      if (messages[i].role === 'user') {
        latestUserQuestion = messages[i].content
        break
      }
    }

    const phaseName = isEn ? phase.labelEn : phase.label
    const fallbackQuestion = isEn
      ? `Auto advice for phase: ${phaseName}`
      : `選択フェーズの自動アドバイス: ${phaseName}`

    try {
      sessionStorage.setItem('feedbackContext_feature2', JSON.stringify({
        source: 'act',
        phase: phaseName,
        question: latestUserQuestion || fallbackQuestion,
        advice: lastMsg.content,
        userQuestion: latestUserQuestion || fallbackQuestion,
        aiAnswer: lastMsg.content,
      }))
    } catch (_) {}
  }, [messages, isEn, phase.label, phase.labelEn])

  const showPromptButtons = messages.length > 0 && !isLoading

  const phaseLabel = isEn ? phase.labelEn : phase.label
  const phaseDesc = isEn ? phase.shortDescEn : phase.shortDesc
  const skillLabel = isEn ? skillLevel.labelEn : skillLevel.label

  return (
    <div className="flex flex-col h-full animate-slide-right">
      {/* Header bar */}
      <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-5 py-2.5 sm:py-4 border-b border-[#1e1e35] bg-[#0f0f1a]/60 backdrop-blur-md">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-[#6b7280] hover:text-white active:scale-95 transition-all text-xs sm:text-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="hidden sm:inline">{isEn ? 'Back to Phases' : 'フェーズに戻る'}</span>
        </button>
        <div className="w-px h-4 sm:h-5 bg-[#1e1e35]" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#6366f1] animate-pulse" />
            <h2 className="text-xs sm:text-sm font-bold text-white truncate">{phaseLabel}</h2>
          </div>
          <p className="text-[9px] sm:text-[11px] text-[#6b7280] mt-0.5 truncate">{phaseDesc}</p>
        </div>
        <div className={`text-[9px] sm:text-[11px] font-semibold px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full whitespace-nowrap ${
          skillLevel.level === 'beginner'
            ? 'text-emerald-400 bg-emerald-400/10'
            : skillLevel.level === 'intermediate'
              ? 'text-amber-400 bg-amber-400/10'
              : 'text-violet-400 bg-violet-400/10'
        }`}>
          {skillLabel} ({Math.floor(bestRecord / 100)}m{Math.floor((bestRecord % 100) / 10)}0)
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-5 py-3 sm:py-5 space-y-3 sm:space-y-4">
        {/* Loading shimmer */}
        {messages.length === 0 && isLoading && (
          <div className="animate-fade-in space-y-3">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-[#6366f1]/15 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-[#6366f1]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-[10px] sm:text-xs text-[#6b7280]">{isEn ? 'Generating...' : 'アドバイスを生成中...'}</span>
            </div>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-3 sm:h-4 rounded bg-[#1e1e35]/40 shimmer-bg" style={{ width: `${90 - i * 12}%` }} />
            ))}
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} ref={i === messages.length - 1 ? lastMessageRef : undefined}>
            {msg.role === 'user' ? (
              <div className="flex justify-end animate-fade-in-up">
                <div className="max-w-[85%] sm:max-w-[80%] bg-[#6366f1] text-white rounded-2xl rounded-br-md px-3 sm:px-4 py-2.5 sm:py-3 text-[13px] sm:text-sm leading-relaxed">
                  {msg.content}
                </div>
              </div>
            ) : (
              <div className="animate-fade-in-up">
                {i === 0 && (
                  <div className="flex items-center gap-2 mb-2 sm:mb-3">
                    <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-gradient-to-br from-[#6366f1] to-violet-600 flex items-center justify-center">
                      <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <span className="text-[10px] sm:text-xs font-semibold text-[#fb923c]">{isEn ? 'AI Advice' : 'AIアドバイス'}</span>
                  </div>
                )}
                <div className="bg-[#0f0f1a] border border-[#1e1e35] rounded-2xl rounded-bl-md px-3 sm:px-5 py-3 sm:py-4 text-[13px] sm:text-sm leading-relaxed whitespace-pre-wrap text-[#e8e8ed]">
                  {msg.content}
                </div>

                {showFeedbackPrompt && !feedbackDismissed && i === messages.length - 1 && msg.role === 'assistant' && (
                  <div className="mt-3 bg-[#0b0b14] border border-[#1e1e35] rounded-xl p-3 sm:p-4 animate-fade-in">
                    <p className="text-[11px] sm:text-xs text-[#9ca3af] mb-2.5">
                      {isEn ? 'Was this helpful? Please give 30-second feedback.' : 'お役に立ちましたか？30秒でフィードバックをお願いします。'}
                    </p>
                    <div className="flex gap-2">
                      <Link
                        href="/feedback?feature=feature2"
                        className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-orange-500 text-white text-[11px] sm:text-xs font-semibold hover:bg-orange-600 active:scale-95 transition-all"
                      >
                        {isEn ? 'Give Feedback' : 'フィードバックする'}
                      </Link>
                      <button
                        onClick={() => setFeedbackDismissed(true)}
                        className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-[#1e1e35] text-[#9ca3af] text-[11px] sm:text-xs font-semibold hover:bg-[#2a2a45] active:scale-95 transition-all"
                      >
                        {isEn ? 'Later' : 'あとで'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {/* Loading dots */}
        {messages.length > 0 && isLoading && (
          <div className="flex justify-start animate-fade-in">
            <div className="bg-[#0f0f1a] border border-[#1e1e35] rounded-2xl rounded-bl-md px-3 sm:px-4 py-2 sm:py-3">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#6366f1] animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#6366f1] animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#6366f1] animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Intelligent Prompter */}
      {showPromptButtons && (
        <div className="px-3 sm:px-5 pb-1.5 sm:pb-2">
          <div className="flex items-center gap-1.5 mb-1.5">
            <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#6b7280]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-[10px] sm:text-[11px] text-[#6b7280] font-medium">{isEn ? 'Ask more:' : 'もっと聞く:'}</span>
          </div>
          <div className="flex gap-1.5 sm:gap-2 overflow-x-auto pb-1">
            {suggestedPrompts.map((sp) => (
              <button
                key={sp.label}
                onClick={() => sendMessage(sp.prompt)}
                disabled={isLoading}
                className="
                  flex-shrink-0 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-medium
                  bg-[#0f0f1a] border border-[#1e1e35] text-[#9ca3af]
                  hover:border-[#6366f1]/40 hover:text-[#818cf8] hover:bg-[#6366f1]/5
                  active:scale-95
                  disabled:opacity-40 transition-all duration-200
                "
              >
                {isEn ? sp.labelEn : sp.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input area */}
      <div className="border-t border-[#1e1e35] px-3 sm:px-5 py-2 sm:py-3 bg-[#0f0f1a]/40 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        <div className="flex items-end gap-2 sm:gap-3">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => { setInput(e.target.value); autoResize(); }}
            onKeyDown={handleKeyDown}
            placeholder={isEn ? 'Ask a question about this phase...' : 'このフェーズについて質問してください...'}
            disabled={isLoading}
            rows={1}
            className="flex-1 resize-none rounded-xl bg-[#0b0b14] border border-[#1e1e35] px-3 sm:px-4 py-2 sm:py-2.5 text-[13px] sm:text-sm text-white placeholder-[#6b7280] focus:outline-none focus:border-[#6366f1]/50 focus:ring-1 focus:ring-[#6366f1]/30 transition-all disabled:opacity-50"
          />
          <button
            onClick={() => { if (input.trim() && !isLoading) sendMessage(input.trim()); }}
            disabled={isLoading || !input.trim()}
            className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#6366f1] text-white flex items-center justify-center hover:bg-[#818cf8] active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
