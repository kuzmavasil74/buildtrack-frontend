import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import en from './locales/en.json'
import uk from './locales/uk.json'
import pl from './locales/pl.json'
import ru from './locales/ru.json'
import cs from './locales/cs.json'

export const SUPPORTED_LANGUAGES = [
  { code: 'uk', label: 'Українська' },
  { code: 'en', label: 'English' },
  { code: 'pl', label: 'Polski' },
  { code: 'ru', label: 'Русский' },
  { code: 'cs', label: 'Čeština' },
]

export const LOCALE_MAP = {
  uk: 'uk-UA',
  en: 'en-US',
  pl: 'pl-PL',
  ru: 'ru-RU',
  cs: 'cs-CZ',
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      uk: { translation: uk },
      pl: { translation: pl },
      ru: { translation: ru },
      cs: { translation: cs },
    },
    fallbackLng: 'uk',
    supportedLngs: SUPPORTED_LANGUAGES.map((l) => l.code),
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'buildtrack_lang',
    },
  })

export default i18n
