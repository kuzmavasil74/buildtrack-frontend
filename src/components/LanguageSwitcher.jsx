import React from 'react'
import { useTranslation } from 'react-i18next'
import { SUPPORTED_LANGUAGES } from '../i18n/config.js'

const LanguageSwitcher = ({ className = '' }) => {
  const { i18n } = useTranslation()

  return (
    <select
      value={i18n.resolvedLanguage || i18n.language}
      onChange={(e) => i18n.changeLanguage(e.target.value)}
      aria-label="Language"
      className={`border border-gray-300 rounded-lg text-sm px-2 py-1.5 text-gray-700 bg-white focus:outline-none focus:border-blue-500 ${className}`}
    >
      {SUPPORTED_LANGUAGES.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.label}
        </option>
      ))}
    </select>
  )
}

export default LanguageSwitcher
