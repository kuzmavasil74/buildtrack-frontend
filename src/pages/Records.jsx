import React, { useState, useEffect } from 'react'
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
} from '../api/api.js'
import Navbar from '../components/Navbar.jsx'
import { LOCALE_MAP } from '../i18n/config.js'

const parseMaterialsText = (text) =>
  text
    .split(',')
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map((chunk) => {
      const [name = '', quantity = '', unit = ''] = chunk.split(':').map((s) => s.trim())
      return { name, quantity: Number(quantity) || 0, unit }
    })

const materialsToText = (materials) =>
  materials.map((m) => `${m.name}:${m.quantity}:${m.unit}`).join(', ')

const RecordCard = ({ record, sites, crews, getSiteName, onSaved, onDelete, t, locale }) => {
  const [editing, setEditing] = useState(false)
  const [siteId, setSiteId] = useState(record.siteId)
  const [crewId, setCrewId] = useState(record.crewId || '')
  const [dateStr, setDateStr] = useState(new Date(record.date).toISOString().slice(0, 10))
  const [workersPresent, setWorkersPresent] = useState(record.workersPresent)
  const [hoursWorked, setHoursWorked] = useState(record.hoursWorked)
  const [tasksText, setTasksText] = useState(record.tasksCompleted.join(', '))
  const [materialsText, setMaterialsText] = useState(materialsToText(record.materialsUsed))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleSave = async () => {
    setSaving(true)
    setError('')
    try {
      await updateRecord(record._id, {
        siteId: Number(siteId),
        crewId: crewId ? Number(crewId) : undefined,
        date: new Date(dateStr).toISOString(),
        workersPresent: Number(workersPresent),
        hoursWorked: Number(hoursWorked),
        tasksCompleted: tasksText.split(',').map((t) => t.trim()).filter(Boolean),
        materialsUsed: parseMaterialsText(materialsText),
      })
      setEditing(false)
      onSaved()
    } catch (err) {
      setError(err.response?.data?.message || err.message)
    }
    setSaving(false)
  }

  if (editing) {
    return (
      <div className="bg-white rounded-xl p-5 shadow-sm border border-blue-200 flex flex-col gap-3">
        <div className="flex gap-2 flex-wrap">
          <select
            value={siteId}
            onChange={(e) => setSiteId(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm flex-1 min-w-[140px]"
          >
            {sites.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          <select
            value={crewId}
            onChange={(e) => setCrewId(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm flex-1 min-w-[140px]"
          >
            <option value="">{t('dashboard.selectCrew')}</option>
            {crews.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-2 flex-wrap">
          <input
            type="date"
            value={dateStr}
            onChange={(e) => setDateStr(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
          <input
            type="number"
            value={workersPresent}
            onChange={(e) => setWorkersPresent(e.target.value)}
            placeholder={t('dashboard.workersPresent')}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm flex-1 min-w-[100px]"
          />
          <input
            type="number"
            value={hoursWorked}
            onChange={(e) => setHoursWorked(e.target.value)}
            placeholder={t('dashboard.hoursWorked')}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm flex-1 min-w-[100px]"
          />
        </div>
        <input
          type="text"
          value={tasksText}
          onChange={(e) => setTasksText(e.target.value)}
          placeholder={t('dashboard.tasksCompleted')}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
        />
        <input
          type="text"
          value={materialsText}
          onChange={(e) => setMaterialsText(e.target.value)}
          placeholder="cement:50:bags, sand:10:bags"
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-blue-500 text-white px-4 py-1.5 rounded-lg hover:bg-blue-600 transition text-sm font-semibold disabled:opacity-60"
          >
            {saving ? t('common.saving') : t('common.save')}
          </button>
          <button
            onClick={() => setEditing(false)}
            className="bg-gray-200 text-gray-700 px-4 py-1.5 rounded-lg hover:bg-gray-300 transition text-sm font-semibold"
          >
            {t('common.cancel')}
          </button>
        </div>
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
          <p className="text-sm text-gray-700">{record.tasksCompleted.join(', ')}</p>
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
  const [monthlyStats, setMonthlyStats] = useState([])
  const [siteFilter, setSiteFilter] = useState('')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [downloading, setDownloading] = useState(false)
  const [downloadingCsv, setDownloadingCsv] = useState(false)

  const refreshRecords = async (filterSiteId = siteFilter) => {
    const res = await getRecords(filterSiteId || undefined)
    setRecords(res.data.records)
  }

  useEffect(() => {
    refreshRecords()
    getSites().then((res) => setSites(res.data.sites))
    getCrews().then((res) => setCrews(res.data.crews))
    getMonthlyStats().then((res) => setMonthlyStats(res.data.stats))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    refreshRecords(siteFilter)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteFilter])

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
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {t('records.title')}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {t('records.total', { count: records.length })}
              </p>
            </div>
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
                {monthlyStats.map((stat) => (
                  <div
                    key={`${stat.year}-${stat.month}`}
                    className="bg-white rounded-lg border border-gray-200 shadow-sm px-4 py-3 min-w-[140px]"
                  >
                    <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1">
                      {new Date(stat.year, stat.month - 1).toLocaleDateString(locale, {
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 mb-1">
                      {stat.hours}{' '}
                      <span className="text-sm font-normal text-gray-500">
                        {t('records.hoursUnit')}
                      </span>
                    </p>
                    <p className="text-xs text-gray-500">
                      {stat.records} {t('records.recordsWord', { count: stat.records })} ·{' '}
                      {stat.workers} {t('records.workerDaysWord')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {records.length === 0 ? (
            <div className="bg-white rounded-xl border border-dashed border-gray-300 px-6 py-12 text-center">
              <p className="text-3xl mb-2">📋</p>
              <p className="text-gray-600">{t('records.empty')}</p>
              <p className="text-gray-400 text-sm">{t('records.emptyHint')}</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {records.map((record) => (
                <RecordCard
                  key={record._id}
                  record={record}
                  sites={sites}
                  crews={crews}
                  getSiteName={getSiteName}
                  onSaved={refreshRecords}
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
