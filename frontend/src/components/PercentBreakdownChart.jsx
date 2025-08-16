// frontend/src/components/PercentBreakdownChart.jsx
import { useEffect, useState } from 'react'
import { getStats } from '../api/feedback'
import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
ChartJS.register(ArcElement, Tooltip, Legend)

export default function PercentBreakdownChart({ refreshTick }) {
  const [stats, setStats] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  const load = () =>
    getStats()
      .then(r => setStats(r.data))
      .catch(e => setError(e?.message || 'Failed to load stats'))
      .finally(() => setLoading(false))

  useEffect(() => { load() }, [])
  useEffect(() => { if (refreshTick !== undefined) { setLoading(true); load() } }, [refreshTick])

  if (loading) return <div>Loading breakdown…</div>
  if (error)   return <div style={{ color: 'crimson' }}>Error: {error}</div>
  if (!stats || !stats.total) return <div>No data yet — submit some feedback.</div>

  const { total, positive, neutral, negative } = stats
  const pct = (n) => total ? Math.round((n / total) * 10000) / 100 : 0

  const data = {
    labels: [
      `% Positive (${pct(positive)}%)`,
      `% Neutral (${pct(neutral)}%)`,
      `% Negative (${pct(negative)}%)`,
    ],
    datasets: [{
      data: [positive, neutral, negative],
      borderWidth: 1,
      backgroundColor: [
        'rgba(75, 192, 192, 0.6)',
        'rgba(201, 203, 207, 0.6)',
        'rgba(255, 99, 132, 0.6)',
      ],
      borderColor: [
        'rgba(75, 192, 192, 1)',
        'rgba(201, 203, 207, 1)',
        'rgba(255, 99, 132, 1)',
      ],
    }],
  }

  const options = { responsive: true, aspectRatio: 1, plugins: { legend: { position: 'top' } }, maintainAspectRatio: true }

  return (
    <div style={{ width: 300, height: 300, margin: '12px auto' }}>
      <h4 style={{ textAlign: 'center', margin: 0 }}>Overall Sentiment Breakdown</h4>
      <Doughnut data={data} options={options} />
      <div style={{ marginTop: 8, opacity: 0.8, textAlign: 'center' }}>Total feedback: {total}</div>
    </div>
  )
}
