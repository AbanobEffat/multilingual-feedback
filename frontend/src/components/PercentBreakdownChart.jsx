import { useEffect, useState } from 'react'
import { getStats } from '../api/feedback'
import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Colors } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend,Colors)

export default function PercentBreakdownChart() {
  const [stats, setStats] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getStats()
      .then(r => setStats(r.data))
      .catch(e => setError(e?.message || 'Failed to load stats'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div>Loading breakdown…</div>
  if (error)   return <div style={{color:'crimson'}}>Error: {error}</div>
  if (!stats || !stats.total) return <div>No data yet — submit some feedback.</div>

  const { positive, neutral, negative, total } = stats
  const pct = (n) => Math.round((n / total) * 10000) / 100 // 2 decimals

  const data = {
    labels: [
      `% Positive (${pct(positive)}%)`,
      `% Neutral (${pct(neutral)}%)`,
      `% Negative (${pct(negative)}%)`,
    ],
    datasets: [{
      data: [positive, neutral, negative],
      borderWidth: 1
    }]
  }

  const options = {
    plugins: {
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const val = ctx.raw
            const percent = pct(val)
            return `${ctx.label}: ${val} (${percent}%)`
          }
        }
      },
      legend: { position: 'top' }
    },
    maintainAspectRatio: false
  }

  return (
  <div style={{ width: 300, height: 300, margin: '0 auto', padding: 12 }}>
    <h3 style={{ textAlign: 'center' }}>Overall Sentiment Breakdown</h3>
    <Doughnut data={data} options={options} />
    <div style={{marginTop: 8, opacity: 0.8, textAlign: 'center'}}>
      Total feedback: {total}
    </div>
  </div>
)

}
