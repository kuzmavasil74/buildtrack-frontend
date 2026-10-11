import React, { useEffect, useRef, useState } from 'react'
import { createRecord, getSites, getCrews, getWorkerDirectory } from '../api/api.js'
import { useTranslation } from 'react-i18next'
import Navbar from '../components/Navbar.jsx'
import RecordForm from '../components/RecordForm.jsx'

const Dashboard = () => {
  const { t } = useTranslation()
  const [sites, setSites] = useState([])
  const [crews, setCrews] = useState([])
  const [workerDirectory, setWorkerDirectory] = useState([])
  // Bumping the key remounts the form, which clears it after a successful save.
  const [formKey, setFormKey] = useState(0)
  const [saved, setSaved] = useState(false)
  const savedTimer = useRef(null)

  const refreshWorkerDirectory = () =>
    getWorkerDirectory().then((res) => setWorkerDirectory(res.data.workers))

  useEffect(() => {
    getSites().then((res) => setSites(res.data.sites))
    getCrews().then((res) => setCrews(res.data.crews))
    refreshWorkerDirectory()
  }, [])

  const handleSubmit = async (payload) => {
    await createRecord(payload)
    setFormKey((k) => k + 1)
    refreshWorkerDirectory()
    setSaved(true)
    clearTimeout(savedTimer.current)
    savedTimer.current = setTimeout(() => setSaved(false), 4000)
  }

  useEffect(() => () => clearTimeout(savedTimer.current), [])

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="py-6 sm:py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white p-5 sm:p-8 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold text-gray-700 mb-6">
              {t('dashboard.dailyRecord')}
            </h3>
            {saved && (
              <p
                role="status"
                className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-2 text-sm font-semibold text-green-700"
              >
                ✓ {t('dashboard.createSuccess')}
              </p>
            )}
            <RecordForm
              key={formKey}
              sites={sites}
              crews={crews}
              workerDirectory={workerDirectory}
              submitLabel={t('dashboard.submit')}
              submittingLabel={t('dashboard.submitting')}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
