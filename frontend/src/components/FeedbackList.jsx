// frontend/src/components/FeedbackList.jsx
import { useEffect, useState } from 'react'
import { getFeedback } from '../api/feedback'

export default function FeedbackList({ filters, refreshTick }) {
  const [data, setData] = useState({ total: 0, items: [] })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true); setError(null)
    getFeedback({ limit: 20, offset: 0, ...filters })
      .then(r => {
        // support both shapes: either an array or {total, items}
        const payload = r.data
        if (Array.isArray(payload)) {
          setData({ total: payload.length, items: payload })
        } else {
          setData({ total: payload.total ?? payload.items?.length ?? 0, items: payload.items ?? [] })
        }
      })
      .catch(e => setError(e?.message || 'Failed to load feedback'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])
  useEffect(() => { load() }, [JSON.stringify(filters), refreshTick])

  if (loading) return <div>Loading feedback…</div>
  if (error)   return <div style={{color:'crimson'}}>Error: {error}</div>
  if (!data.items.length) return <div>No feedback found.</div>

  return (
    <div style={{marginTop:12}}>
      <div style={{opacity:.8, marginBottom:6}}>Results: {data.total}</div>
      <ul style={{listStyle:'none', padding:0}}>
        {data.items.map(f => {
          const lang = (f.language || '').toLowerCase()
          const isEnglish = lang === 'en'
          // Show translation block whenever it exists and source != EN
          const showTranslation = !isEnglish && f.translated_text && f.translated_text !== f.original_text
          const rtl = ['ar','fa','he','ur'].includes(lang)

          return (
            <li key={f.id} style={{padding:12, border:'1px solid #eee', borderRadius:10, marginBottom:10}}>
              <div style={{fontSize:12, opacity:.7, marginBottom:4}}>
                {new Date(f.created_at).toLocaleString()} • Lang: <strong>{lang || '—'}</strong> • Sentiment: <strong>{f.sentiment || '—'}</strong>
                {f.product_id ? <> • Product: <strong>{f.product_id}</strong></> : null}
              </div>

              <div style={{padding:10, borderRadius:8, background:'#fafafa', direction: rtl ? 'rtl' : 'ltr'}}>
                <span style={{fontSize:12, opacity:.7, marginRight:6}}>
                  {isEnglish ? 'Original (EN)' : `Original (${lang || '?'})`}:
                </span>
                <span>{f.original_text}</span>
              </div>

              {showTranslation && (
                <div style={{marginTop:8, padding:10, borderRadius:8, background:'#f5fbff'}}>
                  <span style={{fontSize:12, opacity:.7, marginRight:6}}>English:</span>
                  <span>{f.translated_text}</span>
                </div>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
