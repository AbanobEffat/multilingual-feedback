import { useEffect, useState } from 'react'
import { getStats } from '../api/feedback'

export default function StatsDashboard(){
  const [stats, setStats] = useState(null)
  useEffect(()=>{ getStats().then(r=>setStats(r.data)).catch(()=>{}) }, [])
  if(!stats) return <div>Loading...</div>
  return <div>
    <h3>Overview</h3>
    <ul>
      <li>Total: {stats.total}</li>
      <li>Positive: {stats.positive}</li>
      <li>Neutral: {stats.neutral}</li>
      <li>Negative: {stats.negative}</li>
    </ul>
  </div>
}
