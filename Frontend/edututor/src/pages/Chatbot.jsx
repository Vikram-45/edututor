import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import Navbar from '../components/Navbar'

const BASE_URL = 'https://edututor-mbl4.onrender.com'

const SUGGESTIONS = [
  'Explain Newton\'s laws of motion',
  'What is the Pythagorean theorem?',
  'Summarise the causes of World War I',
  'How does photosynthesis work?',
]

export default function Chatbot() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: 'Hi! I\'m your AI tutor 👋 Ask me anything — concepts, problems, or study tips.',
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function sendMessage(text) {
    const msg = text || input.trim()
    if (!msg || loading) return

    setMessages((prev) => [...prev, { role: 'user', text: msg }])
    setInput('')
    setLoading(true)

    try {
      const res = await axios.post(`${BASE_URL}/chatbot/`, { message: msg })
      setMessages((prev) => [...prev, { role: 'assistant', text: res.data.reply }])
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: '⚠️ Sorry, I couldn\'t connect to the server. Please try again.',
          isError: true,
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="flex min-h-screen bg-bg text-slate-800">
      <Navbar />

      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="px-4 md:px-8 py-6 border-b border-slate-200 bg-surface">
          <p className="section-heading">AI Tutor Chat</p>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-slate-900">Instant study support</h1>
          <p className="text-slate-500 mt-1">Chat with your AI tutor for explanations, step-by-step solutions, and learning tips.</p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-4">
          {/* Suggestions (only when just the welcome message) */}
          {messages.length === 1 && (
            <div className="mb-2">
              <p className="text-xs text-ink-muted font-medium mb-2 uppercase tracking-wide">Try asking…</p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => sendMessage(s)}
                    className="text-xs bg-white border border-gray-200 text-ink-soft hover:border-accent hover:text-accent rounded-full px-3 py-1.5 transition-all"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-ink flex items-center justify-center text-sm mr-3 mt-0.5 shrink-0">
                  🤖
                </div>
              )}
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-accent text-white border border-accent hover:bg-accent-hover'
                    : msg.isError
                    ? 'bg-red-50 border border-red-200 text-red-600 rounded-bl-sm'
                    : 'bg-white border border-gray-200 text-ink rounded-bl-sm shadow-sm'
                }`}
              >
                {msg.text}
              </div>
              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-xs font-bold text-accent ml-3 mt-0.5 shrink-0 uppercase">
                  {localStorage.getItem('email')?.charAt(0) || 'U'}
                </div>
              )}
            </div>
          ))}

          {/* Typing indicator */}
          {loading && (
            <div className="flex justify-start">
              <div className="w-8 h-8 rounded-full bg-ink flex items-center justify-center text-sm mr-3 shrink-0">
                🤖
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                <div className="flex gap-1 items-center h-4">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="w-1.5 h-1.5 bg-ink-muted rounded-full animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input bar */}
        <div className="px-8 py-4 border-t border-gray-200 bg-white">
          <div className="flex items-end gap-3 max-w-3xl">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask your tutor anything… (Enter to send)"
              rows={1}
              disabled={loading}
              className="flex-1 input-field resize-none min-h-11.5 max-h-32 leading-relaxed"
              style={{ overflowY: 'auto' }}
            />
            <button
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
              className="shrink-0 w-11 h-11 bg-accent hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl flex items-center justify-center transition-all"
            >
              <svg className="w-5 h-5 rotate-90" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path d="M12 19V5M5 12l7-7 7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
          <p className="text-ink-muted text-xs mt-2">Press Enter to send · Shift+Enter for new line</p>
        </div>
      </main>
    </div>
  )
}
