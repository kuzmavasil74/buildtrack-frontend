import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { deleteMyAccount, exportMyData, getCompany } from '../api/api.js'
import Navbar from '../components/Navbar.jsx'
import { useMe, isOwner } from '../context/me.js'
import { emailMatches, fileNameFrom } from '../utils/account.js'

const card = 'bg-white p-5 sm:p-6 rounded-xl shadow-lg'
const input = 'border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 min-w-0'
const primary = 'bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition font-semibold disabled:opacity-60'
const danger = 'bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition font-semibold disabled:opacity-50'

const saveBlob = (blob, filename) => {
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.URL.revokeObjectURL(url)
}

// Self-service GDPR rights: download a copy of your data, delete your account.
export default function Account() {
  const { t } = useTranslation()
  const me = useMe()
  const owner = isOwner(me)
  const companyName = me?.company?.name || ''
  const [otherMembers, setOtherMembers] = useState(0)
  const [exporting, setExporting] = useState(false)
  const [typed, setTyped] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [deleted, setDeleted] = useState(false)
  const [error, setError] = useState('')

  // An owner can only delete once nobody else is in the company.
  useEffect(() => {
    if (!owner) return
    getCompany()
      .then((res) => setOtherMembers(res.data.members.filter((m) => m.id !== me.id).length))
      .catch(() => {})
  }, [owner, me?.id])

  const download = async () => {
    setError('')
    setExporting(true)
    try {
      const res = await exportMyData()
      const fallback = `sanjo-data-${new Date().toISOString().slice(0, 10)}.json`
      saveBlob(
        new Blob([res.data], { type: 'application/json' }),
        fileNameFrom(res.headers?.['content-disposition'], fallback)
      )
    } catch {
      setError(t('account.error'))
    }
    setExporting(false)
  }

  const remove = async (e) => {
    e.preventDefault()
    if (!emailMatches(typed, me.email)) return
    setError('')
    setDeleting(true)
    try {
      await deleteMyAccount(typed)
      setDeleted(true)
    } catch (err) {
      const code = err.response?.data?.code
      if (code === 'OWNER_HAS_MEMBERS') setOtherMembers((n) => Math.max(n, 1))
      setError(
        code === 'OWNER_HAS_MEMBERS'
          ? t('account.ownerHasMembers')
          : code === 'EMAIL_MISMATCH'
            ? t('account.emailMismatch')
            : t('account.error')
      )
    }
    setDeleting(false)
  }

  if (deleted) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className={`${card} max-w-md w-full text-center`}>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('account.deletedTitle')}</h2>
          <p className="text-gray-600 mb-6">{t('account.deletedText')}</p>
          <a href="/" className={primary}>
            {t('account.home')}
          </a>
        </div>
      </div>
    )
  }

  const blocked = owner && otherMembers > 0
  const confirmed = emailMatches(typed, me?.email)

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="p-4 sm:p-8">
        <div className="max-w-2xl mx-auto flex flex-col gap-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">{t('account.title')}</h2>
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <section className={card}>
            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
              <dt className="text-gray-500">{t('account.email')}</dt>
              <dd className="text-gray-800 break-all">{me?.email}</dd>
              <dt className="text-gray-500">{t('account.role')}</dt>
              <dd className="text-gray-800">{owner ? t('team.roleOwner') : t('team.roleForeman')}</dd>
              <dt className="text-gray-500">{t('account.company')}</dt>
              <dd className="text-gray-800 break-words">{companyName}</dd>
            </dl>
          </section>

          <section className={card}>
            <h3 className="text-lg font-semibold text-gray-700 mb-1">{t('account.exportTitle')}</h3>
            <p className="text-sm text-gray-500 mb-4">
              {owner ? t('account.exportOwner') : t('account.exportForeman')}
            </p>
            <button type="button" onClick={download} disabled={exporting} className={primary}>
              {exporting ? t('account.exporting') : t('account.exportButton')}
            </button>
          </section>

          <section className={`${card} border border-red-200`}>
            <h3 className="text-lg font-semibold text-red-700 mb-1">{t('account.deleteTitle')}</h3>
            <p className="text-sm text-gray-600 mb-4">
              {owner
                ? t('account.deleteOwner', { company: companyName })
                : t('account.deleteForeman', { company: companyName })}
            </p>
            {blocked ? (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-gray-700">
                <p className="mb-2">{t('account.ownerHasMembers')}</p>
                <Link to="/team" className="text-blue-600 font-semibold hover:underline">
                  {t('account.openTeam')}
                </Link>
              </div>
            ) : (
              <form onSubmit={remove} className="flex flex-col gap-3">
                <label className="flex flex-col gap-1">
                  <span className="text-sm text-gray-700">{t('account.confirmLabel', { email: me?.email })}</span>
                  <input
                    type="email"
                    autoComplete="off"
                    value={typed}
                    onChange={(e) => setTyped(e.target.value)}
                    placeholder={me?.email}
                    className={input}
                  />
                </label>
                <button type="submit" disabled={!confirmed || deleting} className={`${danger} self-start`}>
                  {deleting ? t('account.deleting') : t('account.deleteButton')}
                </button>
              </form>
            )}
          </section>

          <Link to="/privacy" className="text-xs text-gray-400 hover:underline self-start">
            {t('common.privacy')}
          </Link>
        </div>
      </div>
    </div>
  )
}
