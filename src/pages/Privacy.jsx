import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from '../components/LanguageSwitcher.jsx'
import { CONTROLLER, LAST_UPDATED, getPrivacyPolicy, isPlaceholder } from '../legal/privacyPolicy.js'
import { LOCALE_MAP } from '../i18n/config.js'

const Value = ({ value }) =>
  isPlaceholder(value) ? (
    <span className="bg-yellow-100 text-yellow-800 rounded px-1">{value}</span>
  ) : (
    value
  )

export default function Privacy() {
  const { t, i18n } = useTranslation()
  const policy = getPrivacyPolicy(i18n.resolvedLanguage)
  const locale = LOCALE_MAP[i18n.resolvedLanguage] || 'en-US'

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <article className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-6 sm:p-10 text-gray-700 leading-relaxed">
        <div className="flex items-center justify-between gap-3 mb-6">
          <Link to="/" className="shrink-0">
            <img src="/logo-sanjo.svg" alt={t('app.name')} className="h-7 w-auto" />
          </Link>
          <LanguageSwitcher />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{policy.title}</h1>
        <p className="text-sm text-gray-500 mt-1 mb-6">
          {policy.updated}: {new Date(LAST_UPDATED).toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
        <p className="mb-6">{policy.intro}</p>
        {policy.sections.map((section) => (
          <section key={section.heading} className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">{section.heading}</h2>
            {section.paragraphs?.map((text) => (
              <p key={text} className="mb-2">{text}</p>
            ))}
            {section.controller && (
              <dl className="bg-gray-50 rounded-lg p-4 mb-2 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
                {Object.entries(policy.controllerLabels).map(([key, label]) => (
                  <div key={key} className="contents">
                    <dt className="text-gray-500">{label}</dt>
                    <dd className="break-words"><Value value={CONTROLLER[key]} /></dd>
                  </div>
                ))}
              </dl>
            )}
            {section.items && (
              <ul className="list-disc pl-5 space-y-1.5 mb-2">
                {section.items.map((text) => (
                  <li key={text}>{text}</li>
                ))}
              </ul>
            )}
            {section.after?.map((text) => (
              <p key={text} className="mb-2">{text}</p>
            ))}
          </section>
        ))}
      </article>
    </div>
  )
}
