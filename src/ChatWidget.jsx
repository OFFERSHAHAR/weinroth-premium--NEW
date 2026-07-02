import React, { useState, useRef, useEffect, useCallback } from 'react'

const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY || ''
const SESSION_ID = import.meta.env.VITE_SESSION_ID || ''
const BASE = 'https://api.anthropic.com'
const HEADERS = {
  'Content-Type': 'application/json',
  'x-api-key': API_KEY,
  'anthropic-version': '2023-06-01',
  'anthropic-beta': 'managed-agents-2026-04-01',
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const endRef = useRef(null)
  const lastEventId = useRef(null)

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const pollForResponse = useCallback(async () => {
    const params = new URLSearchParams({ order: 'asc', limit: '20' })
    if (lastEventId.current) params.set('created_at[gt]', lastEventId.current)
    try {
      const res = await fetch(`${BASE}/v1/sessions/${SESSION_ID}/events?${params}`, { headers: HEADERS })
      if (!res.ok) return false
      const data = await res.json()
      for (const event of data.data || []) {
        const ts = event.processed_at || event.created_at
        if (ts && (!lastEventId.current || ts > lastEventId.current)) {
          lastEventId.current = ts
        }
        if (event.type === 'agent.message' && event.content?.[0]?.text) {
          setMessages(m => [...m, { role: 'assistant', content: event.content[0].text }])
          return true
        }
      }
    } catch {}
    return false
  }, [])

  const send = async () => {
    const text = input.trim()
    if (!text || loading) return
    setInput('')
    setMessages(m => [...m, { role: 'user', content: text }])
    setLoading(true)
    try {
      const res = await fetch(`${BASE}/v1/sessions/${SESSION_ID}/events`, {
        method: 'POST',
        headers: HEADERS,
        body: JSON.stringify({
          events: [{ type: 'user.message', content: [{ type: 'text', text }] }],
        }),
      })
      if (!res.ok) { setMessages(m => [...m, { role: 'assistant', content: 'שגיאה בשליחת ההודעה' }]); setLoading(false); return }
      let found = false
      for (let i = 0; i < 60 && !found; i++) {
        await new Promise(r => setTimeout(r, 1000))
        found = await pollForResponse()
      }
      if (!found) setMessages(m => [...m, { role: 'assistant', content: 'הסוכן לא הגיב בזמן' }])
    } catch {
      setMessages(m => [...m, { role: 'assistant', content: 'שגיאה בחיבור לשרת' }])
    }
    setLoading(false)
  }

  return (
    <>
      <button className={`chat-fab ${open ? 'chat-fab--open' : ''}`} onClick={() => setOpen(!open)} aria-label="צ'אט" title="אני כאן בשבילך">
        <img src="/YEHIEL.png" alt="יחיאל" className="chat-fab-img" />
      </button>
      <div className={`chat-panel ${open ? 'chat-panel--open' : ''}`}>
        <div className="chat-header">
          <div className="chat-header-info">
            <img src="/YEHIEL.png" alt="יחיאל" className="chat-avatar" />
            <span>יחיאל — ייעוץ משפטי</span>
          </div>
          <button onClick={() => setOpen(false)} className="chat-close">✕</button>
        </div>
        <div className="chat-body">
          {messages.length === 0 && <div className="chat-empty">שלום, כיצד אוכל לעזור?</div>}
          {messages.map((m, i) => (
            <div key={i} className={`chat-msg chat-msg--${m.role}`}>{m.content}</div>
          ))}
          {loading && <div className="chat-msg chat-msg--assistant chat-msg--typing">...</div>}
          <div ref={endRef} />
        </div>
        <div className="chat-foot">
          <input className="chat-input" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} placeholder="הקלד הודעה..." dir="rtl" />
          <button className="chat-send" onClick={send} disabled={loading || !input.trim()}>שלח</button>
        </div>
        <div className="chat-watermark">PATENTED AI AGENT BY O&amp;0 AGENT HUB GURU</div>
      </div>
    </>
  )
}