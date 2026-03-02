"use client"

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react"
import { translations } from "./translations"

export type Locale = "es" | "en" | "fr"

export const LOCALES: Locale[] = ["es", "en", "fr"]

const STORAGE_KEY = "preferred-locale"

interface LanguageContextValue {
  locale: Locale
  setLocale: (l: Locale) => void
  t: (typeof translations)[Locale]
}

const LanguageContext = createContext<LanguageContextValue>({
  locale: "es",
  setLocale: () => {},
  t: translations.es,
})

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("es")

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Locale | null
    const resolved: Locale =
      stored && stored in translations
        ? stored
        : (navigator.language.slice(0, 2) in translations
            ? (navigator.language.slice(0, 2) as Locale)
            : "es")
    queueMicrotask(() => {
      setLocaleState(resolved)
      document.documentElement.lang = resolved
    })
  }, [])

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l)
    localStorage.setItem(STORAGE_KEY, l)
    document.documentElement.lang = l
  }, [])

  return (
    <LanguageContext.Provider
      value={{ locale, setLocale, t: translations[locale] }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
