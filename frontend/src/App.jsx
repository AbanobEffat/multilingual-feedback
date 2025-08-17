import React, { useEffect, useState } from 'react'
import FeedbackForm from './components/FeedbackForm'
import StatsDashboard from './components/StatsDashboard'
import PercentBreakdownChart from './components/PercentBreakdownChart'
import FeedbackList from './components/FeedbackList'
import FilterBar from './components/FilterBar'
import AdminBar from './components/AdminBar'

export default function App(){
  const [refreshTick, setRefreshTick] = useState(0)
  const [filters, setFilters] = useState({})
  const [isAdmin, setIsAdmin] = useState(!!localStorage.getItem('adminToken'))

  const handleSubmitted = () => setRefreshTick(t => t + 1)

  useEffect(() => {
    const base = (import.meta.env.VITE_API_BASE || 'http://localhost:8000/api').replace(/\/+$/, '')
    const es = new EventSource(`${base}/stats/stream`)
    es.onmessage = () => setRefreshTick(t => t + 1)
    es.onerror = (e) => console.error('SSE error:', e)
    return () => es.close()
  }, [])

  return (
    <div style={{maxWidth: 900, margin: '24px auto', fontFamily: 'sans-serif'}}>
      <h1>Multilingual Customer Feedback</h1>

      <AdminBar onStatus={setIsAdmin} />

      <FeedbackForm onSubmitted={handleSubmitted} />

      <h3>Dashboard</h3>
      <StatsDashboard refreshTick={refreshTick} />
      <PercentBreakdownChart refreshTick={refreshTick} />
      
      {isAdmin && (
        <>
          <h3 style={{marginTop:24}}>Search & Filter (Admin)</h3>
          <FilterBar onChange={setFilters} />
          <FeedbackList filters={filters} refreshTick={refreshTick} />
        </>
      )}
      {!isAdmin && (
        <div style={{opacity:.75, marginTop:12}}>
          🔒 Log in as admin (enter token above) to access search & filter.
        </div>
      )}
    </div>
  )
}
