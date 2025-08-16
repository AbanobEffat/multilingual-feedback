import axios from 'axios'

// normalize base URL and ensure it's absolute (http://...)
// fallback is http://localhost:8000/api
const raw = import.meta.env.VITE_API_BASE || 'http://localhost:8000/api'
const baseURL = raw.replace(/\/+$/, '')

const API = axios.create({ baseURL, timeout: 15000 })

export const postFeedback = (payload) => API.post('/feedback/', payload)
export const getFeedback = (params) => API.get('/feedback/', { params })
export const getStats = () => API.get('/stats/overview')
export const getTrends = (params) => API.get('/stats/trends', { params })

export default API
