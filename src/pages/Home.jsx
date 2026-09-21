import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getSites, getCrews, getMonthlyStats } from '../api/api.js'
import Navbar from '../components/Navbar.jsx'

const StatCard = ({ label, value }) => (
  <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-5 py-4">
    <p className="text-2xl font-bold text-gray-900">{value}</p>
    <p className="text-sm text-gray-500 mt-1">{label}</p>
  </div>
)

const ActionLink = ({ to, label, color }) => (
  <Link
    to={to}
    className={`${color} text-white rounded-xl px-5 py-4 font-semibold text-center hover:opacity-90 transition`}
  >
    {label}
  </Link>
)

export default function Home() {
  const { t } = useTranslation()
  const [sitesCount, setSitesCount] = useState(0)
  const [crewsCount, setCrewsCount] = useState(0)
  const [recordsThisMonth, setRecordsThisMonth] = useState(0)
  const [hoursThisMonth, setHoursThisMonth] = useState(0)

  useEffect(() => {
    getSites().then((res) => setSitesCount(res.data.sites.length))
    getCrews().then((res) => setCrewsCount(res.data.crews.length))
    getMonthlyStats().then((res) => {
      const now = new Date()
      const current = res.data.stats.find(
        (s) => s.year === now.getFullYear() && s.month === now.getMonth() + 1
      )
      setRecordsThisMonth(current?.records || 0)
      setHoursThisMonth(current?.hours || 0)
    })
  }, [])

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="p-4 sm:p-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
            {t('home.overview')}
          </h1>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            <StatCard label={t('home.recordsThisMonth')} value={recordsThisMonth} />
            <StatCard label={t('home.hoursThisMonth')} value={hoursThisMonth} />
            <StatCard label={t('home.sites')} value={sitesCount} />
            <StatCard label={t('home.crews')} value={crewsCount} />
          </div>

          <p className="text-sm font-semibold text-gray-700 mb-3">
            {t('home.quickActions')}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <ActionLink to="/dashboard" label={t('nav.newRecord')} color="bg-blue-600" />
            <ActionLink to="/records" label={t('nav.records')} color="bg-emerald-600" />
            <ActionLink to="/crews" label={t('nav.crews')} color="bg-purple-600" />
            <ActionLink to="/sites" label={t('nav.sites')} color="bg-amber-600" />
          </div>
        </div>
      </div>
    </div>
  )
}
