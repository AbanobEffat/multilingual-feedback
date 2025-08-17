import { useEffect, useState } from 'react'

export default function AdminBar({ onStatus }) {
  const [token, setToken] = useState(localStorage.getItem('adminToken') || '')
  const [ok, setOk] = useState(!!token)

  const save = () => {
    localStorage.setItem('adminToken', token.trim())
    setOk(!!token.trim())
    onStatus?.(!!token.trim())
  }
  const clear = () => {
    localStorage.removeItem('adminToken')
    setToken('')
    setOk(false)
    onStatus?.(false)
  }

  useEffect(() => { onStatus?.(ok) }, []) // initial

  return (
    <div style={{display:'flex', gap:8, alignItems:'center', padding:'8px 0'}}>
      <span style={{fontWeight:600}}>Admin:</span>
      <input type="password" placeholder="Enter admin token"
             value={token} onChange={e=>setToken(e.target.value)}
             style={{width:220}} />
      <button onClick={save}>Use Token</button>
      <button onClick={clear}>Clear</button>
      <span style={{marginLeft:8, fontSize:12, opacity:.7}}>
        {ok ? '✅ admin mode' : '🔒 not authenticated'}
      </span>
    </div>
  )
}
