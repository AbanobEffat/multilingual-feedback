import FeedbackForm from './components/FeedbackForm'
import StatsDashboard from './components/StatsDashboard'
import PercentBreakdownChart from './components/PercentBreakdownChart'

export default function App() {
  return (
    <div>
      <h1>Multilingual Customer Feedback</h1>
      <FeedbackForm />
      <StatsDashboard />
      <PercentBreakdownChart />
    </div>
  )
}
