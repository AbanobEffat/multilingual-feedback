import { useEffect, useState } from 'react'
import { getTrends } from '../api/feedback'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend)

export default function TrendsChart({ days = 30, interval = 'day' }) {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancel = false
    setLoading(true)
    setError(null)
    getTrends({ days, interval })
      .then(res => {
        if (cancel) return
        console.log('Trends payload:', res.data)
        setData(res.data)
      })
      .catch(err => {
        if (cancel) return
        console.error('Trends error:', err)
        setError(err?.response?.data || err?.message || 'Failed to load trends')
      })
      .finally(() => { if (!cancel) setLoading(false) })
    return () => { cancel = true }
  }, [days, interval])

  if (loading) return <div>Loading trends…</div>
  if (error)   return <div style={{ color: 'crimson' }}>Trends error: {String(error)}</div>
  if (!data || !Array.isArray(data.labels) || data.labels.length === 0)
    return <div>No trends yet — submit some feedback and refresh.</div>

  const labels = data.labels.map(ts => new Date(ts).toLocaleDateString())

  const chartData = {
    labels,
    datasets: [
      { label: '% Positive', data: data.pct_positive, borderWidth: 2, tension: 0.25, yAxisID: 'y1' },
      { label: '% Neutral',  data: data.pct_neutral,  borderWidth: 2, tension: 0.25, yAxisID: 'y1' },
      { label: '% Negative', data: data.pct_negative, borderWidth: 2, tension: 0.25, yAxisID: 'y1' },
      { label: 'Total',      data: data.total,        borderWidth: 1, borderDash: [6,6], tension: 0.25, yAxisID: 'y' },
    ],
  }

  const options = {
    responsive: true,
    interaction: { mode: 'index', intersect: false },
    scales: {
      y:  { title: { display: true, text: 'Total feedback' }, beginAtZero: true },
      y1: { position: 'right', title: { display: true, text: 'Percent' }, min: 0, max: 100 }
    },
    plugins: { legend: { position: 'top' } },
    maintainAspectRatio: false,
  }

  return (
    <div style={{ padding: 12, minHeight: 320 }}>
      <h3>Feedback Trends (last {data.days} {data.interval}s)</h3>
      <Line data={chartData} options={options} />
    </div>
  )
}
