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
    <div>
      <h2>Dashboard</h2>
      <form onSubmit={submit}>
        <input
          type="text"
          value={siteId}
          onChange={(e) => setSiteId(e.target.value)}
          placeholder="Site ID"
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          placeholder="Date"
        />
        <input
          type="number"
          value={workersPresent}
          onChange={(e) => setworkersPresent(e.target.value)}
          placeholder="Workers Present"
        />
        <input
          type="number"
          value={hoursWorked}
          onChange={(e) => sethoursWorked(e.target.value)}
          placeholder="Hours Worked"
        />
        <input
          type="text"
          value={tasksCompleted}
          onChange={(e) => settasksCompleted(e.target.value)}
          placeholder="Tasks Completed"
        />
        <input
          type="text"
          value={materialsUsed}
          onChange={(e) => setmaterialsUsed(e.target.value)}
          placeholder="Materials Used"
        />
        <button type="submit">Submit</button>
      </form>
      <button onClick={logout}>Logout</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {loading && <p>Loading...</p>}
    </div>
  )
}

export default Dashboard
