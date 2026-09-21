import React, { useState } from 'react'
import { resetPassword } from '../api/api.js'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from '../components/LanguageSwitcher.jsx'

const ResetPassword = () => {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') || ''
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { t } = useTranslation()

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)
    try {
      await resetPassword(token, password)
      setMessage(t('auth.resetSuccess'))
      setTimeout(() => navigate('/login'), 1500)
    } catch (error) {
      setError(error.response?.data?.message || error.message)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen py-18 px-4 bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <div className="flex justify-end mb-2">
          <LanguageSwitcher />
        </div>
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          {t('auth.resetPasswordTitle')}
        </h2>
        {!token ? (
          <p className="text-red-500 text-sm text-center">
            {t('auth.invalidOrExpiredToken')}
          </p>
        ) : (
          <form onSubmit={submit} className="flex flex-col gap-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('auth.newPassword')}
              minLength={8}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition disabled:opacity-60"
            >
              {loading ? t('auth.resetting') : t('auth.resetPassword')}
            </button>
          </form>
        )}
        <p className="text-center text-sm text-gray-500 mt-4">
          <a href="/login" className="text-blue-500 hover:underline">
            {t('auth.backToLogin')}
          </a>
        </p>
        {message && <p className="text-green-600 text-sm mt-2">{message}</p>}
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>
    </div>
  )
}

export default ResetPassword
