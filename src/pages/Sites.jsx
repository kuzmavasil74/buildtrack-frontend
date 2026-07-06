import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getSites, createSite, deleteSite } from '../api/api.js'

export default function Sites() {
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const navigate = useNavigate()
  const [sites, setSites] = useState([])

  useEffect(() => {
    const token = localStorage.getItem('token')
    getSites(token).then((res) => setSites(res.data.sites))
  }, [])
  const handleCreateSite = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('token')
    await createSite({ name, address }, token)
    setName('')
    setAddress('')
    const res = await getSites(token)
    setSites(res.data.sites)
  }
  const handleDeleteSite = async (id) => {
    const token = localStorage.getItem('token')
    await deleteSite(id, token)
    const res = await getSites(token)
    setSites(res.data.sites)
  }
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Sites</h2>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            New Record
          </button>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
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
              className="bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition font-semibold"
            >
              Add Site
            </button>
          </form>
        </div>
        {sites.map((site) => (
          <div
            key={site.id}
            className="bg-white p-6 rounded-xl shadow-lg mb-4 flex justify-between items-center"
          >
            <div>
              <p className="font-semibold text-gray-800">{site.name}</p>
              <p className="text-gray-500 text-sm">{site.address}</p>
            </div>
            <button
              onClick={() => handleDeleteSite(site.id)}
              className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition text-sm"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
