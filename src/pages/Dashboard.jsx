import React, { useState } from 'react'
import { createRecord } from '../api/api.js'
import { useNavigate } from 'react-router-dom'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

const Dashboard = () => {
  const [siteId, setSiteId] = useState('')
  const [date, setDate] = useState(new Date())
  const [workersPresent, setworkersPresent] = useState('')
  const [hoursWorked, sethoursWorked] = useState('')
  const [tasksCompleted, settasksCompleted] = useState('')
  const [materials, setMaterials] = useState([])
  const [materialName, setMaterialName] = useState('')
  const [materialQty, setMaterialQty] = useState('')
  const [materialUnit, setMaterialUnit] = useState('')
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
          date: date.toISOString(),
          workersPresent: Number(workersPresent),
          hoursWorked: Number(hoursWorked),
          tasksCompleted: tasksCompleted.split(',').map((t) => t.trim()),
          materialsUsed: materials,
        },
        token
      )
      setSiteId('')
      setDate(new Date())
      setworkersPresent('')
      sethoursWorked('')
      settasksCompleted('')
      setMaterials([])
      alert('Record created successfully!')
    } catch (error) {
      setError(error.message)
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
              placeholder="Construction Site Number (e.g. 1, 2, 3)"
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
            />
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
            <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
              <p className="text-sm font-semibold text-gray-600 mb-3">
                Materials Used
              </p>
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  value={materialName}
                  onChange={(e) => setMaterialName(e.target.value)}
                  placeholder="Material Name (e.g. cement)"
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 bg-white"
                />
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={materialQty}
                    onChange={(e) => setMaterialQty(e.target.value)}
                    placeholder="Quantity"
                    className="border border-gray-300 rounded-lg px-4 py-2 w-1/2 focus:outline-none focus:border-blue-500 bg-white"
                  />
                  <input
                    type="text"
                    value={materialUnit}
                    onChange={(e) => setMaterialUnit(e.target.value)}
                    placeholder="Unit (kg, bags, pcs)"
                    className="border border-gray-300 rounded-lg px-4 py-2 w-1/2 focus:outline-none focus:border-blue-500 bg-white"
                  />
                </div>
                <button
                  type="button"
                  onClick={addMaterial}
                  className="bg-gray-700 text-white py-2 rounded-lg hover:bg-gray-800 transition text-sm font-semibold"
                >
                  + Add Material
                </button>
                {materials.length > 0 && (
                  <div className="mt-1 flex flex-col gap-1">
                    {materials.map((m, i) => (
                      <p
                        key={i}
                        className="text-sm text-gray-600 bg-white border border-gray-200 rounded-lg px-3 py-1"
                      >
                        {m.name} — {m.quantity} {m.unit}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>
            {materials.map((m, i) => (
              <p key={i} className="text-sm text-gray-600">
                {m.name} — {m.quantity} {m.unit}
              </p>
            ))}
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
