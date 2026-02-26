import { useState } from 'react'
import { useLanguage } from '../../context/LanguageContext'

function RatingRow({
  label,
  sublabel,
  value,
  onChange,
  activeColor,
}) {
  const [hover, setHover] = useState(0)

  return (
    <div className="flex items-center justify-between gap-2 sm:gap-3">
      <div className="min-w-0">
        <p className="text-[11px] sm:text-xs font-semibold text-white leading-tight">{label}</p>
        <p className="text-[9px] sm:text-[10px] text-[#6b7280] leading-tight">{sublabel}</p>
      </div>
      <div className="flex items-center gap-0 sm:gap-0.5 flex-shrink-0">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            className="p-0.5 transition-transform active:scale-110"
          >
            <svg
              className={`w-5 h-5 sm:w-5 sm:h-5 transition-colors ${
                n <= (hover || value) ? activeColor : 'text-[#1e1e35]'
              }`}
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </button>
        ))}
      </div>
    </div>
  )
}

export default function FeedbackPanel({ messageIndex, onSubmit }) {
  const { lang } = useLanguage()
  const isEn = lang === 'en'
  const [cognitiveFit, setCognitiveFit] = useState(0)
  const [embodiedFit, setEmbodiedFit] = useState(0)

  const ready = cognitiveFit > 0 && embodiedFit > 0

  const handleSubmit = () => {
    if (!ready) return
    onSubmit({ messageIndex, cognitiveFit, embodiedFit })
  }

  return (
    <div className="bg-[#0b0b14] border border-[#1e1e35] rounded-xl p-3 sm:p-3.5 space-y-2.5 sm:space-y-3 animate-fade-in">
      <p className="text-[10px] sm:text-[11px] text-[#6b7280] font-medium">{isEn ? 'Rate this advice:' : 'このアドバイスを評価:'}</p>
      <RatingRow
        label={isEn ? 'Cognitive Fit' : '認知的適合性'}
        sublabel={isEn ? 'How well does this match your understanding?' : '理解とどの程度一致していますか？'}
        value={cognitiveFit}
        onChange={setCognitiveFit}
        activeColor="text-amber-400"
      />
      <RatingRow
        label={isEn ? 'Embodied Fit' : '身体的適合性'}
        sublabel={isEn ? 'How actionable is this for your body?' : '身体にとってどの程度実行可能ですか？'}
        value={embodiedFit}
        onChange={setEmbodiedFit}
        activeColor="text-violet-400"
      />
      <button
        onClick={handleSubmit}
        disabled={!ready}
        className="w-full py-1.5 sm:py-2 rounded-lg bg-[#6366f1] text-white text-[11px] sm:text-xs font-semibold hover:bg-[#818cf8] active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        {isEn ? 'Submit' : '送信'}
      </button>
    </div>
  )
}
