import { useEffect, useState } from 'react'
import { register, previewInvite } from '../api/api.js'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from '../components/LanguageSwitcher.jsx'

const Register = () => {
  const [searchParams] = useSearchParams()
  const inviteToken = searchParams.get('invite')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [invite, setInvite] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { t } = useTranslation()

  // An invite fixes the email, so the account lands in the right company.
  useEffect(() => {
    if (!inviteToken) return
    previewInvite(inviteToken)
      .then((res) => {
        setInvite(res.data)
        setEmail(res.data.email)
      })
      .catch(() => setError(t('invite.invalid')))
  }, [inviteToken, t])

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if (!agreed) {
      setError(t('auth.mustAgree'))
      return
    }
    setLoading(true)
    try {
      await register(email, password, invite ? inviteToken : undefined)
      navigate(`/login?email=${encodeURIComponent(email)}`)
    } catch (error) {
      setError(error.response?.data?.message || error.message)
    }
    setLoading(false)
  }
  // Accounts are created only from an invitation link.
  if (!inviteToken) {
    return (
      <div className="min-h-screen py-14 px-4 bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md text-center">
          <div className="flex justify-end mb-2">
            <LanguageSwitcher />
          </div>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">{t('auth.register')}</h2>
          <p className="text-gray-600 mb-6">{t('auth.inviteOnly')}</p>
          <Link to="/login" className="text-blue-500 hover:underline text-sm">
            {t('auth.login')}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-14 px-4 bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <div className="flex justify-end mb-2">
          <LanguageSwitcher />
        </div>
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          {t('auth.register')}
        </h2>
        {invite && (
          <p className="bg-blue-50 text-blue-800 text-sm rounded-lg px-4 py-3 mb-4 text-center">
            {t('auth.joiningCompany', { company: invite.companyName })}
          </p>
        )}
        <form onSubmit={submit} className="flex flex-col gap-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            readOnly={Boolean(invite)}
            placeholder={t('auth.email')}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 read-only:bg-gray-50 read-only:text-gray-500"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t('auth.passwordMinChars')}
            minLength={8}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
          />
          <label className="flex items-start gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0"
            />
            <span>
              {t('auth.agreePrefix')}{' '}
              <Link to="/privacy" target="_blank" className="text-blue-500 hover:underline">
                {t('auth.privacyLink')}
              </Link>
            </span>
          </label>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition disabled:opacity-60"
          >
            {loading ? t('auth.creatingAccount') : t('auth.register')}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-4">
          {t('auth.haveAccount')}{' '}
          <a href="/login" className="text-blue-500 hover:underline">
            {t('auth.login')}
          </a>
        </p>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>
    </div>
  )
}

export default Register
