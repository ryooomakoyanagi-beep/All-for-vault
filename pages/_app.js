import '../styles/globals.css'
import { LanguageProvider, LanguageSwitcher } from '../context/LanguageContext'

export default function App({ Component, pageProps }) {
  return (
    <LanguageProvider>
      <LanguageSwitcher />
      <Component {...pageProps} />
    </LanguageProvider>
  )
}
