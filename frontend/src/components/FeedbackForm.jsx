import React, { useState } from 'react'
import { postFeedback } from '../api/feedback'

export default function FeedbackForm(){
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState(null)
  const submit = async (e) => {
    e.preventDefault()
    if(!text.trim()) return
    setLoading(true); setMsg(null)
    try{
      await postFeedback({ text })
      setMsg('Submitted!')
      setText('')
    }catch(err){
      setMsg('Submit failed: ' + (err?.response?.data?.detail || err.message))
    }finally{
      setLoading(false)
    }
  }
  return (
    <form onSubmit={submit} style={{display:'grid', gap:8, marginBottom:16}}>
      <textarea rows={4} value={text} onChange={e=>setText(e.target.value)} placeholder="Type feedback in any language..." />
      <button disabled={loading}>{loading ? 'Submitting...' : 'Submit Feedback'}</button>
      {msg && <div style={{opacity:0.8}}>{msg}</div>}
    </form>
  )
}
