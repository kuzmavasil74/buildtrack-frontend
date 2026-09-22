import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getPayroll, downloadPayrollCsv } from '../api/api.js'
import Navbar from '../components/Navbar.jsx'

export default function Payroll() {
  const { t } = useTranslation()
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [crews, setCrews] = useState([])
  const [unassignedHours, setUnassignedHours] = useState(0)
  const [grandTotal, setGrandTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [downloading, setDownloading] = useState(false)

  const refresh = async () => {
    setLoading(true)
    try {
      const res = await getPayroll({ from, to })
      setCrews(res.data.crews)
      setUnassignedHours(res.data.unassignedHours)
      setGrandTotal(res.data.grandTotal)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleDownloadCsv = async () => {
    setDownloading(true)
    try {
      const response = await downloadPayrollCsv({ from, to })
      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: 'text/csv' })
      )
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'payroll.csv')
      document.body.appendChild(link)
      link.click()
      link.remove()
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="p-4 sm:p-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
            {t('payroll.title')}
          </h1>

          <div className="bg-white rounded-xl p-5 sm:p-6 mb-6 shadow-sm border border-gray-200">
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
              <button
                onClick={refresh}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-5 py-2 rounded-lg transition"
              >
                {t('payroll.calculate')}
              </button>
              <button
                onClick={handleDownloadCsv}
                disabled={downloading}
                className="sm:ml-auto bg-gray-700 hover:bg-gray-800 disabled:bg-gray-400 text-white font-semibold text-sm px-5 py-2 rounded-lg transition"
              >
                {downloading ? t('records.generating') : t('records.downloadCsv')}
              </button>
            </div>
            {!from && !to && (
              <p className="text-xs text-gray-400 mt-2">{t('records.noDatesHint')}</p>
            )}
          </div>

          {!loading && crews.length === 0 && unassignedHours === 0 ? (
            <div className="bg-white rounded-xl border border-dashed border-gray-300 px-6 py-12 text-center">
              <p className="text-3xl mb-2">💵</p>
              <p className="text-gray-600">{t('payroll.empty')}</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {crews.map((crew) => (
                <div
                  key={crew.crewId}
                  className="bg-white rounded-xl p-5 shadow-sm border border-gray-200"
                >
                  <div className="flex justify-between items-baseline mb-3">
                    <p className="font-bold text-gray-900">{crew.crewName}</p>
                    <p className="text-sm text-gray-500">
                      {crew.totalHours} {t('records.hoursUnit')}
                    </p>
                  </div>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-[11px] text-gray-400 uppercase tracking-wide">
                        <th className="font-semibold pb-1">{t('payroll.member')}</th>
                        <th className="font-semibold pb-1 text-right">{t('payroll.hours')}</th>
                        <th className="font-semibold pb-1 text-right">{t('payroll.rate')}</th>
                        <th className="font-semibold pb-1 text-right">{t('payroll.wage')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {crew.members.map((member) => (
                        <tr key={member.name} className="border-t border-gray-100">
                          <td className="py-1.5 text-gray-700">{member.name}</td>
                          <td className="py-1.5 text-right text-gray-700">{member.hours}</td>
                          <td className="py-1.5 text-right text-gray-700">{member.rate}</td>
                          <td className="py-1.5 text-right font-semibold text-gray-900">
                            {member.wage}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="flex justify-end mt-2 pt-2 border-t border-gray-200">
                    <p className="text-sm font-bold text-gray-900">
                      {t('payroll.crewTotal')}: {crew.totalWage}
                    </p>
                  </div>
                </div>
              ))}

              {unassignedHours > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
                  {t('payroll.unassignedHint', { hours: unassignedHours })}
                </div>
              )}

              {crews.length > 0 && (
                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 flex justify-between items-center">
                  <p className="font-semibold text-gray-700">{t('payroll.grandTotal')}</p>
                  <p className="text-xl font-bold text-gray-900">{grandTotal}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
