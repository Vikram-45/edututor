import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

const BASE_URL = 'https://edututor-mbl4.onrender.com'

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await axios.post(`${BASE_URL}/login/`, form)
      const role = res.data.role || 'student'
      localStorage.setItem('email', form.email)
      localStorage.setItem('role', role)
      if (role === 'teacher') {
        navigate('/dashboard')
      } else {
        navigate('/dashboard')
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Invalid email or password. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4 py-8 md:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 w-full max-w-6xl gap-8">
        <div className="hidden md:flex flex-col justify-center rounded-2xl bg-indigo-700 text-white p-10 shadow-[0_22px_45px_-11px_rgba(79,70,229,0.35)]">
          <h2 className="text-4xl font-display font-bold leading-tight">Edu<span className="text-indigo-300">tutor</span></h2>
          <p className="mt-5 text-slate-100 text-lg leading-relaxed">Unlock personalized test creation and instant AI tutoring. Build confidence each day with a dashboard that reflects your progress.</p>
          <div className="mt-8 space-y-3 text-sm text-indigo-100">
            <p>✔️ Adaptive MCQ tests</p>
            <p>✔️ Rank-boosting score reports</p>
            <p>✔️ 24/7 AI study coach</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-[0_25px_45px_-20px_rgba(15,23,42,0.25)] border border-slate-100">
          <h1 className="font-display text-2xl font-bold text-slate-900">Sign in to your account</h1>
          <p className="text-slate-500 mt-2">Start learning with your AI assistant</p>

          {error && (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="text-sm font-semibold text-slate-600">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="input-field mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-600">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="input-field mt-1"
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary mt-3">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Signing in…
                </span>
              ) : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            New to EduTutor?{' '}
            <Link to="/register" className="text-indigo-600 font-semibold hover:text-indigo-700">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
