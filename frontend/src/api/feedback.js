import axios from 'axios'

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:8000/api',
  timeout: 10000,
})

export const postFeedback = (payload) => API.post('/feedback/', payload)
export const getFeedback = (params) => API.get('/feedback/', { params })
export const getStats = () => API.get('/stats/overview')
export const getTrends = (params) => API.get('/stats/trends', { params })

// helpful debug:
API.interceptors.response.use(
  (r) => r,
  (err) => {
    console.error('API Error:', err?.response?.status, err?.response?.data || err?.message)
    return Promise.reject(err)
  }
)

export default API
