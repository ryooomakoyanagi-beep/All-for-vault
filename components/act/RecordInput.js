import { getSkillLevel } from '../../lib/act-knowledge-base'
import { useLanguage } from '../../context/LanguageContext'

export default function RecordInput({ bestRecord, onRecordChange }) {
  const { lang } = useLanguage()
  const skillLevel = getSkillLevel(bestRecord)
  const isEn = lang === 'en'

  const meters = Math.floor(bestRecord / 100)
  const tens = Math.floor((bestRecord % 100) / 10)

  const handleMetersChange = (val) => {
    const m = Math.max(0, Math.min(7, Number(val) || 0))
    onRecordChange(m * 100 + tens * 10)
  }

  const handleTensChange = (val) => {
    const t = Math.max(0, Math.min(9, Number(val) || 0))
    onRecordChange(meters * 100 + t * 10)
  }

  const colors = {
    beginner: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    intermediate: "text-amber-400 bg-amber-400/10 border-amber-400/20",
    advanced: "text-violet-400 bg-violet-400/10 border-violet-400/20",
  }

  return (
    <div className="flex items-center gap-1.5 sm:gap-3">
      <div className="flex items-center gap-0.5 sm:gap-1">
        <input
          type="number"
          min={0}
          max={7}
          value={meters}
          onChange={(e) => handleMetersChange(e.target.value)}
          className="w-9 sm:w-12 px-1 py-1 sm:py-1.5 rounded-md sm:rounded-lg bg-[#0b0b14] border border-[#1e1e35] text-white text-center text-xs sm:text-sm font-bold focus:outline-none focus:border-[#6366f1]/50 transition-all"
        />
        <span className="text-[10px] sm:text-xs text-[#6b7280] font-medium">m</span>
        <input
          type="number"
          min={0}
          max={9}
          step={1}
          value={tens}
          onChange={(e) => handleTensChange(e.target.value)}
          className="w-9 sm:w-12 px-1 py-1 sm:py-1.5 rounded-md sm:rounded-lg bg-[#0b0b14] border border-[#1e1e35] text-white text-center text-xs sm:text-sm font-bold focus:outline-none focus:border-[#6366f1]/50 transition-all"
        />
        <span className="text-[10px] sm:text-xs text-[#6b7280] font-medium">0cm</span>
      </div>
      <span className={`text-[9px] sm:text-[11px] font-semibold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full border whitespace-nowrap ${colors[skillLevel.level]}`}>
        {isEn ? skillLevel.labelEn : skillLevel.label}
      </span>
    </div>
  )
}
