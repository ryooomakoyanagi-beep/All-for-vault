import { useLanguage } from '../../context/LanguageContext'

export default function PhaseCard({ group, onSelectPhase }) {
  const { lang } = useLanguage()
  const isEn = lang === 'en'

  return (
    <div className="group relative flex flex-col rounded-xl sm:rounded-2xl border border-[#1e1e35] bg-[#0f0f1a] overflow-hidden transition-all duration-300 hover:border-[#6366f1]/40 hover:shadow-xl hover:shadow-[rgba(99,102,241,0.12)]">
      {/* Image */}
      <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] overflow-hidden bg-[#0a0a16]">
        <img
          src={group.image}
          alt={isEn ? group.titleEn : group.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f1a] via-[#0f0f1a]/40 to-transparent" />
        <div className="absolute bottom-2 sm:bottom-3 left-2.5 sm:left-4 right-2.5 sm:right-4">
          <p className="text-[8px] sm:text-[10px] font-semibold text-[#818cf8] tracking-[0.12em] sm:tracking-[0.15em] uppercase">
            {group.titleEn}
          </p>
          <h3 className="text-[11px] sm:text-sm font-bold text-white mt-0.5 tracking-wide">
            {isEn ? group.titleEn : group.title}
          </h3>
        </div>
      </div>

      {/* Phase buttons */}
      <div className="flex flex-col gap-1 sm:gap-1.5 p-2 sm:p-3">
        {group.phases.map((phase) => (
          <button
            key={phase.label}
            onClick={() => onSelectPhase(phase)}
            className="
              w-full flex items-start gap-2 sm:gap-3 px-2 sm:px-3 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-left
              bg-[#0b0b14] border border-transparent
              hover:bg-[#16162a] hover:border-[#6366f1]/30
              active:scale-[0.98]
              transition-all duration-200 group/btn
            "
          >
            <div className="mt-1 w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-[#6366f1] flex-shrink-0 opacity-60" />
            <div className="flex-1 min-w-0">
              <p className="text-[11px] sm:text-[13px] font-semibold text-[#9ca3af] group-hover/btn:text-white transition-colors leading-tight">
                {isEn ? phase.labelEn : phase.label}
              </p>
              <p className="text-[9px] sm:text-[11px] text-[#6b7280] mt-0.5 leading-tight">
                {isEn ? phase.shortDescEn : phase.shortDesc}
              </p>
            </div>
            <svg
              className="w-3 h-3 sm:w-4 sm:h-4 text-[#6b7280] flex-shrink-0 mt-0.5 opacity-40 sm:opacity-0 sm:group-hover/btn:opacity-100"
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        ))}
      </div>
    </div>
  )
}
