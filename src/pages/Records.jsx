import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import {
  getRecords,
  downloadReport,
  getSites,
  deleteRecord,
} from '../api/api.js'

export default function Records() {
  const navigate = useNavigate()
  const [records, setRecords] = useState([])
  const [sites, setSites] = useState([])
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')
    getRecords(token).then((res) => setRecords(res.data.records))
    getSites(token).then((res) => setSites(res.data.sites))
  }, [])

  const getSiteName = (siteId) => {
    const site = sites.find((s) => s.id === Number(siteId))
    return site ? site.name : `Site #${siteId}`
  }
  const handleDownloadReport = async () => {
    const token = localStorage.getItem('token')
    const response = await downloadReport(token, { from, to })
    const url = window.URL.createObjectURL(
      new Blob([response.data], { type: 'application/pdf' })
    )
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'report.pdf')
    document.body.appendChild(link)
    link.click()
    link.remove()
  }
  const handleDeleteRecord = async (id) => {
    const token = localStorage.getItem('token')
    await deleteRecord(id, token)
    const res = await getRecords(token)
    setRecords(res.data.records)
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
          <div className="flex gap-2 items-center">
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
            <span className="text-gray-500">—</span>
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>
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
            <div className="flex justify-between items-start">
              <p className="text-gray-500 text-sm">
                {new Date(record.date).toLocaleDateString()}
              </p>
              <button
                onClick={() => handleDeleteRecord(record._id)}
                className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition text-sm"
              >
                Delete
              </button>
            </div>
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
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import {
  getRecords,
  downloadReport,
  getSites,
  deleteRecord,
} from '../api/api.js'

export default function Records() {
  const navigate = useNavigate()
  const [records, setRecords] = useState([])
  const [sites, setSites] = useState([])
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    getRecords(token).then((res) => setRecords(res.data.records))
    getSites(token).then((res) => setSites(res.data.sites))
  }, [])

  const getSiteName = (siteId) => {
    const site = sites.find((s) => s.id === Number(siteId))
    return site ? site.name : `Site #${siteId}`
  }

  const handleDownloadReport = async () => {
    setDownloading(true)
    try {
      const token = localStorage.getItem('token')
      const response = await downloadReport(token, { from, to })
      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: 'application/pdf' })
      )
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'report.pdf')
      document.body.appendChild(link)
      link.click()
      link.remove()
    } finally {
      setDownloading(false)
    }
  }

  const handleDeleteRecord = async (id) => {
    const token = localStorage.getItem('token')
    await deleteRecord(id, token)
    const res = await getRecords(token)
    setRecords(res.data.records)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#F0F2F5',
      padding: '32px 16px',
      fontFamily: "'Inter', 'Segoe UI', sans-serif"
    }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>

        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 28
        }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 700, color: '#111827', margin: 0 }}>
              Work Records
            </h1>
            <p style={{ fontSize: 13, color: '#6B7280', margin: '4px 0 0' }}>
              {records.length} record{records.length !== 1 ? 's' : ''} total
            </p>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              background: '#2563EB',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '10px 18px',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            + New Record
          </button>
        </div>

        {/* Report Download Panel */}
        <div style={{
          background: '#fff',
          borderRadius: 12,
          padding: '20px 24px',
          marginBottom: 24,
          boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
          border: '1px solid #E5E7EB'
        }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#374151', margin: '0 0 12px' }}>
            Download PDF Report
          </p>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <label style={{ fontSize: 12, color: '#6B7280', whiteSpace: 'nowrap' }}>From</label>
              <input
                type="date"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                style={{
                  border: '1px solid #D1D5DB',
                  borderRadius: 8,
                  padding: '8px 12px',
                  fontSize: 13,
                  color: '#111827',
                  outline: 'none',
                  background: '#F9FAFB'
                }}
              />
            </div>
            <span style={{ color: '#9CA3AF', fontSize: 16 }}>→</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <label style={{ fontSize: 12, color: '#6B7280', whiteSpace: 'nowrap' }}>To</label>
              <input
                type="date"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                style={{
                  border: '1px solid #D1D5DB',
                  borderRadius: 8,
                  padding: '8px 12px',
                  fontSize: 13,
                  color: '#111827',
                  outline: 'none',
                  background: '#F9FAFB'
                }}
              />
            </div>
            <button
              onClick={handleDownloadReport}
              disabled={downloading}
              style={{
                background: downloading ? '#9CA3AF' : '#16A34A',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                padding: '9px 18px',
                fontSize: 13,
                fontWeight: 600,
                cursor: downloading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                marginLeft: 'auto'
              }}
            >
              {downloading ? '⏳ Generating...' : '⬇ Download PDF'}
            </button>
          </div>
          {(!from && !to) && (
            <p style={{ fontSize: 12, color: '#9CA3AF', margin: '10px 0 0' }}>
              No dates selected — all records will be included
            </p>
          )}
        </div>

        {/* Records List */}
        {records.length === 0 ? (
          <div style={{
            background: '#fff',
            borderRadius: 12,
            padding: '48px 24px',
            textAlign: 'center',
            border: '1px dashed #D1D5DB'
          }}>
            <p style={{ fontSize: 32, margin: '0 0 8px' }}>📋</p>
            <p style={{ color: '#6B7280', fontSize: 15 }}>No records yet</p>
            <p style={{ color: '#9CA3AF', fontSize: 13 }}>Create your first work record to get started</p>
          </div>
        ) : (
          records.map((record) => (
            <div
              key={record._id}
              style={{
                background: '#fff',
                borderRadius: 12,
                padding: '20px 24px',
                marginBottom: 12,
                boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                border: '1px solid #E5E7EB',
              }}
            >
              {/* Record Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <p style={{ fontSize: 15, fontWeight: 700, color: '#111827', margin: 0 }}>
                    {getSiteName(record.siteId)}
                  </p>
                  <p style={{ fontSize: 12, color: '#6B7280', margin: '3px 0 0' }}>
                    {new Date(record.date).toLocaleDateString('uk-UA', {
                      day: '2-digit', month: 'long', year: 'numeric'
                    })}
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteRecord(record._id)}
                  style={{
                    background: 'transparent',
                    color: '#EF4444',
                    border: '1px solid #FCA5A5',
                    borderRadius: 7,
                    padding: '5px 12px',
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Delete
                </button>
              </div>

              {/* Stats Row */}
              <div style={{
                display: 'flex',
                gap: 12,
                marginBottom: 12,
                flexWrap: 'wrap'
              }}>
                <div style={{
                  background: '#EFF6FF',
                  borderRadius: 8,
                  padding: '6px 14px',
                  fontSize: 13,
                  color: '#1D4ED8',
                  fontWeight: 600
                }}>
                  👷 {record.workersPresent} workers
                </div>
                <div style={{
                  background: '#F0FDF4',
                  borderRadius: 8,
                  padding: '6px 14px',
                  fontSize: 13,
                  color: '#15803D',
                  fontWeight: 600
                }}>
                  ⏱ {record.hoursWorked} hours
                </div>
              </div>

              {/* Tasks */}
              {record.tasksCompleted.length > 0 && (
                <div style={{ marginBottom: 8 }}>
                  <p style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 4px' }}>
                    Tasks
                  </p>
                  <p style={{ fontSize: 13, color: '#374151', margin: 0 }}>
                    {record.tasksCompleted.join(', ')}
                  </p>
                </div>
              )}

              {/* Materials */}
              {record.materialsUsed.length > 0 && (
                <div>
                  <p style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 4px' }}>
                    Materials
                  </p>
                  <p style={{ fontSize: 13, color: '#374151', margin: 0 }}>
                    {record.materialsUsed.map((m) => `${m.name} (${m.quantity} ${m.unit})`).join(', ')}
                  </p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
