import axios from 'axios'

const API = axios.create({ baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:8000/api' })

export const postFeedback = (payload) => API.post('/feedback/', payload)
export const getFeedback = (params) => API.get('/feedback/', { params })
export const getStats = () => API.get('/stats/overview')
