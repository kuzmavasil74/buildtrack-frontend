import { useState } from 'react'
import { login } from '../api/api.js'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { safeNextPath } from '../context/me.js'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from '../components/LanguageSwitcher.jsx'

const Login = () => {
  const [searchParams] = useSearchParams()
  // Set when the login form was opened from somewhere, e.g. an invitation.
  const next = safeNextPath(searchParams.get('next'))
  const [email, setEmail] = useState(searchParams.get('email') || '')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { t } = useTranslation()
  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate(next || '/home')
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
          {t('auth.login')}
        </h2>
        <form onSubmit={submit} className="flex flex-col gap-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('auth.email')}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t('auth.password')}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition disabled:opacity-60"
          >
            {loading ? t('auth.loggingIn') : t('auth.login')}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-4">
          <a href="/forgot-password" className="text-blue-500 hover:underline">
            {t('auth.forgotPassword')}
          </a>
        </p>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        <p className="text-center text-xs text-gray-400 mt-6">
          <Link to="/privacy" className="hover:underline">
            {t('common.privacy')}
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login
