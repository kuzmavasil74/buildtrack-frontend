import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export const login = async (email, password) => {
  return await axios.post(`${API_URL}/auth/login`, {
    email,
    password,
  })
}

export const register = async (email, password) => {
  return await axios.post(`${API_URL}/auth/register`, {
    email,
    password,
  })
}

export const createRecord = async (data, token) => {
  return await axios.post(`${API_URL}/records`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}
export const getRecords = async (token) => {
  return await axios.get(`${API_URL}/records`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}
export const downloadReport = async (token) => {
  return await axios.get(`${API_URL}/records/report`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    responseType: 'blob',
  })
}
export const getSites = async (token) => {
  return await axios.get(`${API_URL}/sites`, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export const createSite = async (data, token) => {
  return await axios.post(`${API_URL}/sites`, data, {
    headers: { Authorization: `Bearer ${token}` },
  })
}
export const deleteSite = async (id, token) => {
  return await axios.delete(`${API_URL}/sites/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
}
export const deleteRecord = async (id, token) => {
  return await axios.delete(`${API_URL}/records/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
}
