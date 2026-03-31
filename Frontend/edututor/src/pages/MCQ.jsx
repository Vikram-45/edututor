import React, { useState } from 'react'
import axios from 'axios'
import Navbar from '../components/Navbar'

const BASE_URL = 'https://edututor-mbl4.onrender.com'

const DIFFICULTIES = ['Easy', 'Medium', 'Hard']
const SUBJECTS = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'History', 'Geography', 'Computer Science', 'English']

export default function MCQ() {
  const email = localStorage.getItem('email') || ''

  // Setup state
  const [subject, setSubject] = useState('')
  const [difficulty, setDifficulty] = useState('')
  const [customSubject, setCustomSubject] = useState('')

  // Test state
  const [testId, setTestId] = useState(null)
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState({})
  const [score, setScore] = useState(null)

  // UI state
  const [phase, setPhase] = useState('setup') // setup | test | result
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const finalSubject = subject === 'Other' ? customSubject : subject

  async function handleGenerate(e) {
    e.preventDefault()
    if (!finalSubject || !difficulty) return
    setLoading(true)
    setError('')
    try {
      const res = await axios.post(`${BASE_URL}/generate-mcq/`, {
        email: email,
        subject: finalSubject,
        difficulty: difficulty.toLowerCase(),
      })
      setTestId(res.data.test_id)
      setQuestions(res.data.questions)
      setAnswers({})
      setScore(null)
      setPhase('test')
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Failed to generate questions. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit() {
    if (!email) {
      setError('User email not found in local storage. Please login again.')
      return
    }
    if (Object.keys(answers).length < questions.length) {
      setError('Please answer all questions before submitting.')
      return
    }
    setLoading(true)
    setError('')
    try {
      // Normalize payload to object format (selected/correct) to avoid letter/text mismatch.
      const normalizedAnswers = questions.map((q, i) => {
        const selectedLetter = answers[i] || ''
        const selectedText = ['A', 'B', 'C', 'D'].includes(selectedLetter)
          ? q.options['ABCD'.indexOf(selectedLetter)]
          : ''

        const correctKey = q.answer || ''
        const correctText = ['A', 'B', 'C', 'D'].includes(correctKey)
          ? q.options['ABCD'.indexOf(correctKey)]
          : q.options.includes(correctKey)
            ? correctKey
            : q.options[0] || ''

        return {
          selected: selectedText || selectedLetter,
          correct: correctText,
        }
      })

      const res = await axios.post(`${BASE_URL}/submit-answers/`, {
        email,
        subject: finalSubject,
        answers: normalizedAnswers,
      })

      const rawScore = Number(res.data.score) || 0
      const total = Number(res.data.total) || currentAnswers.length
      const percent = total > 0 ? Math.round((rawScore / total) * 100) : 0

      setScore(percent)
      setPhase('result')
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Failed to submit answers. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  function handleReset() {
    setPhase('setup')
    setSubject('')
    setDifficulty('')
    setCustomSubject('')
    setQuestions([])
    setAnswers({})
    setScore(null)
    setError('')
  }

  const answeredCount = Object.keys(answers).length

  return (
    <div className="flex min-h-screen bg-bg text-slate-800">
      <Navbar />

      <main className="flex-1 px-4 md:px-8 lg:px-10 py-8 overflow-y-auto">
        <div className="mb-8">
          <p className="section-heading pb-1">MCQ Builder</p>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-slate-900">AI-powered test creator</h1>
          <p className="text-slate-500 text-sm md:text-base mt-2">Design a customized quiz, answer questions, and evaluate your performance instantly.</p>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm">
            {error}
          </div>
        )}

        {/* ===== SETUP PHASE ===== */}
        {phase === 'setup' && (
          <div className="max-w-lg">
            <div className="card">
              <h2 className="font-display font-semibold text-lg text-ink mb-6">Configure Your Test</h2>
              <form onSubmit={handleGenerate} className="space-y-5">
                {/* Subject */}
                <div>
                  <label className="block text-sm font-medium text-ink-soft mb-2">Subject</label>
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    {SUBJECTS.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => { setSubject(s); setCustomSubject('') }}
                        className={`text-sm py-2.5 px-3 rounded-xl border font-medium transition-all ${
                          subject === s
                            ? 'bg-accent text-white border-accent'
                            : 'bg-white border-gray-200 text-ink-soft hover:border-accent/50 hover:text-ink'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setSubject('Other')}
                      className={`text-sm py-2.5 px-3 rounded-xl border font-medium transition-all col-span-2 ${
                        subject === 'Other'
                          ? 'bg-accent text-white border-accent'
                          : 'bg-white border-gray-200 text-ink-soft hover:border-accent/50 hover:text-ink'
                      }`}
                    >
                      Other…
                    </button>
                  </div>
                  {subject === 'Other' && (
                    <input
                      type="text"
                      value={customSubject}
                      onChange={(e) => setCustomSubject(e.target.value)}
                      placeholder="Enter subject name"
                      className="input-field mt-2"
                    />
                  )}
                </div>

                {/* Difficulty */}
                <div>
                  <label className="block text-sm font-medium text-ink-soft mb-2">Difficulty</label>
                  <div className="flex gap-2">
                    {DIFFICULTIES.map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setDifficulty(d)}
                        className={`flex-1 text-sm py-2.5 rounded-xl border font-medium transition-all ${
                          difficulty === d
                            ? d === 'Easy'
                              ? 'bg-green-500 text-white border-green-500'
                              : d === 'Medium'
                              ? 'bg-yellow-500 text-white border-yellow-500'
                              : 'bg-red-500 text-white border-red-500'
                            : 'bg-white border-gray-200 text-ink-soft hover:border-gray-300'
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !finalSubject || !difficulty}
                  className="btn-primary"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Generating Questions…
                    </span>
                  ) : 'Generate Test →'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ===== TEST PHASE ===== */}
        {phase === 'test' && (
          <div className="max-w-2xl">
            {/* Progress bar */}
            <div className="flex items-center justify-between mb-4 text-sm text-ink-muted">
              <span>{answeredCount} / {questions.length} answered</span>
              <span className="font-medium text-ink">{finalSubject} · {difficulty}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 mb-6">
              <div
                className="bg-accent h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${(answeredCount / questions.length) * 100}%` }}
              />
            </div>

            <div className="space-y-4 mb-6">
              {questions.map((q, qi) => (
                <div key={qi} className="card">
                  <p className="font-medium text-ink text-sm mb-3">
                    <span className="text-accent font-bold">Q{qi + 1}.</span> {q.question}
                  </p>
                  <div className="space-y-2">
                    {q.options.map((opt, oi) => {
                      const letter = String.fromCharCode(65 + oi) // A, B, C, D
                      const isSelected = answers[qi] === letter
                      return (
                        <label
                          key={oi}
                          className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                            isSelected
                              ? 'border-accent bg-accent-light'
                              : 'border-gray-200 hover:border-accent/40 hover:bg-surface'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`q-${qi}`}
                            value={letter}
                            checked={isSelected}
                            onChange={() => setAnswers({ ...answers, [qi]: letter })}
                            className="accent-orange-500"
                          />
                          <span className={`text-sm font-medium w-5 ${isSelected ? 'text-accent' : 'text-ink-muted'}`}>
                            {letter}.
                          </span>
                          <span className="text-sm text-ink">{opt}</span>
                        </label>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button onClick={handleReset} className="btn-secondary max-w-35">
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading || answeredCount < questions.length}
                className="btn-primary"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Submitting…
                  </span>
                ) : `Submit Answers (${answeredCount}/${questions.length})`}
              </button>
            </div>
          </div>
        )}

        {/* ===== RESULT PHASE ===== */}
        {phase === 'result' && (
          <div className="max-w-md">
            <div className="card text-center py-10">
              <div className="text-6xl mb-4">
                {score >= 80 ? '🏆' : score >= 50 ? '👍' : '📚'}
              </div>
              <h2 className="font-display text-2xl font-bold text-ink mb-1">
                {score >= 80 ? 'Excellent!' : score >= 50 ? 'Good Job!' : 'Keep Practicing!'}
              </h2>
              <p className="text-ink-muted text-sm mb-6">
                You scored on your {finalSubject} ({difficulty}) test
              </p>
              <div className="inline-flex items-baseline gap-1 mb-6">
                <span className="font-display text-6xl font-bold text-accent">{score}</span>
                <span className="font-display text-2xl text-ink-muted font-bold">/ 100</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3 mb-8">
                <div
                  className={`h-3 rounded-full transition-all duration-700 ${
                    score >= 80 ? 'bg-green-500' : score >= 50 ? 'bg-yellow-500' : 'bg-red-400'
                  }`}
                  style={{ width: `${score}%` }}
                />
              </div>
              <button onClick={handleReset} className="btn-primary">
                Take Another Test
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
