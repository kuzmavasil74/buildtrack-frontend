import React, { useEffect, useState } from 'react'
import { createRecord, getSites, getCrews } from '../api/api.js'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { useTranslation } from 'react-i18next'
import Navbar from '../components/Navbar.jsx'
import QrScanner from '../components/QrScanner.jsx'

const Dashboard = () => {
  const { t } = useTranslation()
  const [siteId, setSiteId] = useState('')
  const [crewId, setCrewId] = useState('')
  const [crews, setCrews] = useState([])
  const [date, setDate] = useState(new Date())
  const [workersPresent, setworkersPresent] = useState('')
  const [hoursWorked, sethoursWorked] = useState('')
  const [tasksCompleted, settasksCompleted] = useState('')
  const [materials, setMaterials] = useState([])
  const [materialName, setMaterialName] = useState('')
  const [materialQty, setMaterialQty] = useState('')
  const [materialUnit, setMaterialUnit] = useState('')
  const [sites, setSites] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [scanning, setScanning] = useState(false)
  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await createRecord({
        siteId: Number(siteId),
        crewId: crewId ? Number(crewId) : undefined,
        date: date.toISOString(),
        workersPresent: Number(workersPresent),
        hoursWorked: Number(hoursWorked),
        tasksCompleted: tasksCompleted.split(',').map((t) => t.trim()),
        materialsUsed: materials,
      })
      setSiteId('')
      setCrewId('')
      setDate(new Date())
      setworkersPresent('')
      sethoursWorked('')
      settasksCompleted('')
      setMaterials([])
      alert(t('dashboard.createSuccess'))
    } catch (error) {
      setError(error.response?.data?.message || error.message)
    }
    setLoading(false)
  }
  const addMaterial = () => {
    if (!materialName) return
    setMaterials([
      ...materials,
      {
        name: materialName,
        quantity: Number(materialQty),
        unit: materialUnit,
      },
    ])
    setMaterialName('')
    setMaterialQty('')
    setMaterialUnit('')
  }
  const removeMaterial = (index) => {
    setMaterials(materials.filter((_, i) => i !== index))
  }
  const handleCrewChange = (value) => {
    setCrewId(value)
    const crew = crews.find((c) => String(c.id) === value)
    if (crew) setworkersPresent(String(crew.members.length))
  }
  const handleQrScan = (data) => {
    setScanning(false)
    const match = /^sanjo-crew:(\d+)$/.exec(data || '')
    const id = match?.[1]
    const crew = id && crews.find((c) => String(c.id) === id)
    if (crew) {
      handleCrewChange(id)
      setError('')
    } else {
      setError(t('dashboard.invalidQr'))
    }
  }
  useEffect(() => {
    getSites().then((res) => setSites(res.data.sites))
    getCrews().then((res) => setCrews(res.data.crews))
  }, [])
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="py-6 sm:py-8 px-4">
        <div className="max-w-lg mx-auto">
          <div className="bg-white p-5 sm:p-8 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold text-gray-700 mb-6">
              {t('dashboard.dailyRecord')}
            </h3>
            <form onSubmit={submit} className="flex flex-col gap-4">
              <select
                value={siteId}
                onChange={(e) => setSiteId(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
              >
                <option value="">{t('dashboard.selectSite')}</option>
                {sites.map((site) => (
                  <option key={site.id} value={site.id}>
                    {site.name}
                  </option>
                ))}
              </select>
              <div className="flex gap-2">
                <select
                  value={crewId}
                  onChange={(e) => handleCrewChange(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2 flex-1 min-w-0 focus:outline-none focus:border-blue-500"
                >
                  <option value="">{t('dashboard.selectCrew')}</option>
                  {crews.map((crew) => (
                    <option key={crew.id} value={crew.id}>
                      {crew.name} ({crew.members.length})
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setScanning(true)}
                  className="shrink-0 bg-gray-700 text-white px-3 rounded-lg hover:bg-gray-800 transition text-sm font-semibold"
                >
                  {t('dashboard.scanQr')}
                </button>
              </div>
              <DatePicker
                selected={date}
                onChange={(date) => setDate(date)}
                dateFormat="dd/MM/yyyy"
                className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:border-blue-500"
                value={date}
              />
              <input
                type="number"
                value={workersPresent}
                onChange={(e) => setworkersPresent(e.target.value)}
                placeholder={t('dashboard.workersPresent')}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
              />
              <input
                type="number"
                value={hoursWorked}
                onChange={(e) => sethoursWorked(e.target.value)}
                placeholder={t('dashboard.hoursWorked')}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
              />
              <input
                type="text"
                value={tasksCompleted}
                onChange={(e) => settasksCompleted(e.target.value)}
                placeholder={t('dashboard.tasksCompleted')}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
              />
              <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                <p className="text-sm font-semibold text-gray-600 mb-3">
                  {t('dashboard.materialsUsed')}
                </p>
                <div className="flex flex-col gap-2">
                  <input
                    type="text"
                    value={materialName}
                    onChange={(e) => setMaterialName(e.target.value)}
                    placeholder={t('dashboard.materialName')}
                    className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 bg-white"
                  />
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={materialQty}
                      onChange={(e) => setMaterialQty(e.target.value)}
                      placeholder={t('dashboard.quantity')}
                      className="border border-gray-300 rounded-lg px-4 py-2 w-1/2 focus:outline-none focus:border-blue-500 bg-white"
                    />
                    <input
                      type="text"
                      value={materialUnit}
                      onChange={(e) => setMaterialUnit(e.target.value)}
                      placeholder={t('dashboard.unit')}
                      className="border border-gray-300 rounded-lg px-4 py-2 w-1/2 focus:outline-none focus:border-blue-500 bg-white"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={addMaterial}
                    className="bg-gray-700 text-white py-2 rounded-lg hover:bg-gray-800 transition text-sm font-semibold"
                  >
                    {t('dashboard.addMaterial')}
                  </button>
                  {materials.length > 0 && (
                    <div className="mt-1 flex flex-col gap-1">
                      {materials.map((m, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between text-sm text-gray-600 bg-white border border-gray-200 rounded-lg px-3 py-1"
                        >
                          <span>
                            {m.name} — {m.quantity} {m.unit}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeMaterial(i)}
                            aria-label={t('dashboard.removeMaterial', { name: m.name })}
                            className="text-gray-400 hover:text-red-500 px-2"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition font-semibold disabled:opacity-60"
              >
                {loading ? t('dashboard.submitting') : t('dashboard.submit')}
              </button>
            </form>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>
        </div>
      </div>
      {scanning && (
        <QrScanner onScan={handleQrScan} onClose={() => setScanning(false)} />
      )}
    </div>
  )
}

export default Dashboard
