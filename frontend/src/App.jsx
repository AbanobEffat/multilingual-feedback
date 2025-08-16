import React, { useEffect, useState } from 'react'
import FeedbackForm from './components/FeedbackForm'
import StatsDashboard from './components/StatsDashboard'
import PercentBreakdownChart from './components/PercentBreakdownChart'
import FilterBar from './components/FilterBar'
import FeedbackList from './components/FeedbackList'

export default function App(){
  const [refreshTick, setRefreshTick] = useState(0)
  const [filters, setFilters] = useState({})
  const handleSubmitted = () => setRefreshTick(t => t + 1)

  // SSE-only refresh
  useEffect(() => {
    const base = (import.meta.env.VITE_API_BASE || 'http://localhost:8000/api').replace(/\/+$/, '')
    const es = new EventSource(`${base}/stats/stream`)
    es.onmessage = () => setRefreshTick(t => t + 1)
    es.onerror = (e) => console.error('SSE error:', e) // keep SSE-only
    return () => es.close()
  }, [])

  return (
    <div style={{maxWidth: 900, margin: '24px auto', fontFamily: 'sans-serif'}}>
      <h1>Multilingual Customer Feedback</h1>
      <FeedbackForm onSubmitted={handleSubmitted} />

      <h3>Dashboard</h3>
      <StatsDashboard refreshTick={refreshTick} />
      <PercentBreakdownChart refreshTick={refreshTick} />

      <h3 style={{marginTop:24}}>Search & Filter</h3>
      <FilterBar onChange={setFilters} />
      <FeedbackList filters={filters} refreshTick={refreshTick} />
    </div>
  )
}
