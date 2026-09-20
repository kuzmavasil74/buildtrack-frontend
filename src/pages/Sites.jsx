import React, { useState, useEffect } from 'react'
import { getSites, createSite, deleteSite } from '../api/api.js'
import Navbar from '../components/Navbar.jsx'

export default function Sites() {
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [sites, setSites] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getSites().then((res) => setSites(res.data.sites))
  }, [])
  const handleCreateSite = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await createSite({ name, address })
      setName('')
      setAddress('')
      const res = await getSites()
      setSites(res.data.sites)
    } catch (err) {
      setError(err.response?.data?.message || err.message)
    }
    setLoading(false)
  }
  const handleDeleteSite = async (id) => {
    if (!window.confirm('Delete this site? This cannot be undone.')) return
    await deleteSite(id)
    const res = await getSites()
    setSites(res.data.sites)
  }
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="p-4 sm:p-8">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8">
            Sites
          </h2>
          <div className="bg-white p-5 sm:p-6 rounded-xl shadow-lg mb-8">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Add New Site
            </h3>
            <form onSubmit={handleCreateSite} className="flex flex-col gap-4">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Site Name"
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
              />
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Address"
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition font-semibold disabled:opacity-60"
              >
                {loading ? 'Adding...' : 'Add Site'}
              </button>
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </form>
          </div>
          {sites.length === 0 ? (
            <div className="bg-white rounded-xl border border-dashed border-gray-300 p-10 text-center text-gray-400">
              No sites yet — add your first construction site above
            </div>
          ) : (
            sites.map((site) => (
              <div
                key={site.id}
                className="bg-white p-5 sm:p-6 rounded-xl shadow-lg mb-4 flex justify-between items-center gap-3"
              >
                <div className="min-w-0">
                  <p className="font-semibold text-gray-800 truncate">{site.name}</p>
                  <p className="text-gray-500 text-sm truncate">{site.address}</p>
                </div>
                <button
                  onClick={() => handleDeleteSite(site.id)}
                  className="shrink-0 bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition text-sm"
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
