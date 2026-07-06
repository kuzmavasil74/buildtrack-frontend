import React, { useState } from 'react'
import { createRecord } from '../api/api.js'
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
  const [siteId, setSiteId] = useState('')
  const [date, setDate] = useState('')
  const [workersPresent, setworkersPresent] = useState('')
  const [hoursWorked, sethoursWorked] = useState('')
  const [tasksCompleted, settasksCompleted] = useState('')
  const [materialsUsed, setmaterialsUsed] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      await createRecord(
        {
          siteId: Number(siteId),
          date,
          workersPresent: Number(workersPresent),
          hoursWorked: Number(hoursWorked),
          tasksCompleted: tasksCompleted.split(',').map((t) => t.trim()),
          materialsUsed: [{ name: materialsUsed, quantity: 1, unit: 'units' }],
        },
        token
      )
      setSiteId('')
      setDate('')
      setworkersPresent('')
      sethoursWorked('')
      settasksCompleted('')
      setmaterialsUsed('')
      alert('Record created successfully!')
    } catch (error) {
      setError(error.message)
    }
    setLoading(false)
  }
  const logout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }
  return (
    <div className="py-8 bg-gray-100 px-4 overflow-y-auto">
      <div className="max-w-lg mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            BuildTrack Dashboard
          </h2>
          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
          <button
            onClick={() => navigate('/records')}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
          >
            View Records
          </button>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold text-gray-700 mb-6">
            Daily Record
          </h3>
          <form onSubmit={submit} className="flex flex-col gap-4">
            <input
              type="text"
              value={siteId}
              onChange={(e) => setSiteId(e.target.value)}
              placeholder="Site ID"
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
            />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
            />
            <input
              type="number"
              value={workersPresent}
              onChange={(e) => setworkersPresent(e.target.value)}
              placeholder="Workers Present"
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
            />
            <input
              type="number"
              value={hoursWorked}
              onChange={(e) => sethoursWorked(e.target.value)}
              placeholder="Hours Worked"
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
            />
            <input
              type="text"
              value={tasksCompleted}
              onChange={(e) => settasksCompleted(e.target.value)}
              placeholder="Tasks Completed (comma separated)"
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
            />
            <input
              type="text"
              value={materialsUsed}
              onChange={(e) => setmaterialsUsed(e.target.value)}
              placeholder="Materials Used"
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition font-semibold"
            >
              Submit Record
            </button>
          </form>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          {loading && <p className="text-gray-500 text-sm mt-2">Loading...</p>}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
