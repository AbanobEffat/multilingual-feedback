import React from 'react'
import FeedbackForm from './components/FeedbackForm'
import StatsDashboard from './components/StatsDashboard'
import PercentBreakdownChart from './components/PercentBreakdownChart'

export default function App(){
  return (
    <div style={{maxWidth: 900, margin: '24px auto', fontFamily: 'sans-serif'}}>
      <h1>Multilingual Customer Feedback</h1>
      <FeedbackForm />
      <StatsDashboard />
      <PercentBreakdownChart />
    </div>
  )
}
