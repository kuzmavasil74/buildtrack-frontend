import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getMe } from '../api/api.js'

const ProtectedRoute = ({ children }) => {
  const { t } = useTranslation()
  const [status, setStatus] = useState('checking')

  useEffect(() => {
    let cancelled = false
    getMe()
      .then(() => {
        if (!cancelled) setStatus('authorized')
      })
      .catch(() => {
        if (!cancelled) setStatus('unauthorized')
      })
    return () => {
      cancelled = true
    }
  }, [])

  if (status === 'checking') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-500 text-sm">{t('common.loading')}</p>
      </div>
    )
  }
  if (status === 'unauthorized') {
    return <Navigate to="/login" replace />
  }
  return children
}

export default ProtectedRoute
