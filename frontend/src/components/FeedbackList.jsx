// frontend/src/components/FeedbackList.jsx
import { useEffect, useMemo, useState } from 'react'
import { getFeedback } from '../api/feedback'

export default function FeedbackList({ filters, refreshTick }) {
  const [data, setData] = useState({ total: 0, items: [], limit: 20, offset: 0 })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  const [limit, setLimit] = useState(20)
  const [offset, setOffset] = useState(0)

  const page = useMemo(() => Math.floor(offset / limit) + 1, [offset, limit])
  const totalPages = useMemo(() => Math.max(1, Math.ceil((data.total || 0) / limit)), [data.total, limit])

  const load = () => {
    setLoading(true); setError(null)
    getFeedback({ limit, offset, ...filters })
      .then(r => {
        const payload = r.data
        if (Array.isArray(payload)) {
          setData({ total: payload.length, items: payload, limit, offset })
        } else {
          setData({
            total: payload.total ?? payload.items?.length ?? 0,
            items: payload.items ?? [],
            limit: payload.limit ?? limit,
            offset: payload.offset ?? offset
          })
        }
      })
      .catch(e => setError(e?.message || 'Failed to load feedback'))
      .finally(() => setLoading(false))
  }

  // initial + when page/size changes
  useEffect(() => { load() }, [limit, offset])

  // when filters or refresh tick change: reset to first page and reload
  useEffect(() => { setOffset(0); load() }, [JSON.stringify(filters), refreshTick])

  if (loading) return <div>Loading feedback…</div>
  if (error)   return <div style={{color:'crimson'}}>Error: {error}</div>

  const items = data.items || []
  const hasPrev = offset > 0
  const hasNext = offset + limit < (data.total || 0)

  return (
    <div style={{marginTop:12}}>
      <div style={{display:'flex', alignItems:'center', gap:12, marginBottom:8}}>
        <div style={{opacity:.8}}>Results: {data.total}</div>
        <div style={{marginLeft:'auto', display:'flex', alignItems:'center', gap:8}}>
          <label>Page size:</label>
          <select value={limit} onChange={e=>{ setLimit(Number(e.target.value)); setOffset(0) }}>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
          <button disabled={!hasPrev} onClick={()=> setOffset(Math.max(0, offset - limit))}>Prev</button>
          <span>Page {page} / {totalPages}</span>
          <button disabled={!hasNext} onClick={()=> setOffset(offset + limit)}>Next</button>
        </div>
      </div>

      {items.length === 0 ? (
        <div>No feedback found.</div>
      ) : (
        <ul style={{listStyle:'none', padding:0}}>
          {items.map(f => {
            const lang = (f.language || '').toLowerCase()
            const isEnglish = lang === 'en'
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
      )}
    </div>
  )
}
