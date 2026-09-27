import React, { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import {
  getRecords,
  updateRecord,
  downloadReport,
  downloadCsv,
  getSites,
  getCrews,
  deleteRecord,
  getMonthlyStats,
  getWorkerDirectory,
} from '../api/api.js'
import Navbar from '../components/Navbar.jsx'
import RecordForm from '../components/RecordForm.jsx'
import { LOCALE_MAP } from '../i18n/config.js'

const pad = (n) => String(n).padStart(2, '0')
const dateStr = (y, m, d) => `${y}-${pad(m + 1)}-${pad(d)}`
// [firstDay, lastDay] of the calendar month a Date falls in, as "YYYY-MM-DD".
const monthRange = (date) => {
  const y = date.getFullYear()
  const m = date.getMonth()
  const lastDay = new Date(y, m + 1, 0).getDate()
  return { from: dateStr(y, m, 1), to: dateStr(y, m, lastDay) }
}
const sameMonth = (date, year, month) => date.getFullYear() === year && date.getMonth() === month - 1

const RecordCard = ({
  record,
  sites,
  crews,
  workerDirectory,
  getSiteName,
  onSaved,
  onDelete,
  t,
  locale,
}) => {
  const [editing, setEditing] = useState(false)
  const crew = crews.find((c) => c.id === record.crewId)

  const handleSave = async (payload) => {
    await updateRecord(record._id, payload)
    setEditing(false)
    onSaved()
  }

  if (editing) {
    return (
      <div className="bg-white rounded-xl p-5 shadow-sm border border-blue-200">
        <RecordForm
          record={record}
          sites={sites}
          crews={crews}
          workerDirectory={workerDirectory}
          submitLabel={t('common.save')}
          submittingLabel={t('common.saving')}
          onSubmit={handleSave}
          onCancel={() => setEditing(false)}
        />
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
      <div className="flex justify-between items-start gap-3 mb-3">
        <div className="min-w-0">
          <p className="font-bold text-gray-900 truncate">{getSiteName(record.siteId)}</p>
          <p className="text-xs text-gray-500 mt-0.5">
            {new Date(record.date).toLocaleDateString(locale, {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            })}
          </p>
        </div>
        <div className="shrink-0 flex gap-2">
          <button
            onClick={() => setEditing(true)}
            className="text-gray-600 border border-gray-200 hover:bg-gray-50 rounded-lg px-3 py-1 text-xs font-semibold transition"
          >
            {t('common.edit')}
          </button>
          <button
            onClick={() => onDelete(record._id)}
            className="text-red-500 border border-red-200 hover:bg-red-50 rounded-lg px-3 py-1 text-xs font-semibold transition"
          >
            {t('common.delete')}
          </button>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap mb-3">
        {crew && (
          <span className="bg-gray-100 text-gray-700 rounded-lg px-3 py-1 text-sm font-semibold">
            {crew.name}
          </span>
        )}
        <span className="bg-blue-50 text-blue-700 rounded-lg px-3 py-1 text-sm font-semibold">
          {t('records.workersTag', { count: record.workersPresent })}
        </span>
        <span className="bg-green-50 text-green-700 rounded-lg px-3 py-1 text-sm font-semibold">
          {t('records.hoursTag', { count: record.hoursWorked })}
        </span>
      </div>

      {record.tasksCompleted.length > 0 && (
        <div className="mb-2">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1">
            {t('records.tasks')}
          </p>
          <p className="text-sm text-gray-700 whitespace-pre-line">
            {record.tasksCompleted.join('\n')}
          </p>
        </div>
      )}

      {record.crewNote && (
        <div className="mb-2">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1">
            {t('records.crewWork')}
          </p>
          <p className="text-sm text-gray-700 whitespace-pre-line">{record.crewNote}</p>
        </div>
      )}

      {record.entries?.length > 0 && (
        <div className="mb-2">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1">
            {t('records.workers')}
          </p>
          <ul className="text-sm text-gray-700 divide-y divide-gray-100">
            {record.entries.map((entry, i) => (
              <li key={i} className="py-1">
                <div className="flex justify-between gap-3">
                  <span className="font-medium">{entry.name}</span>
                  <span className="shrink-0 text-gray-600">
                    {entry.hours} {t('records.hoursUnit')}
                    {entry.startTime && entry.endTime && (
                      <span className="text-gray-400">
                        {' '}
                        ({entry.startTime}–{entry.endTime})
                      </span>
                    )}
                  </span>
                </div>
                {entry.note && <p className="text-xs text-gray-500">{entry.note}</p>}
              </li>
            ))}
          </ul>
        </div>
      )}

      {record.materialsUsed.length > 0 && (
        <div>
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1">
            {t('records.materials')}
          </p>
          <p className="text-sm text-gray-700">
            {record.materialsUsed.map((m) => `${m.name} (${m.quantity} ${m.unit})`).join(', ')}
          </p>
        </div>
      )}
    </div>
  )
}

export default function Records() {
  const { t, i18n } = useTranslation()
  const locale = LOCALE_MAP[i18n.resolvedLanguage] || 'en-US'
  const [records, setRecords] = useState([])
  const [sites, setSites] = useState([])
  const [crews, setCrews] = useState([])
  const [workerDirectory, setWorkerDirectory] = useState([])
  const [monthlyStats, setMonthlyStats] = useState([])
  const [siteFilter, setSiteFilter] = useState('')
  const [monthDate, setMonthDate] = useState(() => {
    const d = new Date()
    d.setDate(1)
    return d
  })
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [downloading, setDownloading] = useState(false)
  const [downloadingCsv, setDownloadingCsv] = useState(false)
  const autoJumped = useRef(false)

  const refreshRecords = async (filterSiteId = siteFilter, filterMonth = monthDate) => {
    const { from: monthFrom, to: monthTo } = monthRange(filterMonth)
    const res = await getRecords({ siteId: filterSiteId || undefined, from: monthFrom, to: monthTo })
    setRecords(res.data.records)
  }

  const refreshAfterSave = async () => {
    await refreshRecords()
    getWorkerDirectory().then((res) => setWorkerDirectory(res.data.workers))
  }

  useEffect(() => {
    getSites().then((res) => setSites(res.data.sites))
    getCrews().then((res) => setCrews(res.data.crews))
    getWorkerDirectory().then((res) => setWorkerDirectory(res.data.workers))
    getMonthlyStats().then((res) => {
      setMonthlyStats(res.data.stats)
      // First load, current month is empty, but other months have records:
      // jump straight to the most recent one instead of showing an empty page.
      if (!autoJumped.current) {
        autoJumped.current = true
        const stats = res.data.stats
        const now = new Date()
        const hasCurrentMonth = stats.some((s) => sameMonth(now, s.year, s.month))
        if (!hasCurrentMonth && stats.length > 0) {
          setMonthDate(new Date(stats[0].year, stats[0].month - 1, 1))
        }
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    refreshRecords(siteFilter, monthDate)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteFilter, monthDate])

  const changeMonth = (delta) =>
    setMonthDate((d) => new Date(d.getFullYear(), d.getMonth() + delta, 1))
  const goToMonth = (year, month) => setMonthDate(new Date(year, month - 1, 1))
  const isCurrentMonth = sameMonth(new Date(), monthDate.getFullYear(), monthDate.getMonth() + 1)

  const getSiteName = (siteId) => {
    const site = sites.find((s) => s.id === Number(siteId))
    return site ? site.name : `Site #${siteId}`
  }

  const triggerDownload = (blob, filename) => {
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
    link.remove()
  }

  const handleDownloadReport = async () => {
    setDownloading(true)
    try {
      const response = await downloadReport({ from, to, lang: i18n.resolvedLanguage })
      triggerDownload(new Blob([response.data], { type: 'application/pdf' }), 'report.pdf')
    } finally {
      setDownloading(false)
    }
  }

  const handleDownloadCsv = async () => {
    setDownloadingCsv(true)
    try {
      const response = await downloadCsv({ from, to })
      triggerDownload(new Blob([response.data], { type: 'text/csv' }), 'records.csv')
    } finally {
      setDownloadingCsv(false)
    }
  }

  const handleDeleteRecord = async (id) => {
    if (!window.confirm(t('records.confirmDelete'))) return
    await deleteRecord(id)
    await refreshRecords()
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="p-4 sm:p-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{t('records.title')}</h1>
            <select
              value={siteFilter}
              onChange={(e) => setSiteFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
            >
              <option value="">{t('records.allSites')}</option>
              {sites.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-white rounded-xl p-4 mb-6 shadow-sm border border-gray-200 flex items-center justify-between gap-3">
            <button
              onClick={() => changeMonth(-1)}
              aria-label={t('records.prevMonth')}
              className="shrink-0 w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition text-lg font-bold"
            >
              ‹
            </button>
            <div className="text-center">
              <p className="font-bold text-gray-900 capitalize">
                {monthDate.toLocaleDateString(locale, { month: 'long', year: 'numeric' })}
              </p>
              <p className="text-xs text-gray-500">
                {t('records.total', { count: records.length })}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {!isCurrentMonth && (
                <button
                  onClick={() => setMonthDate(new Date(new Date().setDate(1)))}
                  className="hidden sm:inline text-xs text-blue-600 hover:text-blue-700 font-semibold px-2"
                >
                  {t('records.thisMonth')}
                </button>
              )}
              <button
                onClick={() => changeMonth(1)}
                aria-label={t('records.nextMonth')}
                className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition text-lg font-bold"
              >
                ›
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 sm:p-6 mb-6 shadow-sm border border-gray-200">
            <p className="text-sm font-semibold text-gray-700 mb-3">
              {t('records.downloadReport')}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <label className="text-xs text-gray-500 whitespace-nowrap">{t('records.from')}</label>
                <input
                  type="date"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 bg-gray-50 focus:outline-none focus:border-blue-500"
                />
              </div>
              <span className="text-gray-400">→</span>
              <div className="flex items-center gap-2">
                <label className="text-xs text-gray-500 whitespace-nowrap">{t('records.to')}</label>
                <input
                  type="date"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 bg-gray-50 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="flex gap-2 w-full sm:w-auto sm:ml-auto">
                <button
                  onClick={handleDownloadCsv}
                  disabled={downloadingCsv}
                  className="flex-1 sm:flex-none bg-gray-700 hover:bg-gray-800 disabled:bg-gray-400 text-white font-semibold text-sm px-5 py-2 rounded-lg transition"
                >
                  {downloadingCsv ? t('records.generating') : t('records.downloadCsv')}
                </button>
                <button
                  onClick={handleDownloadReport}
                  disabled={downloading}
                  className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold text-sm px-5 py-2 rounded-lg transition"
                >
                  {downloading ? t('records.generating') : t('records.download')}
                </button>
              </div>
            </div>
            {!from && !to && (
              <p className="text-xs text-gray-400 mt-2">{t('records.noDatesHint')}</p>
            )}
          </div>

          {monthlyStats.length > 0 && (
            <div className="mb-6">
              <p className="text-sm font-semibold text-gray-700 mb-3">{t('records.hoursByMonth')}</p>
              <div className="flex gap-3 flex-wrap">
                {monthlyStats.map((stat) => {
                  const active = sameMonth(monthDate, stat.year, stat.month)
                  return (
                    <button
                      key={`${stat.year}-${stat.month}`}
                      onClick={() => goToMonth(stat.year, stat.month)}
                      className={`text-left rounded-lg border shadow-sm px-4 py-3 min-w-[140px] transition ${
                        active
                          ? 'bg-blue-600 border-blue-600'
                          : 'bg-white border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <p
                        className={`text-[11px] font-semibold uppercase tracking-wide mb-1 ${
                          active ? 'text-blue-100' : 'text-gray-400'
                        }`}
                      >
                        {new Date(stat.year, stat.month - 1).toLocaleDateString(locale, {
                          month: 'long',
                          year: 'numeric',
                        })}
                      </p>
                      <p className={`text-2xl font-bold mb-1 ${active ? 'text-white' : 'text-gray-900'}`}>
                        {stat.hours}{' '}
                        <span className={`text-sm font-normal ${active ? 'text-blue-100' : 'text-gray-500'}`}>
                          {t('records.hoursUnit')}
                        </span>
                      </p>
                      <p className={`text-xs ${active ? 'text-blue-100' : 'text-gray-500'}`}>
                        {stat.records} {t('records.recordsWord', { count: stat.records })} ·{' '}
                        {stat.workers} {t('records.workerDaysWord')}
                      </p>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {records.length === 0 ? (
            <div className="bg-white rounded-xl border border-dashed border-gray-300 px-6 py-12 text-center">
              <p className="text-3xl mb-2">📋</p>
              <p className="text-gray-600">
                {monthlyStats.length > 0 ? t('records.emptyMonth') : t('records.empty')}
              </p>
              <p className="text-gray-400 text-sm">
                {monthlyStats.length > 0 ? t('records.emptyMonthHint') : t('records.emptyHint')}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {records.map((record) => (
                <RecordCard
                  key={record._id}
                  record={record}
                  sites={sites}
                  crews={crews}
                  workerDirectory={workerDirectory}
                  getSiteName={getSiteName}
                  onSaved={refreshAfterSave}
                  onDelete={handleDeleteRecord}
                  t={t}
                  locale={locale}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
