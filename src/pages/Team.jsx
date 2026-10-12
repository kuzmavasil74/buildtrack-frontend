import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getCompany, inviteMember, removeMember, renameCompany, revokeInvite } from '../api/api.js'
import Navbar from '../components/Navbar.jsx'
import { useMe } from '../context/me.js'
import { LOCALE_MAP } from '../i18n/config.js'
import { relativeTime } from '../utils/relativeTime.js'

const card = 'bg-white p-5 sm:p-6 rounded-xl shadow-lg'
const input = 'border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 min-w-0'
const primary = 'bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition font-semibold disabled:opacity-60'

export default function Team() {
  const { t, i18n } = useTranslation()
  const locale = LOCALE_MAP[i18n.resolvedLanguage] || 'en-US'
  const me = useMe()
  const [company, setCompany] = useState(null)
  const [members, setMembers] = useState([])
  const [invites, setInvites] = useState([])
  const [name, setName] = useState('')
  const [nameSaved, setNameSaved] = useState(false)
  const [email, setEmail] = useState('')
  const [sending, setSending] = useState(false)
  const [created, setCreated] = useState(null)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')

  const apply = (res) => {
    setCompany(res.data.company)
    setMembers(res.data.members)
    setInvites(res.data.invites)
    return res
  }
  const reload = () => getCompany().then(apply)

  useEffect(() => {
    getCompany().then((res) => {
      apply(res)
      setName(res.data.company.name)
    })
  }, [])

  const saveName = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await renameCompany(name)
      setNameSaved(true)
      setTimeout(() => setNameSaved(false), 2000)
    } catch (err) {
      setError(err.response?.data?.message || err.message)
    }
  }

  const sendInvite = async (e) => {
    e.preventDefault()
    setError('')
    setCreated(null)
    setCopied(false)
    setSending(true)
    try {
      const res = await inviteMember(email)
      setCreated({ email: res.data.invite.email, link: res.data.link, emailed: res.data.emailed })
      setEmail('')
      await reload()
    } catch (err) {
      const code = err.response?.data?.code
      setError(code === 'ALREADY_MEMBER' ? t('team.alreadyMember') : err.response?.data?.message || err.message)
    }
    setSending(false)
  }

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(created.link)
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  const revoke = async (id) => {
    await revokeInvite(id)
    await reload()
  }

  const remove = async (member) => {
    if (!window.confirm(t('team.confirmRemove', { email: member.email }))) return
    await removeMember(member.id)
    await reload()
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="p-4 sm:p-8">
        <div className="max-w-2xl mx-auto flex flex-col gap-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">{t('team.title')}</h2>
          {error && <p className="text-red-500 text-sm">{error}</p>}

          {company && (
            <form onSubmit={saveName} className={`${card} flex flex-col sm:flex-row sm:items-end gap-3`}>
              <label className="flex flex-col gap-1 flex-1 min-w-0">
                <span className="text-sm font-semibold text-gray-700">{t('team.companyName')}</span>
                <input value={name} onChange={(e) => setName(e.target.value)} maxLength={100} className={input} />
              </label>
              <button type="submit" disabled={!name.trim()} className={primary}>
                {nameSaved ? t('team.saved') : t('team.save')}
              </button>
            </form>
          )}

          <section className={card}>
            <h3 className="text-lg font-semibold text-gray-700 mb-3">{t('team.members')}</h3>
            <ul className="flex flex-col gap-2">
              {members.map((member) => (
                <li key={member.id} className="bg-gray-50 rounded-lg p-3 flex items-center gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-gray-800 truncate">
                      {member.email}
                      {member.id === me?.id && <span className="text-gray-400"> ({t('team.you')})</span>}
                    </p>
                    <p className="text-xs text-gray-500">
                      {member.last_seen_at
                        ? t('team.lastSeen', { when: relativeTime(member.last_seen_at, locale) })
                        : t('team.neverSeen')}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 text-xs font-semibold rounded-full px-2.5 py-1 ${
                      member.role === 'owner' ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {member.role === 'owner' ? t('team.roleOwner') : t('team.roleForeman')}
                  </span>
                  {member.role !== 'owner' && (
                    <button
                      type="button"
                      onClick={() => remove(member)}
                      className="shrink-0 text-red-500 border border-red-200 hover:bg-red-50 rounded-lg px-3 py-1 text-xs font-semibold transition"
                    >
                      {t('team.remove')}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </section>

          <section className={card}>
            <h3 className="text-lg font-semibold text-gray-700 mb-1">{t('team.inviteTitle')}</h3>
            <p className="text-sm text-gray-500 mb-4">{t('team.inviteHint')}</p>
            <form onSubmit={sendInvite} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('team.emailPlaceholder')}
                className={`${input} flex-1`}
              />
              <button type="submit" disabled={sending || !email} className={primary}>
                {sending ? t('team.sending') : t('team.send')}
              </button>
            </form>
            {created && (
              <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-gray-700">
                <p className="mb-2">{t('team.linkReady', { email: created.email })}</p>
                <div className="flex gap-2">
                  <input readOnly value={created.link} onFocus={(e) => e.target.select()} className={`${input} flex-1 text-xs bg-white`} />
                  <button type="button" onClick={copyLink} className="shrink-0 border border-gray-300 bg-white rounded-lg px-3 text-xs font-semibold hover:bg-gray-50">
                    {copied ? t('team.copied') : t('team.copy')}
                  </button>
                </div>
                <p className="mt-2 text-xs text-gray-500">{created.emailed ? t('team.emailed') : t('team.notEmailed')}</p>
              </div>
            )}

            <h4 className="text-sm font-semibold text-gray-700 mt-6 mb-2">{t('team.pending')}</h4>
            {invites.length === 0 && <p className="text-sm text-gray-400">{t('team.noPending')}</p>}
            <ul className="flex flex-col gap-2">
              {invites.map((invite) => (
                <li key={invite.id} className="bg-gray-50 rounded-lg p-3 flex items-center gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-gray-800 truncate">{invite.email}</p>
                    <p className="text-xs text-gray-500">
                      {t('team.expires', { date: new Date(invite.expires_at).toLocaleDateString(locale) })}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => revoke(invite.id)}
                    className="shrink-0 text-gray-600 border border-gray-200 hover:bg-gray-100 rounded-lg px-3 py-1 text-xs font-semibold transition"
                  >
                    {t('team.revoke')}
                  </button>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}
