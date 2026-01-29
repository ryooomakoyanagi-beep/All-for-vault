import { createContext, useContext, useState, useEffect } from 'react'

const STORAGE_KEY = 'allforvault_lang'

const LanguageContext = createContext({ lang: 'ja', setLang: () => {} })

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState('ja')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    try {
      const saved = typeof window !== 'undefined' && localStorage.getItem(STORAGE_KEY)
      if (saved === 'en' || saved === 'ja') setLangState(saved)
    } catch (_) {}
  }, [])

  const setLang = (next) => {
    setLangState(next)
    try {
      if (typeof window !== 'undefined') localStorage.setItem(STORAGE_KEY, next)
    } catch (_) {}
  }

  return (
    <LanguageContext.Provider value={{ lang: mounted ? lang : 'ja', setLang }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  return ctx || { lang: 'ja', setLang: () => {} }
}

export function LanguageSwitcher() {
  const { lang, setLang } = useLanguage()
  return (
    <div className="fixed top-4 right-4 z-50 flex gap-2">
      <button
        type="button"
        onClick={() => setLang('ja')}
        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
          lang === 'ja'
            ? 'bg-white/20 text-white'
            : 'bg-slate-800/60 text-slate-400 hover:text-white'
        }`}
      >
        日本語
      </button>
      <button
        type="button"
        onClick={() => setLang('en')}
        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
          lang === 'en'
            ? 'bg-white/20 text-white'
            : 'bg-slate-800/60 text-slate-400 hover:text-white'
        }`}
      >
        EN
      </button>
    </div>
  )
}
