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
