import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getSites, uploadReceipt } from '../api/api.js'

export default function Receipts() {
  const navigate = useNavigate()
  const [sites, setSites] = useState([])
  const [siteId, setSiteId] = useState('')
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    getSites(token).then((res) => setSites(res.data.sites))
  }, [])

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!file || !siteId) return
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const formData = new FormData()
      formData.append('receipt', file)
      formData.append('siteId', siteId)

      await uploadReceipt(formData, token)

      setSuccess(true)
      setFile(null)
    } catch (error) {
      console.error(error)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Receipts</h2>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Dashboard
          </button>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <form onSubmit={handleUpload} className="flex flex-col gap-4">
            <select
              value={siteId}
              onChange={(e) => setSiteId(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
            >
              <option value="">Select Site</option>
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
              className="border border-gray-300 rounded-lg px-4 py-2"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition font-semibold"
            >
              {loading ? 'Uploading...' : 'Upload Receipt'}
            </button>
          </form>
          {success && (
            <p className="text-green-500 text-sm mt-2">
              Receipt uploaded successfully!
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
