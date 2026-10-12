import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { getSites, uploadReceipt, getReceipts } from '../api/api.js'
import Navbar from '../components/Navbar.jsx'
import { LOCALE_MAP } from '../i18n/config.js'
import { compressImage } from '../utils/compressImage.js'

const RECEIPT_REFRESH_MS = 50 * 60 * 1000

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
  const [filterSiteId, setFilterSiteId] = useState('')
  const [viewingId, setViewingId] = useState(null)

  const loadReceipts = () => getReceipts().then((res) => setReceipts(res.data.receipts))

  // Photo links from the API are signed for an hour, so a page left open
  // re-fetches the list before they run out.
  useEffect(() => {
    getSites().then((res) => setSites(res.data.sites))
    getReceipts().then((res) => setReceipts(res.data.receipts))
    const timer = setInterval(loadReceipts, RECEIPT_REFRESH_MS)
    return () => clearInterval(timer)
  }, [])

  // Looked up by id so the viewer picks up re-signed links after a refresh.
  const viewing = receipts.find((receipt) => receipt._id === viewingId)

  useEffect(() => {
    if (!viewingId) return
    const onKey = (e) => e.key === 'Escape' && setViewingId(null)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [viewingId])

  const siteName = (id) => sites.find((site) => site.id === id)?.name || t('receipts.unknownSite')

  const shownReceipts = filterSiteId
    ? receipts.filter((receipt) => String(receipt.siteId) === filterSiteId)
    : receipts

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!file || !siteId) return
    setLoading(true)
    setError('')
    setSuccess(false)
    try {
      const formData = new FormData()
      formData.append('receipt', await compressImage(file))
      formData.append('siteId', siteId)

      await uploadReceipt(formData)
      await loadReceipts()
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
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <h3 className="text-lg font-semibold text-gray-700">
                  {t('receipts.uploaded')}
                </h3>
                <select
                  value={filterSiteId}
                  onChange={(e) => setFilterSiteId(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500"
                >
                  <option value="">{t('receipts.allSites')}</option>
                  {sites.map((site) => (
                    <option key={site.id} value={site.id}>
                      {site.name}
                    </option>
                  ))}
                </select>
              </div>
              {shownReceipts.map((receipt) => (
                <button
                  type="button"
                  key={receipt._id}
                  onClick={() => setViewingId(receipt._id)}
                  disabled={!receipt.viewUrl}
                  className="w-full text-left bg-gray-50 p-2 rounded-lg mb-2 flex items-center gap-3 hover:bg-blue-50 transition disabled:cursor-default disabled:hover:bg-gray-50"
                >
                  {receipt.viewUrl ? (
                    <img
                      src={receipt.viewUrl}
                      alt={receipt.originalName}
                      loading="lazy"
                      className="w-14 h-14 object-cover rounded-md bg-gray-200 shrink-0"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-md bg-gray-200 shrink-0 flex items-center justify-center text-[10px] text-gray-400 text-center leading-tight p-1">
                      {t('receipts.noPreview')}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-gray-700 truncate">{receipt.originalName}</p>
                    <p className="text-xs text-gray-500 truncate">{siteName(receipt.siteId)}</p>
                  </div>
                  <p className="text-xs text-gray-400 shrink-0">
                    {new Date(receipt.createdAt).toLocaleDateString(locale)}
                  </p>
                </button>
              ))}
              {shownReceipts.length === 0 && (
                <p className="text-gray-400 text-sm">
                  {receipts.length === 0 ? t('receipts.empty') : t('receipts.emptyFiltered')}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      {viewing?.viewUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex flex-col items-center justify-center p-4"
          onClick={() => setViewingId(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="w-full max-w-3xl flex items-center justify-between gap-3 mb-3 text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">{viewing.originalName}</p>
              <p className="text-xs text-gray-300 truncate">
                {siteName(viewing.siteId)} · {new Date(viewing.createdAt).toLocaleDateString(locale)}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <a
                href={viewing.viewUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs sm:text-sm bg-white/15 hover:bg-white/25 px-3 py-1.5 rounded-lg"
              >
                {t('receipts.openOriginal')}
              </a>
              <button
                type="button"
                onClick={() => setViewingId(null)}
                className="text-xs sm:text-sm bg-white/15 hover:bg-white/25 px-3 py-1.5 rounded-lg"
              >
                {t('receipts.close')}
              </button>
            </div>
          </div>
          <img
            src={viewing.viewUrl}
            alt={viewing.originalName}
            onClick={(e) => e.stopPropagation()}
            className="max-w-full max-h-[80vh] object-contain rounded-lg bg-white"
          />
        </div>
      )}
    </div>
  )
}
