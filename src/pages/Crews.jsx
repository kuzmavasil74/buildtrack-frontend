import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import QRCode from 'qrcode'
import { getCrews, createCrew, updateCrew, deleteCrew } from '../api/api.js'
import Navbar from '../components/Navbar.jsx'

const parseNames = (text) =>
  text.split(',').map((m) => m.trim()).filter(Boolean)

const MemberRateFields = ({ members, rates, setRates, t }) => {
  const names = parseNames(members)
  if (names.length === 0) return null
  return (
    <div className="border border-gray-200 rounded-xl p-3 bg-gray-50 flex flex-col gap-2">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
        {t('crews.hourlyRate')}
      </p>
      {names.map((name) => (
        <div key={name} className="flex items-center gap-2">
          <span className="text-sm text-gray-700 flex-1 truncate">{name}</span>
          <input
            type="number"
            min="0"
            step="any"
            value={rates[name] ?? ''}
            onChange={(e) => setRates({ ...rates, [name]: e.target.value })}
            placeholder="0"
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm w-28 bg-white focus:outline-none focus:border-blue-500"
          />
        </div>
      ))}
    </div>
  )
}

const QrModal = ({ crew, onClose, t }) => {
  const [dataUrl, setDataUrl] = useState(null)

  useEffect(() => {
    let cancelled = false
    QRCode.toDataURL(`sanjo-crew:${crew.id}`, {
      width: 280,
      margin: 1,
      color: { dark: '#001659', light: '#FFFFFF' },
    }).then((url) => {
      if (!cancelled) setDataUrl(url)
    })
    return () => {
      cancelled = true
    }
  }, [crew.id])

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl p-6 max-w-xs w-full text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="font-semibold text-gray-800 mb-4">{crew.name}</p>
        {dataUrl ? (
          <img src={dataUrl} alt={`QR ${crew.name}`} className="mx-auto rounded-lg" />
        ) : (
          <div className="h-[280px] flex items-center justify-center text-gray-400 text-sm">
            {t('common.loading')}
          </div>
        )}
        <button
          onClick={onClose}
          className="mt-4 w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition text-sm font-semibold"
        >
          {t('common.cancel')}
        </button>
      </div>
    </div>
  )
}

const CrewRow = ({ crew, onSaved, onDelete, onShowQr }) => {
  const { t } = useTranslation()
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(crew.name)
  const [members, setMembers] = useState(crew.members.join(', '))
  const [rates, setRates] = useState(crew.member_rates || {})
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleSave = async () => {
    setSaving(true)
    setError('')
    try {
      await updateCrew(crew.id, {
        name,
        members: parseNames(members),
        memberRates: rates,
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
        <MemberRateFields members={members} rates={rates} setRates={setRates} t={t} />
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
          <p className="text-gray-400 text-xs">
            {crew.members
              .map((m) => {
                const rate = Number(crew.member_rates?.[m]) || 0
                return rate > 0 ? `${m} (${rate}/${t('crews.perHour')})` : m
              })
              .join(', ')}
          </p>
        )}
      </div>
      <div className="shrink-0 flex flex-col gap-2 items-end">
        <button
          onClick={() => onShowQr(crew)}
          className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-lg hover:bg-indigo-100 transition text-sm"
        >
          {t('crews.qrCode')}
        </button>
        <div className="flex gap-2">
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
    </div>
  )
}

export default function Crews() {
  const { t } = useTranslation()
  const [name, setName] = useState('')
  const [members, setMembers] = useState('')
  const [rates, setRates] = useState({})
  const [crews, setCrews] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [qrCrew, setQrCrew] = useState(null)

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
        members: parseNames(members),
        memberRates: rates,
      })
      setName('')
      setMembers('')
      setRates({})
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
              <MemberRateFields members={members} rates={rates} setRates={setRates} t={t} />
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
                onShowQr={setQrCrew}
              />
            ))
          )}
        </div>
      </div>
      {qrCrew && <QrModal crew={qrCrew} onClose={() => setQrCrew(null)} t={t} />}
    </div>
  )
}
