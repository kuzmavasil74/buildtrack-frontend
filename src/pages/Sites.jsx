import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { getSites, createSite, updateSite, deleteSite } from '../api/api.js'
import Navbar from '../components/Navbar.jsx'

const SiteRow = ({ site, onSaved, onDelete }) => {
  const { t } = useTranslation()
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(site.name)
  const [address, setAddress] = useState(site.address || '')
  const [latitude, setLatitude] = useState(site.latitude ?? '')
  const [longitude, setLongitude] = useState(site.longitude ?? '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleSave = async () => {
    setSaving(true)
    setError('')
    try {
      await updateSite(site.id, { name, address, latitude, longitude })
      setEditing(false)
      onSaved()
    } catch (err) {
      setError(err.response?.data?.message || err.message)
    }
    setSaving(false)
  }

  if (editing) {
    return (
      <div className="bg-white p-5 sm:p-6 rounded-xl shadow-lg mb-4 flex flex-col gap-3">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
        />
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
        />
        <div className="flex gap-2">
          <input
            type="number"
            step="any"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            placeholder={t('sites.latitude')}
            className="border border-gray-300 rounded-lg px-4 py-2 w-1/2 focus:outline-none focus:border-blue-500"
          />
          <input
            type="number"
            step="any"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            placeholder={t('sites.longitude')}
            className="border border-gray-300 rounded-lg px-4 py-2 w-1/2 focus:outline-none focus:border-blue-500"
          />
        </div>
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
    <div className="bg-white p-5 sm:p-6 rounded-xl shadow-lg mb-4 flex justify-between items-center gap-3">
      <div className="min-w-0">
        <p className="font-semibold text-gray-800 truncate">{site.name}</p>
        <p className="text-gray-500 text-sm truncate">{site.address}</p>
        {site.latitude != null && site.longitude != null && (
          <a
            href={`https://www.google.com/maps?q=${site.latitude},${site.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 text-sm hover:underline"
          >
            {t('sites.viewOnMap')}
          </a>
        )}
      </div>
      <div className="shrink-0 flex gap-2">
        <button
          onClick={() => setEditing(true)}
          className="bg-gray-100 text-gray-700 px-3 py-1 rounded-lg hover:bg-gray-200 transition text-sm"
        >
          {t('common.edit')}
        </button>
        <button
          onClick={() => onDelete(site.id)}
          className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition text-sm"
        >
          {t('common.delete')}
        </button>
      </div>
    </div>
  )
}

export default function Sites() {
  const { t } = useTranslation()
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')
  const [sites, setSites] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const refresh = async () => {
    const res = await getSites()
    setSites(res.data.sites)
  }

  useEffect(() => {
    refresh()
  }, [])
  const handleCreateSite = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await createSite({ name, address, latitude, longitude })
      setName('')
      setAddress('')
      setLatitude('')
      setLongitude('')
      await refresh()
    } catch (err) {
      setError(err.response?.data?.message || err.message)
    }
    setLoading(false)
  }
  const handleDeleteSite = async (id) => {
    if (!window.confirm(t('sites.confirmDelete'))) return
    setError('')
    try {
      await deleteSite(id)
      await refresh()
    } catch (err) {
      const data = err.response?.data
      setError(
        data?.code === 'SITE_IN_USE'
          ? t('sites.inUse', { records: data.records, receipts: data.receipts })
          : data?.message || err.message
      )
    }
  }
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="p-4 sm:p-8">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8">
            {t('sites.title')}
          </h2>
          <div className="bg-white p-5 sm:p-6 rounded-xl shadow-lg mb-8">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              {t('sites.addNew')}
            </h3>
            <form onSubmit={handleCreateSite} className="flex flex-col gap-4">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('sites.siteName')}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
              />
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder={t('sites.address')}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
              />
              <div className="flex gap-2">
                <input
                  type="number"
                  step="any"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  placeholder={t('sites.latitude')}
                  className="border border-gray-300 rounded-lg px-4 py-2 w-1/2 focus:outline-none focus:border-blue-500"
                />
                <input
                  type="number"
                  step="any"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  placeholder={t('sites.longitude')}
                  className="border border-gray-300 rounded-lg px-4 py-2 w-1/2 focus:outline-none focus:border-blue-500"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition font-semibold disabled:opacity-60"
              >
                {loading ? t('sites.adding') : t('sites.add')}
              </button>
            </form>
          </div>
          {error && (
            <p className="text-red-500 text-sm mb-4 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
              {error}
            </p>
          )}
          {sites.length === 0 ? (
            <div className="bg-white rounded-xl border border-dashed border-gray-300 p-10 text-center text-gray-400">
              {t('sites.empty')}
            </div>
          ) : (
            sites.map((site) => (
              <SiteRow
                key={site.id}
                site={site}
                onSaved={refresh}
                onDelete={handleDeleteSite}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}
