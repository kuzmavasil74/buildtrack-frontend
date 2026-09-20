import React, { useState, useEffect } from 'react'
import {
  getRecords,
  downloadReport,
  getSites,
  deleteRecord,
  getMonthlyStats,
} from '../api/api.js'
import Navbar from '../components/Navbar.jsx'

export default function Records() {
  const [records, setRecords] = useState([])
  const [sites, setSites] = useState([])
  const [monthlyStats, setMonthlyStats] = useState([])
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
    getRecords().then((res) => setRecords(res.data.records))
    getSites().then((res) => setSites(res.data.sites))
    getMonthlyStats().then((res) => setMonthlyStats(res.data.stats))
  }, [])

  const getSiteName = (siteId) => {
    const site = sites.find((s) => s.id === Number(siteId))
    return site ? site.name : `Site #${siteId}`
  }

  const handleDownloadReport = async () => {
    setDownloading(true)
    try {
      const response = await downloadReport({ from, to })
      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: 'application/pdf' })
      )
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'report.pdf')
      document.body.appendChild(link)
      link.click()
      link.remove()
    } finally {
      setDownloading(false)
    }
  }

  const handleDeleteRecord = async (id) => {
    if (!window.confirm('Delete this record? This cannot be undone.')) return
    await deleteRecord(id)
    const res = await getRecords()
    setRecords(res.data.records)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="p-4 sm:p-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Work Records
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {records.length} record{records.length !== 1 ? 's' : ''} total
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 sm:p-6 mb-6 shadow-sm border border-gray-200">
            <p className="text-sm font-semibold text-gray-700 mb-3">
              Download PDF Report
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <label className="text-xs text-gray-500 whitespace-nowrap">From</label>
                <input
                  type="date"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 bg-gray-50 focus:outline-none focus:border-blue-500"
                />
              </div>
              <span className="text-gray-400">→</span>
              <div className="flex items-center gap-2">
                <label className="text-xs text-gray-500 whitespace-nowrap">To</label>
                <input
                  type="date"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 bg-gray-50 focus:outline-none focus:border-blue-500"
                />
              </div>
              <button
                onClick={handleDownloadReport}
                disabled={downloading}
                className="w-full sm:w-auto sm:ml-auto bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold text-sm px-5 py-2 rounded-lg transition"
              >
                {downloading ? '⏳ Generating...' : '⬇ Download PDF'}
              </button>
            </div>
            {!from && !to && (
              <p className="text-xs text-gray-400 mt-2">
                No dates selected — all records will be included
              </p>
            )}
          </div>

          {monthlyStats.length > 0 && (
            <div className="mb-6">
              <p className="text-sm font-semibold text-gray-700 mb-3">Hours by Month</p>
              <div className="flex gap-3 flex-wrap">
                {monthlyStats.map((stat) => (
                  <div
                    key={`${stat.year}-${stat.month}`}
                    className="bg-white rounded-lg border border-gray-200 shadow-sm px-4 py-3 min-w-[140px]"
                  >
                    <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1">
                      {new Date(stat.year, stat.month - 1).toLocaleDateString('uk-UA', {
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 mb-1">
                      {stat.hours} <span className="text-sm font-normal text-gray-500">год</span>
                    </p>
                    <p className="text-xs text-gray-500">
                      {stat.records} записів · {stat.workers} люд/день
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {records.length === 0 ? (
            <div className="bg-white rounded-xl border border-dashed border-gray-300 px-6 py-12 text-center">
              <p className="text-3xl mb-2">📋</p>
              <p className="text-gray-600">No records yet</p>
              <p className="text-gray-400 text-sm">
                Create your first work record to get started
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {records.map((record) => (
                <div
                  key={record._id}
                  className="bg-white rounded-xl p-5 shadow-sm border border-gray-200"
                >
                  <div className="flex justify-between items-start gap-3 mb-3">
                    <div className="min-w-0">
                      <p className="font-bold text-gray-900 truncate">
                        {getSiteName(record.siteId)}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {new Date(record.date).toLocaleDateString('uk-UA', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteRecord(record._id)}
                      className="shrink-0 text-red-500 border border-red-200 hover:bg-red-50 rounded-lg px-3 py-1 text-xs font-semibold transition"
                    >
                      Delete
                    </button>
                  </div>

                  <div className="flex gap-2 flex-wrap mb-3">
                    <span className="bg-blue-50 text-blue-700 rounded-lg px-3 py-1 text-sm font-semibold">
                      👷 {record.workersPresent} workers
                    </span>
                    <span className="bg-green-50 text-green-700 rounded-lg px-3 py-1 text-sm font-semibold">
                      ⏱ {record.hoursWorked} hours
                    </span>
                  </div>

                  {record.tasksCompleted.length > 0 && (
                    <div className="mb-2">
                      <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1">
                        Tasks
                      </p>
                      <p className="text-sm text-gray-700">
                        {record.tasksCompleted.join(', ')}
                      </p>
                    </div>
                  )}

                  {record.materialsUsed.length > 0 && (
                    <div>
                      <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1">
                        Materials
                      </p>
                      <p className="text-sm text-gray-700">
                        {record.materialsUsed
                          .map((m) => `${m.name} (${m.quantity} ${m.unit})`)
                          .join(', ')}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
