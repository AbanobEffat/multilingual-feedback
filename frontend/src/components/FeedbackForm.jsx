import { useState } from 'react'
import { postFeedback } from '../api/feedback'

export default function FeedbackForm({ onSubmitted }) {
  const [text, setText] = useState('')
  const [productId, setProductId] = useState('')   // <— NEW
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState(null)

  const submit = async (e) => {
    e.preventDefault()
    if (!text.trim()) return
    setLoading(true); setMsg(null)
    try {
      const payload = { text: text.trim() }
      // include product_id only if provided and valid number
      const pidNum = Number(productId)
      if (!Number.isNaN(pidNum) && productId !== '') payload.product_id = pidNum

      await postFeedback(payload)
      setMsg('Submitted!')
      setText('')
      setProductId('')                 // reset field
      onSubmitted?.()
    } catch (err) {
      setMsg('Submit failed: ' + (err?.response?.data?.detail || err.message))
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} style={{ display: 'grid', gap: 8, marginBottom: 16 }}>
      <label>
        Product ID (optional)
        <input
          type="number"
          value={productId}
          onChange={e => setProductId(e.target.value)}
          placeholder="e.g., 101"
          min="0"
          style={{ width: 200, marginLeft: 8 }}
        />
      </label>

      <textarea
        rows={4}
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Type feedback in any language..."
      />

      <button disabled={loading}>{loading ? 'Submitting…' : 'Submit Feedback'}</button>
      {msg && <div style={{ opacity: 0.8 }}>{msg}</div>}
    </form>
  )
}
