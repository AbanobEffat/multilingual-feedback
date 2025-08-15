import { useState } from 'react'
import { postFeedback } from '../api/feedback'

export default function FeedbackForm() {
  const [text, setText] = useState('')
  const [productId, setProductId] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      await postFeedback({ text, product_id: productId ? Number(productId) : null })
      setText('')
      setProductId('')
      alert('Submitted')
    } catch (err) {
      console.error(err)
      alert('Submit failed')
    } finally { setLoading(false) }
  }

  return (
    <form onSubmit={submit}>
      <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Write feedback..." />
      <input value={productId} onChange={e=>setProductId(e.target.value)} placeholder="Product ID (optional)" />
      <button type="submit" disabled={loading}>Submit</button>
    </form>
  )
}
