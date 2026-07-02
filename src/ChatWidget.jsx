import React, { useState, useRef, useEffect } from 'react'

const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY || ''
const BASE = 'https://api.anthropic.com'
const HEADERS = {
  'content-type': 'application/json',
  'x-api-key': API_KEY,
  'anthropic-version': '2023-06-01',
}
const SYSTEM = `שמך הוא יחיאל. אתה עוזר משפטי חכם של משרד עו"ד ד"ר י. וינרוט ושות'. אתה עונה תמיד בסגנון חרדי מכובד. פרטי המשרד: שם - משרד עורכי הדין ד"ר י. וינרוט ושות', ניסיון - למעלה מ-50 שנה (מאז 1974), טלפון - 03-7181111, מייל - office@weinrothlaw.com, אתר - https://weinroth-premium-new.onrender.com/. אתה עוזר ללקוחות בשפה העברית. לעולם אל תנסה לקרוא או לעבד תמונות. השב רק בהודעות טקסט. היה מנומס ואדיב.`

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const endRef = useRef(null)

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const send = async () => {
    const text = input.trim()
    if (!text || loading) return
    setInput('')
    setMessages(m => [...m, { role: 'user', content: text }])
    setLoading(true)
    try {
      const msgs = [...messages, { role: 'user', content: text }].map(m => ({ role: m.role, content: m.content }))
      const res = await fetch(`${BASE}/v1/messages`, {
        method: 'POST',
        headers: HEADERS,
        body: JSON.stringify({
          model: 'claude-opus-4-8',
          max_tokens: 4096,
          system: SYSTEM,
          messages: msgs,
        }),
      })
      if (!res.ok) { setMessages(m => [...m, { role: 'assistant', content: 'שגיאה בשליחת ההודעה' }]); return }
      const data = await res.json()
      const reply = data.content?.find(c => c.type === 'text')?.text || ''
      setMessages(m => [...m, { role: 'assistant', content: reply }])
    } catch {
      setMessages(m => [...m, { role: 'assistant', content: 'שגיאה בחיבור לשרת' }])
    }
    setLoading(false)
  }

  return (
    <>
      <div className="chat-fab-wrap">
        <span className="chat-fab-tooltip">אני כאן בשבילך</span>
        <button className={`chat-fab ${open ? 'chat-fab--open' : ''}`} onClick={() => setOpen(!open)} aria-label="צ'אט">
          <img src="/YEHIEL.png" alt="יחיאל" className="chat-fab-img" />
        </button>
      </div>
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
