import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { getCrews, createCrew, updateCrew, deleteCrew } from '../api/api.js'
import Navbar from '../components/Navbar.jsx'

const CrewRow = ({ crew, onSaved, onDelete }) => {
  const { t } = useTranslation()
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(crew.name)
  const [members, setMembers] = useState(crew.members.join(', '))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleSave = async () => {
    setSaving(true)
    setError('')
    try {
      await updateCrew(crew.id, {
        name,
        members: members.split(',').map((m) => m.trim()).filter(Boolean),
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
      <div className="bg-white p-5 sm:p-6 rounded-xl shadow-lg mb-4 flex flex-col gap-3">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
        />
        <input
          type="text"
          value={members}
          onChange={(e) => setMembers(e.target.value)}
          placeholder={t('crews.members')}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
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
    <div className="bg-white p-5 sm:p-6 rounded-xl shadow-lg mb-4 flex justify-between items-start gap-3">
      <div className="min-w-0">
        <p className="font-semibold text-gray-800">{crew.name}</p>
        <p className="text-gray-500 text-sm mb-1">
          {t('crews.memberCount', { count: crew.members.length })}
        </p>
        {crew.members.length > 0 && (
          <p className="text-gray-400 text-xs">{crew.members.join(', ')}</p>
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
          onClick={() => onDelete(crew.id)}
          className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition text-sm"
        >
          {t('common.delete')}
        </button>
      </div>
    </div>
  )
}

export default function Crews() {
  const { t } = useTranslation()
  const [name, setName] = useState('')
  const [members, setMembers] = useState('')
  const [crews, setCrews] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const refresh = async () => {
    const res = await getCrews()
    setCrews(res.data.crews)
  }

  useEffect(() => {
    refresh()
  }, [])

  const handleCreateCrew = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await createCrew({
        name,
        members: members.split(',').map((m) => m.trim()).filter(Boolean),
      })
      setName('')
      setMembers('')
      await refresh()
    } catch (err) {
      setError(err.response?.data?.message || err.message)
    }
    setLoading(false)
  }

  const handleDeleteCrew = async (id) => {
    if (!window.confirm(t('crews.confirmDelete'))) return
    await deleteCrew(id)
    await refresh()
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="p-4 sm:p-8">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8">
            {t('crews.title')}
          </h2>
          <div className="bg-white p-5 sm:p-6 rounded-xl shadow-lg mb-8">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              {t('crews.addNew')}
            </h3>
            <form onSubmit={handleCreateCrew} className="flex flex-col gap-4">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('crews.crewName')}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
              />
              <input
                type="text"
                value={members}
                onChange={(e) => setMembers(e.target.value)}
                placeholder={t('crews.members')}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition font-semibold disabled:opacity-60"
              >
                {loading ? t('crews.adding') : t('crews.add')}
              </button>
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </form>
          </div>
          {crews.length === 0 ? (
            <div className="bg-white rounded-xl border border-dashed border-gray-300 p-10 text-center text-gray-400">
              {t('crews.empty')}
            </div>
          ) : (
            crews.map((crew) => (
              <CrewRow
                key={crew.id}
                crew={crew}
                onSaved={refresh}
                onDelete={handleDeleteCrew}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}
