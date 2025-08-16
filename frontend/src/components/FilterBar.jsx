import { useState } from 'react'

export default function FilterBar({ onChange, onSearch }) {
  const [productId, setProductId] = useState('')
  const [language, setLanguage] = useState('')
  const [sentiment, setSentiment] = useState('')
  const [q, setQ] = useState('')

  const apply = () => onChange?.({
    product_id: productId ? Number(productId) : undefined,
    language: language || undefined,
    sentiment: sentiment || undefined,
    q: q || undefined,
    offset: 0,
  })

  return (
    <div style={{display:'grid', gap:8, gridTemplateColumns:'1fr 1fr 1fr 2fr auto'}}>
      <input placeholder="Product ID" value={productId} onChange={e=>setProductId(e.target.value)} />
      <input placeholder="Language (e.g., en, ar, fr)" value={language} onChange={e=>setLanguage(e.target.value.toLowerCase())} />
      <select value={sentiment} onChange={e=>setSentiment(e.target.value)}>
        <option value="">All sentiments</option>
        <option value="positive">Positive</option>
        <option value="neutral">Neutral</option>
        <option value="negative">Negative</option>
      </select>
      <input placeholder="Search text…" value={q} onChange={e=>setQ(e.target.value)} />
      <button onClick={apply}>Apply</button>
    </div>
  )
}
