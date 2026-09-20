import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

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

export const logout = async () => {
  return await api.post('/auth/logout')
}

export const getMe = async () => {
  return await api.get('/auth/me')
}

export const createRecord = async (data) => {
  return await api.post('/records', data)
}
export const getRecords = async () => {
  return await api.get('/records')
}
export const downloadReport = async ({ from, to } = {}) => {
  const params = {}
  if (from) params.from = from
  if (to) params.to = to

  return await api.get('/records/report', {
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
export const deleteSite = async (id) => {
  return await api.delete(`/sites/${id}`)
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
