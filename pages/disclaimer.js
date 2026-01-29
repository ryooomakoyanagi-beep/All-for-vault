import Head from 'next/head'
import Link from 'next/link'
import { useLanguage } from '../context/LanguageContext'
import { getTranslations } from '../lib/translations'

export default function Disclaimer() {
  const { lang } = useLanguage()
  const t = getTranslations(lang)
  return (
    <>
      <Head>
        <title>{t.disclaimerTitle}</title>
        <meta name="description" content={lang === 'en' ? 'Terms, disclaimer, privacy' : '利用規約・免責事項・プライバシー'} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <div className="min-h-screen relative overflow-hidden">
        <div className="absolute inset-0">
          <div
            className="w-full h-full bg-center bg-cover blur-sm"
            style={{ backgroundImage: "url(/hero.jpg)" }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
          <div className="absolute inset-0 bg-black/30" />
        </div>

        <div className="relative z-10 px-6 py-12 max-w-md mx-auto">
          <Link href="/" className="text-white/90 hover:text-white mb-6 inline-block">
            ← {t.home}
          </Link>

          <h1 className="text-4xl font-black tracking-tight mb-8 text-white">
            {t.disclaimerHeading}
          </h1>

          <div className="space-y-5">
            <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 backdrop-blur-sm p-6 rounded-2xl">
              <h2 className="text-xl font-bold text-white mb-3">{t.sectionA}</h2>
              <ul className="space-y-2 text-slate-300 text-sm leading-relaxed">
                <li>• {t.purpose1}</li>
                <li>• {t.purpose2}</li>
                <li>• {t.purpose3}</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 backdrop-blur-sm p-6 rounded-2xl">
              <h2 className="text-xl font-bold text-white mb-3">{t.sectionB}</h2>
              <ul className="space-y-2 text-slate-300 text-sm leading-relaxed">
                <li>• {t.safety1}</li>
                <li>• {t.safety2}</li>
                <li>• {t.safety3}</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 backdrop-blur-sm p-6 rounded-2xl">
              <h2 className="text-xl font-bold text-white mb-3">{t.sectionC}</h2>
              <ul className="space-y-2 text-slate-300 text-sm leading-relaxed">
                <li>• {t.privacy1}</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 backdrop-blur-sm p-6 rounded-2xl">
              <h2 className="text-xl font-bold text-white mb-3">{t.sectionD}</h2>
              <ul className="space-y-2 text-slate-300 text-sm leading-relaxed">
                <li>• {t.api1}</li>
                <li>• {t.api2}</li>
                <li>• {t.api3}</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 backdrop-blur-sm p-6 rounded-2xl">
              <h2 className="text-xl font-bold text-white mb-3">{t.sectionE}</h2>
              <ul className="space-y-2 text-slate-300 text-sm leading-relaxed">
                <li>• {t.feedbackDisclaimer1}</li>
                <li>• {t.feedbackDisclaimer2}</li>
                <li>• {t.feedbackDisclaimer3}</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 backdrop-blur-sm p-6 rounded-2xl">
              <h2 className="text-xl font-bold text-white mb-3">{t.sectionF}</h2>
              <ul className="space-y-2 text-slate-300 text-sm leading-relaxed">
                <li>• {t.changes1}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
