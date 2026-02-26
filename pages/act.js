import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { PHASE_GROUPS } from '../lib/act-knowledge-base'
import { useLanguage } from '../context/LanguageContext'
import PhaseCard from '../components/act/PhaseCard'
import RecordInput from '../components/act/RecordInput'
import AdviceView from '../components/act/AdviceView'

export default function ACT() {
  const { lang } = useLanguage()
  const isEn = lang === 'en'
  const [bestRecord, setBestRecord] = useState(300)
  const [selectedPhase, setSelectedPhase] = useState(null)

  if (selectedPhase) {
    return (
      <div className="h-[100dvh] flex flex-col" style={{ background: '#06060c' }}>
        <Head>
          <title>{isEn ? 'Technique Advice' : '技術アドバイス'} - {isEn ? selectedPhase.labelEn : selectedPhase.label}</title>
        </Head>
        <AdviceView
          key={`${selectedPhase.label}-${bestRecord}`}
          phase={selectedPhase}
          bestRecord={bestRecord}
          onBack={() => setSelectedPhase(null)}
        />
      </div>
    )
  }

  return (
    <div className="min-h-[100dvh] flex flex-col" style={{ background: '#06060c', color: '#e8e8ed', fontFamily: "'Inter', 'Noto Sans JP', system-ui, sans-serif" }}>
      <Head>
        <title>{isEn ? 'Technique Advice' : '技術アドバイス'} | All for Vault</title>
        <meta name="description" content={isEn ? 'Phase-specific AI coaching optimized by cognitive linguistics' : '認知言語学に基づく局面別AIコーチング'} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      {/* Header */}
      <header className="border-b sticky top-0 z-50 backdrop-blur-md" style={{ borderColor: '#1e1e35', background: 'rgba(15,15,26,0.6)' }}>
        <div className="max-w-6xl mx-auto px-3 sm:px-5 py-3 sm:py-5 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Link href="/" className="flex items-center gap-1 text-sm mr-2" style={{ color: '#6b7280' }}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shadow-lg overflow-hidden" style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}>
                <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: "url(/picture2.jpg)" }} />
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  {isEn ? 'Technique Advice' : '技術アドバイス'}
                </h1>
                <p className="text-xs mt-0.5 hidden sm:block" style={{ color: '#6b7280' }}>
                  {isEn ? 'Phase-specific AI coaching powered by cognitive linguistics' : '認知言語学に基づく局面別AIコーチング'}
                </p>
              </div>
            </div>
            <RecordInput bestRecord={bestRecord} onRecordChange={setBestRecord} />
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-3 sm:px-5 py-4 sm:py-8">
          {/* How it works */}
          <div className="flex gap-3 overflow-x-auto pb-3 mb-5 sm:mb-8 sm:grid sm:grid-cols-3 sm:gap-4 sm:overflow-visible sm:pb-0">
            {[
              {
                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />,
                title: isEn ? '1. Select Phase' : '1. 局面を選ぶ',
                desc: isEn ? 'Choose from 9 pole vault phases to improve' : '9局面から改善したいフェーズを選択',
              },
              {
                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />,
                title: isEn ? '2. AI Analyzes' : '2. AIが即座に分析',
                desc: isEn ? 'Auto-generates advice with cognitive framing' : '認知フレームでアドバイスを自動生成',
              },
              {
                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />,
                title: isEn ? '3. Deep Dialogue' : '3. 深く対話する',
                desc: isEn ? 'Deepen understanding via guided questions or free text' : '誘導質問やフリーテキストで理解を深める',
              },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-2.5 px-3 py-2.5 rounded-xl border min-w-[200px] sm:min-w-0" style={{ background: 'rgba(15,15,26,0.5)', borderColor: 'rgba(30,30,53,0.5)' }}>
                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(249,115,22,0.1)' }}>
                  <svg className="w-3.5 h-3.5" style={{ color: '#fb923c' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {item.icon}
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white">{item.title}</p>
                  <p className="text-xs mt-0.5 leading-relaxed" style={{ color: '#6b7280' }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Section title */}
          <div className="flex items-center gap-2 mb-4 sm:mb-6">
            <div className="w-1 h-5 sm:h-6 rounded-full" style={{ background: '#f97316' }} />
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white">
                {isEn ? 'Select a Phase' : '局面を選んでください'}
              </h2>
              <p className="text-xs mt-0.5" style={{ color: '#6b7280' }}>
                {isEn ? 'Choose a phase and AI will start advising' : 'フェーズを選択するとAIがアドバイスを開始します'}
              </p>
            </div>
          </div>

          {/* Phase cards grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
            {PHASE_GROUPS.map((group) => (
              <PhaseCard
                key={group.id}
                group={group}
                onSelectPhase={(phase) => setSelectedPhase(phase)}
              />
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-2 sm:py-3" style={{ borderColor: '#1e1e35', background: 'rgba(15,15,26,0.3)' }}>
        <p className="text-center text-xs" style={{ color: '#6b7280' }}>
          {isEn ? 'Technique Advice | Cognitive Linguistics × Boutaka Channel' : '技術アドバイス | 認知言語学 × ボウタカチャンネル'}
        </p>
      </footer>
    </div>
  )
}
