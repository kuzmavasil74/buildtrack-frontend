import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getMe } from '../api/api.js'
import { MeContext, isOwner } from '../context/me.js'

const ProtectedRoute = ({ children, ownerOnly = false, adminOnly = false }) => {
  const { t } = useTranslation()
  const [status, setStatus] = useState('checking')
  const [me, setMe] = useState(null)

  useEffect(() => {
    let cancelled = false
    getMe()
      .then((res) => {
        if (cancelled) return
        setMe(res.data)
        setStatus('authorized')
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
  if ((ownerOnly && !isOwner(me)) || (adminOnly && !me?.isAdmin)) {
    return <Navigate to="/home" replace />
  }
  return <MeContext.Provider value={me}>{children}</MeContext.Provider>
}

export default ProtectedRoute
