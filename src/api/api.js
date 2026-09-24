import axios from 'axios'

// In production the API is reached through Vercel's same-origin /api rewrite so the
// auth cookie is first-party; iOS Safari drops cross-site (vercel.app -> onrender.com) cookies.
const API_URL = import.meta.env.PROD
  ? '/api'
  : import.meta.env.VITE_API_URL || 'http://localhost:4000'

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
})

export const login = async (email, password) => {
  return await api.post('/auth/login', { email, password })
}

export const register = async (email, password) => {
  return await api.post('/auth/register', { email, password })
}

export const forgotPassword = async (email) => {
  return await api.post('/auth/forgot-password', { email })
}

export const resetPassword = async (token, password) => {
  return await api.post('/auth/reset-password', { token, password })
}

export const logout = async () => {
  return await api.post('/auth/logout')
}

export const getMe = async () => {
  return await api.get('/auth/me')
}

export const createRecord = async (data) => {
  return await api.post('/records', data)
}
export const getRecords = async (siteId) => {
  return await api.get('/records', { params: siteId ? { siteId } : {} })
}
export const updateRecord = async (id, data) => {
  return await api.put(`/records/${id}`, data)
}
export const downloadReport = async ({ from, to, lang } = {}) => {
  const params = {}
  if (from) params.from = from
  if (to) params.to = to
  if (lang) params.lang = lang

  return await api.get('/records/report', {
    params,
    responseType: 'blob',
  })
}
export const downloadCsv = async ({ from, to } = {}) => {
  const params = {}
  if (from) params.from = from
  if (to) params.to = to

  return await api.get('/records/export.csv', {
    params,
    responseType: 'blob',
  })
}
export const getSites = async () => {
  return await api.get('/sites')
}

export const createSite = async (data) => {
  return await api.post('/sites', data)
}
export const updateSite = async (id, data) => {
  return await api.put(`/sites/${id}`, data)
}
export const deleteSite = async (id) => {
  return await api.delete(`/sites/${id}`)
}
export const getCrews = async () => {
  return await api.get('/crews')
}
export const createCrew = async (data) => {
  return await api.post('/crews', data)
}
export const updateCrew = async (id, data) => {
  return await api.put(`/crews/${id}`, data)
}
export const deleteCrew = async (id) => {
  return await api.delete(`/crews/${id}`)
}
export const deleteRecord = async (id) => {
  return await api.delete(`/records/${id}`)
}
export const uploadReceipt = async (formData) => {
  return await api.post('/receipts/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}
export const getReceipts = async (siteId) => {
  const url = siteId ? `/receipts?siteId=${siteId}` : '/receipts'
  return await api.get(url)
}
export const getMonthlyStats = async () => {
  return await api.get('/records/monthly-stats')
}
export const getPayroll = async ({ from, to } = {}) => {
  const params = {}
  if (from) params.from = from
  if (to) params.to = to
  return await api.get('/records/payroll', { params })
}
export const downloadPayrollCsv = async ({ from, to } = {}) => {
  const params = {}
  if (from) params.from = from
  if (to) params.to = to
  return await api.get('/records/payroll.csv', { params, responseType: 'blob' })
}
