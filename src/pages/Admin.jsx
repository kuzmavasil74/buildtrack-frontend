import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getAdminStats } from '../api/api.js'
import Navbar from '../components/Navbar.jsx'
import { LOCALE_MAP } from '../i18n/config.js'
import { relativeTime } from '../utils/relativeTime.js'

const Stat = ({ label, value }) => (
  <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-4 py-3">
    <p className="text-2xl font-bold text-gray-900">{value}</p>
    <p className="text-xs text-gray-500 mt-1">{label}</p>
  </div>
)

export default function Admin() {
  const { t, i18n } = useTranslation()
  const locale = LOCALE_MAP[i18n.resolvedLanguage] || 'en-US'
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    getAdminStats()
      .then((res) => setData(res.data))
      .catch((err) => setError(err.response?.data?.message || err.message))
  }, [])

  const when = (date) => (date ? relativeTime(date, locale) : null)

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="p-4 sm:p-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">{t('admin.title')}</h2>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {!data && !error && <p className="text-gray-500 text-sm">{t('common.loading')}</p>}
          {data && (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
                <Stat label={t('admin.users')} value={data.totals.users} />
                <Stat label={t('admin.companies')} value={data.totals.companies} />
                <Stat label={t('admin.active7d')} value={data.totals.active7d} />
                <Stat label={t('admin.active30d')} value={data.totals.active30d} />
                <Stat label={t('admin.records')} value={data.totals.records} />
                <Stat label={t('admin.receipts')} value={data.totals.receipts} />
              </div>
              <div className="bg-white rounded-xl shadow-lg overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
                    <tr>
                      <th className="px-4 py-3">{t('admin.email')}</th>
                      <th className="px-4 py-3">{t('admin.company')}</th>
                      <th className="px-4 py-3">{t('admin.role')}</th>
                      <th className="px-4 py-3">{t('admin.lastSeen')}</th>
                      <th className="px-4 py-3">{t('admin.registered')}</th>
                      <th className="px-4 py-3 text-right">{t('admin.records')}</th>
                      <th className="px-4 py-3 text-right">{t('admin.receipts')}</th>
                      <th className="px-4 py-3 text-right">{t('admin.sites')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {data.users.map((user) => (
                      <tr key={user.id} className="whitespace-nowrap">
                        <td className="px-4 py-3 text-gray-900">{user.email}</td>
                        <td className="px-4 py-3 text-gray-600">{user.company}</td>
                        <td className="px-4 py-3 text-gray-600">
                          {user.role === 'owner' ? t('team.roleOwner') : t('team.roleForeman')}
                        </td>
                        <td className="px-4 py-3 text-gray-600">{when(user.lastSeenAt) || t('admin.never')}</td>
                        <td className="px-4 py-3 text-gray-600">
                          {user.createdAt ? new Date(user.createdAt).toLocaleDateString(locale) : t('admin.unknown')}
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums">{user.records}</td>
                        <td className="px-4 py-3 text-right tabular-nums">{user.receipts}</td>
                        <td className="px-4 py-3 text-right tabular-nums">{user.companySites}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
