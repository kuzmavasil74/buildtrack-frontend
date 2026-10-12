import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { acceptInvite, getMe, logout, previewInvite } from '../api/api.js'
import LanguageSwitcher from '../components/LanguageSwitcher.jsx'

const sameEmail = (a, b) => String(a || '').trim().toLowerCase() === String(b || '').trim().toLowerCase()

export default function Invite() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') || ''
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [invite, setInvite] = useState(null)
  const [me, setMe] = useState(null)
  const [state, setState] = useState('loading')
  const [error, setError] = useState('')
  const [accepting, setAccepting] = useState(false)

  useEffect(() => {
    Promise.all([
      previewInvite(token),
      getMe().then((res) => res.data).catch(() => null),
    ])
      .then(([preview, current]) => {
        setInvite(preview.data)
        setMe(current)
        setState('ready')
      })
      .catch(() => setState('invalid'))
  }, [token])

  const here = `/invite?token=${encodeURIComponent(token)}`

  const accept = async () => {
    setAccepting(true)
    setError('')
    try {
      await acceptInvite(token)
      navigate('/home')
    } catch (err) {
      const code = err.response?.data?.code
      setError(code === 'OWNER_HAS_MEMBERS' ? t('invite.ownerHasMembers') : err.response?.data?.message || err.message)
      setAccepting(false)
    }
  }

  const signOut = async () => {
    await logout()
    setMe(null)
  }

  const button = 'block w-full text-center bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition font-semibold disabled:opacity-60'

  return (
    <div className="min-h-screen py-14 px-4 bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <img src="/logo-sanjo.svg" alt={t('app.name')} className="h-7 w-auto" />
          <LanguageSwitcher />
        </div>
        <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">{t('invite.title')}</h2>

        {state === 'loading' && <p className="text-center text-gray-500 text-sm">{t('common.loading')}</p>}
        {state === 'invalid' && <p className="text-center text-gray-600">{t('invite.invalid')}</p>}

        {state === 'ready' && (
          <div className="flex flex-col gap-4">
            <p className="text-center text-gray-700">
              {t('invite.body', { company: invite.companyName, email: invite.email })}
            </p>
            <p className="text-sm text-gray-500 bg-gray-50 rounded-lg p-3">{t('team.inviteHint')}</p>

            {me && sameEmail(me.email, invite.email) && (
              <button type="button" onClick={accept} disabled={accepting} className={button}>
                {accepting ? t('invite.accepting') : t('invite.accept')}
              </button>
            )}
            {me && !sameEmail(me.email, invite.email) && (
              <>
                <p className="text-sm text-amber-700 bg-amber-50 rounded-lg p-3">
                  {t('invite.wrongAccount', { current: me.email, email: invite.email })}
                </p>
                <button type="button" onClick={signOut} className={button}>
                  {t('invite.logout')}
                </button>
              </>
            )}
            {!me && invite.hasAccount && (
              <Link
                to={`/login?next=${encodeURIComponent(here)}&email=${encodeURIComponent(invite.email)}`}
                className={button}
              >
                {t('invite.login')}
              </Link>
            )}
            {!me && !invite.hasAccount && (
              <Link to={`/register?invite=${encodeURIComponent(token)}`} className={button}>
                {t('invite.register')}
              </Link>
            )}
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>
        )}
      </div>
    </div>
  )
}
