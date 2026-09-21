import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from '../components/LanguageSwitcher.jsx'

const Main = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  return (
    <div className="min-h-screen py-20 px-4 bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-10 rounded-xl shadow-lg w-full max-w-md text-center">
        <div className="flex justify-end mb-4">
          <LanguageSwitcher />
        </div>
        <h1 className="text-4xl font-bold text-gray-800 mb-2">{t('app.name')}</h1>
        <p className="text-gray-500 mb-8">{t('app.tagline')}</p>
        <div className="flex flex-col gap-4">
          <button
            onClick={() => navigate('/login')}
            className="bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition font-semibold"
          >
            {t('auth.login')}
          </button>
          <button
            onClick={() => navigate('/register')}
            className="bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition font-semibold"
          >
            {t('auth.register')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Main
