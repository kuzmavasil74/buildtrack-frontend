import React, { useEffect, useState } from 'react'
import { createRecord, getSites, getCrews } from '../api/api.js'
import { useTranslation } from 'react-i18next'
import Navbar from '../components/Navbar.jsx'
import RecordForm from '../components/RecordForm.jsx'

const Dashboard = () => {
  const { t } = useTranslation()
  const [sites, setSites] = useState([])
  const [crews, setCrews] = useState([])
  // Bumping the key remounts the form, which clears it after a successful save.
  const [formKey, setFormKey] = useState(0)

  useEffect(() => {
    getSites().then((res) => setSites(res.data.sites))
    getCrews().then((res) => setCrews(res.data.crews))
  }, [])

  const handleSubmit = async (payload) => {
    await createRecord(payload)
    setFormKey((k) => k + 1)
    alert(t('dashboard.createSuccess'))
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="py-6 sm:py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white p-5 sm:p-8 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold text-gray-700 mb-6">
              {t('dashboard.dailyRecord')}
            </h3>
            <RecordForm
              key={formKey}
              sites={sites}
              crews={crews}
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
