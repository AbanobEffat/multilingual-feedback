import axios from 'axios'

const raw = import.meta.env.VITE_API_BASE || 'http://localhost:8000/api'
const API = axios.create({ baseURL: raw.replace(/\/+$/, ''), timeout: 15000 })

API.interceptors.request.use((config) => {
  const token = (localStorage.getItem('adminToken') || '').trim()
  if (token) {
    config.headers['X-Admin-Token'] = token
    console.log('[API] attach admin token header ✓', { baseURL: config.baseURL })
  } else {
    console.log('[API] no admin token in localStorage')
  }
  return config
})

export const postFeedback = (payload) => API.post('/feedback/', payload)
export const getFeedback = (params) => API.get('/feedback/', { params })  // ← supports filters
export const getStats = () => API.get('/stats/overview')
export const getTrends = (params) => API.get('/stats/trends', { params })
export default API
