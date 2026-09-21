import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { getSites, uploadReceipt, getReceipts } from '../api/api.js'
import Navbar from '../components/Navbar.jsx'
import { LOCALE_MAP } from '../i18n/config.js'

export default function Receipts() {
  const { t, i18n } = useTranslation()
  const locale = LOCALE_MAP[i18n.resolvedLanguage] || 'en-US'
  const [sites, setSites] = useState([])
  const [siteId, setSiteId] = useState('')
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [receipts, setReceipts] = useState([])

  useEffect(() => {
    getSites().then((res) => setSites(res.data.sites))
    getReceipts().then((res) => setReceipts(res.data.receipts))
  }, [])

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!file || !siteId) return
    setLoading(true)
    setError('')
    setSuccess(false)
    try {
      const formData = new FormData()
      formData.append('receipt', file)
      formData.append('siteId', siteId)

      await uploadReceipt(formData)
      const res = await getReceipts()
      setReceipts(res.data.receipts)
      setSuccess(true)
      setFile(null)
    } catch (err) {
      setError(err.response?.data?.message || err.message)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="p-4 sm:p-8">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8">
            {t('receipts.title')}
          </h2>
          <div className="bg-white p-5 sm:p-6 rounded-xl shadow-lg">
            <form onSubmit={handleUpload} className="flex flex-col gap-4">
              <select
                value={siteId}
                onChange={(e) => setSiteId(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
              >
                <option value="">{t('receipts.selectSite')}</option>
                {sites.map((site) => (
                  <option key={site.id} value={site.id}>
                    {site.name}
                  </option>
                ))}
              </select>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files[0])}
                className="border border-gray-300 rounded-lg px-4 py-2 text-sm"
              />
              <button
                type="submit"
                disabled={loading || !file || !siteId}
                className="bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition font-semibold disabled:opacity-60"
              >
                {loading ? t('receipts.uploading') : t('receipts.upload')}
              </button>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              {success && (
                <p className="text-green-500 text-sm">{t('receipts.uploadSuccess')}</p>
              )}
            </form>
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                {t('receipts.uploaded')}
              </h3>
              {receipts.map((receipt) => (
                <div
                  key={receipt._id}
                  className="bg-gray-50 p-3 rounded-lg mb-2 flex justify-between items-center gap-3"
                >
                  <p className="text-sm text-gray-700 truncate">{receipt.originalName}</p>
                  <p className="text-xs text-gray-400 shrink-0">
                    {new Date(receipt.createdAt).toLocaleDateString(locale)}
                  </p>
                </div>
              ))}
              {receipts.length === 0 && (
                <p className="text-gray-400 text-sm">{t('receipts.empty')}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
