import React, { useEffect, useState } from 'react'
import { getStats } from '../api/feedback'

export default function StatsDashboard(){
  const [stats, setStats] = useState(null)
  const [error, setError] = useState(null)

  useEffect(()=>{
    getStats()
      .then(r=>setStats(r.data))
      .catch(e=>setError(e?.message || 'Failed to load stats'))
  }, [])

  if (error) return <div style={{color:'crimson'}}>Stats error: {error}</div>
  if (!stats) return <div>Loading stats…</div>

  return (
    <div style={{marginBottom: 12}}>
      <h3>Overview</h3>
      <ul>
        <li>Total: {stats.total}</li>
        <li>Positive: {stats.positive}</li>
        <li>Neutral: {stats.neutral}</li>
        <li>Negative: {stats.negative}</li>
      </ul>
    </div>
  )
}
