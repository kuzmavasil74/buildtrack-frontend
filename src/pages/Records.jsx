import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getRecords, downloadReport, getSites } from '../api/api.js'

export default function Records() {
  const navigate = useNavigate()
  const [records, setRecords] = useState([])
  const [sites, setSites] = useState([])

  useEffect(() => {
    const token = localStorage.getItem('token')
    getRecords(token).then((res) => setRecords(res.data.records))
    getSites(token).then((res) => setSites(res.data.sites))
  }, [])
  const getSiteName = (siteId) => {
    const site = sites.find((s) => s.id === siteId)
    return site ? site.name : `Site #${siteId}`
  }
  const handleDownloadReport = async () => {
    const token = localStorage.getItem('token')
    const response = await downloadReport(token)
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'report.pdf')
    document.body.appendChild(link)
    link.click()
    link.remove()
  }
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Records</h2>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            New Record
          </button>
          <button
            onClick={handleDownloadReport}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
          >
            Download Report
          </button>
        </div>
        {records.map((record) => (
          <div
            key={record._id}
            className="bg-white p-6 rounded-xl shadow-lg mb-4"
          >
            <p className="text-gray-500 text-sm">
              {new Date(record.date).toLocaleDateString()}
            </p>
            <p className="font-semibold mt-1">{getSiteName(record.siteId)}</p>
            <p>
              Workers: {record.workersPresent} | Hours: {record.hoursWorked}
            </p>
            <p className="text-gray-600 text-sm mt-1">
              Tasks: {record.tasksCompleted.join(', ')}
            </p>
            <p className="text-gray-600 text-sm mt-1">
              Materials:{' '}
              {record.materialsUsed
                .map((m) => `${m.name} (${m.quantity} ${m.unit})`)
                .join(', ')}
            </p>
          </div>
        ))}
        {records.length === 0 && (
          <p className="text-gray-500 text-center">No records yet</p>
        )}
      </div>
    </div>
  )
}
